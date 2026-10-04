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
