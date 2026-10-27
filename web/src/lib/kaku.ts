// Contenido de la ficha de Kaku! en cada idioma. Un solo sitio para el copy:
// la página visible y el JSON-LD (FAQPage) salen de aquí, así nunca divergen.
// Solo hechos confirmados en la ficha de Google Play: no añadir precios,
// plataformas ni cifras sin confirmar.
import { route, type Lang } from '../i18n';
export type { Lang };

export const KAKU_PLAY: Record<Lang, string> = {
  es: 'https://play.google.com/store/apps/details?id=com.kaku.kaku&hl=es_419',
  en: 'https://play.google.com/store/apps/details?id=com.kaku.kaku&hl=en',
};

export const kakuPaths: Record<Lang, string> = { es: route('kaku', 'es'), en: route('kaku', 'en') };

export interface KakuCopy {
  title: string;
  description: string;
  h1: string;
  lead: string;
  cta: string;
  videoAlt: string;
  sections: { id: string; q: string; a: string[] }[];
  steps: { title: string; desc: string }[];
  /** Bloque de keywords de Search Console (escribir en japonés, hiragana y katakana, kanji). */
  writing: {
    heading: string;
    intro: string;
    items: { title: string; desc: string; link: { label: string; href: string } }[];
    outro: { before: string; link: { label: string; href: string }; after: string };
  };
  stepsHeading: string;
  moreHeading: string;
  moreLinks: { label: string; href: string }[];
  breadcrumbHome: string;
}

export const kaku: Record<Lang, KakuCopy> = {
  es: {
    title: 'Kaku!: escribe en japonés con el dedo, del hiragana al kanji',
    description:
      'Practica la escritura japonesa trazando hiragana, katakana y kanji con el dedo: Kaku! corrige tus trazos al momento. Kana gratis, kanji por 2,39 €. Pruébala.',
    h1: 'Kaku!: aprende a escribir en japonés (hiragana, katakana y kanji) en el móvil',
    lead: 'Traza cada carácter con el dedo y Kaku! reconoce tus trazos en tiempo real: te dice al momento si el orden y la forma son correctos. Hiragana y katakana gratis; los kanji, con un pago único de 2,39 €.',
    cta: 'Descargar en Google Play',
    videoAlt: 'Kaku! en un móvil: el hiragana あ se traza paso a paso hasta completarlo.',
    stepsHeading: '¿Cómo funciona Kaku!?',
    steps: [
      { title: 'Elige un carácter', desc: 'Hiragana, katakana o kanji del nivel JLPT N5 (los kanji, con el Sensei Pass).' },
      { title: 'Trázalo con el dedo', desc: 'Sigues el orden de trazos correcto, trazo a trazo.' },
      { title: 'Recibe corrección al instante', desc: 'Kaku! valida el orden y la forma de cada trazo y te corrige en el momento.' },
    ],
    writing: {
      heading: 'Escribir en japonés: hiragana, katakana y kanji',
      intro:
        'La escritura japonesa combina tres sistemas. La app Kaku! te ayuda a escribir los tres a mano, en el orden en que se suelen aprender:',
      items: [
        {
          title: 'Hiragana',
          desc: 'Los 46 caracteres básicos con los que se empieza a escribir en japonés. En Kaku! son gratis.',
          link: { label: 'Cómo aprender hiragana escribiendo', href: '/guias/como-aprender-hiragana-escribiendo/' },
        },
        {
          title: 'Katakana',
          desc: 'Los otros 46 kana, que se usan sobre todo para palabras extranjeras. Hiragana y katakana se practican gratis.',
          link: { label: 'Hiragana y katakana: diferencias', href: '/guias/hiragana-y-katakana-diferencias/' },
        },
        {
          title: 'Kanji',
          desc: 'Los kanji del nivel JLPT N5, trazo a trazo y con su orden correcto. Se desbloquean con el Sensei Pass.',
          link: { label: 'Primeros kanji del JLPT N5', href: '/guias/primeros-kanji-jlpt-n5/' },
        },
      ],
      outro: {
        before: '¿Prefieres practicar también en papel? Tienes gratis las ',
        link: { label: 'hojas de orden de trazos de hiragana y katakana', href: '/recursos/hojas-de-trazos/' },
        after: ' en PDF.',
      },
    },
    sections: [
      {
        id: 'que-es',
        q: '¿Qué es Kaku!?',
        a: [
          'Kaku! es una app de Android para aprender a escribir japonés a mano. Practicas hiragana, katakana y los kanji básicos del JLPT N5 trazándolos con el dedo, con feedback sobre el orden de trazos.',
          'En japonés, 書く (kaku) significa «escribir»: la app se basa en aprender un carácter escribiéndolo, no solo reconociéndolo.',
        ],
      },
      {
        id: 'gratis',
        q: '¿Kaku! es gratis?',
        a: [
          'Puedes empezar gratis: hiragana y katakana están disponibles sin pagar.',
          'Los kanji se desbloquean con el Sensei Pass, un pago único de 2,39 € (sin suscripción, para siempre). Empezar no cuesta nada, y desbloquear los kanji cuesta lo que un café.',
        ],
      },
      {
        id: 'para-quien',
        q: '¿Para quién es Kaku!?',
        a: [
          'Para quien empieza con el japonés y quiere aprender los silabarios y los primeros kanji escribiéndolos: autodidactas, estudiantes de academia y quien prepara el JLPT N5.',
        ],
      },
      {
        id: 'sin-conexion',
        q: '¿Funciona sin conexión?',
        a: ['Sí. Puedes practicar sin conexión. Si inicias sesión con Google, tu progreso se sincroniza.'],
      },
      {
        id: 'plataformas',
        q: '¿En qué dispositivos está disponible?',
        a: ['Kaku! está disponible para Android en Google Play.'],
      },
    ],
    moreHeading: 'Más de Kuxar Studio',
    moreLinks: [
      { label: 'Guía: aprender a escribir japonés a mano', href: '/guias/aprender-a-escribir-japones-a-mano/' },
      { label: 'Todos los proyectos', href: '/portfolio/' },
      { label: 'Devlog del estudio', href: '/devlog/' },
      { label: 'Sobre el estudio', href: '/#estudio' },
    ],
    breadcrumbHome: 'Inicio',
  },
  en: {
    title: 'Kaku!: Learn Japanese Handwriting, from Kana to Kanji',
    description:
      'Practice Japanese handwriting by tracing hiragana, katakana and kanji with your finger. Kaku! corrects every stroke instantly. Kana free, kanji €2.39. Try it.',
    h1: 'Kaku!: learn Japanese handwriting (hiragana, katakana and kanji) on your phone',
    lead: 'Trace each character with your finger and Kaku! recognizes your strokes in real time, telling you right away whether the stroke order and shape are correct. Hiragana and katakana are free; kanji unlock with a one-time €2.39 purchase.',
    cta: 'Get it on Google Play',
    videoAlt: 'Kaku! on a phone: the hiragana あ is traced stroke by stroke until complete.',
    stepsHeading: 'How does Kaku! work?',
    steps: [
      { title: 'Pick a character', desc: 'Hiragana, katakana or JLPT N5 kanji (kanji need the Sensei Pass).' },
      { title: 'Trace it with your finger', desc: 'You follow the correct stroke order, one stroke at a time.' },
      { title: 'Get instant correction', desc: 'Kaku! checks the order and shape of every stroke and corrects you on the spot.' },
    ],
    writing: {
      heading: 'Japanese handwriting: kana and kanji',
      intro:
        'Written Japanese mixes three scripts. The Kaku! app helps you handwrite all three, in the order they are usually learned:',
      items: [
        {
          title: 'Hiragana',
          desc: 'The 46 basic Japanese kana you start writing with. In Kaku! they are free.',
          link: { label: 'How to learn hiragana by writing', href: '/en/guides/how-to-learn-hiragana-by-writing/' },
        },
        {
          title: 'Katakana',
          desc: 'The other 46 kana, used mainly for foreign words. Hiragana and katakana practice is free.',
          link: { label: 'Hiragana vs katakana', href: '/en/guides/hiragana-vs-katakana/' },
        },
        {
          title: 'Kanji',
          desc: 'JLPT N5 kanji, stroke by stroke in the correct order. They unlock with the Sensei Pass.',
          link: { label: 'First JLPT N5 kanji', href: '/en/guides/first-jlpt-n5-kanji/' },
        },
      ],
      outro: {
        before: 'Want to practice on paper too? Grab the free ',
        link: { label: 'hiragana and katakana stroke order sheets', href: '/en/resources/stroke-order-sheets/' },
        after: ' (PDF).',
      },
    },
    sections: [
      {
        id: 'what-is',
        q: 'What is Kaku!?',
        a: [
          'Kaku! is an Android app for learning to handwrite Japanese. You practice hiragana, katakana and the basic JLPT N5 kanji by tracing them with your finger, with feedback on stroke order.',
          'In Japanese, 書く (kaku) means “to write”: the app is built around learning a character by writing it, not only by recognizing it.',
        ],
      },
      {
        id: 'free',
        q: 'Is Kaku! free?',
        a: [
          'You can start for free: hiragana and katakana are available without paying.',
          'Kanji are unlocked with the Sensei Pass, a one-time purchase of €2.39 (no subscription, yours for good). Starting costs nothing, and unlocking kanji costs about the price of a coffee.',
        ],
      },
      {
        id: 'who-for',
        q: 'Who is Kaku! for?',
        a: [
          'For people starting Japanese who want to learn the kana and first kanji by writing them: self-learners, class students and anyone preparing for the JLPT N5.',
        ],
      },
      {
        id: 'offline',
        q: 'Does Kaku! work offline?',
        a: ['Yes. You can practice offline. If you sign in with Google, your progress syncs.'],
      },
      {
        id: 'platforms',
        q: 'Which devices is Kaku! available on?',
        a: ['Kaku! is available for Android on Google Play.'],
      },
    ],
    moreHeading: 'More from Kuxar Studio',
    moreLinks: [
      { label: 'Guide: learn to write Japanese by hand', href: '/en/guides/learn-to-write-japanese-by-hand/' },
      { label: 'All projects', href: '/en/projects/' },
      { label: 'Studio devlog', href: '/en/devlog/' },
      { label: 'About the studio', href: '/en/#studio' },
    ],
    breadcrumbHome: 'Home',
  },
};
