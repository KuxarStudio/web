// Acceso a las entradas del devlog por idioma. La versión inglesa vive en la
// colección `devlog-en` (mismo nombre de archivo = mismo slug); si una entrada
// no está traducida, no aparece en inglés.
import { getCollection } from 'astro:content';
import type { Lang } from '../i18n';

export async function devlogCollection(lang: Lang) {
  const entries = await getCollection(lang === 'en' ? 'devlog-en' : 'devlog');
  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
