// QA visual y de accesibilidad sobre el sitio ya construido (dist/).
// Uso: `npm run build && npm run qa`   (opciones: --no-shots, --strict)
//
// 1. Sirve dist/ en un servidor local mínimo (sin dependencias).
// 2. Recorre TODAS las páginas en móvil (390px) y escritorio (1440px), en
//    modo claro y oscuro, y pasa axe-core (WCAG 2.2 AA + buenas prácticas)
//    y un control de scroll horizontal.
// 3. Hace capturas a página completa de las páginas clave (SHOT_PAGES) en
//    las 4 combinaciones, para revisarlas a ojo en cada PR.
//
// Sale con código 1 si hay fallos `serious`/`critical` de axe o desbordamiento
// horizontal. Los `moderate`/`minor` solo avisan (fallan con --strict).
// Resultado en .visual-qa/: report.md + shots/*.png. En CI se sube como
// artefacto y el resumen va al "Job summary" del PR.
//
// Chromium: usa el de Playwright (`npx playwright install chromium`) o el que
// indique CHROMIUM_PATH.
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync, appendFileSync } from 'node:fs';
import { extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const root = resolve(fileURLToPath(new URL('../../', import.meta.url)));
const dist = join(root, 'dist');
const out = join(root, '.visual-qa');
const args = new Set(process.argv.slice(2));
const STRICT = args.has('--strict');
const SHOTS = !args.has('--no-shots');

// Páginas que se capturan. El resto solo se audita (sin captura).
const SHOT_PAGES = [
  '/',
  '/en/',
  '/diseno-web/',
  '/en/web-design/',
  '/kaku/',
  '/parte/',
  '/estudio/',
  '/devlog/',
  '/guias/que-es-el-kana/',
  '/recursos/hojas-de-trazos/',
];
const VIEWPORTS = [
  { name: 'movil', width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: 'escritorio', width: 1440, height: 900 },
];
const THEMES = ['light', 'dark'];
const BLOCKING = new Set(['serious', 'critical']);

if (!existsSync(dist)) {
  console.error('No existe dist/. Ejecuta antes `npm run build`.');
  process.exit(2);
}

const axeSource = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');

// --- Servidor estático mínimo -------------------------------------------
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.pdf': 'application/pdf', '.xml': 'application/xml',
  '.txt': 'text/plain', '.webmanifest': 'application/manifest+json',
};
function resolveFile(urlPath) {
  let p;
  try {
    p = decodeURIComponent(urlPath.split('?')[0]);
  } catch {
    return null;
  }
  const file = resolve(dist, '.' + p);
  if (file !== dist && !file.startsWith(dist + sep)) return null; // nada fuera de dist/
  if (existsSync(file) && statSync(file).isFile()) return file;
  const index = join(file, 'index.html');
  return existsSync(index) ? index : null;
}
const server = createServer((req, res) => {
  const file = resolveFile(req.url || '/');
  if (!file) {
    res.writeHead(404, { 'content-type': TYPES['.html'] });
    res.end(existsSync(join(dist, '404.html')) ? readFileSync(join(dist, '404.html')) : 'Not found');
    return;
  }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const origin = `http://127.0.0.1:${server.address().port}`;

// --- Páginas a revisar ---------------------------------------------------
function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
const pages = walk(dist)
  .filter((f) => f.endsWith(`${sep}index.html`) || f === join(dist, 'index.html'))
  .filter((f) => !/http-equiv=["']refresh/i.test(readFileSync(f, 'utf8'))) // redirecciones
  .map((f) => '/' + relative(dist, f).split(sep).slice(0, -1).map((s) => s + '/').join(''))
  .sort();

// --- Recorrido -----------------------------------------------------------
rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'shots'), { recursive: true });

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const findings = new Map(); // id -> { impact, help, helpUrl, views:Set, samples:[] }
const overflow = [];
let shots = 0;

try {
  for (const theme of THEMES) {
    for (const vp of VIEWPORTS) {
      const { name, ...viewport } = vp;
      const ctx = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        isMobile: viewport.isMobile,
        hasTouch: viewport.hasTouch,
        colorScheme: theme,
        reducedMotion: 'reduce', // capturas estables: sin animaciones ni vídeo en bucle
      });
      // Tema elegido y cookies ya decididas (el banner taparía la captura).
      await ctx.addInitScript((t) => {
        try {
          localStorage.setItem('kuxar-theme', t);
          localStorage.setItem('kuxar-consent', 'denied');
        } catch {}
      }, theme);
      const page = await ctx.newPage();

      for (const path of pages) {
        const view = `${theme}/${name}${path}`;
        await page.goto(origin + path, { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);

        await page.addScriptTag({ content: axeSource });
        const violations = await page.evaluate(async () => {
          const r = await window.axe.run(document, {
            runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'],
          });
          return r.violations.map((v) => ({
            id: v.id, impact: v.impact, help: v.help, helpUrl: v.helpUrl,
            nodes: v.nodes.slice(0, 3).map((n) => `${n.target.join(' ')} — ${(n.failureSummary || '').split('\n').slice(1).join(' ').trim()}`),
          }));
        });
        for (const v of violations) {
          const f = findings.get(v.id) ?? { impact: v.impact, help: v.help, helpUrl: v.helpUrl, views: new Set(), samples: [] };
          f.views.add(view);
          for (const s of v.nodes) if (f.samples.length < 4 && !f.samples.includes(s)) f.samples.push(`${path} ${s}`);
          findings.set(v.id, f);
        }

        const extra = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        if (extra > 1) overflow.push(`${view} (+${extra}px)`);

        if (SHOTS && SHOT_PAGES.includes(path)) {
          // Las imágenes lazy fuera de pantalla no cargan en una captura a página
          // completa: se fuerzan a eager y se espera a que terminen.
          await page.evaluate(async () => {
            const imgs = [...document.images];
            imgs.forEach((img) => (img.loading = 'eager'));
            await Promise.all(imgs.map((img) => img.decode().catch(() => {})));
          });
          await page.waitForTimeout(150); // un frame para pintar lo recién decodificado
          const slug = path === '/' ? 'home' : path.replace(/^\/|\/$/g, '').replace(/\//g, '_');
          await page.screenshot({ path: join(out, 'shots', `${slug}--${name}--${theme}.png`), fullPage: true });
          shots++;
        }
      }
      await ctx.close();
    }
  }
} finally {
  await browser.close();
  server.close();
}

// --- Informe -------------------------------------------------------------
const sorted = [...findings.entries()].sort(([, a], [, b]) => Number(BLOCKING.has(b.impact)) - Number(BLOCKING.has(a.impact)));
const blocking = sorted.filter(([, f]) => BLOCKING.has(f.impact) || STRICT);
const lines = [
  '## QA visual y accesibilidad',
  '',
  `${pages.length} páginas × ${VIEWPORTS.length} anchos × ${THEMES.length} temas. Capturas: ${shots} (artefacto \`visual-qa\`).`,
  '',
];
if (!sorted.length && !overflow.length) lines.push('✅ Sin fallos de axe-core ni scroll horizontal.');
for (const [id, f] of sorted) {
  const mark = BLOCKING.has(f.impact) || STRICT ? '❌' : '⚠️';
  lines.push(`${mark} **${id}** (${f.impact}) — ${f.help} · ${f.views.size} vistas · [regla](${f.helpUrl})`);
  for (const s of f.samples) lines.push(`  - \`${s}\``);
}
if (overflow.length) {
  lines.push(`❌ **Scroll horizontal** en ${overflow.length} vistas:`);
  for (const o of overflow.slice(0, 10)) lines.push(`  - \`${o}\``);
}
const report = lines.join('\n') + '\n';
writeFileSync(join(out, 'report.md'), report);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);
console.log(report);
console.log(`Informe y capturas en ${relative(process.cwd(), out) || out}`);

process.exit(blocking.length || overflow.length ? 1 : 0);
