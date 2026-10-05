---
name: kuxar-information-gain
description: Cuando una página de kuxarstudio.com rankea pero no convierte, o antes de publicar una guía, usa esto para puntuar Único / Específico / Auténtico y decir qué dato propio falta.
---

# Buscador de information gain (paso 7 · MEASURE)

La ganancia de información es lo que tu página dice y las demás no. Las IA citan a quien
aporta algo nuevo; una guía que reformula lo que ya está en todas partes no se cita.

## Flujo

1. Lee la página (ES y EN) y las 3 primeras páginas que salen para su pregunta.
2. Puntúa de 0 a 5 cada eje:
   - **Único**: ¿dice algo que esas páginas no dicen (dato, método, ángulo)?
   - **Específico**: ¿hay cifras, ejemplos, pasos y casos concretos en vez de generalidades?
   - **Auténtico**: ¿hay evidencia de primera mano de Kuxar (medición propia, captura real,
     decisión de diseño, error real)?
3. Para cada eje por debajo de 4, pide UN dato real que se pueda conseguir: qué medir, cómo
   y dónde publicarlo. Puntos de partida: `evidence_prompt` de cada proyecto en
   `tools/seo-agent/projects.yaml` (GoCita sin nombre del cliente, uso real de Kaku!, etc.).
4. Si hay un activo compartible posible (gráfico, tabla, hoja descargable anclada al dominio,
   sin formulario), proponlo: es lo que otros enlazan y citan.

## Formato de salida

```
Página: <ruta>
Único n/5 · Específico n/5 · Auténtico n/5  → total n/15
Falta (máx. 3), cada uno: dato a conseguir → cómo medirlo → dónde publicarlo
Decisión: publicar | publicar tras añadir <dato> | no publicar todavía
```

## Reglas

- Nunca fabriques el dato que falta. Sin material real, el eje se queda como está y se
  pide a Iñigo. Un hueco honesto vale más que un número inventado.
- Las cifras de cada guía deben poder verificarse; si dependen de KanjiVG u otra fuente,
  cita y mantén la licencia.

## Cuándo NO usarla

- En páginas legales, de contacto o de listado: no compiten por información.
