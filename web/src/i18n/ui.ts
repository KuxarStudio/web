// Textos de la interfaz compartidos por todas las páginas (cabecera, pie,
// tarjetas, estados...). El contenido propio de cada página vive en su
// módulo (home.ts, parte.ts, kaku.ts...). Los dos idiomas comparten forma:
// TypeScript avisa si falta una clave en alguno.
import type { Lang } from './index';

export interface Ui {
  skipLink: string;
  /** ids de ancla (distintos por idioma para que la URL se lea bien). */
  ids: { projects: string; business: string; studio: string; devlog: string; contact: string };
  header: {
    navLabel: string;
    projects: string;
    studio: string;
    devlog: string;
    contact: string;
    menu: string;
    toDark: string;
    toLight: string;
    switchTo: string;
    switchLabel: string;
  };
  footer: {
    title: string;
    nav: string;
    about: string;
    projects: string;
    tools: string;
    devlog: string;
    studio: string;
    legal: string;
    privacy: string;
    terms: string;
  };
  cookie: { label: string; text: string; policy: string; reject: string; accept: string };
  category: Record<'juego' | 'aprendizaje', string>;
  status: Record<'en-desarrollo' | 'proximamente' | 'disponible', string>;
  workStatus: Record<'entregado' | 'en-desarrollo', string>;
  project: {
    phase: (current: number, total: number, label: string) => string;
    phaseShort: (current: number, total: number) => string;
    more: (name: string) => string;
    readDevlog: string;
    googlePlay: string;
    appStore: string;
    steam: string;
    repo: string;
  };
  tool: { label: string; download: string; code: string };
  work: { label: string; demo: string };
  devlog: { back: string; all: string };
  video: { pause: string; play: string };
  notFound: { title: string; description: string; h1: string; home: string; projects: string };
  legal: { updated: string };
  stickyCta: { label: string };
  thanks: { title: string; description: string; h1: string; body: string; home: string; projects: string };
}

export const ui: Record<Lang, Ui> = {
  es: {
    skipLink: 'Saltar al contenido',
    ids: { projects: 'proyectos', business: 'empresas', studio: 'estudio', devlog: 'devlog', contact: 'contacto' },
    header: {
      navLabel: 'Principal',
      projects: 'Proyectos',
      studio: 'Estudio',
      devlog: 'Devlog',
      contact: 'Escríbenos',
      menu: 'Menú',
      toDark: 'Cambiar a modo oscuro',
      toLight: 'Cambiar a modo claro',
      switchTo: 'EN',
      switchLabel: 'View in English',
    },
    footer: {
      title: 'Escríbenos',
      nav: 'Pie de página',
      about: 'Estudio de software independiente. Juegos, apps de aprendizaje, herramientas y software para empresas.',
      projects: 'Proyectos',
      tools: 'Herramientas',
      devlog: 'Devlog',
      studio: 'Estudio',
      legal: 'Legal',
      privacy: 'Privacidad',
      terms: 'Términos',
    },
    cookie: {
      label: 'Aviso de cookies',
      text: 'Usamos cookies analíticas (Google Analytics) solo si las aceptas.',
      policy: 'Política de privacidad',
      reject: 'Rechazar',
      accept: 'Aceptar',
    },
    category: { juego: 'Juego', aprendizaje: 'App de aprendizaje' },
    status: { 'en-desarrollo': 'En desarrollo', proximamente: 'Próximamente', disponible: 'Disponible' },
    workStatus: { entregado: 'Entregado y en producción', 'en-desarrollo': 'En desarrollo' },
    project: {
      phase: (c, t, label) => `fase ${c} de ${t}, ${label}`,
      phaseShort: (c, t) => `Fase ${c} de ${t}`,
      more: (name) => `Más sobre ${name} →`,
      readDevlog: 'Leer el devlog →',
      googlePlay: 'Descargar en Google Play',
      appStore: 'Descargar en App Store',
      steam: 'Ver en Steam',
      repo: 'Ver repositorio',
    },
    tool: { label: 'Herramienta', download: 'Descargar', code: 'Código en GitHub →' },
    work: { label: 'Software a medida', demo: 'Ver demo →' },
    devlog: { back: '← Volver al devlog', all: 'Ver todas las entradas →' },
    video: { pause: 'Pausar vídeo', play: 'Reproducir vídeo' },
    notFound: {
      title: 'Página no encontrada | Kuxar Studio',
      description: 'Esta página no existe o se ha movido.',
      h1: 'No encontramos esta página',
      home: 'Ir al inicio',
      projects: 'Ver proyectos →',
    },
    legal: { updated: 'Última actualización' },
    stickyCta: { label: 'Escríbenos' },
    thanks: {
      title: 'Mensaje enviado | Kuxar Studio',
      description: 'Hemos recibido tu mensaje. Te responderemos por email lo antes posible.',
      h1: 'Mensaje enviado',
      body: 'Gracias por escribirnos. Hemos recibido tu mensaje y te responderemos por email lo antes posible.',
      home: 'Volver al inicio',
      projects: 'Ver proyectos →',
    },
  },
  en: {
    skipLink: 'Skip to content',
    ids: { projects: 'projects', business: 'business', studio: 'studio', devlog: 'devlog', contact: 'contact' },
    header: {
      navLabel: 'Main',
      projects: 'Projects',
      studio: 'Studio',
      devlog: 'Devlog',
      contact: 'Contact',
      menu: 'Menu',
      toDark: 'Switch to dark mode',
      toLight: 'Switch to light mode',
      switchTo: 'ES',
      switchLabel: 'Ver en español',
    },
    footer: {
      title: 'Get in touch',
      nav: 'Footer',
      about: 'Independent software studio. Games, learning apps, tools and software for businesses.',
      projects: 'Projects',
      tools: 'Tools',
      devlog: 'Devlog',
      studio: 'Studio',
      legal: 'Legal',
      privacy: 'Privacy',
      terms: 'Terms',
    },
    cookie: {
      label: 'Cookie notice',
      text: 'We use analytics cookies (Google Analytics) only if you accept them.',
      policy: 'Privacy policy',
      reject: 'Reject',
      accept: 'Accept',
    },
    category: { juego: 'Game', aprendizaje: 'Learning app' },
    status: { 'en-desarrollo': 'In development', proximamente: 'Coming soon', disponible: 'Available' },
    workStatus: { entregado: 'Delivered and in production', 'en-desarrollo': 'In development' },
    project: {
      phase: (c, t, label) => `phase ${c} of ${t}, ${label}`,
      phaseShort: (c, t) => `Phase ${c} of ${t}`,
      more: (name) => `More about ${name} →`,
      readDevlog: 'Read the devlog →',
      googlePlay: 'Get it on Google Play',
      appStore: 'Download on the App Store',
      steam: 'View on Steam',
      repo: 'View repository',
    },
    tool: { label: 'Tool', download: 'Download', code: 'Code on GitHub →' },
    work: { label: 'Custom software', demo: 'View demo →' },
    devlog: { back: '← Back to the devlog', all: 'See all entries →' },
    video: { pause: 'Pause video', play: 'Play video' },
    notFound: {
      title: 'Page not found | Kuxar Studio',
      description: 'This page does not exist or has moved.',
      h1: "We couldn't find this page",
      home: 'Go to the homepage',
      projects: 'See projects →',
    },
    legal: { updated: 'Last updated' },
    stickyCta: { label: 'Contact us' },
    thanks: {
      title: 'Message sent | Kuxar Studio',
      description: 'We have received your message. We will reply by email as soon as we can.',
      h1: 'Message sent',
      body: 'Thanks for writing to us. We have received your message and will reply by email as soon as we can.',
      home: 'Back to the homepage',
      projects: 'See projects →',
    },
  },
};
