// Acceso a las guías por idioma y relación pilar <-> clusters.
// Cada idioma tiene su colección (guides / guides-en) y su propio slug (URLs
// localizadas); la versión ES y la EN de una guía se emparejan por `key`. Una
// guía sin traducir no aparece en inglés. El enlazado interno sale de aquí:
// cada cluster enlaza a su pilar y el pilar lista todos sus clusters, así que
// publicar una guía nueva no requiere tocar plantillas.
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';

export type Guide = CollectionEntry<'guides'> | CollectionEntry<'guides-en'>;

export async function guidesCollection(lang: Lang): Promise<Guide[]> {
  const entries = await getCollection(lang === 'en' ? 'guides-en' : 'guides');
  return entries.sort((a, b) => a.data.order - b.data.order || b.data.date.valueOf() - a.data.date.valueOf());
}

/** Slug de una guía (por su `key`) en cada idioma en que existe. */
export async function slugsByKey(key: string): Promise<Partial<Record<Lang, string>>> {
  const [es, en] = await Promise.all([guidesCollection('es'), guidesCollection('en')]);
  return { es: es.find((g) => g.data.key === key)?.slug, en: en.find((g) => g.data.key === key)?.slug };
}

/** Pilar al que pertenece una guía (ella misma si es pilar). */
export function pillarOf(guide: Guide, all: Guide[]): Guide | undefined {
  if (guide.data.role === 'pillar') return guide;
  return all.find((g) => g.data.role === 'pillar' && g.data.key === guide.data.pillar);
}

/** Guías relacionadas: para un pilar, sus clusters; para un cluster, el pilar y sus hermanos. */
export function relatedGuides(guide: Guide, all: Guide[]): Guide[] {
  const pillar = pillarOf(guide, all);
  if (!pillar) return [];
  const clusters = all.filter((g) => g.data.role === 'cluster' && g.data.pillar === pillar.data.key);
  if (guide.data.role === 'pillar') return clusters;
  return [pillar, ...clusters.filter((g) => g.data.key !== guide.data.key)];
}
