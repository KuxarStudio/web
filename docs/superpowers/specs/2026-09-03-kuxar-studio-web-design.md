# Kuxar Studio — web principal (diseño y arquitectura)

## Contexto

Kuxar Studio es un estudio independiente que construye juegos (Godot/GDScript),
apps de aprendizaje (Android/Kotlin) y herramientas (Python). Esta web es la
Fase 1 del ecosistema (ver `CLAUDE.md` en la raíz). El objetivo declarado
detrás de la web es tener un dominio propio verificado para crear una
organización de Google Cloud; el contenido en sí debe funcionar como
portfolio real del estudio.

Este documento consolida las decisiones tomadas en esta sesión (exploración
de diseño con el skill `frontend-design`, iteración directa con el usuario,
e investigación del estado real de los repos de GitHub) para que el plan de
implementación parta de una base sin ambigüedad.

## Dirección visual: "Taller Dinámico"

Se exploraron 4 variaciones reales (Ficha Técnica, Bitácora, Estantería, y el
híbrido final Taller Dinámico) publicadas como Artifacts navegables. Ganadora:
**Taller Dinámico** — combina la base cálida/técnica de "Ficha Técnica"
(papel/blueprint, sellos de categoría, precisión de "planos") con el
lenguaje más audaz de "Bitácora" (terminal real en el hero, hashes de commit
estilo git, tipografía JetBrains Mono), más motion orquestado (escritura del
titular, scroll-reveal, hovers). Justificación: dos de los tres proyectos
insignia son consumo (juego móvil, app de aprendizaje) por lo que el sitio no
puede leerse como "solo para developers" (descartando Bitácora tal cual);
tampoco puede diluir la credibilidad técnica que el usuario pidió
explícitamente (descartando Estantería tal cual).

### Tokens de diseño

**Color (modo claro, `:root`):**
```
--paper:#f2ede1;       --paper-2:#eae3d2;      --paper-rgb:242,237,225;
--ink:#161f2b;         --ink-soft:#3d4b59;     --ink-mute:#5b6b7d;
--line: rgba(22,31,43,0.14);  --line-soft: rgba(22,31,43,0.08);
--blue:#2f5fb0;        --live:#17b890;
--juego:#6a4cff;       --aprendizaje:#17b890;  --herramienta:#c9820a;
--on-accent:#14101c;   /* texto fijo sobre fondos de categoría, en ambos temas */
--term-bg:#1e2636;     /* panel de terminal, fijo en ambos temas */
```

**Color (modo oscuro, `:root[data-theme="dark"]`):**
```
--paper:#15181d;  --paper-2:#1c2028;  --paper-rgb:21,24,29;
--ink:#e9e4d8;     --ink-soft:#b9c0cc; --ink-mute:#838c99;
--line: rgba(233,228,216,0.14);  --line-soft: rgba(233,228,216,0.05);
```
Los acentos de categoría (`--juego`, `--aprendizaje`, `--herramienta`),
`--blue`, `--live`, `--on-accent` y `--term-bg` **no cambian** entre temas —
decisión explícita del usuario. `--on-accent` y `--term-bg` son tokens fijos
independientes de `--ink`/`--paper` precisamente para que la inversión de
tema no rompa el contraste de textos que van sobre fondos de acento (sello
de categoría, icono de herramienta) ni el panel de terminal (que debe leerse
siempre como "terminal oscura", en ambos temas).

**Tipografía:** 'Space Grotesk' (500/700, display y cuerpo corto) + 'JetBrains
Mono' (400/500/600/700, labels técnicos, meta info, botones, terminal) vía
Google Fonts.

**Layout:** fondo con retícula técnica sutil (grid de líneas de 32px vía
`linear-gradient` repetido). Tarjetas con esquinas cortadas (`clip-path`
angular), borde 2px. Panel de terminal real en el hero con barra de ventana,
prompt con cursor parpadeante, contenido tipo `cat ficha.json`.

**Motion (deliberado, no decorativo):** titular del hero se escribe letra a
letra al cargar; tarjetas de portfolio y filas de devlog aparecen con
fade+rise al hacer scroll (`IntersectionObserver`); hover en tarjetas =
`translateY(-4px)` + sombra acentuada, `transition: all .2s ease`. Todo
respeta `prefers-reduced-motion: reduce`.

**Modo oscuro:** toggle en el header (icono sol/luna), persiste en
`localStorage` bajo la clave `kuxar-theme`, con fallback a
`prefers-color-scheme` si no hay preferencia guardada. El atributo
`data-theme` se fija en `<html>` con un script inline que corre antes del
primer paint (evita parpadeo/FOUC).

**Selector de idioma:** UI simple ES/EN en el header, **visual únicamente**
en esta fase — no hay contenido bilingüe todavía. Traducir de verdad
requeriría rutas i18n de Astro (`i18n.locales`) y contenido duplicado por
locale; queda fuera de alcance de este plan (v2).

**Privacidad geográfica:** no se muestra "España" en ningún sitio del
contenido público — se usa "Internet-based" (eyebrow del hero y fila `sede`
del panel de terminal).

## Estado real de los repos de GitHub (verificado, no inventado)

Org `KuxarStudio`, consultado vía `gh repo list` / `gh api` en esta sesión:

| Proyecto | Repo | Visibilidad | Notas |
|---|---|---|---|
| Nadir: Protocol 1-Star | `KuxarStudio/nadir--protocol-1-star` | **Privado** | sin enlace público, sin stats de API |
| Kaku! | `KuxarStudio/kaku-app` | **Privado** | ya publicado en Google Play: `https://play.google.com/store/apps/details?id=com.kaku.kaku&hl=es_419` |
| BlindNote | `KuxarStudio/Blindnote-Android` | **Privado** | sin enlace público, sin stats de API |
| PDF-Blender | `KuxarStudio/PDF-Blender` | **Público** | 0 estrellas, release real `v1.0` ("PDF Tools Pro") en `/releases/latest` |

**Implicación de arquitectura:** el `GITHUB_TOKEN` automático de un workflow
de Actions solo tiene permiso de lectura sobre el propio repo donde corre
(`KuxarStudio/web`), no sobre otros repos privados de la org, aunque sean del
mismo dueño. Por tanto la integración con la API de GitHub (estrellas, último
commit) solo puede funcionar para **repos públicos** — hoy, únicamente
PDF-Blender. Enlazar "ver repositorio" a un repo privado sería además inútil
para un visitante externo (404/sin acceso).

**Decisión:** el campo `githubRepo` del content collection es opcional y solo
se rellena para repos públicos. La tarjeta de proyecto no muestra hash de
commit ni enlace a repo cuando no hay `githubRepo` — en su lugar prioriza el
enlace a tienda (`googlePlay` / `appStore` / `steam`) si existe, y si no,
solo muestra el estado. Esto es intencional y correcto: no se está pidiendo
ni sugiriendo hacer públicos los repos de juegos/apps en desarrollo — esa es
una decisión que solo el usuario debe tomar más adelante si quiere.

El badge "N repos activos" del header original se cambia por "N proyectos
activos" (cuenta de projects+tools, no de repos de GitHub) para no insinuar
algo falso a un visitante técnico que comprueba los enlaces.

## Modelo de contenido (Astro content collections)

**`projects`** (`src/content/projects/*.md`): título, categoría
(`juego`/`aprendizaje`), estado (`en-desarrollo`/`proximamente`/`disponible`),
descripción, stack, thumbnail opcional (+ label de fallback), `repo` /
`githubRepo` opcionales (solo si el repo es público), `googlePlay` /
`appStore` / `steam` opcionales, `featured` (bool, controla si aparece en la
portada) y `order`.

**`tools`** (`src/content/tools/*.md`): título, descripción, stack, comando
de instalación, `repo` / `githubRepo`, `releasesUrl` opcional.

**`devlog`** (`src/content/devlog/*.md`): título, fecha, `project` (etiqueta
de categoría), extracto, cuerpo en markdown (entrada completa, con página
propia).

## Integración con la API de GitHub (build time)

`src/lib/github.ts` expone `getRepoStats(githubRepo)` que llama a
`https://api.github.com/repos/{owner}/{repo}` y
`https://api.github.com/repos/{owner}/{repo}/commits?per_page=1`, autenticado
con el `GITHUB_TOKEN` del workflow (disponible como env var en build,
`secrets.GITHUB_TOKEN`, sin necesidad de crear un secreto nuevo). Se ejecuta
en build time (Node, en Actions), nunca en el cliente. Si la llamada falla
(red, repo no encontrado, rate limit) se captura el error y se devuelve
`null` — el build nunca debe romperse por esto, la tarjeta simplemente omite
el badge de stats.

## Escalabilidad de listados

- Portada: máximo 4 proyectos destacados (`featured: true`, ordenados por
  `order`), con enlace "Ver archivo completo →" a `/portfolio.html`
  (archivo completo, sin límite).
- Portada: 3 entradas de devlog más recientes, con enlace "Ver bitácora
  completa →" a `/devlog.html` (todas las entradas). Cada entrada de
  `/devlog.html` enlaza a su propia página `/devlog/<slug>.html` con el
  cuerpo completo en markdown.
- Herramientas: sin archivo/paginación todavía — hay una sola herramienta
  (PDF-Blender); se añadirá un patrón equivalente cuando haga falta.

`astro.config.mjs` usa `build.format: 'file'` para que las rutas se generen
como `portfolio.html` / `devlog.html` (no `/portfolio/index.html`), tal como
se pidió explícitamente.

## Stack técnico

Astro (sin framework de UI — componentes `.astro` + JS vanilla, coherente
con YAGNI y con que todo sea gratis), CSS con custom properties (sin
Tailwind — el sistema de `clip-path` angular y la retícula técnica son muy
a medida), Google Fonts vía `<link>`. Sin backend: sitio 100% estático.

## Despliegue

GitHub Actions (`.github/workflows/deploy.yml`) build + `actions/deploy-pages`
hacia el propio Pages de `KuxarStudio/web` (repo ya hecho público en esta
sesión, con consentimiento explícito del usuario, porque GitHub Pages
gratuito requiere repo público). URL resultante:
`https://kuxarstudio.github.io/web/` — un *preview* de trabajo, no el
dominio final. Llevar este contenido a la raíz `kuxarstudio.github.io`
(sustituyendo la web HTML actual en producción) o a un dominio propio es una
decisión posterior y deliberada que toca el sitio en producción — no se hace
en este plan sin aprobación explícita.

## Fuera de alcance (v2 / futuro, no bloquea esto)

- Traducción real ES/EN (rutas i18n + contenido duplicado).
- Press kit.
- Cutover del dominio de producción / dominio propio.
- Página de archivo para herramientas (cuando haya más de una).
- Páginas de detalle por proyecto (hoy el enlace de salida es suficiente).
