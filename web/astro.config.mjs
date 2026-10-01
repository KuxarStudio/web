import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync } from 'node:fs';
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
        const pair = pairs.get(new URL(item.url).pathname);
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
