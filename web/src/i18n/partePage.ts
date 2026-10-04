// Copy propio de la página /parte/ (el pitch compartido con la home vive en lib/parte.ts).
import type { Lang } from './index';

export interface PartePageCopy {
  title: string;
  description: string;
  back: string;
  requestAccess: string;
  howLink: string;
  designNote: string;
  howTitle: string;
  howNote: string;
  whyTitle: string;
  points: { title: string; desc: string }[];
  interestedTitle: string;
  /** Texto con «Parte» (se pinta con su wordmark en la plantilla). */
  interestedText: string;
}

export const partePage: Record<Lang, PartePageCopy> = {
  es: {
    title: 'Parte | Presupuestos de obra desde el móvil · Kuxar Studio',
    description:
      'Parte convierte las notas de una visita en un presupuesto editable, desde el móvil. Para pymes de fontanería, instalaciones y reformas. En diseño.',
    back: '← Kuxar Studio para empresas',
    requestAccess: 'Pedir acceso',
    howLink: 'Cómo funciona →',
    designNote: 'En diseño. Modelo previsto: suscripción mensual.',
    howTitle: 'Cómo funciona',
    howNote: 'Todo desde el móvil, en la propia obra.',
    whyTitle: 'Por qué lo hacemos',
    points: [
      { title: 'Menos tardes de papeleo', desc: 'El presupuesto sale de la visita, no de una sesión de oficina por la noche.' },
      { title: 'Menos partidas olvidadas', desc: 'Te pregunta lo que falta o puede faltar, para que no quede trabajo sin cobrar.' },
      { title: 'Tus precios, no unos genéricos', desc: 'Usa tus tarifas y tus presupuestos anteriores como punto de partida.' },
      { title: 'Tú tienes la última palabra', desc: 'Revisas precio, alcance y margen antes de enviar. Nunca sale nada sin que lo veas.' },
    ],
    interestedTitle: '¿Te interesa?',
    interestedText:
      'Estamos diseñando Parte con empresas de fontanería, instalaciones y reformas. Si quieres usarlo antes que nadie y contarnos cómo trabajas, pide acceso.',
  },
  en: {
    title: 'Parte | Construction quotes from your phone · Kuxar Studio',
    description:
      'Parte turns the notes from a site visit into an editable quote, from your phone. For small plumbing, installation and renovation businesses. In design.',
    back: '← Kuxar Studio for businesses',
    requestAccess: 'Request access',
    howLink: 'How it works →',
    designNote: 'In design. Planned model: monthly subscription.',
    howTitle: 'How it works',
    howNote: 'All from your phone, on the job site.',
    whyTitle: 'Why we are building it',
    points: [
      { title: 'Fewer evenings of paperwork', desc: 'The quote comes out of the visit, not out of an office session at night.' },
      { title: 'Fewer forgotten items', desc: 'It asks about what is missing or might be missing, so no work goes unbilled.' },
      { title: 'Your prices, not generic ones', desc: 'It uses your rates and your previous quotes as a starting point.' },
      { title: 'You have the final say', desc: 'You review price, scope and margin before sending. Nothing ever goes out without you seeing it.' },
    ],
    interestedTitle: 'Interested?',
    interestedText:
      'We are designing Parte with plumbing, installation and renovation companies. If you want to use it before anyone else and tell us how you work, request access.',
  },
};
