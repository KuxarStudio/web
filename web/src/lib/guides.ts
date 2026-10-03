// Acceso a las guías por idioma y relación pilar <-> clusters.
// La versión inglesa vive en `guides-en` (mismo nombre de archivo = mismo slug);
// una guía sin traducir no aparece en inglés. El enlazado interno sale de aquí:
// cada cluster enlaza a su pilar y el pilar lista todos sus clusters, así que
// publicar una guía nueva no requiere tocar plantillas.
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';

export type Guide = CollectionEntry<'guides'> | CollectionEntry<'guides-en'>;

export async function guidesCollection(lang: Lang): Promise<Guide[]> {
  const entries = await getCollection(lang === 'en' ? 'guides-en' : 'guides');
  return entries.sort((a, b) => a.data.order - b.data.order || b.data.date.valueOf() - a.data.date.valueOf());
}

/** Pilar al que pertenece una guía (ella misma si es pilar). */
export function pillarOf(guide: Guide, all: Guide[]): Guide | undefined {
  if (guide.data.role === 'pillar') return guide;
  return all.find((g) => g.data.role === 'pillar' && g.slug === guide.data.pillar);
}

/** Guías relacionadas: para un pilar, sus clusters; para un cluster, el pilar y sus hermanos. */
export function relatedGuides(guide: Guide, all: Guide[]): Guide[] {
  const pillar = pillarOf(guide, all);
  if (!pillar) return [];
  const clusters = all.filter((g) => g.data.role === 'cluster' && g.data.pillar === pillar.slug);
  if (guide.data.role === 'pillar') return clusters;
  return [pillar, ...clusters.filter((g) => g.slug !== guide.slug)];
}
