// Datos legales compartidos por las páginas de políticas y borrado de cuenta.
// Un solo sitio para los plazos, así la política y la página de borrado no
// pueden contradecirse (ni entre idiomas). Cambia aquí si cambia lo que
// realmente se cumple.
import type { Lang } from '../i18n';

export const LEGAL_EMAIL = 'admin@kuxarstudio.com';

/** Plazo máximo para borrar una cuenta de Kaku! (política + página de borrado). */
export const KAKU_DELETION_TERM: Record<Lang, string> = { es: '7 días naturales', en: '7 calendar days' };

/**
 * Plazo máximo para responder a una solicitud de supresión u otro derecho sobre
 * los datos de BlindNote (RGPD art. 12.3). Antes eran 48 horas para "borrar
 * identificadores técnicos", pero la app nueva no tiene cuentas ni servidores
 * propios: los datos los conserva Google (Firebase, AdMob), no siempre pueden
 * relacionarse con una persona y Google indica hasta 180 días para eliminar un
 * identificador de instalación. Prometemos solo la respuesta, no el borrado.
 */
export const BLINDNOTE_DELETION_TERM: Record<Lang, string> = { es: 'un mes', en: 'one month' };

/**
 * Retención de los datos de Google Analytics de BlindNote asociados a
 * identificadores. Única fuente del plazo: debe coincidir con lo configurado en
 * Google Analytics (Administrar > Recogida y conservación de datos).
 */
export const BLINDNOTE_ANALYTICS_RETENTION: Record<Lang, string> = { es: '2 meses', en: '2 months' };

/** Edad mínima del público de BlindNote (16, confirmada por el titular; debe coincidir con Play Console). */
export const BLINDNOTE_MIN_AGE = 16;

/** Cuánto conservamos los correos de solicitudes de privacidad de BlindNote. */
export const BLINDNOTE_REQUEST_RETENTION: Record<Lang, string> = {
  es: 'hasta cerrar la solicitud y, como máximo, un año',
  en: 'until the request is closed and, at most, one year',
};

/** Cuánto conservamos los correos de soporte de BlindNote (botón Contactar u otras consultas). */
export const BLINDNOTE_SUPPORT_RETENTION: Record<Lang, string> = {
  es: 'hasta resolver tu consulta y, como máximo, un año desde que la recibimos',
  en: 'until your enquiry is resolved and, at most, one year from receipt',
};

export interface LegalOwnerData { name: string | null; taxId: string | null; address: string | null }

/**
 * Titular legal del estudio (responsable del tratamiento y prestador del servicio
 * de sus apps). La LSSI (art. 10) y el RGPD (art. 13) exigen publicar nombre o
 * razón social, NIF/CIF y domicilio. Mientras un campo sea null, las páginas solo
 * muestran "Kuxar Studio" y el correo: rellenarlos al tener los datos de la sociedad.
 */
export const STUDIO_OWNER: LegalOwnerData = {
  name: null, // TODO: razón social
  taxId: null, // TODO: CIF
  address: null, // TODO: domicilio social
};

/** Titular de Kaku!. Si una app pasa a otro titular, dale aquí sus propios datos. */
export const KAKU_OWNER: LegalOwnerData = STUDIO_OWNER;

/** Titular de BlindNote. */
export const BLINDNOTE_OWNER: LegalOwnerData = STUDIO_OWNER;

/** Edad mínima para usar Kaku! (público objetivo declarado en Play Console). */
export const KAKU_MIN_AGE = 13;

/** Edad a partir de la cual un menor puede consentir por sí mismo en España (LOPDGDD art. 7). */
export const SPAIN_DIGITAL_CONSENT_AGE = 14;
