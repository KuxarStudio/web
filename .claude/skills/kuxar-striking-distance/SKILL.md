---
name: kuxar-striking-distance
description: Cuando se pida revisar datos de Search Console o Bing (informe SEO semanal, export CSV) para encontrar consultas en posición 4-15 con impresiones, usa esto para proponer un ajuste por consulta.
---

# Buscador de "striking distance" (paso 6 · MEASURE, mensual)

## Entradas (por orden de preferencia)

1. El informe semanal del agente (artefacto `seo-report` en Actions o el correo) y los
   snapshots de la rama `seo-data` (`snapshots/AAAA-MM-DD.json`).
2. Un export CSV de Search Console (Consultas × Páginas) o de Bing Webmaster Tools que
   pegue el usuario. Bing es "gold-tier": ChatGPT Search y Copilot se apoyan en su índice.

Search Console tarda 2–3 días en consolidar y oculta consultas poco frecuentes. Con la web
nueva habrá meses con pocos datos: dilo, no inventes tendencias.

## Flujo

1. Filtra consultas con posición media 4–15 y ≥ `min_impressions` (en `projects.yaml`,
   `settings`). El agente usa 8–20 para sus "quick wins"; aquí el corte es más estricto.
2. Agrupa por página y por intención. Descarta consultas de marca.
3. Para cada consulta, UN ajuste concreto y barato, el primero que aplique:
   - título/description que no contiene la consulta → `kuxar-title-optimizer`
   - falta una sección o respuesta directa → añadir H2 + primera frase que responde
   - falta enlace interno hacia esa página → enlace con ancla descriptiva
   - contenido viejo → actualizar y fijar `updated` real
4. Anota la fecha del cambio para comparar a 28 días con la misma ventana.

## Formato de salida

| Consulta | Página | Pos. | Impr. | Clics | Ajuste (uno) | Archivo |
|---|---|---|---|---|---|---|

Cierra con: nº de consultas, las 5 con más impresiones, y qué datos faltan.

## Cuándo NO usarla

- Con menos de ~28 días de datos o sin impresiones: no hay nada que medir todavía.
- Si el dato requiere acceso a Search Console y no está pegado ni en el informe: pídelo.
