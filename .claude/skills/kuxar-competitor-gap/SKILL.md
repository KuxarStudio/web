---
name: kuxar-competitor-gap
description: Cuando se pida comparar Kuxar con competidores o buscar huecos de keywords y contenido de un proyecto (Kaku!, software a medida, PDF-Blender), usa esto para sacar huecos priorizados.
---

# Huecos frente a competidores (paso 3 · PLAN)

## Entradas

- Competidores del proyecto: `tools/seo-agent/projects.yaml` (campo `competitors`). Para
  software a medida, los de CLAUDE.md (sonkeit.com, vertixsolutions.es, arttalo-tech.com),
  tomando patrones de conversión, no estética.
- Mapa de temas: `tools/seo-agent/topic-map.yaml` (incluye `fan_out`).
- Fuentes: WebSearch/WebFetch sobre 2 competidores como mucho (los que más salen para las
  `questions` del proyecto). Si una URL está tras login, Cloudflare o bloqueo regional, dilo
  y pide al usuario que pegue el contenido; no la rodees.

## Flujo

1. Para cada competidor, lista sus páginas que responden a las preguntas del `fan_out`.
2. Cruza con el mapa de temas: tema con página `live` / `planned` / ausente.
3. Clasifica cada hueco por intención (informacional, comparativa, comercial, transaccional)
   y asigna rol (hub, supporting, definitional, question, comparison).
4. Para cada hueco, decide el movimiento más barato: optimizar existente → embeber en un
   pilar → producir página nueva. Ritmo máximo: 2 páginas nuevas + 1 refresh por semana.

## Formato de salida

| Hueco | Quién lo cubre | Intención | Rol | Movimiento | Prioridad |
|---|---|---|---|---|---|

Después: máx. 5 huecos recomendados, y para cada uno una línea con la pregunta exacta que
responde y el `key` propuesto para el mapa. Los nuevos entran como `status: planned`.

## Reglas

- Mide la autoridad con los 4 proxies: cobertura del mapa, profundidad de clics (≤3),
  amplitud de ranking, frecuencia de citación por IA.
- No copies texto ni estructura 1:1 de un competidor; el objetivo es información que ellos no
  tienen (ver `kuxar-information-gain`).
- No afirmes volúmenes ni posiciones de competidores sin fuente.

## Cuándo NO usarla

- Con la web sin tráfico y sin mapa de temas definido para ese proyecto: primero el mapa.
