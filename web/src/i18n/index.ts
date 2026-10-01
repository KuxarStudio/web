// Núcleo de i18n del sitio. Un único origen para:
//  - los idiomas soportados,
//  - el mapa de rutas ES <-> EN (con slugs traducidos en inglés),
//  - los helpers de hreflang y de contenido localizado.
//
// Convención de URLs: español en la raíz (/portfolio/), inglés bajo /en/
// con slug traducido (/en/projects/). Añadir una página = añadir una clave
// a `routes`; el selector de idioma, el hreflang del <head> y el sitemap
// (ver astro.config.mjs) salen de aquí y no pueden divergir.
export type Lang = 'es' | 'en';

export const LANGS: readonly Lang[] = ['es', 'en'] as const;
export const DEFAULT_LANG: Lang = 'es';

export const routes = {
  home: { es: '/', en: '/en/' },
  projects: { es: '/portfolio/', en: '/en/projects/' },
  tools: { es: '/herramientas/', en: '/en/tools/' },
  devlog: { es: '/devlog/', en: '/en/devlog/' },
  parte: { es: '/parte/', en: '/en/parte/' },
  privacy: { es: '/privacidad/', en: '/en/privacy/' },
  terms: { es: '/terminos/', en: '/en/terms/' },
  kaku: { es: '/kaku/', en: '/en/kaku/' },
  // Páginas legales de las apps (noindex; las pide Google Play).
  appsPrivacy: { es: '/privacidad/apps/', en: '/en/privacy/apps/' },
  kakuPrivacy: { es: '/kaku/privacy-policy/', en: '/en/kaku/privacy-policy/' },
  kakuDelete: { es: '/kaku/delete-account/', en: '/en/kaku/delete-account/' },
  blindnotePrivacy: { es: '/blindnote/privacy-policy/', en: '/en/blindnote/privacy-policy/' },
  blindnoteDelete: { es: '/blindnote/delete-account/', en: '/en/blindnote/delete-account/' },
} as const satisfies Record<string, Record<Lang, string>>;

export type RouteKey = keyof typeof routes;

/** Ruta de sitio (con barra inicial y final) de una página en un idioma. */
export const route = (key: RouteKey, lang: Lang): string => routes[key][lang];

/** Ruta de una entrada de devlog. Mismo slug en ambos idiomas. */
export const devlogPath = (slug: string, lang: Lang): string => `${route('devlog', lang)}${slug}/`;

export const otherLang = (lang: Lang): Lang => (lang === 'es' ? 'en' : 'es');

/** Idioma al que pertenece una ruta (por prefijo /en/). */
export const langFromPath = (pathname: string): Lang => (/^\/en(\/|$)/.test(pathname) ? 'en' : 'es');

export type Alternate = { hreflang: Lang | 'x-default'; path: string };

/** Pares hreflang (incluida la propia página y x-default) para dos rutas. */
export const alternatesFromPaths = (paths: Record<Lang, string>): Alternate[] => [
  { hreflang: 'es', path: paths.es },
  { hreflang: 'en', path: paths.en },
  { hreflang: 'x-default', path: paths.es },
];

export const alternatesFor = (key: RouteKey): Alternate[] => alternatesFromPaths(routes[key]);

/**
 * Aplica las traducciones de un elemento de contenido (`data.en`) sobre sus
 * campos base cuando el idioma es inglés. Los objetos anidados conocidos
 * (media, image, progress) se fusionan campo a campo: basta con traducir
 * `alt` o `label` sin repetir el resto.
 */
const NESTED_KEYS = ['media', 'image', 'progress'] as const;

export function localize<T extends { en?: Record<string, any> }>(data: T, lang: Lang): Omit<T, 'en'> {
  const { en, ...base } = data as T & { en?: Record<string, any> };
  if (lang !== 'en' || !en) return base as Omit<T, 'en'>;
  const merged: Record<string, any> = { ...base, ...en };
  for (const key of NESTED_KEYS) {
    const baseValue = (base as Record<string, any>)[key];
    if (baseValue && en[key]) merged[key] = { ...baseValue, ...en[key] };
  }
  return merged as Omit<T, 'en'>;
}

/** Fecha en el formato del idioma. UTC para que no cambie según la zona del build. */
export function formatDate(date: Date, lang: Lang, month: 'long' | 'short' = 'long'): string {
  return date.toLocaleDateString(lang === 'en' ? 'en-GB' : 'es-ES', { day: 'numeric', month, year: 'numeric', timeZone: 'UTC' });
}
