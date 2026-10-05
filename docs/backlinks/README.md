# Backlinks de Kuxar Studio

Método: infografía "How to Get Backlinks" (Lawrence Hitches / HawkAcademy, 2026; opinión del autor apoyada en un estudio de Ahrefs sobre visibilidad en IA, no una regla de Google). Todo gratis.

## La prueba única

**¿Existiría este enlace si no hubiera buscadores?** Si no, se descarta. Nada más importa.

## Filtro de 6 pasos (parar en el primer "no")

| # | Pregunta | Columna del CSV |
|---|---|---|
| 1 | ¿Existiría sin buscadores? | `p1_sin_buscadores` |
| 2 | ¿La página donde está es real (autor, fecha, contenido alrededor)? | `p2_pagina_real` |
| 3 | ¿El sitio tiene audiencia (comentarios, newsletter, compartidos)? | `p3_audiencia` |
| 4 | ¿Un humano escribiría ese texto de enlace? | `p4_ancla_natural` |
| 5 | ¿Es relevante para lo que hacemos (una frase lo explica)? | `p5_relevante` |
| 6 | Solo ahora, métricas (para ordenar los que pasaron) | `p6_metricas` |

Rellena con `si` / `no` / `?`. Un objetivo solo pasa a `estado=contactar` si p1 a p5 son `si`.

## Archivos

- `backlinks.csv`: lista de objetivos y su estado. **Los objetivos concretos salen de conocimiento general y no están verificados**: comprueba que existen y cuáles son sus normas antes de enviar nada.
- `perfiles.md`: textos listos para pegar al crear cada perfil (nombre exacto "Kuxar Studio" y "Kaku!").
- `outreach.md`: mensajes para repartir las hojas de trazos y presentar PDF-Blender.

## Orden de trabajo

1. Perfiles propios (LinkedIn, YouTube, AlternativeTo, itch.io). Al crearlos, añadir la URL a `SAME_AS` en `web/src/lib/entity.ts` y enlazar de vuelta a kuxarstudio.com.
2. Repartir las hojas de trazos a profesores, escuelas y comunidades (`outreach.md`).
3. PDF-Blender: topics en GitHub, Show HN, listas "awesome" (`outreach.md`).
4. Dato propio de GoCita publicado sin nombre del cliente (cuando haya métrica).
5. Dominios que aparezcan en el tally de citaciones de IA (ítem 16 del playbook) pasan a este CSV.

## Qué NO hacer

Comprar enlaces; granjas de perfiles; spam de comentarios; PBN y "DA alto" de gigs; notas de prensa masivas; enlaces .gov/.edu comprados; pedir como texto de enlace la palabra clave exacta. Tampoco inventar reseñas ni testimonios.

## Medir

- Search Console > Enlaces > Sitios que enlazan más (gratis).
- Bing Webmaster Tools > Enlaces entrantes (cuando esté dado de alta el dominio).
- Los `nofollow` también cuentan como mención.
