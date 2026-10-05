---
name: kuxar-seo-audit-page
description: Cuando se pida auditar el SEO on-page de una URL o página de kuxarstudio.com (home, proyecto, guía, devlog), usa esto para devolver la lista de prioridades en formato fijo.
---

# Auditoría SEO de una página de Kuxar (paso 1 · AUDIT)

Para quién: Iñigo y el equipo de Kuxar Studio. Primer eslabón de la cadena
`audit → plan → write → measure` (ver `docs/seo.md`).

## Flujo

1. Identifica la página (ruta ES y su pareja EN). Lee su fuente en `web/src/pages/` o
   `web/src/content/guides*/`.
2. Ejecuta `cd web && npm run build && npm run audit -- --json` y filtra los hallazgos de esa
   URL. No repitas a mano lo que ya mide la auditoría (enlaces rotos, h1, title, lang, alt,
   labels, anclas genéricas, profundidad de clics, huérfanas, inlinks).
3. Revisa lo que la auditoría NO ve:
   - Title ≤ 60 (ideal ≤ 50), keyword al principio, único. Meta description ≤ 160, lo clave
     en los primeros 120, con llamada a la acción.
   - H1 con el tema; H2–H6 en orden; la primera frase responde la pregunta del título.
   - Una única llamada al producto en el primer tercio del cuerpo (regla "sink": producto
     abajo, un enlace hacia el producto y uno lateral a la siguiente guía).
   - Pareja EN existente y con el mismo `key`; hreflang correcto.
   - JSON-LD coherente con la página (BlogPosting, FAQPage, SoftwareApplication…); sin
     ratings ni precios inventados.
   - Fecha visible y `updated` real si se ha revisado el contenido.
   - Nombre de marca exacto: "Kuxar Studio" y "Kaku!" (con exclamación).
4. Ordena por impacto y esfuerzo: primero lo que bloquea indexación o confunde a la entidad,
   luego CTR (title/description), luego enlazado, luego pulido.

## Formato de salida (idéntico en cada ejecución)

```
Página: <ruta ES> · <ruta EN>
Veredicto: <una frase>
Errores (bloquean CI): <lista o "ninguno">
Prioridades (máx. 7), cada una: [P1|P2|P3] qué cambiar → por qué → archivo a tocar
No tocar: <lo que ya está bien y no debe cambiar>
```

## Reglas

- No inventes datos, cifras ni reseñas. Lo que no se pueda comprobar, se marca "a verificar".
- No propongas `llms.txt` ni markup especial para IA: Google dice que no hace falta.
- Las cifras de CTR por posición y el "25–49 enlaces por página" son heurísticas del autor
  de los apuntes, no reglas: no las uses como criterio de fallo.

## Cuándo NO usarla

- Tarea puntual y rara (un redirect, un favicon): hazla directamente.
- Decisión estratégica (¿entramos en un tema nuevo?): usa el mapa de temas y habla con Iñigo.
