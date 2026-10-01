// Copy de la home en cada idioma. Los textos con **negrita** se pintan con
// `bold()`; el producto «Parte» se pinta con su wordmark en la plantilla.
import type { Lang } from './index';

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
    custom: { h3: string; text: string; link: string };
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
    title: 'Kuxar Studio | Juegos, apps y software para empresas',
    description:
      'Kuxar Studio es un estudio de software independiente. Publicamos juegos, apps de aprendizaje y herramientas propias, y desarrollamos software para empresas.',
    h1: 'Hacemos juegos, apps y software para empresas.',
    heroSub:
      'Kuxar Studio es un estudio de software independiente. Publicamos productos propios y desarrollamos software a medida.',
    doorsLabel: '¿Qué buscas?',
    doors: {
      games: { title: 'Juegos y apps', desc: 'Kaku!, BlindNote y Nadir. Descárgalos o sigue su desarrollo.' },
      business: { title: 'Para empresas', desc: 'Parte para presupuestos de obra, y desarrollo a medida.' },
    },
    kakuVideoLabel: 'Kaku!: trazando el hiragana あ hasta completarlo.',
    blindnoteAlt: 'BlindNote: pantalla de resultados para marcar artista, canción y año acertados.',
    projects: { h2: 'Proyectos', intro: 'Lo que ya puedes usar y lo que tenemos en marcha.' },
    business: {
      h2: 'Para empresas',
      intro:
        'Software que resuelve un problema concreto de tu negocio. Empezamos por uno que conocemos bien: los presupuestos de obra.',
      custom: {
        h3: '¿Tu problema es otro?',
        text: 'También desarrollamos apps y herramientas a medida para empresas. Al terminar, **el código es tuyo**. Cuéntanos qué necesitas.',
        link: 'Escríbenos →',
      },
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
    title: 'Kuxar Studio | Games, apps and software for businesses',
    description:
      'Kuxar Studio is an independent software studio. We publish our own games, learning apps and tools, and build custom software for businesses.',
    h1: 'We make games, apps and software for businesses.',
    heroSub:
      'Kuxar Studio is an independent software studio. We publish our own products and build custom software.',
    doorsLabel: 'What are you looking for?',
    doors: {
      games: { title: 'Games and apps', desc: 'Kaku!, BlindNote and Nadir. Download them or follow their development.' },
      business: { title: 'For businesses', desc: 'Parte for construction job quotes, and custom development.' },
    },
    kakuVideoLabel: 'Kaku!: tracing the hiragana あ until it is complete.',
    blindnoteAlt: 'BlindNote: results screen for marking the artist, song and year you got right.',
    projects: { h2: 'Projects', intro: 'What you can use today and what we have in the works.' },
    business: {
      h2: 'For businesses',
      intro:
        'Software that solves a specific problem in your business. We start with one we know well: quotes for construction jobs.',
      custom: {
        h3: 'Is your problem a different one?',
        text: 'We also build custom apps and tools for businesses. When we finish, **the code is yours**. Tell us what you need.',
        link: 'Get in touch →',
      },
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
