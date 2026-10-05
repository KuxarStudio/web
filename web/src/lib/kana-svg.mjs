// Dibujo SVG de un kana a partir de los trazos de KanjiVG (src/data/kana-strokes.json).
// Funciones puras que devuelven strings: las usan la página de hojas de trazos
// (Astro) y el generador de PDF (scripts/kana/make-pdf.mjs).

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

/**
 * @param {{ s: string[], n: [number, number][] }} data trazos y posición de los números
 * @param {{ numbers?: boolean, color?: string, numberColor?: string, strokeWidth?: number, label?: string, guides?: boolean, size?: string }} [opts]
 */
export function kanaSvg(data, opts = {}) {
  const { numbers = true, color = '#111', numberColor = '#b3261e', strokeWidth = 3.4, label, guides = false, size } = opts;
  const paths = data.s.map((d) => `<path d="${d}"/>`).join('');
  const nums = numbers
    ? data.n.map(([x, y], i) => `<text x="${x}" y="${y}" font-size="12" font-weight="700" fill="${numberColor}" stroke="#fff" stroke-width="2.4" paint-order="stroke">${i + 1}</text>`).join('')
    : '';
  // Cruz de guía (como el papel de caligrafía): ayuda a centrar el trazo al practicar.
  const cross = guides ? '<path d="M54.5 4v101M4 54.5h101" stroke="#c9c9c4" stroke-width="0.8" stroke-dasharray="3 3" fill="none"/>' : '';
  const a11y = label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"';
  const dim = size ? ` width="${size}" height="${size}"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 109 109"${dim} ${a11y}>${cross}<g fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${paths}</g>${nums}</svg>`;
}

/** Descripción accesible: "あ (a): 3 trazos, se escribe en el orden 1, 2, 3". */
export function strokeLabel(char, romaji, count, lang) {
  const order = Array.from({ length: count }, (_, i) => i + 1).join(', ');
  return lang === 'en'
    ? `${char} (${romaji}): ${count} ${count === 1 ? 'stroke' : 'strokes'}, written in order ${order}`
    : `${char} (${romaji}): ${count} ${count === 1 ? 'trazo' : 'trazos'}, se escribe en el orden ${order}`;
}
