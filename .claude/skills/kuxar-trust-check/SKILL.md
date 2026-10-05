---
name: kuxar-trust-check
description: Cuando se pida revisar la confianza o E-E-A-T de kuxarstudio.com (página /estudio/, About, contacto, casos), usa esto para sacar una puntuación y 3 cosas concretas que añadir.
---

# Comprobación de confianza (E-E-A-T) de Kuxar (paso 2 · AUDIT)

E-E-A-T no es un factor de ranking: es lo que miden los factores. Se audita sobre
`/estudio/` (`/en/studio/`), la home, `/contacto`, el caso GoCita y las fichas de producto.

## Flujo

Puntúa 0/1 cada check (16 en total) leyendo el HTML real (`web/dist/`) y `web/src/lib/entity.ts`:

**Experience (4)**: caso con resultado medido · observaciones propias (no genéricas) ·
capturas o vídeo reales · fechas de actualización visibles.
**Expertise (4)**: firma con nombre de pila (decisión ya tomada: nombre de pila + "Kuxar
Studio", sin apellido ni foto) · bio del estudio en 3 longitudes · Person/Organization
schema coherente · páginas de servicio específicas.
**Authoritativeness (4)**: perfiles externos reales en `sameAs` · menciones o enlaces de
terceros · fichas en directorios/tiendas · mismo nombre exacto en todas partes.
**Trust (4)**: HTTPS · contacto real (`admin@kuxarstudio.com`) · privacidad y términos ·
titular legal publicado cuando la forma legal esté inscrita (LSSI/RGPD).

## Formato de salida

```
Puntuación: N/16
Por bloque: Experience n/4 · Expertise n/4 · Authoritativeness n/4 · Trust n/4
Añadir ahora (exactamente 3, ordenadas por impacto/esfuerzo):
1. <qué> → <dónde> → <qué prueba lo respalda>
2. …
3. …
Depende de Iñigo (no se puede hacer desde el código): <lista>
```

## Reglas

- Nunca inventes reseñas, testimonios, ratings ni clientes. Sin prueba real, el check es 0.
- El caso GoCita se publica sin nombre del cliente; no lo reveles.
- No pongas foto personal ni apellido. No menciones ubicación (decisión del estudio).
- No incluyas `sameAs` de perfiles que no existan todavía.

## Cuándo NO usarla

- Si la pregunta es "¿qué nombre/forma legal usamos?": es decisión de Iñigo, no táctica.
