// Genera src/data/kana-strokes.json a partir de KanjiVG (https://kanjivg.tagaini.net,
// licencia CC BY-SA 3.0): trazos (path SVG) y posición de los números de cada kana.
// Uso: node scripts/kana/generate-data.mjs <ruta-a-kanjivg>   (clon de github.com/KanjiVG/kanjivg)
// El JSON resultante es una obra derivada de KanjiVG y hereda su licencia (ver src/data/LICENSE-KanjiVG.md).
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { charsOf } from '../../src/data/kana-table.mjs';

const kanjivg = resolve(process.argv[2] ?? '');
if (!process.argv[2]) {
  console.error('Uso: node scripts/kana/generate-data.mjs <ruta-a-kanjivg>');
  process.exit(2);
}
const out = {};
for (const ch of [...charsOf('hira'), ...charsOf('kata')]) {
  const hex = ch.codePointAt(0).toString(16).padStart(5, '0');
  const svg = readFileSync(join(kanjivg, 'kanji', `${hex}.svg`), 'utf8');
  const strokes = [...svg.matchAll(new RegExp(`<path id="kvg:${hex}-s(\\d+)"[^>]*\\sd="([^"]+)"`, 'g'))]
    .sort((a, b) => Number(a[1]) - Number(b[1]))
    .map((m) => m[2]);
  const numbers = [...svg.matchAll(/<text transform="matrix\(1 0 0 1 ([\d.]+) ([\d.]+)\)">(\d+)<\/text>/g)]
    .sort((a, b) => Number(a[3]) - Number(b[3]))
    .map((m) => [Number(m[1]), Number(m[2])]);
  if (!strokes.length || strokes.length !== numbers.length) throw new Error(`Datos incompletos para ${ch} (${hex}): ${strokes.length} trazos, ${numbers.length} números`);
  out[ch] = { s: strokes, n: numbers };
}
const dest = fileURLToPath(new URL('../../src/data/kana-strokes.json', import.meta.url));
writeFileSync(dest, JSON.stringify(out) + '\n');
console.log(`${Object.keys(out).length} kana -> ${dest}`);
