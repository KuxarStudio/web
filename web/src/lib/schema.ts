// Constructores de JSON-LD (schema.org) reutilizables. Cada función devuelve un
// objeto plano; BaseLayout los serializa. Solo datos que ya están visibles en
// la página o confirmados: no añadir ratings, precios ni plataformas inventadas.
import { route, type Lang, type RouteKey } from '../i18n';

const CONTEXT = 'https://schema.org';

export interface Crumb {
  name: string;
  /** Ruta de sitio con barra inicial (p. ej. '/portfolio/'). */
  path: string;
}

const HOME_LABEL: Record<Lang, string> = { es: 'Inicio', en: 'Home' };

/** Migas de pan. La primera es siempre la home del idioma; la última no necesita enlace propio. */
export function breadcrumbList(site: string, lang: Lang, trail: Crumb[]) {
  const items: Crumb[] = [{ name: HOME_LABEL[lang], path: route('home', lang) }, ...trail];
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${site}${c.path}`,
    })),
  };
}

/** Atajo: migas para una página de primer nivel registrada en el mapa de rutas. */
export const breadcrumbForRoute = (site: string, lang: Lang, key: RouteKey, name: string) =>
  breadcrumbList(site, lang, [{ name, path: route(key, lang) }]);

export interface BlogPostingInput {
  /** Tipo schema.org. Devlog = BlogPosting (por defecto); guías = Article. */
  type?: 'BlogPosting' | 'Article';
  site: string;
  lang: Lang;
  path: string;
  headline: string;
  description: string;
  datePublished: Date;
  /** Última modificación real, si se conoce. Si no, se omite (no se inventa). */
  dateModified?: Date;
  /** Nombre del proyecto al que pertenece la entrada. */
  about?: string;
  /** Imagen absoluta de la entrada (por defecto, la del estudio). */
  image: string;
}

/** Entrada de devlog. Autor y editor son la organización: la web no nombra personas. */
export function blogPosting(i: BlogPostingInput) {
  const url = `${i.site}${i.path}`;
  return {
    '@context': CONTEXT,
    '@type': i.type ?? 'BlogPosting',
    '@id': `${url}#post`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: i.headline,
    description: i.description,
    inLanguage: i.lang,
    datePublished: i.datePublished.toISOString().slice(0, 10),
    ...(i.dateModified ? { dateModified: i.dateModified.toISOString().slice(0, 10) } : {}),
    image: i.image,
    ...(i.about ? { about: { '@type': 'Thing', name: i.about } } : {}),
    author: { '@id': `${i.site}/#organization` },
    publisher: { '@id': `${i.site}/#organization` },
  };
}

export interface ToolInput {
  site: string;
  name: string;
  description: string;
  lang: Lang;
  /** URL del repositorio público (código abierto). */
  repo?: string;
  /** Página del sitio donde se describe la herramienta. */
  url: string;
  programmingLanguage?: string;
}

/** Herramienta de escritorio/CLI. Sin `offers` ni `operatingSystem`: no están confirmados. */
export function toolApplication(i: ToolInput) {
  return {
    '@context': CONTEXT,
    '@type': 'SoftwareApplication',
    name: i.name,
    description: i.description,
    inLanguage: i.lang,
    url: i.url,
    applicationCategory: 'BusinessApplication',
    ...(i.repo ? { codeRepository: i.repo } : {}),
    ...(i.programmingLanguage ? { programmingLanguage: i.programmingLanguage } : {}),
    author: { '@id': `${i.site}/#organization` },
    publisher: { '@id': `${i.site}/#organization` },
  };
}

/** Listado de elementos (portfolio, herramientas, devlog) como ItemList. */
export function itemList(items: { name: string; url: string }[]) {
  return {
    '@context': CONTEXT,
    '@type': 'ItemList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: it.url,
    })),
  };
}

export interface FaqItem {
  q: string;
  a: string;
}

/** Preguntas frecuentes. Solo para listas que se ven tal cual en la página. */
export function faqPage(lang: Lang, items: FaqItem[]) {
  return {
    '@context': CONTEXT,
    '@type': 'FAQPage',
    inLanguage: lang,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export interface ServiceInput {
  site: string;
  lang: Lang;
  /** Ruta de la página del servicio (p. ej. '/diseno-web/'). */
  path: string;
  name: string;
  description: string;
  /** Tipo de servicio en texto libre (schema.org `serviceType`). */
  serviceType: string;
  /** Lo que incluye, como catálogo sin precios (no están confirmados). */
  includes?: string[];
}

/**
 * Servicio que presta el estudio. Sin `offers`, precios ni `areaServed`: no
 * están confirmados y schema.org no los exige. El proveedor es la organización.
 */
export function service(i: ServiceInput) {
  const url = `${i.site}${i.path}`;
  return {
    '@context': CONTEXT,
    '@type': 'Service',
    '@id': `${url}#service`,
    url,
    name: i.name,
    description: i.description,
    serviceType: i.serviceType,
    inLanguage: i.lang,
    provider: { '@id': `${i.site}/#organization` },
    ...(i.includes && i.includes.length > 0
      ? {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: i.name,
            itemListElement: i.includes.map((name) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name },
            })),
          },
        }
      : {}),
  };
}
