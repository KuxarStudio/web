import { describe, expect, it } from 'vitest';
import { buildPayload, pathFromFile, urlsFromChangedFiles } from '../scripts/indexnow/lib.mjs';

describe('IndexNow: archivo -> URL', () => {
  it('mapea guías y devlog por idioma', () => {
    expect(pathFromFile('web/src/content/guides/que-es-el-kana.md')).toBe('/guias/que-es-el-kana/');
    expect(pathFromFile('web/src/content/guides-en/what-is-kana.md')).toBe('/en/guides/what-is-kana/');
    expect(pathFromFile('web/src/content/devlog/nadir-log-001.md')).toBe('/devlog/nadir-log-001/');
    expect(pathFromFile('web/src/content/devlog-en/nadir-log-001.md')).toBe('/en/devlog/nadir-log-001/');
  });
  it('mapea páginas estáticas, incluida la home de cada idioma', () => {
    expect(pathFromFile('web/src/pages/index.astro')).toBe('/');
    expect(pathFromFile('web/src/pages/en/index.astro')).toBe('/en/');
    expect(pathFromFile('web/src/pages/estudio.astro')).toBe('/estudio/');
    expect(pathFromFile('web/src/pages/recursos/hojas-de-trazos.astro')).toBe('/recursos/hojas-de-trazos/');
  });
  it('ignora rutas dinámicas, componentes y archivos que no son páginas', () => {
    expect(pathFromFile('web/src/pages/guias/[...slug].astro')).toBeUndefined();
    expect(pathFromFile('web/src/components/Header.astro')).toBeUndefined();
    expect(pathFromFile('README.md')).toBeUndefined();
  });
});

describe('IndexNow: URLs a notificar', () => {
  it('devuelve URLs absolutas, únicas y ordenadas, sin páginas legales de apps ni 404', () => {
    const urls = urlsFromChangedFiles([
      'web/src/content/guides/b.md',
      'web/src/content/guides/a.md',
      'web/src/content/guides/a.md',
      'web/src/pages/kaku/privacy-policy.astro',
      'web/src/pages/privacidad/apps.astro',
      'web/src/pages/404.astro',
      'web/src/components/X.astro',
    ]);
    expect(urls).toEqual(['https://kuxarstudio.com/guias/a/', 'https://kuxarstudio.com/guias/b/']);
  });
  it('construye el payload con keyLocation en el host', () => {
    expect(buildPayload({ host: 'kuxarstudio.com', key: 'abc', urls: ['https://kuxarstudio.com/x/'] })).toEqual({
      host: 'kuxarstudio.com',
      key: 'abc',
      keyLocation: 'https://kuxarstudio.com/abc.txt',
      urlList: ['https://kuxarstudio.com/x/'],
    });
  });
});
