# Requisitos de seguridad

Qué tiene que cumplir todo lo que vive en este repo (web, workflows y
`tools/seo-agent`) y, en el último apartado, cualquier backend o app futura del
ecosistema Kuxar. Cada requisito tiene un id (`SR-xx`) al que remiten el
[modelo de amenazas](threat-model.md) y la [checklist](security-checklist.md).

"Debe" es obligatorio; "debería" es la opción por defecto salvo motivo anotado.

Documentos relacionados: [arquitectura](security-architecture.md) ·
[amenazas](threat-model.md) · [checklist](security-checklist.md).

## 1. Secretos y credenciales

- **SR-01** — Ningún secreto (API key, token, contraseña, JSON de cuenta de
  servicio, clave privada) debe entrar en el repo, en ninguna rama ni en el
  historial. Los secretos viven en *GitHub → Settings → Secrets and variables →
  Actions → Secrets*; en local, en `.env` (ignorado por git).
- **SR-02** — Las variables `PUBLIC_*` de Astro acaban en el HTML: se tratan
  como públicas. Debe ir en ellas solo lo que es público por diseño (ID de GA4,
  access key de Web3Forms). Nunca una clave de backend.
- **SR-03** — Si un secreto se filtra, primero se **revoca y se rota** en el
  proveedor, y después se limpia el repo. Borrarlo del historial no lo invalida.
- **SR-04** — Cada credencial con el mínimo permiso posible: `GITHUB_TOKEN` con
  permisos por job; la cuenta de servicio de Search Console solo con lectura; la
  clave de Resend solo para enviar desde `kuxarstudio.com`; la access key de
  Web3Forms limitada al dominio.

## 2. Identidad y acceso

- **SR-05** — Toda cuenta con capacidad de cambiar la web o sus datos debe tener
  2FA (passkey o app TOTP, no SMS): cuentas de GitHub con escritura en la org,
  registrador del dominio, Google Cloud / Search Console, Resend y Web3Forms.
- **SR-06** — Los commits se firman con el email noreply de GitHub
  (`262545842+KuxarStudio@users.noreply.github.com`). En el repo no debe haber
  datos personales: emails personales, teléfonos, nombres de personas físicas o
  direcciones (ver también `CLAUDE.md`).
- **SR-07** — `main` debe estar protegida: sin force-push, sin borrado, y los
  cambios entran por PR con el CI en verde.
- **SR-08** — Los agentes de IA con acceso de escritura trabajan en ramas y
  abren PR; no fusionan en `main` ni hacen force-push sin OK explícito de una
  persona.

## 3. Cadena de suministro

- **SR-09** — Los lockfiles (`web/package-lock.json`) se versionan y el CI
  instala con `npm ci`. Las dependencias de Python del agente SEO se mantienen
  mínimas y con rango acotado.
- **SR-10** — No se despliega con vulnerabilidades altas o críticas conocidas
  en `npm audit` o `pip-audit` que afecten al código publicado o a un workflow
  con secretos. Dependabot debe estar activo para avisar.
- **SR-11** — Workflows de GitHub Actions:
  - `permissions` mínimos por job (por defecto `contents: read`).
  - `actions/checkout` con `persist-credentials: false`.
  - Prohibido `pull_request_target` y `workflow_run` sobre código de forks.
  - Ningún dato controlado por terceros (títulos de PR, nombres de rama,
    cuerpos de issue) se interpola con `${{ }}` dentro de un `run:`; se pasa
    por `env:`.
  - Solo actions de organizaciones de confianza (`actions/*`). Las de terceros
    deberían ir fijadas por SHA.
- **SR-12** — Los PR de colaboradores externos necesitan aprobación manual
  antes de ejecutar workflows.

## 4. Web (cliente)

- **SR-13** — La web es estática: no debe haber servidor propio, sesiones ni
  base de datos en `web/`. Cualquier dato dinámico llega por servicios externos
  definidos en la [arquitectura](security-architecture.md).
- **SR-14** — `set:html` y `define:vars` solo con contenido del propio repo o
  variables controladas por el estudio. Nunca con datos de una API externa o de
  un usuario. Los datos de la API de GitHub (estrellas, último commit) se
  pintan como texto.
- **SR-15** — Scripts de terceros: solo GA4, y solo tras consentimiento
  explícito (banner de cookies). Fuentes autoalojadas. Cualquier script externo
  nuevo necesita una entrada en la arquitectura y en el modelo de amenazas.
- **SR-16** — HTTPS obligatorio ("Enforce HTTPS" activo en GitHub Pages). La web
  debería declarar una Content-Security-Policy por `<meta>` (GitHub Pages no
  permite cabeceras propias).
- **SR-17** — Los enlaces con `target="_blank"` llevan `rel="noopener"`.
- **SR-18** — El formulario de contacto pide solo nombre, email y mensaje;
  mantiene el honeypot anti-spam y no pide datos sensibles.
- **SR-19** — La web debe publicar `/.well-known/security.txt` con un contacto
  del estudio y fecha `Expires` vigente.

## 5. Privacidad y cumplimiento

- **SR-20** — Sin cookies ni analítica antes del consentimiento (RGPD/LSSI). La
  política de privacidad lista todos los encargados que tratan datos
  (Web3Forms, Google Analytics) y se actualiza al añadir uno.
- **SR-21** — Cuando la forma legal esté inscrita, el aviso legal debe incluir
  titular, NIF y dirección (LSSI).
- **SR-22** — Las páginas de privacidad y borrado de cuenta de las apps (Kaku!,
  BlindNote) deben seguir accesibles en la misma URL que figura en Google Play /
  App Store.

## 6. Dominio y correo

- **SR-23** — Dominio `kuxarstudio.com` con bloqueo de transferencia en el
  registrador, 2FA (SR-05) y DNSSEC si el registrador lo permite.
- **SR-24** — El dominio debe estar **verificado en la organización de GitHub**
  (*Org settings → Pages → Verified domains*), para que nadie pueda reclamarlo
  en otro repo. No se dejan registros DNS que apunten a servicios ya dados de
  baja.
- **SR-25** — Correo del dominio con SPF, DKIM (Resend) y una política DMARC
  publicada (`p=quarantine` como mínimo cuando se haya comprobado que los
  envíos legítimos pasan).

## 7. Backends y apps futuras del ecosistema

Para Parte (SaaS), los rankings de BlindNote o cualquier API propia:

- **SR-26** — Repo separado del de la web. La web solo consume la API pública.
- **SR-27** — Autenticación delegada en un proveedor (Firebase Auth, Supabase
  Auth o similar). No guardar contraseñas propias.
- **SR-28** — Autorización siempre en el servidor (o en reglas de seguridad de
  Firebase/Supabase), con **denegación por defecto**. El cliente no decide
  permisos.
- **SR-29** — Validación de entrada en el servidor, límite de peticiones en
  endpoints públicos y CORS restringido a los orígenes del estudio.
- **SR-30** — Cualquier clave embebida en una app móvil o en la web se considera
  pública: su seguridad depende de las reglas del servidor, no de esconderla.
- **SR-31** — Entornos de desarrollo y producción separados, con credenciales
  distintas. Logs sin datos personales.
- **SR-32** — Copias de seguridad de los datos de usuarios y procedimiento de
  borrado de cuenta (RGPD y requisito de las tiendas).
