// Tabla básica del kana (gojūon, 46 + 46). Una fila por consonante, cinco columnas
// (a i u e o). `null` = hueco de la tabla (no existe "yi", "ye", "wi", "wu", "we").
// Compartida por la página de hojas de trazos y el generador del PDF.
export const COLUMNS = ['a', 'i', 'u', 'e', 'o'];

export const ROWS = [
  { id: '', hira: ['あ', 'い', 'う', 'え', 'お'], kata: ['ア', 'イ', 'ウ', 'エ', 'オ'], romaji: ['a', 'i', 'u', 'e', 'o'] },
  { id: 'k', hira: ['か', 'き', 'く', 'け', 'こ'], kata: ['カ', 'キ', 'ク', 'ケ', 'コ'], romaji: ['ka', 'ki', 'ku', 'ke', 'ko'] },
  { id: 's', hira: ['さ', 'し', 'す', 'せ', 'そ'], kata: ['サ', 'シ', 'ス', 'セ', 'ソ'], romaji: ['sa', 'shi', 'su', 'se', 'so'] },
  { id: 't', hira: ['た', 'ち', 'つ', 'て', 'と'], kata: ['タ', 'チ', 'ツ', 'テ', 'ト'], romaji: ['ta', 'chi', 'tsu', 'te', 'to'] },
  { id: 'n', hira: ['な', 'に', 'ぬ', 'ね', 'の'], kata: ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'], romaji: ['na', 'ni', 'nu', 'ne', 'no'] },
  { id: 'h', hira: ['は', 'ひ', 'ふ', 'へ', 'ほ'], kata: ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'], romaji: ['ha', 'hi', 'fu', 'he', 'ho'] },
  { id: 'm', hira: ['ま', 'み', 'む', 'め', 'も'], kata: ['マ', 'ミ', 'ム', 'メ', 'モ'], romaji: ['ma', 'mi', 'mu', 'me', 'mo'] },
  { id: 'y', hira: ['や', null, 'ゆ', null, 'よ'], kata: ['ヤ', null, 'ユ', null, 'ヨ'], romaji: ['ya', null, 'yu', null, 'yo'] },
  { id: 'r', hira: ['ら', 'り', 'る', 'れ', 'ろ'], kata: ['ラ', 'リ', 'ル', 'レ', 'ロ'], romaji: ['ra', 'ri', 'ru', 're', 'ro'] },
  { id: 'w', hira: ['わ', null, null, null, 'を'], kata: ['ワ', null, null, null, 'ヲ'], romaji: ['wa', null, null, null, 'wo'] },
  { id: 'nn', hira: ['ん', null, null, null, null], kata: ['ン', null, null, null, null], romaji: ['n', null, null, null, null] },
];

/** Todos los caracteres de un silabario, en orden de tabla. */
export const charsOf = (script /* 'hira' | 'kata' */) => ROWS.flatMap((r) => r[script].filter(Boolean));
