import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kuxarstudio.github.io',
  base: '/web',
  build: {
    format: 'file',
  },
});
