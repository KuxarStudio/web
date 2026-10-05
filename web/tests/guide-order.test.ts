import { describe, expect, it } from 'vitest';
import { nextInSequence, readingSequence } from '../src/lib/guide-order';

const g = (key: string, role: 'pillar' | 'cluster', pillar?: string) => ({ data: { key, role, pillar } });
const all = [g('hub', 'pillar'), g('a', 'cluster', 'hub'), g('b', 'cluster', 'hub'), g('otro-hub', 'pillar'), g('x', 'cluster', 'otro-hub')];

describe('orden de lectura de guías', () => {
  it('el pilar va primero y solo incluye su clúster', () => {
    expect(readingSequence(all[2], all).map((x) => x.data.key)).toEqual(['hub', 'a', 'b']);
  });
  it('la siguiente de cada guía es la próxima del clúster', () => {
    expect(nextInSequence(all[0], all)?.data.key).toBe('a');
    expect(nextInSequence(all[1], all)?.data.key).toBe('b');
  });
  it('la última del clúster no tiene siguiente', () => {
    expect(nextInSequence(all[2], all)).toBeUndefined();
    expect(nextInSequence(all[4], all)).toBeUndefined();
  });
});
