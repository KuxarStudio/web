import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';
import { routes } from './src/i18n/index.ts';

const SITE = 'https://kuxarstudio.com';

// Pares ES <-> EN para el hreflang del sitemap. Salen del mapa de rutas
// (src/i18n) y de las entradas de devlog traducidas, así que añadir una
// página o una traducción no requiere tocar este archivo.
const translatedDevlog = new Set(
  readdirSync(new URL('./src/content/devlog-en/', import.meta.url))
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, '')),
);
// Guías: slug propio por idioma, emparejadas por la clave `key` del frontmatter.
const guideSlugsByKey = (dir) =>
  new Map(
    readdirSync(new URL(`./src/content/${dir}/`, import.meta.url))
      .filter((f) => f.endsWith('.md'))
      .map((f) => {
        const text = readFileSync(new URL(`./src/content/${dir}/${f}`, import.meta.url), 'utf8');
        const key = /^key:\s*["']?([^"'\n]+)["']?\s*$/m.exec(text)?.[1];
        return [key, f.replace(/\.md$/, '')];
      }),
  );
const guidesEs = guideSlugsByKey('guides');
const guidesEn = guideSlugsByKey('guides-en');
// lastmod real (frontmatter `updated` o, si no, `date`) solo para contenido con
// fecha propia. Las páginas estáticas no llevan lastmod: Google lo ignora si no
// es fiable, y en CI (checkout superficial) las fechas de git serían todas la misma.
const lastmodByPath = new Map();
const addLastmods = (dir, prefix) => {
  for (const f of readdirSync(new URL(`./src/content/${dir}/`, import.meta.url)).filter((n) => n.endsWith('.md'))) {
    const text = readFileSync(new URL(`./src/content/${dir}/${f}`, import.meta.url), 'utf8');
    const fm = /^---\n([\s\S]*?)\n---/.exec(text)?.[1] ?? '';
    const read = (k) => new RegExp(`^${k}:\\s*["']?(\\d{4}-\\d{2}-\\d{2})`, 'm').exec(fm)?.[1];
    const d = read('updated') ?? read('date');
    if (d) lastmodByPath.set(`${prefix}${f.replace(/\.md$/, '')}/`, new Date(d).toISOString());
  }
};
addLastmods('devlog', '/devlog/');
addLastmods('devlog-en', '/en/devlog/');
addLastmods('guides', '/guias/');
addLastmods('guides-en', '/en/guides/');
const pairs = new Map(); // ruta -> { es, en }
for (const pair of Object.values(routes)) {
  pairs.set(pair.es, pair);
  pairs.set(pair.en, pair);
}
for (const slug of translatedDevlog) {
  const pair = { es: `/devlog/${slug}/`, en: `/en/devlog/${slug}/` };
  pairs.set(pair.es, pair);
  pairs.set(pair.en, pair);
}

for (const [key, slugEs] of guidesEs) {
  const slugEn = guidesEn.get(key);
  if (!slugEn) continue;
  const pair = { es: `/guias/${slugEs}/`, en: `/en/guides/${slugEn}/` };
  pairs.set(pair.es, pair);
  pairs.set(pair.en, pair);
}

// Custom domain (kuxarstudio.com) attached 2026-09-04 — GitHub Pages serves
// it from the root, so base is '/' and site is the domain itself. See
// README.md "Dominio propio" for why this didn't need a repo migration.
//
// build.format 'directory' (Astro's default) produces clean URLs like
// /portfolio/ instead of /portfolio.html, matching what @astrojs/sitemap
// generates. The old .html paths were briefly live in production, so they
// redirect below instead of just disappearing.
export default defineConfig({
  site: SITE,
  base: '/',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap({
      // Páginas legales de las apps y solicitudes de borrado: accesibles por URL
      // (las pide Google Play) pero sin interés de búsqueda.
      filter: (page) => !/\/(privacy-policy|delete-account)\/$|\/(privacidad|privacy)\/apps\/$/.test(page),
      // xhtml:link de hreflang: cada página con traducción enlaza a su par
      // (ver `pairs`). x-default apunta a la versión en español.
      serialize(item) {
        const path = new URL(item.url).pathname;
        const lastmod = lastmodByPath.get(path);
        if (lastmod) item.lastmod = lastmod;
        const pair = pairs.get(path);
        if (pair) {
          item.links = [
            { url: SITE + pair.es, lang: 'es' },
            { url: SITE + pair.en, lang: 'en' },
            { url: SITE + pair.es, lang: 'x-default' },
          ];
        }
        return item;
      },
    }),
  ],
  redirects: {
    '/portfolio.html': '/portfolio/',
    '/devlog.html': '/devlog/',
    // Entradas retiradas (no reflejaban el trabajo real): redirigen al índice.
    '/devlog/nadir-primer-nivel.html': '/devlog/',
    '/devlog/nadir-primer-nivel': '/devlog/',
    '/devlog/kaku-trazos.html': '/devlog/',
    '/devlog/kaku-trazos': '/devlog/',
    '/devlog/blindnote-rankings.html': '/devlog/',
    '/devlog/blindnote-rankings': '/devlog/',
  },
});
