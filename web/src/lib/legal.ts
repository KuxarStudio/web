// Datos legales compartidos por las páginas de políticas y borrado de cuenta.
// Un solo sitio para los plazos, así la política y la página de borrado no
// pueden contradecirse (ni entre idiomas). Cambia aquí si cambia lo que
// realmente se cumple.
import type { Lang } from '../i18n';

export const LEGAL_EMAIL = 'admin@kuxarstudio.com';

/** Plazo máximo para borrar una cuenta de Kaku! (política + página de borrado). */
export const KAKU_DELETION_TERM: Record<Lang, string> = { es: '7 días naturales', en: '7 calendar days' };

/** Plazo máximo para borrar identificadores técnicos de BlindNote. */
export const BLINDNOTE_DELETION_TERM: Record<Lang, string> = { es: '48 horas', en: '48 hours' };

/**
 * Titular legal de Kaku! (responsable del tratamiento y prestador del servicio).
 * La LSSI (art. 10) y el RGPD (art. 13) exigen publicar nombre o razón social,
 * NIF/CIF y domicilio. Mientras un campo sea null, las páginas solo muestran
 * "Kuxar Studio" y el correo: rellenarlos al tener los datos de la sociedad.
 */
export const KAKU_OWNER: { name: string | null; taxId: string | null; address: string | null } = {
  name: null, // TODO: razón social
  taxId: null, // TODO: CIF
  address: null, // TODO: domicilio social
};

/** Edad mínima para usar Kaku! (público objetivo declarado en Play Console). */
export const KAKU_MIN_AGE = 13;

/** Edad a partir de la cual un menor puede consentir por sí mismo en España (LOPDGDD art. 7). */
export const SPAIN_DIGITAL_CONSENT_AGE = 14;
