// Temas de contacto: un botón de una página comercial lleva al formulario del
// pie con `?asunto=<tema>#contacto`. El formulario usa el tema para etiquetar
// el asunto del email (y precargar el inicio del mensaje), así cada solicitud
// llega ya clasificada. Añadir un servicio = añadir una clave aquí; el
// formulario (ContactForm.astro) no necesita cambios.
import type { Lang } from '../i18n';
import { ui } from '../i18n/ui';

export type ContactTopic = 'parte' | 'web' | 'software';

export interface ContactTopicCopy {
  /** Asunto del email que recibe el estudio. */
  subject: string;
  /** Inicio del mensaje, para que el visitante solo tenga que completarlo. */
  message: string;
}

export const contactTopics: Record<Lang, Record<ContactTopic, ContactTopicCopy>> = {
  es: {
    parte: {
      subject: 'Solicitud de acceso anticipado a Parte',
      message: 'Me interesa Parte. Mi empresa se dedica a ',
    },
    web: {
      subject: 'Proyecto de diseño web',
      message: 'Necesito una web para ',
    },
    software: {
      subject: 'Proyecto de software a medida',
      message: 'Necesito una app o herramienta para ',
    },
  },
  en: {
    parte: {
      subject: 'Early access request for Parte (English page)',
      message: "I'm interested in Parte. My company does ",
    },
    web: {
      subject: 'Web design project (English page)',
      message: 'I need a website for ',
    },
    software: {
      subject: 'Custom software project (English page)',
      message: 'I need an app or tool for ',
    },
  },
};

/** Enlace al formulario del pie de `page`, etiquetado con un tema. */
export const contactHref = (page: string, topic: ContactTopic, lang: Lang = 'es'): string =>
  `${page}?asunto=${topic}#${ui[lang].ids.contact}`;
