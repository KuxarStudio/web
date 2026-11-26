// Contenido de la ficha de BlindNote en cada idioma. Un solo sitio para el copy:
// la página visible y el JSON-LD (FAQPage) salen de aquí, así nunca divergen.
// Solo hechos de la app y de su ficha de Google Play (docs/play/ficha.md del repo
// de la app). Mientras no haya enlace público de Play, BLINDNOTE_PLAY es null y
// el botón dice «Próximamente».
import { route, type Lang } from '../i18n';
export type { Lang };

export const BLINDNOTE_PLAY: Record<Lang, string> | null = null;

export const blindnotePaths: Record<Lang, string> = { es: route('blindnote', 'es'), en: route('blindnote', 'en') };

export interface BlindNoteCopy {
  title: string;
  description: string;
  h1: string;
  lead: string;
  cta: string;
  ctaSoon: string;
  imageAlt: string;
  stepsHeading: string;
  steps: { title: string; desc: string }[];
  themesHeading: string;
  themes: string[];
  sections: { id: string; q: string; a: string[] }[];
  legalHeading: string;
  legalLinks: { label: string; href: string }[];
  moreHeading: string;
  moreLinks: { label: string; href: string }[];
  trademark: string;
  breadcrumbHome: string;
}

export const blindnote: Record<Lang, BlindNoteCopy> = {
  es: {
    title: 'BlindNote: quiz musical en grupo con un solo móvil',
    description:
      'Adivina el artista, el título y el año de la canción que suena en tu Spotify. BlindNote hace de árbitro con turnos, reloj y puntos. Gratis, para Android.',
    h1: 'BlindNote: el quiz musical para jugar en grupo con un solo móvil',
    lead: 'Reúne a tus amigos, elige una temática y adivinad qué suena. La música suena en tu app de Spotify y BlindNote hace de árbitro: turnos, reloj y hasta 3 puntos por canción.',
    cta: 'Descargar en Google Play',
    ctaSoon: 'Próximamente en Google Play',
    imageAlt: 'BlindNote en un móvil: turno de Ana, cuenta atrás y botón «¡Lo sé!».',
    stepsHeading: '¿Cómo se juega?',
    steps: [
      { title: 'Elige una temática y apunta a los jugadores', desc: 'De 3 a 20 rondas y de 5 a 60 segundos por turno.' },
      { title: 'Abre la lista en Spotify', desc: 'Activa el modo aleatorio y vuelve a BlindNote.' },
      { title: 'Pulsa «¡Lo sé!»', desc: 'En cada turno suena una canción: di el artista, el título y el año.' },
      { title: 'Revela la solución', desc: 'Marca los aciertos: hasta 3 puntos por canción. Al final, podio y confeti.' },
    ],
    themesHeading: 'Temáticas',
    themes: ['500 Leyendas', 'Rock de Estadio', 'Reggaetón de Siempre', 'Global Hits', 'Pop Español'],
    sections: [
      {
        id: 'que-es',
        q: '¿Qué es BlindNote?',
        a: [
          'BlindNote es un concurso musical para Android pensado para jugar en grupo con un solo móvil: os lo vais pasando por turnos. No incluye música: la canción suena en tu app de Spotify y BlindNote la pone, la pausa y la pasa, lleva el reloj y cuenta los puntos.',
        ],
      },
      {
        id: 'spotify',
        q: '¿Necesito Spotify Premium?',
        a: [
          'Necesitas la app de Spotify instalada, con una cuenta iniciada y conexión. Se recomienda Premium: con la cuenta gratuita, Spotify puede poner sus anuncios y límites durante la partida.',
          'BlindNote es compatible con Spotify, pero no está afiliada a Spotify ni cuenta con su patrocinio o aprobación.',
        ],
      },
      {
        id: 'notificaciones',
        q: '¿Por qué pide acceso a notificaciones?',
        a: [
          'Android exige ese permiso para que una app vea y controle la música de otra. BlindNote lo usa solo para saber qué canción suena en Spotify y poder pausarla, reanudarla o pasar a la siguiente. No lee, guarda ni envía tus notificaciones, y puedes retirar el permiso cuando quieras.',
        ],
      },
      {
        id: 'gratis',
        q: '¿BlindNote es gratis?',
        a: [
          'Sí. No tiene compras ni registro: se financia con un anuncio antes del resultado de cada partida. Las estadísticas de uso son opcionales y están apagadas hasta que las aceptas.',
        ],
      },
      {
        id: 'donde',
        q: '¿Dónde puedo jugar?',
        a: [
          'BlindNote es para Android y está en prueba cerrada en Google Play; pronto estará disponible para todos. Está en español, inglés y euskera, y es para mayores de 16 años.',
          'Es para jugar en privado, en casa o con amigos: las condiciones de Spotify no permiten usarlo para poner música en bares, locales o eventos públicos.',
        ],
      },
    ],
    legalHeading: 'Privacidad y condiciones',
    legalLinks: [
      { label: 'Política de privacidad', href: route('blindnotePrivacy', 'es') },
      { label: 'Condiciones de uso', href: route('blindnoteTerms', 'es') },
      { label: 'Eliminar tus datos', href: route('blindnoteDelete', 'es') },
    ],
    moreHeading: 'Más de Kuxar Studio',
    moreLinks: [
      { label: 'Todos los proyectos', href: '/portfolio/' },
      { label: 'Devlog del estudio', href: '/devlog/' },
      { label: 'Sobre el estudio', href: '/#estudio' },
    ],
    trademark: 'Spotify es una marca de Spotify AB. Google Play y Android son marcas de Google LLC.',
    breadcrumbHome: 'Inicio',
  },
  en: {
    title: 'BlindNote: a group music quiz on one phone',
    description:
      'Guess the artist, title and year of the song playing in your Spotify. BlindNote is the referee, with turns, a clock and points. Free, for Android.',
    h1: 'BlindNote: the music quiz you play as a group on one phone',
    lead: "Gather your friends, pick a theme and guess what's playing. The music plays in your Spotify app and BlindNote is the referee: turns, a clock and up to 3 points per song.",
    cta: 'Get it on Google Play',
    ctaSoon: 'Coming soon to Google Play',
    imageAlt: 'BlindNote on a phone: Ana’s turn, a countdown and an “I know it!” button.',
    stepsHeading: 'How do you play?',
    steps: [
      { title: 'Pick a theme and add the players', desc: '3 to 20 rounds and 5 to 60 seconds per turn.' },
      { title: 'Open the playlist in Spotify', desc: 'Turn on shuffle and come back to BlindNote.' },
      { title: 'Tap “I know it!”', desc: 'A song plays on each turn: say the artist, title and year.' },
      { title: 'Reveal the answer', desc: 'Mark what was right: up to 3 points per song. At the end, a podium and confetti.' },
    ],
    themesHeading: 'Themes',
    themes: ['500 Legends', 'Stadium Rock', 'Reggaeton Classics', 'Global Hits', 'Spanish Pop'],
    sections: [
      {
        id: 'what-is',
        q: 'What is BlindNote?',
        a: [
          'BlindNote is an Android music quiz made for playing as a group on one phone: you pass it around in turns. It does not include any music: the song plays in your Spotify app and BlindNote starts, pauses and skips it, keeps the clock and counts the points.',
        ],
      },
      {
        id: 'spotify',
        q: 'Do I need Spotify Premium?',
        a: [
          'You need the Spotify app installed, with an account signed in and a connection. Premium is recommended: with a free account, Spotify may play its own ads and apply its limits during the game.',
          'BlindNote is compatible with Spotify, but it is not affiliated with, sponsored by or endorsed by Spotify.',
        ],
      },
      {
        id: 'notifications',
        q: 'Why does it ask for notification access?',
        a: [
          'Android requires this permission for one app to see and control the music of another. BlindNote uses it only to know which song is playing in Spotify and to pause it, resume it or skip to the next one. It does not read, store or send your notifications, and you can withdraw the permission at any time.',
        ],
      },
      {
        id: 'free',
        q: 'Is BlindNote free?',
        a: [
          'Yes. It has no purchases and no sign-up: it is funded by one ad before the result of each game. Usage statistics are optional and off until you accept them.',
        ],
      },
      {
        id: 'where',
        q: 'Where can I play?',
        a: [
          'BlindNote is for Android and is in closed testing on Google Play; it will soon be available to everyone. It is in Spanish, English and Basque, and it is for ages 16 and up.',
          "It is for playing privately, at home or with friends: Spotify's terms do not allow using it to play music in bars, venues or public events.",
        ],
      },
    ],
    legalHeading: 'Privacy and terms',
    legalLinks: [
      { label: 'Privacy policy', href: route('blindnotePrivacy', 'en') },
      { label: 'Terms of use', href: route('blindnoteTerms', 'en') },
      { label: 'Delete your data', href: route('blindnoteDelete', 'en') },
    ],
    moreHeading: 'More from Kuxar Studio',
    moreLinks: [
      { label: 'All projects', href: '/en/projects/' },
      { label: 'Studio devlog', href: '/en/devlog/' },
      { label: 'About the studio', href: '/en/#studio' },
    ],
    trademark: 'Spotify is a trademark of Spotify AB. Google Play and Android are trademarks of Google LLC.',
    breadcrumbHome: 'Home',
  },
};
