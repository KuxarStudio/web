# DESIGN.md — Kuxar Studio ("Vitrina")

Sistema de diseño de kuxarstudio.com y punto de partida para todo lo visual
del estudio. Va en la raíz del repo, en el formato DESIGN.md (nueve secciones),
para que cualquier agente o persona lo lea **antes** de generar o cambiar UI.

- **Fuente de verdad de los valores:** `web/src/styles/global.css`. Si este
  documento y el CSS no coinciden, manda el CSS: actualiza este archivo en el
  mismo PR.
- **Estado:** dirección "Vitrina", elegida el 2026-09-27. La sección "Dirección
  de diseño — EN EXPLORACIÓN" de `CLAUDE.md` ("Taller/Señal", crema, Space
  Grotesk) es histórica: no la uses.
- **Comprobación:** `npm run qa` (en `web/`) pasa axe-core (WCAG 2.2 AA) en
  todas las páginas, móvil y escritorio, claro y oscuro, y hace capturas. CI
  falla si hay errores serios.

---

## 1. Tema visual y atmósfera

Una **vitrina**: el marco del estudio es monocromo y sobrio, y el color lo
ponen los productos, mostrados con su interfaz real (capturas y vídeos dentro
de un marco de teléfono o de navegador). El estudio no tiene color de acento
propio: se descartó a propósito.

- Voz: calmada, técnica y concreta. En español, "nosotros" (somos 3
  desarrolladores). Nada de superlativos, urgencia falsa ni promesas no
  confirmadas (precios, plazos, garantías).
- "Muestra, no cuentes": un vídeo corto del producto vale más que un párrafo.
- Mobile-first estricto: se diseña a ~375px y se amplía.
- Modo claro = Vitrina. Modo oscuro = "Nocturno" (lienzo casi negro, paneles
  de producto teñidos), con la **misma** tipografía, formas y espaciado.

## 2. Paleta y papeles del color

Tokens en `:root` (claro) y `:root[data-theme="dark"]` (oscuro). Usa siempre
el token, nunca el hex suelto.

| Token | Claro | Oscuro | Papel |
|---|---|---|---|
| `--bg` | `#ffffff` | `#0c0d10` | Lienzo de la página |
| `--surface` | `#ffffff` | `#141519` | Superficie elevada |
| `--surface-2` | `#f3f3f1` | `#1b1d22` | Paneles, tarjetas, botón secundario |
| `--ink` | `#111111` | `#f2f2f3` | Texto principal, botón primario |
| `--ink-soft` | `#3f3f3c` | `#b7bac1` | Texto de apoyo, entradillas |
| `--ink-mute` | `#62625e` | `#8b8f98` | Meta, notas, flechas |
| `--line` | `#e4e4e0` | `rgba(255,255,255,.09)` | Bordes y separadores |
| `--accent` | `= --ink` | `= --ink` | Foco y enlaces activos (monocromo) |
| `--success` | `#0d684e` | `#7ee0a8` | Estado "Disponible", envío correcto |
| `--danger` | `#b3261e` | `#ff8a80` | Errores de formulario |
| `--parte` | `#b93d0b` | `#ff8f57` | **Solo** el wordmark y el bloque de Parte |

**Color de producto** (`data-product="…"` en el contenedor; da
`--product-bg` y `--product-ink`):

| Producto | Claro (bg / ink) | Oscuro (bg / ink) |
|---|---|---|
| `kaku` | `#f4e3dd` / `#8a2318` | `#2b1c1a` / `#ef8a7e` |
| `blindnote` | `#7fc782` / `#0f3a14` | `#16301b` / `#9ad99c` |
| `nadir` | `#16171b` / `#ffaa00` | `#221a07` / `#ffaa00` |

Reglas:
- Un producto nuevo = una línea `[data-product="slug"]` en claro y otra en
  oscuro, tomando los colores **de su interfaz real**.
- El color de producto nunca sale de su panel o figura. El marco del estudio
  sigue monocromo.
- Contraste mínimo 4.5:1 en texto normal (3:1 en texto grande y en iconos).
  Las mezclas (`color-mix`) también cuentan: compruébalas con `npm run qa`.

## 3. Tipografía

- **Una sola familia: Familjen Grotesk** (variable 400–700, autoalojada en
  `web/src/assets/fonts/`, subset latino, `font-display: swap` y precargada).
  Se eligió para no parecer "hecha por IA". **No** añadas Inter, Roboto, Arial,
  Space Grotesk ni otras de Google Fonts.
- Código y comandos: monoespaciada del sistema (`--font-mono`).
- Titulares (`h1–h3`): peso 700, `line-height` ~1–1.08, tracking negativo
  (−0.015 a −0.022em) y `text-wrap: balance`.
- Párrafos: `line-height` 1.55, `text-wrap: pretty`, ancho de lectura de
  60–72ch.

| Uso | Tamaño |
|---|---|
| Hero `h1` | `clamp(2.4rem, 10.5vw, 4.4rem)` |
| Cabecera de sección `h1/h2` | `clamp(2rem, 8vw, 3.2rem)` |
| Título de tarjeta | 1.2–1.35rem (destacada: 1.9rem) |
| Entradilla | 1.05–1.1rem, `--ink-soft` |
| Texto base | 1rem |
| Meta, etiquetas, estados | 0.78–0.92rem |

Tipografía fina: `…` y no `...`; comillas tipográficas (“ ” o « »); los
nombres de marca llevan `translate="no"` para que el traductor del navegador
no los destroce (Kuxar Studio, Kaku!, BlindNote, Nadir, Parte).

## 4. Componentes

Todos en `web/src/components/` y reutilizables (props + i18n, sin textos
fijos dentro).

- **Botones** (`.btn`): forma de píldora (`--r-sm`), alto mínimo 44px, peso
  600. Variantes: `.btn-primary` (tinta sobre lienzo), `.btn-secondary`
  (`--surface-2`, al pasar el ratón aparece un borde de tinta) y `.btn-parte`
  (solo en el contexto de Parte). Estados: hover visible, `:active` baja 1px y
  `[disabled]` con opacidad 0.6.
- **Enlace de acción** (`.text-link`): subrayado de 1.5px con color de línea,
  que pasa a tinta al pasar el ratón; alto mínimo 44px.
- **Puertas** (`.door`): dos rutas en el hero (productos / empresas), panel
  `--surface-2` con flecha que se desplaza 3px al pasar el ratón.
- **ProjectCard**: panel `--surface-2` con radio grande; medio (teléfono con
  captura/vídeo, o tile con progreso) + meta + título + estado + enlaces. La
  primera tarjeta es la destacada y ocupa toda la fila.
- **WorkCard / DeviceMock**: encargos de clientes con marco de navegador y
  teléfono. Los clientes van anónimos si así se pactó (GoCita).
- **ServiceCard**: servicios contratables, con el mismo lenguaje que
  ProjectCard. Sin precios ni plazos.
- **PhoneVideo**: vídeo mp4/webm en bucle, silenciado, dentro de `.phone`. Se
  reproduce solo cuando está en pantalla, tiene botón de pausa y, con
  `prefers-reduced-motion`, se queda en el póster.
- **Estado** (`.status`): píldora pequeña; `.status-disponible` en verde
  `--success`.
- **Parte** (`Parte.astro`): wordmark obligatorio cada vez que "Parte" es el
  producto.
- **Logo** (`Logo.astro`): K de tres piezas en `currentColor`; variante `icon`
  para favicon y avatar.
- **Formularios** (`ContactForm`): etiqueta visible siempre, `autocomplete`
  correcto, error junto al campo (`aria-invalid` + `aria-describedby`), foco
  en el primer error y estado de envío con `aria-live`.
- **FaqList**: lista abierta `<dl>` (sin acordeón, todo legible y rastreable)
  que genera su FAQPage con el mismo texto que se ve.
- **CookieBanner / StickyCta**: el CTA fijo es solo para móvil y se oculta con
  el banner abierto o el contacto a la vista.

## 5. Principios de maquetación

- Contenedor `.wrap`: máximo 1180px, con margen lateral `--gutter` (16 → 24
  → 32px).
- Puntos de corte, solo `min-width`: **560**, **768**, **900** (navegación de
  escritorio) y **1024px**. Los estilos base son los de móvil.
- Secciones: `.section` con padding vertical de 56/64px (88/96px desde 768px)
  y separador `--line` entre secciones seguidas. Cabecera de sección: `h2` +
  entradilla de 62ch como máximo.
- Rejillas con CSS Grid y Flex; nada de medir con JS.
- Sin scroll horizontal en ningún ancho (lo vigila `npm run qa`). Las tablas
  anchas van dentro de un contenedor desplazable y enfocable (`tabindex="0"`).
- La cabecera es fija; las anclas compensan con `scroll-padding-top`.

## 6. Profundidad y elevación

Plano casi siempre. La jerarquía se marca con superficie (`--surface-2`) y
radio, no con sombras.

- Radios: `--r-lg` 22px (paneles/tarjetas), `--r-md` 16px (bloques medios),
  `--r-sm` píldora (botones, estados). Marco de teléfono 22px (14px en
  tarjetas).
- `--shadow`: solo para lo que flota (menú desplegable, banner) y para los
  marcos de dispositivo.
- Cabecera: lienzo al 92% con `backdrop-filter: blur(8px)` y una línea
  inferior.

## 7. Qué hacer y qué no

**Sí**
- Mostrar el producto real (captura o vídeo) antes que describirlo.
- Usar tokens y componentes existentes; si falta algo, crear un componente
  nuevo y documentarlo aquí.
- Escribir cada texto en ES y EN (`web/src/i18n/`) y respetar las rutas
  localizadas.
- Foco visible en todo lo interactivo (`:focus-visible`, contorno de 2px).
- Respetar `prefers-reduced-motion` y animar solo `transform`/`opacity`,
  listando las propiedades de `transition` (nunca `all`).
- Dar a cada `<img>` `width`/`height`, `alt`, y `loading="lazy"` si está
  fuera de la primera pantalla.
- Pasar `npm run qa` y `npm run audit` antes de abrir un PR.

**No**
- Añadir un color de acento del estudio, degradados de fondo,
  glassmorphism, neón ni "dark tech" genérico.
- Meter cajas dentro de cajas, ni etiquetas o insignias decorativas sin
  función.
- Escribir textos de relleno ("soluciones innovadoras", "de vanguardia"),
  inventar testimonios, cifras o promesas comerciales.
- Usar GIF (va vídeo mp4/webm con póster).
- Usar `user-scalable=no`, `outline: none` sin sustituto, ni `<div>` con
  clic.
- Usar el color de Parte fuera de Parte, o escribir "Parte" sin su
  componente.
- Poner fotos ni nombres de personas.

## 8. Comportamiento responsive

- Diseño base: 375–390px. Comprobado en 390px y 1440px por `npm run qa`.
- Zonas táctiles de al menos 44×44px (`--tap`); `touch-action: manipulation`
  en enlaces y botones.
- Navegación: bajo 900px, botón "Menú" con panel desplegable (se cierra con
  Escape, al tocar fuera o al elegir enlace); desde 900px, en línea con el CTA
  "Escríbenos" en píldora. Sin JS, el menú se muestra siempre.
- Hero: una columna en móvil (texto → puertas → figuras de producto); dos
  columnas (1.15fr / 0.85fr) desde 1024px.
- Proyectos: una columna en móvil; dos desde 768px, con la destacada a lo
  ancho.
- CTA fijo inferior solo en móvil, respetando `env(safe-area-inset-bottom)`.
- Tema: sigue al sistema por defecto, con selector manual guardado en
  `localStorage` (`kuxar-theme`). `<meta name="theme-color">` sigue al tema
  elegido.

## 9. Guía para agentes (prompt)

Al generar o cambiar UI de Kuxar Studio:

1. Lee este archivo y `web/src/styles/global.css`. Reutiliza los componentes
   de `web/src/components/` antes de crear nada.
2. Estética Vitrina: marco monocromo; el color solo dentro de los paneles de
   producto (`data-product`). Familjen Grotesk, peso 700 en titulares. Botones
   en píldora y paneles con radio de 22px.
3. Primero móvil, y textos en ES y EN.
4. Antes de dar nada por terminado: `npm run build && npm run audit && npm run qa`,
   y revisa las capturas de `web/.visual-qa/shots/`.
5. Para un cliente de diseño web, crea un DESIGN.md propio del cliente con
   esta misma estructura de 9 secciones. No reutilices la identidad de Kuxar.

Skills instaladas que encajan (ver `skills-lock.json`):
`web-design-guidelines` para auditar código, `redesign-existing-projects` para
revisar sin romper lo que funciona y `design-taste-frontend` como filtro
anti-plantilla. Si chocan con este documento, manda este documento.
