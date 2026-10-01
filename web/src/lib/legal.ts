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
