# Kuxar Studio — web

Código fuente de la web de [Kuxar Studio](https://kuxarstudio.github.io/web/),
estudio independiente de software: juegos (Godot/GDScript), apps de
aprendizaje (Android/Kotlin) y herramientas (Python).

Este repo (`KuxarStudio/web`) es el **origen** del sitio. El contenido real
vive en `web/`, construido con [Astro](https://astro.build). Todo lo demás
(`docs/`, este README) es contexto de proyecto, no parte del sitio publicado.

## Empezar en local

Requiere Node 20+.

```bash
cd web
npm install
npm run dev
```

Abre `http://localhost:4321/web/` (el `/web/` es intencional — ver
[Base path y dominio propio](#base-path-y-dominio-propio) más abajo).

### Scripts disponibles (desde `web/`)

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Build de producción en `web/dist/` |
| `npm run preview` | Sirve el build de `dist/` localmente, para probar antes de desplegar |
| `npm test` | Ejecuta los tests (Vitest) |
| `npm run check` | Type-checking de todo el proyecto (`astro check`) |

## Cómo funciona el deploy

Cada push a `main` dispara `.github/workflows/deploy.yml`:

1. `npm ci` — instala dependencias
2. `npm run check` — type-checking, el build no continúa si falla
3. `npm test` — Vitest, el build no continúa si falla
4. `npm run build` — build de producción (`web/dist/`)
5. Sube `web/dist/` como artefacto de Pages y lo despliega

No hace falta ningún secreto nuevo: el build usa el `GITHUB_TOKEN` que
Actions genera automáticamente (con permisos de solo lectura sobre este
repo) para consultar la API de GitHub en build time y mostrar estrellas /
último commit de los proyectos con repo público (ver
[`src/lib/github.ts`](web/src/lib/github.ts)).

Para desplegar manualmente sin hacer push, usa el botón "Run workflow" en la
pestaña Actions del repo (el workflow tiene `workflow_dispatch`).

## Content collections

Todo el contenido real (proyectos, herramientas, entradas de devlog) vive en
`web/src/content/` como archivos Markdown con frontmatter, validados contra
el esquema en [`web/src/content/config.ts`](web/src/content/config.ts).
Añadir contenido nuevo es crear un archivo — no hace falta tocar componentes
ni páginas.

### `projects` (`web/src/content/projects/*.md`)

Juegos y apps. Aparecen en la portada (máx. 4, los que tengan
`featured: true`, ordenados por `order`) y siempre en `/portfolio.html`
(sin límite).

```yaml
---
title: "Nombre del proyecto"
category: "juego"          # o "aprendizaje"
status: "en-desarrollo"    # "en-desarrollo" | "proximamente" | "disponible"
description: "Una frase."
stack: ["Godot", "GDScript"]
thumbnailLabel: "gif · próximamente"   # texto de fallback si no hay thumbnail
thumbnail: "/ruta/a/captura.gif"       # opcional
repo: "https://github.com/..."         # opcional — SOLO si el repo es público
githubRepo: "KuxarStudio/nombre-repo"  # opcional — SOLO si el repo es público
googlePlay: "https://play.google.com/..."  # opcional
appStore: "..."                        # opcional
steam: "..."                           # opcional
featured: true
order: 1
---
```

**Importante sobre `repo`/`githubRepo`:** solo se rellenan si el repositorio
de GitHub es **público**. El build de Actions solo puede leer stats (vía la
API de GitHub) de repos públicos — un repo privado de la organización no es
visible para el `GITHUB_TOKEN` automático de este repo, aunque sea del mismo
dueño. Enlazar a un repo privado tampoco tendría sentido para un visitante
externo. Hoy, de los proyectos reales, solo `PDF-Blender` (en `tools/`) es
público — Nadir, Kaku! y BlindNote tienen sus repos privados y no llevan
`repo`/`githubRepo`.

### `tools` (`web/src/content/tools/*.md`)

Herramientas sueltas (hoy solo PDF-Blender). Mismo patrón que `projects`,
más `installCmd` y `releasesUrl`:

```yaml
---
title: "Nombre"
description: "Una frase."
stack: ["Python"]
installCmd: "pip install nombre"
repo: "https://github.com/..."
githubRepo: "KuxarStudio/nombre-repo"
releasesUrl: "https://github.com/.../releases/latest"  # opcional
---
```

### `devlog` (`web/src/content/devlog/*.md`)

Entradas de bitácora. La portada muestra las 3 más recientes; `/devlog.html`
las lista todas; cada una tiene su propia página en
`/devlog/<nombre-de-archivo>.html`. El cuerpo del Markdown es el contenido
completo de la entrada.

```yaml
---
title: "Título de la entrada"
date: 2026-08-29
project: "Juego"          # etiqueta libre — se muestra como tag
excerpt: "Resumen de una línea para la portada y el archivo."
---

Cuerpo de la entrada en Markdown.
```

## Estructura

```
web/
  astro.config.mjs       # base path, integración de sitemap
  src/
    content/              # ver arriba — projects/tools/devlog
    components/            # Header, Footer, ProjectCard, DevlogRow, ToolCard
    layouts/BaseLayout.astro  # <head>, tema oscuro, fuentes, meta/OG tags
    pages/                 # index, portfolio, devlog, devlog/[slug], 404
    lib/github.ts          # stats de GitHub en build time
    styles/global.css      # sistema de diseño (tokens, modo claro/oscuro)
  tests/                  # Vitest — solo src/lib/github.ts tiene lógica real
```

## Base path y dominio propio

El sitio se sirve hoy en `https://kuxarstudio.github.io/web/` (GitHub Pages
como *project site*), por eso `astro.config.mjs` tiene `base: '/web/'` y
todo enlace interno se construye con `import.meta.env.BASE_URL` (nunca una
ruta absoluta a pelo — se rompería bajo ese prefijo).

Cuando se compre un dominio propio (`kuxarstudio.com`): GitHub Pages sirve
**cualquier** dominio personalizado desde la raíz, sin el prefijo `/web` —
esto es así independientemente del repo que lo aloje. El cambio necesario en
ese momento es de una línea:

```js
// astro.config.mjs
export default defineConfig({
  site: 'https://kuxarstudio.com',
  base: '/',
  // ...
});
```

Migrar el contenido a un repo `KuxarStudio/kuxarstudio.github.io` antes de
tener el dominio no aporta nada técnico — el prefijo `/web` solo existe para
la URL de fallback `*.github.io/web/`, y desaparece igual con un dominio
propio venga de donde venga. Además, `KuxarStudio/kuxarstudio.github.io` ya
existe y sirve la web HTML actual en producción; sustituirla es una decisión
deliberada y separada, no un efecto colateral de este cambio.

## Estado de los repos de GitHub (para futuras sesiones)

Verificado en esta sesión vía `gh repo list KuxarStudio`:

| Proyecto | Repo | Visibilidad |
|---|---|---|
| Nadir: Protocol 1-Star | `KuxarStudio/nadir--protocol-1-star` | Privado |
| Kaku! | `KuxarStudio/kaku-app` | Privado (ya publicado en Google Play) |
| BlindNote | `KuxarStudio/Blindnote-Android` | Privado |
| PDF-Blender | `KuxarStudio/PDF-Blender` | **Público** |

Esta lista puede quedar desactualizada — antes de asumir que sigue siendo
así, vuelve a comprobarlo con `gh repo list KuxarStudio`.
