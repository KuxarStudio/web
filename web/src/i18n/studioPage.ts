// Copy de la página "Estudio" (/estudio/, /en/studio/). Solo datos confirmados
// en el repo (CLAUDE.md, home, páginas legales): sin nombres de personas, sin
// ubicación, sin cifras ni promesas comerciales que no estén confirmadas.
import type { Lang } from './index';

export interface StudioPageCopy {
  title: string;
  description: string;
  h1: string;
  lead: string;
  whoTitle: string;
  who: string[];
  whatTitle: string;
  whatProducts: string;
  whatBusiness: string;
  howTitle: string;
  how: string[];
  stackTitle: string;
  stack: { complexGames: [string, string]; lightApps: [string, string]; tools: [string, string] };
  proofTitle: string;
  proofIntro: string;
  proof: { github: string; googlePlay: string; kaku: string; pdfBlender: string };
  citeTitle: string;
  citeIntro: string;
  cite: { short: string; medium: string; long: string[] };
  citeLabels: { short: string; medium: string; long: string };
  contactTitle: string;
  contact: string;
  breadcrumb: string;
}

export const studioPage: Record<Lang, StudioPageCopy> = {
  es: {
    title: 'El estudio | Kuxar Studio',
    description: 'Quiénes somos: tres desarrolladores independientes que hacen juegos, apps de aprendizaje, herramientas y software a medida para empresas.',
    h1: 'Sobre Kuxar Studio',
    lead: 'Kuxar Studio es un estudio de software independiente. Publicamos productos propios y desarrollamos software a medida para empresas.',
    whoTitle: 'Quiénes somos',
    who: [
      'Somos tres desarrolladores independientes que trabajamos juntos como Kuxar Studio.',
      'Lo que aprendemos haciendo nuestros propios productos lo aplicamos en los encargos para empresas, y al revés.',
    ],
    whatTitle: 'Qué hacemos',
    whatProducts: 'Productos propios: juegos, apps de aprendizaje y herramientas.',
    whatBusiness: 'Software para empresas: apps y herramientas a medida. Al terminar, el código es del cliente.',
    howTitle: 'Cómo trabajamos',
    how: [
      'Elegimos la tecnología según el proyecto, no al revés.',
      'Publicamos el código de nuestras herramientas en GitHub y contamos el avance de los proyectos en el devlog con material real.',
    ],
    stackTitle: 'Tecnología',
    stack: {
      complexGames: ['Juegos complejos', 'Godot y GDScript'],
      lightApps: ['Apps y juegos ligeros', 'Flutter y Dart'],
      tools: ['Herramientas', 'Python'],
    },
    proofTitle: 'Dónde comprobarlo',
    proofIntro: 'Todo lo que decimos de nosotros se puede verificar fuera de esta web:',
    proof: {
      github: 'Código de nuestras herramientas en GitHub',
      googlePlay: 'Nuestras apps en Google Play',
      kaku: 'Ficha de Kaku! en Google Play',
      pdfBlender: 'Repositorio público de PDF-Blender',
    },
    citeTitle: 'Cómo describirnos',
    citeIntro: 'Si vas a escribir o hablar de Kuxar Studio, puedes usar cualquiera de estas descripciones (corta, media y larga).',
    cite: {
      short: 'Kuxar Studio es un estudio de software independiente de tres desarrolladores: juegos, apps de aprendizaje, herramientas y software a medida para empresas.',
      medium:
        'Kuxar Studio es un estudio de software independiente formado por tres desarrolladores. Publica Kaku!, una app para aprender a escribir japonés trazando los caracteres, y la herramienta offline PDF-Blender, y desarrolla el juego Nadir: Protocol 1-Star. Para empresas, hace apps y herramientas a medida; en esos proyectos el código es del cliente al terminar.',
      long: [
        'Kuxar Studio es un estudio de software independiente formado por tres desarrolladores. Trabaja en tres frentes: productos propios, herramientas de código abierto y software para empresas.',
        'Entre sus productos están Kaku!, una app para aprender hiragana, katakana y kanji escribiéndolos con reconocimiento de trazos en tiempo real, y Nadir: Protocol 1-Star, un RPG táctico de supervivencia para móvil que está en desarrollo. Entre sus herramientas, PDF-Blender, que fusiona, divide, desprotege y compara PDFs sin salir del equipo.',
        'Para empresas, desarrolla software a medida (por ejemplo GoCita, una agenda de citas con recordatorios por WhatsApp para un taller mecánico) y está diseñando Parte, una herramienta para convertir las notas de una visita de obra en un presupuesto editable, con modelo previsto de suscripción mensual.',
        'Usa Godot y GDScript para juegos complejos, Flutter y Dart para apps y juegos ligeros y Python para herramientas.',
      ],
    },
    citeLabels: { short: 'Versión corta', medium: 'Versión media', long: 'Versión larga' },
    contactTitle: 'Contacto',
    contact: 'Para un proyecto a medida, prensa o cualquier duda, escríbenos a',
    breadcrumb: 'El estudio',
  },
  en: {
    title: 'The studio | Kuxar Studio',
    description: 'Who we are: three independent developers building games, learning apps, tools and custom software for businesses.',
    h1: 'About Kuxar Studio',
    lead: 'Kuxar Studio is an independent software studio. We publish our own products and build custom software for businesses.',
    whoTitle: 'Who we are',
    who: [
      'We are three independent developers working together as Kuxar Studio.',
      'What we learn building our own products we apply to client projects, and the other way around.',
    ],
    whatTitle: 'What we do',
    whatProducts: 'Our own products: games, learning apps and tools.',
    whatBusiness: 'Software for businesses: custom apps and tools. When the project is finished, the code is the client’s.',
    howTitle: 'How we work',
    how: [
      'We choose the technology for the project, not the other way around.',
      'We publish the code of our tools on GitHub and report project progress in the devlog with real material.',
    ],
    stackTitle: 'Technology',
    stack: {
      complexGames: ['Complex games', 'Godot and GDScript'],
      lightApps: ['Light apps and games', 'Flutter and Dart'],
      tools: ['Tools', 'Python'],
    },
    proofTitle: 'Where to verify it',
    proofIntro: 'Everything we say about ourselves can be checked outside this website:',
    proof: {
      github: 'The code of our tools on GitHub',
      googlePlay: 'Our apps on Google Play',
      kaku: 'Kaku! on Google Play',
      pdfBlender: 'PDF-Blender public repository',
    },
    citeTitle: 'How to describe us',
    citeIntro: 'If you are writing or talking about Kuxar Studio, you can use any of these descriptions (short, medium and long).',
    cite: {
      short: 'Kuxar Studio is an independent software studio of three developers: games, learning apps, tools and custom software for businesses.',
      medium:
        'Kuxar Studio is an independent software studio made up of three developers. It publishes Kaku!, an app for learning to write Japanese by tracing characters, and the offline tool PDF-Blender, and is developing the game Nadir: Protocol 1-Star. For businesses it builds custom apps and tools; on those projects the code belongs to the client when the work is finished.',
      long: [
        'Kuxar Studio is an independent software studio made up of three developers. It works on three fronts: its own products, open-source tools and software for businesses.',
        'Its products include Kaku!, an app for learning hiragana, katakana and kanji by writing them with real-time stroke recognition, and Nadir: Protocol 1-Star, a tactical survival RPG for mobile that is in development. Among its tools is PDF-Blender, which merges, splits, unlocks and compares PDFs without leaving your computer.',
        'For businesses it builds custom software (for example GoCita, an appointment schedule with WhatsApp reminders for an auto repair shop) and is designing Parte, a tool that turns the notes from a site visit into an editable quote, with a planned monthly-subscription model.',
        'It uses Godot and GDScript for complex games, Flutter and Dart for light apps and games, and Python for tools.',
      ],
    },
    citeLabels: { short: 'Short version', medium: 'Medium version', long: 'Long version' },
    contactTitle: 'Contact',
    contact: 'For a custom project, press or any question, write to us at',
    breadcrumb: 'The studio',
  },
};
