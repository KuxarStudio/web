// Helpers de SEO on-page compartidos por las plantillas.

/** Límite de caracteres de un <title> que los buscadores suelen mostrar entero. */
export const TITLE_MAX = 60;

export const BRAND = 'Kuxar Studio';

/**
 * `<título> | Kuxar Studio` si cabe en 60 caracteres; si no, solo el título.
 * La marca va al final y solo se sacrifica cuando haría el título demasiado largo
 * (el título de la guía ya identifica la página y el sitio sigue siendo Kuxar Studio).
 */
export function withBrand(title: string, brand: string = BRAND, max: number = TITLE_MAX): string {
  const full = `${title} | ${brand}`;
  return full.length <= max ? full : title;
}
