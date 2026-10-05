// Copy de la página de hojas de trazos (/recursos/hojas-de-trazos/).
import type { Lang } from './index';

export interface KanaSheetsCopy {
  title: string;
  description: string;
  h1: string;
  intro: string[];
  howTitle: string;
  how: string[];
  hiraganaTitle: string;
  katakanaTitle: string;
  rowHeader: string;
  downloadTitle: string;
  downloadIntro: string;
  downloads: { hiragana: string; katakana: string };
  pdfNote: string;
  citeTitle: string;
  citeText: string;
  attribution: string;
  breadcrumb: string;
  tip: string;
}

export const kanaSheets: Record<Lang, KanaSheetsCopy> = {
  es: {
    title: 'Orden de trazos de hiragana y katakana (tabla y PDF)',
    description: 'Tabla del orden de trazos de los 92 kana básicos y hojas de práctica en PDF gratis, sin registro. Cada trazo numerado, listo para imprimir.',
    h1: 'Orden de trazos de hiragana y katakana',
    intro: [
      'Aquí tienes los 46 hiragana y los 46 katakana básicos con cada trazo numerado, en la tabla clásica de filas y columnas. Es gratis, sin registro y puedes usarla, imprimirla o enlazarla.',
      'Más abajo hay hojas de práctica en PDF: cada kana aparece una vez con los trazos numerados, dos veces en gris para calcar y dos casillas vacías con guía para escribirlo de memoria.',
    ],
    howTitle: 'Cómo usar la tabla',
    how: [
      'El número rojo marca dónde empieza cada trazo y el orden en que se escribe. Los trazos se hacen siempre en el sentido en que se dibujó la línea: de izquierda a derecha y de arriba abajo en la mayoría de los casos.',
      'Fíjate en los kana con trazos que se confunden, como し y つ, o シ y ツ: la dirección del trazo es lo que los distingue.',
      'Para fijar el orden, calca primero y escribe después de memoria, siguiendo el ciclo de práctica de la guía.',
    ],
    hiraganaTitle: 'Hiragana (46)',
    katakanaTitle: 'Katakana (46)',
    rowHeader: 'Fila',
    downloadTitle: 'Hojas de práctica en PDF',
    downloadIntro: 'Descarga directa, sin formulario ni correo:',
    downloads: { hiragana: 'Hojas de hiragana (PDF)', katakana: 'Hojas de katakana (PDF)' },
    pdfNote: 'Tamaño A4, 2 páginas por silabario. Puedes imprimirlas y compartirlas citando kuxarstudio.com.',
    citeTitle: 'Cómo citar o enlazar',
    citeText: 'Si usas estas tablas en una web, un aula o un vídeo, enlaza a esta página (kuxarstudio.com) y mantén la atribución a KanjiVG.',
    attribution: 'Datos de trazos: KanjiVG (kanjivg.tagaini.net), © Ulrich Apel y colaboradores, licencia CC BY-SA 3.0.',
    breadcrumb: 'Hojas de trazos',
    tip: 'Los números rojos indican el orden de cada trazo.',
  },
  en: {
    title: 'Hiragana and Katakana Stroke Order (Chart and PDF)',
    description: 'Stroke order chart for the 92 basic kana and free PDF practice sheets, no sign-up. Every stroke numbered, ready to print.',
    h1: 'Hiragana and katakana stroke order',
    intro: [
      'Here are the 46 basic hiragana and the 46 basic katakana with every stroke numbered, in the classic chart of rows and columns. It is free, needs no sign-up and you can use it, print it or link to it.',
      'Below there are PDF practice sheets: each kana appears once with numbered strokes, twice in gray to trace, and two empty guide boxes to write it from memory.',
    ],
    howTitle: 'How to use the chart',
    how: [
      'The red number marks where each stroke starts and the order in which it is written. Strokes always follow the direction the line was drawn in: left to right and top to bottom in most cases.',
      'Pay attention to kana with strokes that get mixed up, such as し and つ, or シ and ツ: stroke direction is what tells them apart.',
      'To lock in the order, trace first and then write from memory, following the practice loop in the guide.',
    ],
    hiraganaTitle: 'Hiragana (46)',
    katakanaTitle: 'Katakana (46)',
    rowHeader: 'Row',
    downloadTitle: 'PDF practice sheets',
    downloadIntro: 'Direct download, no form or email:',
    downloads: { hiragana: 'Hiragana sheets (PDF)', katakana: 'Katakana sheets (PDF)' },
    pdfNote: 'A4 size, 2 pages per syllabary. Print and share them, crediting kuxarstudio.com.',
    citeTitle: 'How to cite or link',
    citeText: 'If you use these charts on a website, in a classroom or in a video, link to this page (kuxarstudio.com) and keep the KanjiVG attribution.',
    attribution: 'Stroke data: KanjiVG (kanjivg.tagaini.net), © Ulrich Apel and contributors, CC BY-SA 3.0 license.',
    breadcrumb: 'Stroke order sheets',
    tip: 'Red numbers show the order of each stroke.',
  },
};
