// Copy de la home en cada idioma. Los textos con **negrita** se pintan con
// `bold()`; el producto «Parte» se pinta con su wordmark en la plantilla.
import type { Lang } from './index';

export interface ServiceText {
  label: string;
  title: string;
  desc: string;
  points: string[];
  link: string;
}

export interface HomeCopy {
  title: string;
  description: string;
  h1: string;
  heroSub: string;
  doorsLabel: string;
  doors: { games: { title: string; desc: string }; business: { title: string; desc: string } };
  kakuVideoLabel: string;
  blindnoteAlt: string;
  projects: { h2: string; intro: string };
  business: {
    h2: string;
    intro: string;
    /** Servicios (tarjetas). Orden de pintado: web, software. */
    services: Record<'web' | 'software', ServiceText>;
    /** Rótulo sobre los encargos para clientes. */
    workLabel: string;
    faqTitle: string;
  };
  studio: {
    h2: string;
    paragraphs: string[];
    stack: { complexGames: string; lightApps: string; tools: string; code: string };
  };
  devlog: { h2: string; intro: string };
}

export const home: Record<Lang, HomeCopy> = {
  es: {
    title: 'Kuxar Studio | Juegos, apps, webs y software a medida',
    description:
      'Kuxar Studio es un estudio de software independiente. Publicamos juegos, apps y herramientas propias, y diseñamos webs y software a medida para empresas.',
    h1: 'Hacemos juegos, apps, webs y software para empresas.',
    heroSub:
      'Kuxar Studio es un estudio de software independiente. Publicamos productos propios y diseñamos webs y software a medida.',
    doorsLabel: '¿Qué buscas?',
    doors: {
      games: { title: 'Juegos y apps', desc: 'Kaku!, BlindNote y Nadir. Descárgalos o sigue su desarrollo.' },
      business: { title: 'Para empresas', desc: 'Diseño web, software a medida y Parte para presupuestos de obra.' },
    },
    kakuVideoLabel: 'Kaku!: trazando el hiragana あ hasta completarlo.',
    blindnoteAlt: 'BlindNote: pantalla de resultados para marcar artista, canción y año acertados.',
    projects: { h2: 'Proyectos', intro: 'Lo que ya puedes usar y lo que tenemos en marcha.' },
    business: {
      h2: 'Para empresas',
      intro:
        'Webs, apps y herramientas hechas para un negocio concreto, no para todos a la vez. Al terminar, el código es tuyo.',
      services: {
        web: {
          label: 'Diseño web',
          title: 'Webs a medida, rápidas y preparadas para Google',
          desc: 'Diseñamos y programamos la web de tu empresa desde cero: pensada primero para el móvil, con SEO técnico desde la base y en los idiomas que necesites.',
          points: ['Diseño a medida', 'Móvil primero', 'SEO técnico', 'Multidioma'],
          link: 'Ver diseño web a medida',
        },
        software: {
          label: 'Software a medida',
          title: 'Apps y herramientas para cómo trabajas',
          desc: 'Cuando una hoja de cálculo o una app genérica ya no llega: agendas, paneles internos o herramientas que conectan con lo que ya usas.',
          points: ['Web apps', 'Apps móviles', 'Herramientas internas'],
          link: 'Cuéntanos tu proyecto →',
        },
      },
      workLabel: 'Un encargo reciente',
      faqTitle: 'Preguntas frecuentes',
    },
    studio: {
      h2: 'El estudio',
      paragraphs: [
        'Somos **tres desarrolladores independientes** que trabajamos juntos como Kuxar Studio.',
        'Hacemos **productos propios** (juegos, apps de aprendizaje y herramientas) y **software para empresas**. Lo que aprendemos en unos lo aplicamos en los otros.',
        'Elegimos la tecnología según el proyecto, no al revés.',
      ],
      stack: { complexGames: 'Juegos complejos', lightApps: 'Apps y juegos ligeros', tools: 'Herramientas', code: 'Código' },
    },
    devlog: { h2: 'Devlog', intro: 'Cómo avanzan los proyectos, contado por quienes los hacen.' },
  },
  en: {
    title: 'Kuxar Studio | Games, apps, websites and custom software',
    description:
      'Kuxar Studio is an independent software studio. We publish our own games, apps and tools, and design websites and custom software for businesses.',
    h1: 'We make games, apps, websites and software for businesses.',
    heroSub:
      'Kuxar Studio is an independent software studio. We publish our own products and design custom websites and software.',
    doorsLabel: 'What are you looking for?',
    doors: {
      games: { title: 'Games and apps', desc: 'Kaku!, BlindNote and Nadir. Download them or follow their development.' },
      business: { title: 'For businesses', desc: 'Web design, custom software and Parte for construction job quotes.' },
    },
    kakuVideoLabel: 'Kaku!: tracing the hiragana あ until it is complete.',
    blindnoteAlt: 'BlindNote: results screen for marking the artist, song and year you got right.',
    projects: { h2: 'Projects', intro: 'What you can use today and what we have in the works.' },
    business: {
      h2: 'For businesses',
      intro:
        'Websites, apps and tools built for one specific business, not for everyone at once. When we finish, the code is yours.',
      services: {
        web: {
          label: 'Web design',
          title: 'Custom websites, fast and ready for Google',
          desc: 'We design and build your company website from scratch: mobile first, with technical SEO built in and in the languages you need.',
          points: ['Custom design', 'Mobile first', 'Technical SEO', 'Multilingual'],
          link: 'See custom web design',
        },
        software: {
          label: 'Custom software',
          title: 'Apps and tools that fit how you work',
          desc: 'For when a spreadsheet or an off-the-shelf app is no longer enough: schedules, internal dashboards or tools that connect to what you already use.',
          points: ['Web apps', 'Mobile apps', 'Internal tools'],
          link: 'Tell us about your project →',
        },
      },
      workLabel: 'A recent project',
      faqTitle: 'Frequently asked questions',
    },
    studio: {
      h2: 'The studio',
      paragraphs: [
        'We are **three independent developers** working together as Kuxar Studio.',
        'We make **our own products** (games, learning apps and tools) and **software for businesses**. What we learn on one we apply to the other.',
        'We choose the technology to fit the project, not the other way around.',
      ],
      stack: { complexGames: 'Complex games', lightApps: 'Apps and light games', tools: 'Tools', code: 'Code' },
    },
    devlog: { h2: 'Devlog', intro: 'How the projects are going, told by the people building them.' },
  },
};

/** Convierte **negrita** de los textos del copy en <strong> (copy propio, de confianza). */
export const bold = (text: string): string => text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
