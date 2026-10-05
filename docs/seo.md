# SEO de kuxarstudio.com: qué hay montado y cómo se usa

Todo es gratuito y se ejecuta solo (CI), salvo los pasos manuales de abajo.

## Auditoría automática (`npm run audit`, en `web/`)

Lee el sitio ya construido (`web/dist`) y falla el CI si hay **errores**: enlaces rotos, enlaces a
redirecciones, páginas sin `<title>`/`<h1>`/`lang`/canonical, `<img>` sin `alt`, enlaces o botones
vacíos, campos sin `<label>`, títulos duplicados dentro de un idioma, o desvío respecto al mapa de
temas. Los **avisos** no fallan: título >60, descripción >160, salto de encabezados, anclas
genéricas, páginas a >3 clics de la portada, páginas huérfanas, pocos enlaces entrantes,
parámetros `?` en enlaces, "Kaku" sin "!".

- Código: `web/scripts/seo-audit/` (lógica en `lib.mjs`, probada en `web/tests/seo-audit.test.ts`).
- Se ejecuta en cada PR (`.github/workflows/ci.yml`) y antes de desplegar (`deploy.yml`).
- Salida en máquina: `npm run audit -- --json`. Avisos como fallo: `--strict`.

## Mapa de temas (`tools/seo-agent/topic-map.yaml`)

Una fila = un tema = una página en ES y EN. `status: live` obliga a que exista y salga en el sitemap;
`planned` es un hueco declarado. La auditoría imprime la **cobertura** (live / total) y marca las
guías que no están en el mapa (huérfanas de tema). Al publicar una guía nueva: añade su `key` aquí.

## Enlazado de guías

Cada guía muestra arriba un recuadro con el producto al que pertenece (campo `project`) y al final
un enlace a la siguiente guía del clúster (campo `order`). El orden de lectura sale de
`web/src/lib/guide-order.ts`.

## Identidad del estudio

`web/src/lib/entity.ts` guarda nombre, email y perfiles externos (`sameAs`). **Solo añade perfiles
que existan y enlacen de vuelta a kuxarstudio.com** (LinkedIn de empresa, YouTube, itch.io,
AlternativeTo…). La página `/estudio/` (`/en/studio/`) contiene la descripción en tres longitudes.

## IndexNow (Bing y compañía)

`web/public/<clave>.txt` es la clave pública de IndexNow. Tras cada despliegue,
`web/scripts/indexnow/run.mjs` envía las guías, entradas de devlog y páginas estáticas que
cambiaron en el push. Prueba local: `node web/scripts/indexnow/run.mjs --before <sha> --dry-run`.

### Pasos manuales (una sola vez)

1. Entra en https://www.bing.com/webmasters con tu cuenta y añade `kuxarstudio.com`.
2. Elige **Importar desde Google Search Console** (la propiedad de dominio ya está verificada) o
   verifica con un registro TXT/CNAME en Cloudflare.
3. Envía `https://kuxarstudio.com/sitemap-index.xml` en Bing Webmaster Tools.
4. Revisa en Bing el informe de oportunidades (equivalente al "striking distance" de Search Console).

## Hojas de trazos (activo compartible)

`/recursos/hojas-de-trazos/` y sus PDF (`web/public/recursos/`). Datos de KanjiVG (CC BY-SA 3.0):
**mantén la atribución**. Regenerar datos: `node scripts/kana/generate-data.mjs <clon-de-kanjivg>`;
regenerar PDF: `node scripts/kana/make-pdf.mjs` (necesita Chromium; usa `playwright-core`).

## Backlinks

Método, tracker (`docs/backlinks/backlinks.csv`), textos de perfiles y mensajes de outreach en `docs/backlinks/`. Filtro de 6 pasos: nada se contacta si no pasa los cinco primeros.

## Skills de Claude para SEO (`.claude/skills/`)

Siete skills de un solo propósito, que Claude Code carga solo al abrir el repo. Se encadenan
**auditar → planificar → escribir → medir** (la cadena del apunte "How to Use Claude for SEO"):

| Paso | Skill | Se usa sobre | Devuelve |
|---|---|---|---|
| 1 Audit | `kuxar-seo-audit-page` | una página | lista de prioridades (usa `npm run audit`) |
| 2 Audit | `kuxar-trust-check` | `/estudio/`, home, casos | puntuación E-E-A-T /16 + 3 mejoras |
| 3 Plan | `kuxar-competitor-gap` | un proyecto y 2 rivales | huecos de contenido priorizados |
| 4 Write | `kuxar-content-brief-draft` | cada hueco | brief + guía ES/EN + entrada en el topic-map |
| 5 Write | `kuxar-title-optimizer` | cada página nueva | title y description con longitudes |
| 6 Measure | `kuxar-striking-distance` | informe/CSV de GSC o Bing, mensual | consultas en posición 4–15 con un ajuste cada una |
| 7 Measure | `kuxar-information-gain` | páginas que rankean y no convierten | puntuación Único/Específico/Auténtico |

Cada skill lleva su formato de salida fijo y su sección "cuándo NO usarla". Para editarlas basta
cualquier editor de texto (son `SKILL.md` normales, versionadas en git). Complementan al agente
semanal (que mide) y a la auditoría de CI (que bloquea): las skills son el lado "trabajo con Claude".
