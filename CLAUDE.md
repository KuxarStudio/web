# Kuxar Studio — contexto del proyecto (leer antes de tocar nada)

Este repo/carpeta es la base de **todo el ecosistema Kuxar Studio** (estudio
independiente de software: juegos, apps de aprendizaje, herramientas/programas).
Este `CLAUDE.md` resume las decisiones ya tomadas en una sesión previa de Claude
(Cowork) para que una nueva sesión de Claude Code arranque con contexto completo,
sin repetir preguntas ya respondidas.

## Estructura de carpetas

- `web/` → la web principal del estudio (Fase 1, lo que estamos construyendo ahora).
  Todos los recursos de la web (código, assets, config) van aquí dentro, no en la raíz.
- Carpetas futuras (Fase 2, aún no creadas): `games/` (Godot/GDScript), `apps/`
  (Android/Flutter), `tools/` (Python), quizá `docs/` para specs compartidas.
  No las crees todavía a menos que se pida explícitamente — de momento solo `web/`.

## Fase 1 — la web (`web/`)

**Objetivo real detrás de la web:** el usuario necesita un dominio propio
verificado para poder crear una organización de Google Cloud.
⚠️ Aviso técnico importante: la verificación de dominio para una Google Cloud
Identity/Org normalmente se hace por **registro TXT en el DNS del dominio**
(en el registrador), no solo con el método de archivo HTML de Search Console.
Cuando se compre el dominio, confirmar el método exacto en la consola de Google
Cloud antes de dar por hecho que basta con subir un archivo.

**Stack decidido:** Astro + GitHub Pages. Motivos: gratis, muy rápido (estático),
soporta dominio propio con un CNAME simple, encaja con el flujo ya centrado en
GitHub del usuario, y es fácil de escalar a Fase 2 sin tirar nada. Todo debe ser
gratis o lo más barato posible (instrucción explícita del usuario/proyecto).

**Dominio:** aún no comprado. El usuario decidirá registrador (Cloudflare,
Namecheap, Porkbun...) más adelante.

**Repo de GitHub existente (real, actual, en producción):**
`https://github.com/KuxarStudio/kuxarstudio.github.io` (sirve
`https://kuxarstudio.github.io/`). Es HTML plano, sin build step. Esta web
NUEVA lo sustituirá. **Ojo:** el usuario pidió explícitamente NO tomar el
diseño visual actual como referencia — quiere libertad creativa total para la
nueva web. Sí es útil como fuente de contenido/copy real (ver más abajo).

**Secciones que debe tener la web (pedidas por el usuario):**
1. Portfolio de proyectos (idealmente sincronizable con la API de GitHub)
2. Devlog / blog
3. Hub de herramientas
4. Sobre mí / el estudio + Contacto

**Dirección de diseño — EN EXPLORACIÓN, nada cerrado todavía.** El usuario NO
ha elegido una dirección final. Lo único pasado hasta ahora: se exploraron 3
direcciones distintas en un canvas de diseño (Artifact:
`https://claude.ai/code/artifact/d8f42abd-2a6e-46f4-8273-3b1ef3a75e7a`, puede
que ya no esté disponible desde esta sesión pero el usuario tiene el enlace),
y al usuario le gustó el TONO de una ("Taller": voz calmada y técnica de
estudio, precisión de "planos") combinado con la ESTÉTICA de otra ("Señal":
color por categoría, cortes angulares, tipografía bold). Esa combinación es
el candidato líder actual, publicado como boceto en el canvas — pero es punto
de partida para seguir iterando, NO la decisión final. Sigue pidiendo
feedback visual antes de dar nada por cerrado. El boceto actual, tal cual
está:

- **Tono (de la dirección "Taller"):** voz calmada y técnica de estudio/taller,
  precisión de "planos" — no grita, transmite oficio. Un panel tipo "ficha
  técnica" que desglosa el stack (Godot/GDScript para juegos complejos ·
  Flutter/Dart para apps y juegos simples · Python para herramientas).
  Fondo papel/crema con retícula sutil tipo cuadrícula técnica.
- **Estética visual (de la dirección "Señal"):** sistema de **color por
  categoría** — Juego = violeta `#6a4cff`, Aprendizaje = teal `#17b890`,
  Herramienta = ámbar `#f2a93b` — aplicado como franja superior de color en
  cada tarjeta de proyecto y en una leyenda visible. Bordes gruesos (2px,
  `#1c2733`), esquinas cortadas en diagonal (`clip-path` angular, no
  redondeadas), tipografía bold para titulares.
- **Paleta base:** fondo `#f2ede1` (papel/crema), texto principal `#1c2733`
  (tinta/navy oscuro), texto secundario `#3d4b59` / `#5b6b7d`, acento azul
  `#2f5fb0` para links y detalles técnicos, más los tres colores de categoría
  de arriba.
- **Tipografía:** 'Space Grotesk' (bold, para titulares/display) + 'IBM Plex
  Mono' (para labels técnicos, meta info, botones) vía Google Fonts. Evitar
  Inter/Roboto/Arial/Fraunces (defaults genéricos de IA).
- **Esto NO es definitivo.** Es un boceto de partida en pleno A/B testing.
  El usuario puede pedir cambios de color, tipografía, densidad, tono, o
  incluso descartarlo por completo y explorar una dirección nueva. No lo
  trates como decidido en ningún momento hasta que él lo confirme
  explícitamente.

**Contenido real a usar (verificado desde GitHub, NO inventar datos nuevos):**

⚠️ **Corrección del usuario (2026-09-03):** el stack por proyecto de más abajo
ya estaba MAL en una nota de sesión anterior (asumía Kotlin/Godot de forma
genérica). El criterio real: Godot solo para juegos complejos (Nadir);
Flutter/Dart para apps y juegos más simples (Kaku!, BlindNote). No asumas un
stack único para todo el estudio — pregunta si no está confirmado aquí.

- **Nadir: Protocol 1-Star** — Juego · En desarrollo · Godot/GDScript (juego
  complejo, de ahí Godot). "Un misterio para móvil construido en Godot,
  diseñado para pantalla táctil."
- **Kaku!** — App de aprendizaje · **Flutter/Dart** (NO Android/Kotlin nativo).
  "Hiragana, katakana y kanji con reconocimiento de trazos en tiempo real."
- **BlindNote** — Juego · Próximamente · **Flutter/Dart** (NO Godot — hecho con
  Visual Studio). "Adivina canciones de oído, compite en rankings globales."
- **PDF-Blender** — Herramienta · Python. "Fusiona, divide, desprotege y
  compara PDFs corporativos. 100% offline." (ya tiene repo propio en GitHub).
- Stack general del estudio (corregido): Godot/GDScript solo para juegos
  complejos, Flutter/Dart para apps y juegos más simples, Python para
  herramientas, Git/GitHub para todo. El backend de BlindNote (rankings
  globales) probablemente necesita algo tipo Firebase, pero no está
  confirmado — no lo des por hecho sin preguntar.
- Contacto: **`admin@kuxarstudio.com`** (confirmado por el usuario 2026-09-27;
  sustituye a jack.projekts@gmail.com en la web). La web NO menciona
  ubicación ("España", "en remoto"): el usuario pidió quitarlo (2026-09-27).

**Decisiones confirmadas (2026-09-27, rediseño de la home):**
- La home es del ESTUDIO, no de Parte. Parte (SaaS de presupuestos para
  fontanería/reformas) tiene página propia `/parte/` y un bloque en la home
  ("Para empresas"); nunca en el `<title>` de la home ni en el hero.
- "Parte" como producto se escribe SIEMPRE con el componente
  `web/src/components/Parte.astro` (wordmark con marca y color `--parte`),
  para no confundirlo con la palabra común. No empezar frases con el verbo
  "parte" cerca del producto. No tocar el uso común (p. ej. terminos.astro).
- Voz del estudio: "nosotros". Son **3 desarrolladores independientes**. La
  web no nombra a personas ni menciona el proceso de alta/forma legal (el
  usuario pidió quitarlo). Nada de "Iñigo, persona física" en textos legales.
  Recordar al usuario que la LSSI/RGPD exigen publicar titular con NIF y
  dirección cuando la forma legal esté inscrita.
- Devlog: solo entradas reales. Las de Kaku! y BlindNote se retiraron por
  inventadas (2026-09-27); no crear entradas sin material del usuario.
- BlindNote: juego de adivinar canciones (artista, título, año), por turnos
  con amigos + rankings globales (confirmado).
- Parte está **en diseño** (sin capturas ni prototipo): CTA "Pedir acceso"
  (acceso anticipado), nunca "Probar".
- Kaku! y BlindNote van siempre separados visualmente (cada uno su figura).
- Nadir es un **RPG táctico de supervivencia** para móvil (no un "misterio");
  fuente: su devlog real en kuxarstudio.github.io/nadir/, ya portado a
  `web/src/content/devlog/nadir-log-00*.md`.
- Medios reales en `web/public/media/` (vídeo en bucle de Kaku!, capturas de
  BlindNote). Vídeo mp4/webm en vez de GIF. Nadir sin captura hasta tener arte.
- **Dirección visual elegida (2026-09-27): "Vitrina"** en modo claro (marco
  monocromo, el color lo ponen los productos con paneles de su interfaz
  real, esquinas redondeadas, botones píldora). Modo oscuro = paleta
  "Nocturno" (lienzo #0c0d10, paneles teñidos) con la MISMA tipografía y
  formas. Sin acento de estudio (se descartó el lima). Tokens en
  `web/src/styles/global.css`.
- Tipografía: **Familjen Grotesk** (elegida por el usuario 2026-09-27), una
  sola familia autoalojada. Motivo: evitar fuentes que "parecen hechas por IA".
- Logo (propuesta aplicada, pendiente de OK final): K de tres piezas
  (`web/src/components/Logo.astro`, variante "icon" para favicon/avatar).
- Referencias B2B aportadas por el usuario: sonkeit.com, vertixsolutions.es,
  arttalo-tech.com (competencia en software a medida). Tomar patrones de
  conversión (CTA en cabecera, promesas comerciales, FAQ), no su estética.
  No inventar promesas comerciales (precios, plazos, garantías).
- Promesas comerciales CONFIRMADAS: en proyectos a medida el código es del
  cliente al terminar; Parte será suscripción mensual. Nada más confirmado.
- WhatsApp: el usuario no quiere publicar su móvil personal. Idea futura:
  número dedicado con respuesta automática. Aviso dado: el AI Act (art. 50,
  aplicable desde 2026-08-02) obliga a indicar que es un sistema automático;
  no diseñarlo para ocultar que es un bot.
- Org de GitHub: `https://github.com/KuxarStudio` (7 repos públicos a fecha de
  esta nota; revisar de nuevo si hace falta la lista actualizada).

**Pendiente / siguiente paso lógico:** montar el proyecto Astro dentro de
`web/`, con content collections para proyectos y devlog (fácil de ampliar),
componentes reutilizables (Header, Footer, ProjectCard, DevlogCard, ToolCard),
aplicar la dirección de diseño de arriba, y un workflow de GitHub Actions para
desplegar a GitHub Pages. El repo de GitHub Pages real puede seguir viviendo en
`KuxarStudio/kuxarstudio.github.io` — el contenido de `web/` es el origen, el
deploy publica a la rama/salida que GitHub Pages sirve.

## Reglas generales del ecosistema (aplican a todo, no solo a la web)

- Modularidad absoluta: código desacoplado y reutilizable, pensado como
  componentes.
- Diseñar pensando en conectores/APIs futuras (backends propios del estudio).
- Código listo para producción: manejo de errores, buenas prácticas de
  seguridad, dividir en pasos si es muy largo.
- Priorizar siempre lo gratuito; si es imposible, la opción más barata pero
  lógica y eficiente.
- Advertir de inmediato si una decisión de la web puede limitar la
  escalabilidad futura (apps, juegos, automatizaciones) del ecosistema.

## Estudios de referencia (investigación aportada por el usuario)

Referencias de estudios de software/juegos independientes, para inspirar tono
y estructura — no para copiar estética 1:1. El usuario todavía NO ha elegido
una dirección de diseño definitiva (ver aviso más arriba); esto es material
de referencia para seguir explorando, no una decisión tomada:

| Estudio | Enfoque | Estilo visual | Estrategia |
|---|---|---|---|
| Supergiant Games | Videojuegos (Hades, Bastion) | Fantasía oscura, ilustración inmersiva | Catálogo visual con CTA por plataforma |
| Panic Inc. | Software macOS y Playdate | Retro-tech, vectores coloridos | Segmentación estricta herramientas vs. videojuegos |
| ustwo games | Juegos móviles (Monument Valley) | Minimalismo de agencia UX/UI | Equilibrio entre portfolio de producto y cultura de empresa |
| Raycast | Herramientas de productividad | Dark mode técnico, precisión de SO | Grabaciones de pantalla reales, tipografía para power users |

**Principio general:** equilibrar exhibición visual con fluidez técnica — la
web debe transmitir identidad de estudio y a la vez llevar rápido al usuario
a descargas/repos.

**Tres estéticas dominantes en el sector** (Kuxar no encaja 100% en ninguna,
porque hace juegos + apps de aprendizaje + herramientas a la vez — el boceto
líder actual mezcla precisión técnica de "Dark Tech" con la categorización
visual de un catálogo, sin caer en dark-mode-neón genérico, pero esto sigue
siendo una hipótesis a validar con el usuario, no un veredicto cerrado):
1. *Dark Tech / Developer-Centric*: fondos oscuros, acentos neón/verde
   terminal, tipografía monoespaciada. Encaja con perfiles muy técnicos.
2. *Lúdica e Inmersiva (Indie Studio)*: lienzo minimalista donde el arte del
   juego es protagonista — banners a pantalla completa, GIFs de gameplay.
3. *Minimalismo Funcional (App Studio)*: fondos limpios, sans-serif moderna,
   márgenes amplios — transmite usabilidad/claridad, típico de apps utilitarias.

**Apartados que la web debería cubrir (a incorporar en `web/`, además de lo ya
pactado):**
- **Hero**: propuesta de valor en una frase + recurso visual del mejor
  proyecto + CTA directo (Google Play / App Store / Steam / repo, según el
  proyecto).
- **Proyectos / Portfolio**: grid/tarjetas. Para apps → mockups de teléfono
  con la interfaz. Para juegos → vídeo/GIF corto en loop de la mecánica
  principal, no solo texto.
- **Sobre el estudio / manifiesto**: quién hay detrás, filosofía, stack
  (Godot/GDScript para juegos complejos, Flutter/Dart para apps y juegos
  simples, Python para herramientas) — humaniza la marca. **Ya identificado
  como hueco real en la v1 (el usuario preguntó por esto explícitamente,
  2026-09-03): hoy no hay ninguna sección que diga quién hay detrás del
  estudio, ni una página "sobre mí" — solo la frase del manifiesto en el
  hero/footer.**
- **Press kit**: sección o subpágina con logos en alta resolución, capturas,
  descripciones cortas y contacto, para prensa/creadores de contenido.
  → **Nuevo apartado a valorar con el usuario**, no estaba en la lista
  original de secciones pedidas; confirmar si lo quiere para v1 o más
  adelante.
- **Footer de ecosistema**: enlaces directos a GitHub, perfiles en tiendas de
  apps (Google Play/App Store cuando existan) y redes sociales.

**Consejos de arquitectura/rendimiento a aplicar:**
- "Muestra, no cuentes": preferir un GIF corto (p.ej. reconocimiento de
  trazos de Kaku!, combate de Nadir) antes que párrafos largos explicando la
  mecánica.
- Infraestructura ligera: sitio estático (confirma la elección ya hecha de
  Astro + GitHub Pages — carga casi instantánea, cero mantenimiento de
  servidor).
- **Mobile-first estricto**: si el objetivo es que la gente descargue apps
  móviles, la mayoría del tráfico será desde el móvil — los CTA de descarga y
  cualquier vídeo/GIF deben verse perfectos en pantalla pequeña. Diseñar y
  probar primero en mobile, no como algo secundario.
