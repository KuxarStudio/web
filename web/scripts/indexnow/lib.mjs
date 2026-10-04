// IndexNow (https://www.indexnow.org): avisa a Bing y a los demás buscadores adheridos
// de las URLs que cambian en cada despliegue. ChatGPT Search y Copilot se apoyan en el
// índice de Bing, así que indexar rápido en Bing es la vía más barata de aparecer ahí.
// Funciones puras (probadas con vitest); el envío está en ./run.mjs.

export const SITE = 'https://kuxarstudio.com';

// Páginas que no queremos anunciar: legales de las apps (noindex) y 404.
const SKIP = [/\/(privacy-policy|delete-account)(\/|$)/, /\/(privacidad|privacy)\/apps(\/|$)/, /404/];

const CONTENT_PREFIX = {
  'web/src/content/guides/': '/guias/',
  'web/src/content/guides-en/': '/en/guides/',
  'web/src/content/devlog/': '/devlog/',
  'web/src/content/devlog-en/': '/en/devlog/',
};

/** Ruta del sitio de un archivo cambiado, o undefined si no corresponde a una URL concreta. */
export function pathFromFile(file) {
  for (const [prefix, route] of Object.entries(CONTENT_PREFIX)) {
    if (file.startsWith(prefix) && file.endsWith('.md')) return `${route}${file.slice(prefix.length, -3)}/`;
  }
  const m = /^web\/src\/pages\/(.+)\.astro$/.exec(file);
  if (m && !m[1].includes('[')) {
    const p = m[1] === 'index' ? '' : m[1].replace(/(^|\/)index$/, '$1');
    return `/${p}${p && !p.endsWith('/') ? '/' : ''}`;
  }
  return undefined;
}

/** URLs absolutas y únicas a notificar a partir de los archivos añadidos o modificados. */
export function urlsFromChangedFiles(files, site = SITE) {
  const urls = new Set();
  for (const f of files) {
    const path = pathFromFile(f.trim());
    if (!path || SKIP.some((re) => re.test(path))) continue;
    urls.add(`${site}${path}`);
  }
  return [...urls].sort();
}

/** Cuerpo del POST a https://api.indexnow.org/IndexNow */
export function buildPayload({ host, key, urls }) {
  return { host, key, keyLocation: `https://${host}/${key}.txt`, urlList: urls };
}
