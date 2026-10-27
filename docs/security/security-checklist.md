# Checklist de seguridad

Qué revisar antes de desplegar, cada cierto tiempo y si algo va mal. Cada punto
remite a su requisito (`SR-xx`, en [security-requirements.md](security-requirements.md)).

## 1. Antes de fusionar un PR

**Automático (el CI bloquea si falla):** type-check, tests, build, auditoría
SEO y QA de accesibilidad. Comprobar que el PR está en verde.

**Manual:**

- [ ] El diff no contiene secretos, `.env`, JSON de credenciales ni claves
  privadas. (SR-01)
- [ ] Ninguna variable `PUBLIC_*` nueva contiene algo que no deba ser público.
  (SR-02)
- [ ] No aparecen emails personales, teléfonos ni nombres de personas. (SR-06)
- [ ] Si se añade `set:html`, `define:vars` o `is:inline`, el contenido viene
  del repo y no de una API o de un usuario. (SR-14)
- [ ] Si se añade un script, una fuente o un servicio externo: queda anotado en
  la [arquitectura](security-architecture.md) y en la política de privacidad.
  (SR-15, SR-20)
- [ ] Si se tocan workflows: permisos mínimos, `persist-credentials: false`,
  sin `pull_request_target`, sin `${{ }}` de datos de terceros dentro de `run:`.
  (SR-11)
- [ ] Si cambian dependencias: el lockfile está actualizado y `npm audit` /
  `pip-audit` no muestran altas o críticas nuevas. (SR-09, SR-10)
- [ ] Si se mueven páginas: las URLs legales de Kaku! y BlindNote siguen
  funcionando. (SR-22)
- [ ] Enlaces nuevos con `target="_blank"` llevan `rel="noopener"`. (SR-17)

## 2. Después de desplegar

- [ ] El workflow "Deploy to GitHub Pages" terminó en verde.
- [ ] `https://kuxarstudio.com` carga por HTTPS y el formulario de contacto
  funciona.
- [ ] El banner de cookies aparece en una ventana privada y GA4 no se carga
  antes de aceptar. (SR-20)

## 3. Configuración única (estado a 2026-10-27)

Marcar cuando se haya comprobado. Lo que está sin marcar no se ha podido
verificar o está pendiente.

**GitHub**

- [ ] 2FA con passkey o app TOTP en todas las cuentas con escritura en
  `KuxarStudio`; en la org, *Settings → Authentication security → Require
  two-factor authentication*. (SR-05)
- [ ] *Settings → Emails*: "Keep my email addresses private" y "Block command
  line pushes that expose my email" en cada cuenta. (SR-06)
- [ ] Ruleset de `main`: sin force-push, sin borrado, PR obligatorio con el
  check de CI. (SR-07)
- [ ] *Settings → Code security*: secret scanning, push protection y
  Dependabot alerts activos. (SR-01, SR-10)
- [ ] *Settings → Actions → General*: aprobación obligatoria para workflows de
  colaboradores externos. (SR-12)
- [ ] *Settings → Actions → General → Workflow permissions*: "Read repository
  contents" por defecto. (SR-11)
- [x] Workflows con permisos mínimos y `persist-credentials: false`. (SR-11)
- [x] Historial sin secretos (escaneo del 2026-10-27). (SR-01)
- [x] Historial de `KuxarStudio/web` sin emails personales (2026-10-27). (SR-06)
- [x] `npm audit` y `pip-audit` sin vulnerabilidades (2026-10-27). (SR-10)

**Pages y dominio**

- [ ] `kuxarstudio.com` verificado en *Org settings → Pages → Verified
  domains*. (SR-24)
- [ ] "Enforce HTTPS" activo en *Settings → Pages*. (SR-16)
- [ ] Registrador: 2FA, bloqueo de transferencia y DNSSEC si está disponible.
  (SR-23)
- [ ] Ningún registro DNS apunta a un servicio dado de baja. (SR-24)
- [ ] SPF, DKIM y DMARC publicados para `kuxarstudio.com`. (SR-25)

**Servicios externos**

- [ ] Web3Forms: access key limitada al dominio `kuxarstudio.com`. (SR-04)
- [ ] Google Cloud: `GEMINI_API_KEY` restringida a la API de Gemini y alerta de
  presupuesto configurada. (SR-04)
- [ ] Cuenta de servicio de Search Console con permiso de solo lectura. (SR-04)
- [ ] Resend: clave con permiso solo de envío. (SR-04)

**Web**

- [ ] `/.well-known/security.txt` publicado con contacto y `Expires`. (SR-19)
- [ ] Content-Security-Policy por `<meta>`. (SR-16)
- [x] GA4 solo tras consentimiento; fuentes autoalojadas. (SR-15, SR-20)
- [x] Formulario con honeypot y sin datos sensibles. (SR-18)

**Otros repos del estudio**

- [x] `kuxarstudio.github.io`: email personal sustituido por
  `admin@kuxarstudio.com` en las páginas publicadas (privacidad, borrado de
  cuenta, `security.txt`) y eliminado del historial (2026-10-27). Mismas URLs
  para Google Play / App Store. (SR-06, SR-22)
- [x] `PDF-Blender`: historial y etiqueta `v1.0` sin el email personal; la
  release se publica desde el workflow `Build & release` (2026-10-27). (SR-06)
- [ ] Revisar con esta misma checklist cualquier repo que se haga público.

## 4. Revisión periódica

**Cada mes**

- [ ] Revisar y fusionar los PR de Dependabot.
- [ ] Revisar las alertas de secret scanning y Dependabot.
- [ ] Revisar el último informe semanal SEO por si hay URLs extrañas
  indexadas (señal de alteración).

**Cada trimestre**

- [ ] Revisar quién tiene acceso a la org de GitHub, al registrador y a los
  servicios externos. Quitar accesos que ya no hagan falta.
- [ ] Repasar el [modelo de amenazas](threat-model.md) y esta checklist.
- [ ] Comprobar que `security.txt` no ha caducado.

**Cada año**

- [ ] Rotar `GEMINI_API_KEY`, `RESEND_API_KEY` y la clave de la cuenta de
  servicio de Search Console.
- [ ] Confirmar la renovación del dominio.

## 5. Si algo va mal

**Se ha filtrado un secreto**

1. Revocarlo y crear uno nuevo en el proveedor, inmediatamente. (SR-03)
2. Actualizar el secreto en *Settings → Secrets and variables → Actions*.
3. Revisar en el proveedor si se ha usado (facturación de Google, envíos de
   Resend).
4. Después, limpiar el historial si hace falta.

**Una cuenta comprometida o la web alterada**

1. Cambiar la contraseña, revocar sesiones y tokens personales, y revisar las
   claves SSH y las apps OAuth autorizadas de la cuenta.
2. Revisar el historial de commits y los workflows por cambios no autorizados.
3. Volver a desplegar desde el último commit bueno (*Actions → Deploy to GitHub
   Pages → Run workflow*).
4. Si hay datos de visitantes afectados, valorar la notificación a la AEPD
   (plazo de 72 h según el RGPD).

**Alguien avisa de una vulnerabilidad**

Agradecer, confirmar recepción y corregir. El contacto público es el de
`security.txt` (SR-19).
