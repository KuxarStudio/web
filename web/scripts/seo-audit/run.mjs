// CLI de la auditoría SEO. Uso: `npm run build && npm run audit`.
// Sale con código 1 si hay hallazgos de tipo `error` (los `warn` solo se listan).
// Opciones: --json (salida máquina), --strict (los avisos también fallan).
import { readdirSync, readFileSync, statSync, existsSync, appendFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { auditSite, fileToUrl, parsePage, topicParity } from './lib.mjs';

const root = resolve(fileURLToPath(new URL('../../', import.meta.url)));
const dist = join(root, 'dist');
const SITE = 'https://kuxarstudio.com';
const args = new Set(process.argv.slice(2));

if (!existsSync(dist)) {
  console.error('No existe dist/. Ejecuta antes `npm run build`.');
  process.exit(2);
}

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = walk(dist);
const pages = new Map();
for (const f of files.filter((p) => p.endsWith('.html'))) {
  const rel = relative(dist, f);
  if (rel === '404.html') continue;
  pages.set(fileToUrl(rel), parsePage(readFileSync(f, 'utf8')));
}
const staticFiles = new Set(files.map((f) => '/' + relative(dist, f).replace(/\\/g, '/')));
const exists = (path) => staticFiles.has(path) || staticFiles.has(path.replace(/\/$/, '')) || pages.has(path);

// Sitemap
const sitemapXml = readdirSync(dist)
  .filter((n) => /^sitemap-\d+\.xml$/.test(n))
  .map((n) => readFileSync(join(dist, n), 'utf8'))
  .join('\n');
const sitemapUrls = new Set([...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname));

// Guías (clave, proyecto y slug por idioma) desde el contenido
const guides = new Map();
for (const [dir, lang, prefix] of [['guides', 'es', '/guias/'], ['guides-en', 'en', '/en/guides/']]) {
  const base = join(root, 'src/content', dir);
  if (!existsSync(base)) continue;
  for (const f of readdirSync(base).filter((n) => n.endsWith('.md'))) {
    const fm = /^---\n([\s\S]*?)\n---/.exec(readFileSync(join(base, f), 'utf8'))?.[1] ?? '';
    const data = parseYaml(fm);
    const g = guides.get(data.key) ?? { key: data.key, project: data.project };
    g[lang] = `${prefix}${f.replace(/\.md$/, '')}/`;
    guides.set(data.key, g);
  }
}

// Mapa de temas (vive junto al agente SEO, que lo usará para medir cobertura)
const topicMapPath = resolve(root, '../tools/seo-agent/topic-map.yaml');
const topicMap = existsSync(topicMapPath) ? parseYaml(readFileSync(topicMapPath, 'utf8')) : { projects: {} };
const important = [...guides.values()].flatMap((g) => [g.es, g.en].filter(Boolean));
for (const p of Object.values(topicMap.projects ?? {})) if (p.landing) important.push(p.landing.es, p.landing.en);

const site = auditSite({ pages, exists, siteOrigin: SITE, important });
const parity = topicParity({ topicMap, guides: [...guides.values()], sitemapUrls });
const findings = [...site.findings, ...parity.findings];

const errors = findings.filter((f) => f.severity === 'error');
const warns = findings.filter((f) => f.severity === 'warn');

if (args.has('--json')) {
  console.log(JSON.stringify({ findings, coverage: parity.coverage, pages: pages.size }, null, 2));
} else {
  const group = (list) => {
    const byType = new Map();
    for (const f of list) byType.set(f.type, [...(byType.get(f.type) ?? []), f]);
    return byType;
  };
  const lines = [];
  lines.push(`Auditoría SEO: ${pages.size} páginas, ${errors.length} errores, ${warns.length} avisos`);
  for (const [id, c] of Object.entries(parity.coverage)) lines.push(`Cobertura del mapa de temas · ${id}: ${c.live}/${c.total} (${Math.round(c.ratio * 100)}%), ${c.planned} planificados`);
  for (const [label, list] of [['ERRORES', errors], ['AVISOS', warns]]) {
    if (!list.length) continue;
    lines.push('', `== ${label} ==`);
    for (const [type, items] of group(list)) {
      lines.push(`- ${type} (${items.length})`);
      for (const f of items.slice(0, 25)) lines.push(`    ${f.url}  ${f.detail}`);
      if (items.length > 25) lines.push(`    … y ${items.length - 25} más`);
    }
  }
  console.log(lines.join('\n'));
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, '```\n' + lines.join('\n') + '\n```\n');
}

process.exit(errors.length || (args.has('--strict') && warns.length) ? 1 : 0);
