# Modelo de amenazas

Qué puede salir mal, quién lo provocaría, por dónde entraría y cómo lo
frenamos. Cubre la web (`web/`), los workflows de GitHub Actions y el agente
SEO (`tools/seo-agent`). Revisar al añadir un servicio externo, un workflow o un
backend.

Última revisión: 2026-10-27. Requisitos citados como `SR-xx`
([requisitos](security-requirements.md)); estructura en la
[arquitectura](security-architecture.md).

## 1. Activos

| Activo | Por qué importa |
|---|---|
| Integridad de kuxarstudio.com | Es la cara del estudio; una web alterada puede servir malware o phishing a clientes |
| Cuentas de GitHub con escritura en la org | Quien las controle controla la web y todos los repos |
| Secretos de Actions (`GSC_SERVICE_ACCOUNT_JSON`, `GEMINI_API_KEY`, `RESEND_API_KEY`, `SEO_REPORT_TO`) | Dan acceso a datos de Search Console, a facturación de Google y a enviar correo como `kuxarstudio.com` |
| Dominio y DNS | Quien controle el DNS controla la web y el correo |
| Datos del formulario de contacto | Datos personales de quien escribe (nombre, email, mensaje) |
| Reputación del correo del dominio | Suplantación de `@kuxarstudio.com` en phishing |
| Datos personales del equipo | Emails personales, nombres (ver SR-06) |
| Páginas legales de las apps | Google Play / App Store las exigen; si caen, las fichas pueden retirarse |

## 2. Atacantes considerados

- **Oportunista automatizado**: bots que buscan secretos en repos públicos,
  spam en formularios, dominios caducados o mal configurados. Es el más
  probable.
- **Atacante de cadena de suministro**: un paquete npm/pip o una GitHub Action
  comprometidos.
- **Contribuidor malicioso**: alguien que abre un PR desde un fork.
- **Phisher**: roba credenciales de una cuenta del equipo.
- **Contenido malicioso dirigido a agentes de IA**: texto en una web, issue o
  archivo que intenta que un agente con permisos de escritura haga algo no
  pedido.

Fuera de alcance: ataques dirigidos de alto presupuesto y DDoS (lo absorbe la
CDN de GitHub Pages).

## 3. Fronteras de confianza

1. Internet → visitante: el navegador ejecuta lo que sirve GitHub Pages.
2. Visitante → Web3Forms / Google Analytics: datos que salen del navegador.
3. Fork / PR externo → GitHub Actions: código no confiable ejecutándose en CI.
4. Registros de paquetes (npm, PyPI) y Actions → build.
5. Workflow `seo-weekly` → Google, Gemini, Resend: el único punto con secretos.
6. Registrador / DNS → GitHub Pages y correo.

## 4. Amenazas

Probabilidad (P) e impacto (I): Alto / Medio / Bajo. Estado a 2026-10-27.

| # | Amenaza | Vector | P | I | Mitigación | Estado |
|---|---|---|---|---|---|---|
| T01 | Toma de una cuenta de GitHub del equipo | Phishing, contraseña reutilizada | M | A | 2FA con passkey (SR-05), protección de `main` (SR-07) | ⚠️ Sin verificar |
| T02 | Secreto filtrado en el repo | Commit accidental de `.env` o JSON | M | A | `.gitignore`, SR-01, secret scanning, rotación (SR-03) | ✅ Historial limpio (escaneo 2026-10-27); ⚠️ secret scanning sin verificar |
| T03 | Secreto filtrado por el CI | Un paso imprime una variable o sube un artefacto con ella | B | A | GitHub enmascara secretos en logs; los artefactos solo incluyen `out/` y `.visual-qa/` | ✅ |
| T04 | Dependencia npm comprometida | Paquete malicioso en el build | B | A | Lockfile + `npm ci` (SR-09), auditoría (SR-10), el build de la web no tiene secretos | ✅ `npm audit` = 0 |
| T05 | Dependencia pip comprometida en `seo-weekly` | El paquete corre con los 4 secretos cargados y `contents: write` | B | A | Solo 3 dependencias de primer nivel (google-auth, requests, PyYAML), rangos acotados, `pip-audit` | ✅ Mitigado; riesgo residual aceptado |
| T06 | GitHub Action comprometida o reetiquetada | `@v7` pasa a apuntar a código malicioso | B | A | Solo actions de `actions/*` (SR-11); fijar por SHA reduciría el riesgo | 🟡 Aceptado |
| T07 | PR malicioso desde un fork | Código del PR ejecutado en CI | B | M | `pull_request` corre sin secretos y con token de solo lectura; aprobación manual (SR-12) | ✅ / ⚠️ aprobación sin verificar |
| T08 | Inyección en workflows | Título de PR o nombre de rama interpolado en `run:` | B | A | SR-11; hoy solo se interpolan SHAs y valores booleanos de `workflow_dispatch` | ✅ |
| T09 | Secuestro del dominio | Toma de la cuenta del registrador, transferencia, o reclamar el dominio en otro repo de Pages | B | A | SR-23, SR-24 | ⚠️ Sin verificar |
| T10 | XSS en la web | HTML no confiable renderizado | B | M | Web estática sin entrada de usuario renderizada; `set:html` solo con contenido propio (SR-14) | ✅ |
| T11 | Script de terceros comprometido | GA4 tiene acceso completo a la página | B | M | Solo tras consentimiento (SR-15); CSP limitaría el daño (SR-16) | 🟡 CSP pendiente |
| T12 | Clickjacking | La web se incrusta en un iframe ajeno | B | B | No hay acciones sensibles en la web; GitHub Pages no permite `X-Frame-Options` | 🟡 Aceptado |
| T13 | Abuso del formulario | Spam, agotar la cuota de Web3Forms | A | B | Honeypot (SR-18), clave limitada al dominio (SR-04) | ⚠️ Restricción de dominio sin verificar |
| T14 | Suplantación del correo del dominio | Phishing desde `@kuxarstudio.com` | M | M | SPF + DKIM + DMARC (SR-25) | ⚠️ DMARC sin verificar |
| T15 | Exposición de datos personales del equipo | Emails personales en commits o en páginas | A | M | Commits con noreply (SR-06); historiales de `web`, `kuxarstudio.github.io` y `PDF-Blender` y páginas publicadas limpiados el 2026-10-27 | 🟡 Quedan las refs de PR cerrados (solo GitHub Support) |
| T16 | Fuga de información de negocio | Rama `seo-data` (métricas de Search Console), `CLAUDE.md`, `docs/` | A | B | Decisión consciente: el repo es público | 🟡 Aceptado |
| T17 | Agente de IA manipulado | Instrucciones ocultas en una web o archivo que el agente procesa | B | A | SR-08: ramas + PR + CI; ninguna fusión ni force-push sin OK humano | ✅ |
| T18 | Caída de las páginas legales de las apps | Cambio de URL al migrar la web | M | M | SR-22: no mover esas URLs sin redirección | ✅ / revisar en cada migración |
| T19 | Abuso de las claves del agente SEO | Uso de `GEMINI_API_KEY` con facturación activa | B | M | Clave restringida a la API de Gemini y alerta de presupuesto en Google Cloud | ⚠️ Sin verificar |

Leyenda: ✅ mitigado · 🟡 aceptado o parcial · ⚠️ pendiente de verificar o hacer.
La lista de acciones está en la [checklist](security-checklist.md).

## 5. Riesgos aceptados

- **T06** — Las actions de `actions/*` son de GitHub; fijar por SHA añade
  mantenimiento. Revisar si se añaden actions de terceros.
- **T12** — Sin login ni acciones en la web, el clickjacking no tiene impacto
  real.
- **T16** — Publicar el repo se decidió a sabiendas; si las métricas de
  `seo-data` llegan a ser sensibles, moverlas a un repo privado.
- **T05** — El agente SEO necesita secretos y dependencias externas; se limita
  el número de dependencias en vez de aislarlo más.

## 6. Cuando cambie el sistema

Revisar este documento cuando se añada: un servicio externo nuevo, un workflow
con secretos, un formulario o cualquier backend (Parte, rankings de BlindNote).
Un backend introduce amenazas nuevas (autenticación, autorización, inyección,
datos de usuarios) que se cubren con SR-26 a SR-32.
