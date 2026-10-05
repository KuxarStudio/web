import { describe, expect, it } from 'vitest';
import { withBrand } from '../src/lib/seo';

describe('withBrand', () => {
  it('añade la marca al final cuando cabe en 60 caracteres', () => {
    expect(withBrand('Orden de los trazos')).toBe('Orden de los trazos | Kuxar Studio');
  });
  it('omite la marca cuando el título con marca pasaría de 60', () => {
    const t = 'Cómo aprender a escribir japonés a mano: guía para empezar';
    expect(withBrand(t)).toBe(t);
  });
  it('respeta el límite exacto', () => {
    const t = 'x'.repeat(60 - ' | Kuxar Studio'.length);
    expect(withBrand(t)).toBe(`${t} | Kuxar Studio`);
    expect(withBrand(t + 'x')).toBe(t + 'x');
  });
});

import { SAME_AS, STUDIO_NAME, organizationId } from '../src/lib/entity';

describe('entidad del estudio', () => {
  it('los perfiles externos son https y no se repiten', () => {
    expect(SAME_AS.every((u) => u.startsWith('https://'))).toBe(true);
    expect(new Set(SAME_AS).size).toBe(SAME_AS.length);
  });
  it('un único nombre y un único @id de organización', () => {
    expect(STUDIO_NAME).toBe('Kuxar Studio');
    expect(organizationId('https://kuxarstudio.com')).toBe('https://kuxarstudio.com/#organization');
  });
});
