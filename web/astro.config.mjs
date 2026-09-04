import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Custom domain (kuxarstudio.com) attached 2026-09-04 — GitHub Pages serves
// it from the root, so base is '/' and site is the domain itself. See
// README.md "Dominio propio" for why this didn't need a repo migration.
//
// build.format 'directory' (Astro's default) produces clean URLs like
// /portfolio/ instead of /portfolio.html, matching what @astrojs/sitemap
// generates. The old .html paths were briefly live in production, so they
// redirect below instead of just disappearing.
export default defineConfig({
  site: 'https://kuxarstudio.com',
  base: '/',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
  redirects: {
    '/portfolio.html': '/portfolio/',
    '/devlog.html': '/devlog/',
    '/devlog/kaku-trazos.html': '/devlog/kaku-trazos/',
    '/devlog/nadir-primer-nivel.html': '/devlog/nadir-primer-nivel/',
    '/devlog/blindnote-rankings.html': '/devlog/blindnote-rankings/',
  },
});
