import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// `base: '/web/'` matches the current GitHub Pages *project* URL
// (kuxarstudio.github.io/web/). When a custom domain is attached later,
// GitHub Pages always serves a custom domain from the root — no /web
// prefix — so at that point this becomes `base: '/'` and `site` becomes
// the custom domain. That's a one-line change, not a migration: there is
// no benefit to moving to a kuxarstudio.github.io-named repo beforehand.
// See README.md "Dominio propio" for the full reasoning.
export default defineConfig({
  site: 'https://kuxarstudio.github.io',
  base: '/web/',
  build: {
    format: 'file',
  },
  integrations: [sitemap()],
});
