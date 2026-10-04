// Genera los PDF de práctica (public/recursos/*.pdf) con Chromium (Playwright).
// Uso:  node scripts/kana/make-pdf.mjs
// Necesita un Chromium instalado (variable PLAYWRIGHT_BROWSERS_PATH o CHROMIUM_PATH).
// Los PDF se versionan en el repositorio; vuelve a ejecutarlo si cambian los datos
// de src/data/kana-strokes.json o el diseño de la hoja.
import { mkdirSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { ROWS, charsOf } from '../../src/data/kana-table.mjs';
import { kanaSvg } from '../../src/lib/kana-svg.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const data = JSON.parse(readFileSync(join(root, 'src/data/kana-strokes.json'), 'utf8'));
const outDir = join(root, 'public/recursos');
mkdirSync(outDir, { recursive: true });

const romajiOf = Object.fromEntries(ROWS.flatMap((r) => ['hira', 'kata'].flatMap((k) => r[k].map((c, i) => (c ? [c, r.romaji[i]] : null)).filter(Boolean))));

const TEXT = {
  es: {
    title: { hira: 'Hiragana: orden de trazos y hoja de práctica', kata: 'Katakana: orden de trazos y hoja de práctica' },
    help: 'Los números marcan el orden de cada trazo. Calca los kana en gris y escribe después de memoria en las casillas vacías.',
    foot: 'kuxarstudio.com/recursos/hojas-de-trazos/ · Datos de trazos: KanjiVG (kanjivg.tagaini.net), CC BY-SA 3.0',
    files: { hira: 'orden-de-trazos-hiragana-es.pdf', kata: 'orden-de-trazos-katakana-es.pdf' },
    lang: 'es',
  },
  en: {
    title: { hira: 'Hiragana: stroke order and practice sheet', kata: 'Katakana: stroke order and practice sheet' },
    help: 'Numbers show the order of each stroke. Trace the gray kana, then write from memory in the empty boxes.',
    foot: 'kuxarstudio.com/en/resources/stroke-order-sheets/ · Stroke data: KanjiVG (kanjivg.tagaini.net), CC BY-SA 3.0',
    files: { hira: 'stroke-order-hiragana-en.pdf', kata: 'stroke-order-katakana-en.pdf' },
    lang: 'en',
  },
};

const box = (inner = '', cls = '') => `<div class="box ${cls}">${inner}</div>`;
const group = (ch) => {
  const d = data[ch];
  return `<div class="group">
    ${box(kanaSvg(d, { numbers: true, strokeWidth: 3.6, guides: true }) + `<span class="ro">${romajiOf[ch]}</span>`, 'ref')}
    ${box(kanaSvg(d, { numbers: false, color: '#c4c4c0', strokeWidth: 4, guides: true }))}
    ${box(kanaSvg(d, { numbers: false, color: '#c4c4c0', strokeWidth: 4, guides: true }))}
    ${box(kanaSvg({ s: [], n: [] }, { numbers: false, guides: true }))}
    ${box(kanaSvg({ s: [], n: [] }, { numbers: false, guides: true }))}
  </div>`;
};

const FIRST_PAGE_ROWS = 13;
const OTHER_PAGE_ROWS = 14;

function html(script, t) {
  const chars = charsOf(script);
  const rows = [];
  for (let i = 0; i < chars.length; i += 2) rows.push(`<div class="row">${group(chars[i])}${chars[i + 1] ? group(chars[i + 1]) : '<div class="group"></div>'}</div>`);
  // Paginación explícita (un div por página con su propio pie): evita los pies "fixed" de Chromium.
  const pages = [];
  for (let i = 0, size = FIRST_PAGE_ROWS; i < rows.length; i += size, size = OTHER_PAGE_ROWS) pages.push(rows.slice(i, i + size));
  const body = pages
    .map(
      (r, n) => `<section class="page">${n === 0 ? `<h1>${t.title[script]}</h1><p class="help">${t.help}</p>` : ''}${r.join('\n')}<footer>${t.foot}</footer></section>`,
    )
    .join('\n');
  return `<!doctype html><html lang="${t.lang}"><head><meta charset="utf-8"><title>${t.title[script]}</title><style>
    @page{size:A4;margin:12mm 10mm 12mm}
    *{box-sizing:border-box}
    body{margin:0;font-family:system-ui,'Segoe UI',Arial,sans-serif;color:#111}
    .page{break-after:page;height:273mm;position:relative}
    .page:last-child{break-after:auto}
    h1{font-size:15pt;margin:0 0 1mm}
    p.help{font-size:8.5pt;color:#444;margin:0 0 3mm}
    .row{display:flex;gap:6mm;margin-bottom:1.6mm;break-inside:avoid}
    .group{display:flex;flex:1}
    .box{position:relative;width:17mm;height:17mm;border:0.25mm solid #aaa;margin-right:-0.25mm;background:#fff}
    .box.ref{border-color:#111}
    .box svg{display:block;width:100%;height:100%}
    .ro{position:absolute;left:0.8mm;bottom:0.4mm;font-size:6.5pt;color:#555}
    footer{position:absolute;left:0;right:0;bottom:0;font-size:7pt;color:#666;text-align:center}
  </style></head><body>${body}</body></html>`;
}

function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (!base || !existsSync(base)) return undefined;
  const dir = readdirSync(base).find((d) => /^chromium-\d+$/.test(d));
  const candidate = dir && join(base, dir, 'chrome-linux', 'chrome');
  return candidate && existsSync(candidate) ? candidate : undefined;
}

const browser = await chromium.launch({ executablePath: findChromium() });
try {
  for (const t of Object.values(TEXT)) {
    for (const script of ['hira', 'kata']) {
      const page = await browser.newPage();
      await page.setContent(html(script, t), { waitUntil: 'load' });
      await page.pdf({ path: join(outDir, t.files[script]), format: 'A4', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false });
      await page.close();
      console.log('PDF', t.files[script]);
    }
  }
} finally {
  await browser.close();
}
