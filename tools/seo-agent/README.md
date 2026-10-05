# Agente SEO de Kuxar Studio

Informe semanal por correo para **toda la web y cada proyecto** (apps, juegos,
herramientas y los que vengan). Todo gratis salvo, opcionalmente, la búsqueda
con Google de Gemini (ver "Costes").

## Qué hace cada lunes

| Tarea del flujo | Qué hace el agente |
|---|---|
| 1. Conectar la web con la IA | Claude Code trabaja sobre este repo; el agente le dice qué tocar. |
| 2. Qué buscan los compradores | Lee tus consultas reales en Search Console y las búsquedas que hace la IA. |
| 3. Qué webs nombra la IA | Lanza tus preguntas de compra a Gemini con búsqueda de Google y apunta las fuentes citadas. |
| 4. Algo nuevo que compartir | Cada semana te propone un proyecto y un dato real que medir (no lo inventa). |
| 5. Escribir una página útil | Si la IA cita a otros y no a ti, lo convierte en un trabajo concreto. |
| 6. Arreglar páginas existentes | Detecta consultas en posición 8-20 y páginas sin impresiones. |
| 7. Pedir enlaces | El primer lunes de mes propone 3 sitios donde encajas de verdad. |
| 8. Revisión semanal | Este informe: resumen, comparativa y trabajos de la semana siguiente. |

## Añadir un proyecto

Edita `projects.yaml` y añade un bloque (prefijos de URL, páginas clave, preguntas de
compra por idioma). No hay que tocar código. Las páginas se reparten por el
**prefijo más largo**, así `/kaku/` es de Kaku! y `/` recoge el resto para el estudio.

## Secretos (GitHub → Settings → Secrets and variables → Actions)

| Secreto | Para qué |
|---|---|
| `GSC_SERVICE_ACCOUNT_JSON` | Cuenta de servicio con lectura en Search Console (propiedad `sc-domain:kuxarstudio.com`) |
| `GEMINI_API_KEY` | Citaciones de IA (la búsqueda con Google necesita facturación activa) |
| `RESEND_API_KEY` | Envío del correo (dominio `kuxarstudio.com` verificado en Resend) |
| `SEO_REPORT_TO` | Destinatario del informe. Sin él se usa `admin@kuxarstudio.com` |

## Ejecutar

- **En GitHub**: Actions → *SEO weekly report* → *Run workflow*. Por defecto es una
  **prueba**: genera el informe (lo descargas como artefacto `seo-report`) sin enviar
  correo ni guardar histórico. Desmarca "dry_run" para el envío real.
- **En local**: `pip install -r requirements-dev.txt`, exporta las variables y
  `python -m seo_agent run --dry-run`. Tests: `python -m pytest`.

## Histórico

Cada ejecución real guarda `snapshots/AAAA-MM-DD.json` en la rama **`seo-data`**
(no en `main`, para no redesplegar la web). El informe compara con el anterior.

## Costes

- Search Console, GitHub Actions y Resend (hasta 3.000 correos/mes): 0 €.
- Gemini: el nivel gratuito **no incluye** búsqueda con Google, y la facturación es de
  **prepago** (hay que cargar saldo; con saldo a 0 la API responde HTTP 402). El agente usa
  como mucho ~30 búsquedas por semana. Por eso el módulo está desactivado por defecto
  (`citations_enabled: false` en `projects.yaml`); actívalo cuando haya saldo y tráfico.
  Si falla, el informe lo avisa y lo demás funciona.

## Límites a tener en cuenta

- Search Console tarda 2-3 días en consolidar datos y oculta las consultas poco
  frecuentes; con una web nueva habrá semanas con pocos datos.
- Las citaciones de IA son una muestra pequeña y variable: sirven para ver tendencia,
  no para medir al milímetro.
- El agente propone trabajos; no publica nada ni contacta con nadie por su cuenta.

## Respaldo de la programación

GitHub puede retrasar o saltarse ejecuciones programadas. Además del lunes ~08:17 hay dos
respaldos (lunes 11:47 y martes 08:47, hora de Madrid en verano) que solo corren si la rama
`seo-data` aún no tiene un snapshot de esta semana, así que nunca se envían dos correos.
Las ejecuciones manuales (`workflow_dispatch`) no pasan por ese filtro.
