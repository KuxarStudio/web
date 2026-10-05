# Datos de trazos (kana-strokes.json)

`kana-strokes.json` contiene los trazos y la posición de los números de orden de los 92 kana
básicos, extraídos de **KanjiVG** (https://kanjivg.tagaini.net), © Ulrich Apel y colaboradores,
licencia **Creative Commons Atribución-CompartirIgual 3.0** (CC BY-SA 3.0):
https://creativecommons.org/licenses/by-sa/3.0/

Este archivo es una obra derivada de KanjiVG y se distribuye bajo esa misma licencia (CC BY-SA 3.0).
Las hojas de trazos que se generan con él (página `/recursos/hojas-de-trazos/` y los PDF de
`public/recursos/`) deben mostrar la atribución a KanjiVG. El resto del código del repositorio no
queda afectado por esta licencia.

Para regenerarlo: `node scripts/kana/generate-data.mjs <ruta-a-un-clon-de-kanjivg>`.
