---
name: kuxar-content-brief-draft
description: Cuando se pida escribir una guía o artículo nuevo para kuxarstudio.com a partir de un hueco del mapa de temas, usa esto para producir brief y borrador ES+EN listos para el repo.
---

# Brief y borrador de una guía (paso 4 · WRITE)

## Flujo

1. **Brief** (antes de escribir nada). Tema, `key`, rol (pillar/cluster), pregunta exacta,
   intención, fan-out de sub-preguntas que debe contestar, enlace al pilar, siguiente guía en
   el clúster, qué dato propio o medido aporta (ver `kuxar-information-gain`).
2. **Borrador ES** en `web/src/content/guides/<slug>.md` y **EN** en
   `web/src/content/guides-en/<slug>.md`, mismo `key`.
3. Frontmatter (esquema en `web/src/content/config.ts`):
   ```
   key, title (≤60), description (≤160), date, project, role, pillar (si cluster), order
   ```
4. Cuerpo: la primera frase responde la pregunta; H2 en orden; tabla o lista cuando haya
   comparación; un único enlace al producto en el primer tercio; un enlace al pilar; un
   enlace lateral a la siguiente guía (`order`); anclas descriptivas, nunca "pulsa aquí".
5. Añade el tema a `tools/seo-agent/topic-map.yaml` (`planned` → `live`) y, si cambia el
   orden de lectura, a `web/src/lib/guide-order.ts`.
6. Verifica: `cd web && npm run build && npm run audit && npm test`.
7. Pasa `kuxar-title-optimizer` sobre el title final.

## Reglas

- Escribe como "nosotros" (3 desarrolladores independientes). Sin nombres de personas en el
  cuerpo salvo la firma de nombre de pila decidida.
- No inventes datos, citas, cifras, reseñas ni capturas. Si falta material real, deja un
  hueco marcado `<!-- FALTA: dato real de … -->` y avísalo; no rellenes.
- Nunca "Kaku" sin exclamación. Si usas trazos de KanjiVG, mantén la atribución CC BY-SA 3.0.
- Devlog: solo entradas con material real aportado por el usuario.
- Traduce con criterio, no literal; mismo contenido de fondo en ambos idiomas.

## Cuándo NO usarla

- Si el tema no está en el mapa o el usuario no ha confirmado la pregunta: propón el hueco
  primero (`kuxar-competitor-gap`).
