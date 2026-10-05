// Orden de lectura de un clúster de guías: pilar primero y luego los clusters
// por `order`. Sin dependencias de Astro para poder probarlo con vitest.
interface GuideLike {
  data: { key: string; role: 'pillar' | 'cluster'; pillar?: string };
}

/** Secuencia de lectura del clúster al que pertenece `guide` (la lista `all` ya viene ordenada). */
export function readingSequence<T extends GuideLike>(guide: T, all: T[]): T[] {
  const pillarKey = guide.data.role === 'pillar' ? guide.data.key : guide.data.pillar;
  const pillar = all.find((g) => g.data.role === 'pillar' && g.data.key === pillarKey);
  const clusters = all.filter((g) => g.data.role === 'cluster' && g.data.pillar === pillarKey);
  return pillar ? [pillar, ...clusters] : clusters;
}

/** Guía siguiente en el clúster (enlace lateral). La última no tiene: vuelve al pilar por otro enlace. */
export function nextInSequence<T extends GuideLike>(guide: T, all: T[]): T | undefined {
  const seq = readingSequence(guide, all);
  const i = seq.findIndex((g) => g.data.key === guide.data.key);
  return i >= 0 ? seq[i + 1] : undefined;
}
