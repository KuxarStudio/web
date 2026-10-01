// Contenido de Parte compartido entre la home y /parte/, en cada idioma. Un
// único origen para que el pitch no se desincronice entre páginas ni entre
// idiomas. Solo hechos confirmados por el equipo (ver CLAUDE.md): no añadir
// precios, plazos ni garantías sin confirmar.
import { route, type Lang } from '../i18n';
import { ui } from '../i18n/ui';

export interface ParteCopy {
  tagline: string;
  audience: string;
  /** Frase de la home tras `audience`. */
  homeBlurb: string;
  /** Frase del hero de /parte/ tras `audience`. */
  heroBlurb: string;
  steps: { title: string; desc: string }[];
  /** Preguntas frecuentes de empresas. */
  faq: { q: string; a: string }[];
}

export const parte: Record<Lang, ParteCopy> = {
  es: {
    tagline: 'El presupuesto de la visita, antes de irte de la obra.',
    audience: 'Para pymes de fontanería, instalaciones y reformas.',
    homeBlurb: 'Conviertes las notas de una visita en un presupuesto listo para enviar, sin papeleo por la tarde.',
    heroBlurb: 'Dictas las notas de la visita y te llevas el presupuesto hecho.',
    steps: [
      {
        title: 'Tomas notas en la visita',
        desc: 'Dictas o escribes lo que ves y añades fotos si hacen falta, desde el móvil.',
      },
      {
        title: 'Se arma el presupuesto',
        desc: 'Con tus tarifas y tus presupuestos anteriores: materiales, mano de obra y lo que falte por preguntar.',
      },
      {
        title: 'Tú lo revisas',
        desc: 'Precio, alcance y margen. No sale nada sin que lo veas y lo ajustes.',
      },
      {
        title: 'Lo envías desde el móvil',
        desc: 'Un presupuesto profesional y editable, listo según sales de casa del cliente.',
      },
    ],
    faq: [
      {
        q: '¿De quién es el código de un proyecto a medida?',
        a: 'Tuyo, cuando lo terminamos.',
      },
      {
        q: '¿Parte ya se puede usar?',
        a: 'Todavía no, está en diseño. Puedes pedir acceso anticipado y te avisamos cuando esté listo.',
      },
      {
        q: '¿Cuánto cuesta Parte?',
        a: 'Será una suscripción mensual. El precio aún no está definido.',
      },
      {
        q: '¿Solo hacéis Parte?',
        a: 'No. También desarrollamos apps y herramientas a medida para empresas.',
      },
    ],
  },
  en: {
    tagline: 'The quote from the site visit, before you leave the job.',
    audience: 'For small plumbing, installation and renovation businesses.',
    homeBlurb: 'You turn the notes from a site visit into a quote that is ready to send, with no paperwork in the evening.',
    heroBlurb: 'You dictate your notes from the visit and walk away with the quote done.',
    steps: [
      {
        title: 'Take notes on site',
        desc: 'Dictate or type what you see and add photos if needed, all from your phone.',
      },
      {
        title: 'The quote takes shape',
        desc: 'Built from your rates and your previous quotes: materials, labour and anything still left to ask.',
      },
      {
        title: 'You review it',
        desc: 'Price, scope and margin. Nothing goes out without you seeing and adjusting it.',
      },
      {
        title: 'Send it from your phone',
        desc: 'A professional, editable quote, ready as you leave the customer’s home.',
      },
    ],
    faq: [
      {
        q: 'Who owns the code of a custom project?',
        a: 'You do, once we finish it.',
      },
      {
        q: 'Can I use Parte yet?',
        a: 'Not yet, it is still in design. You can request early access and we will let you know when it is ready.',
      },
      {
        q: 'How much does Parte cost?',
        a: 'It will be a monthly subscription. The price has not been set yet.',
      },
      {
        q: 'Do you only build Parte?',
        a: 'No. We also build custom apps and tools for businesses.',
      },
    ],
  },
};

/** Enlace al formulario de contacto (en el footer de cada página) que
 * etiqueta el mensaje como solicitud de acceso anticipado. `page` es la ruta actual. */
export const parteTrialHref = (page: string, lang: Lang = 'es') => `${page}?asunto=parte#${ui[lang].ids.contact}`;

/** Ruta de la página de Parte en un idioma (atajo para los componentes). */
export const partePath = (lang: Lang) => route('parte', lang);
