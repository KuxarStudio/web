import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Custom domain (kuxarstudio.com) attached 2026-09-04 — GitHub Pages serves
// it from the root, so base is '/' and site is the domain itself. See
// README.md "Dominio propio" for why this didn't need a repo migration.
export default defineConfig({
  site: 'https://kuxarstudio.com',
  base: '/',
  build: {
    format: 'file',
  },
  integrations: [sitemap()],
});
