---
name: kuxar-title-optimizer
description: Cuando se pida optimizar el title o la meta description de una página de kuxarstudio.com, usa esto para devolver el título final y la descripción, ES y EN, con los caracteres contados.
---

# Optimizador de title y meta description (paso 5 · WRITE)

## Reglas del title

- ≤ 60 caracteres (ideal ≤ 50). Keyword al principio, único en todo el sitio (por idioma).
- Marca al final: `withBrand()` en `web/src/lib/seo.ts` añade " | Kuxar Studio" solo si
  cabe en 60. No lo escribas a mano en el frontmatter.
- Como mucho una palabra de acción en mayúsculas; sin keyword stuffing; sin clickbait.
- Debe describir lo que la página contiene de verdad.

## Reglas de la description

- ≤ 160 caracteres, lo importante en los primeros 120, con una llamada a la acción.
- No es factor de ranking: sirve para el CTR. Única por página.

## Flujo

1. Lee el title y la description actuales y la consulta objetivo (pregunta del topic-map o
   consulta real de Search Console).
2. Propón 3 variantes de title con su longitud; recomienda una y di por qué.
3. Escribe la description recomendada con su longitud.
4. Entrega ES y EN por separado (no traducciones literales: adapta a cómo se busca en EN).
5. Aplica el cambio en el frontmatter, ejecuta `cd web && npm run build && npm run audit`
   y confirma que no hay avisos de longitud ni de títulos duplicados.

## Formato de salida

```
Página: <ruta>
ES  title (nn): …   | description (nnn): …
EN  title (nn): …   | description (nnn): …
Variantes descartadas: …
```

## Cuándo NO usarla

- Si la página se va a reescribir entera: optimiza el title al final, no antes.
