---
name: kuxar-purple-cow
description: Cuando haya que decidir qué hace distinto a un producto de Kuxar Studio (software a medida, Kaku!, Parte...) antes de reescribir títulos, home o fichas, usa esto para encontrar un diferenciador verdadero y un movimiento concreto con el que hacerlo visible.
---

# Vaca púrpura (paso 0 · POSITION)

Marco: *La vaca púrpura* de Seth Godin. En un campo de vacas marrones nadie nota otra vaca
marrón; ser "bueno y seguro" equivale a ser invisible. Lo remarcable casi siempre ya es
verdad del producto y se ha rebajado por parecer arriesgado, de nicho o poco "profesional".
Esta skill **encuentra** lo que ya existe; no inventa un posicionamiento.

Es posicionamiento, no una táctica de SEO. Ayuda de forma indirecta (búsquedas de marca,
citas de IA, information gain) y sus efectos tardan meses en verse.

## Fase 0 · Entradas (obligatoria; si falta algo, pregunta antes de concluir)

Lee primero, sin pedir nada a Iñigo: `tools/seo-agent/projects.yaml` (competidores, preguntas,
`evidence_prompt`, `differentiator` si ya existe), `web/src/lib/entity.ts`,
`tools/seo-agent/topic-map.yaml`, la ficha del producto en `web/src/content/` y los textos de
la web (`web/src/i18n/`). Los competidores salen de `competitors` o, si no hay, se piden.

Lo que NO está en el repo y hay que preguntar a Iñigo, de una vez y con estas palabras:

1. ¿Por qué te eligen (o te elegirían) a ti y no a otro? Lo que dicen los clientes o usuarios,
   en sus palabras, aunque sea de viva voz.
2. ¿Qué haces distinto y sueles callar porque suena poco profesional, demasiado de nicho o
   arriesgado?
3. ¿Falta algún competidor real de este producto?
4. ¿Se mantiene la regla de que la web no nombra personas? (Puede condicionar el diferenciador.)

Si Iñigo no tiene respuestas a 1 y 2, **la skill se detiene**: sin esa materia solo produciría
algo genérico que suena bien. Dilo claramente y propón esperar al dato real (p. ej. el
resultado medido de GoCita).

## Flujo (4 pasos)

1. **Punto de mezcla.** Compara cómo se describe el producto en la web (home, ficha, `title`,
   `description`) con cómo se describen los competidores. Señala el lugar concreto donde suena
   igual, no el negocio entero. Distingue lo que Iñigo cree que lo diferencia de lo que
   realmente aparece escrito.
2. **Lo que se rebaja.** Algo ya cierto y específico (nada como "mejor servicio"). Separa
   *mejor* de *distinto*: mejorar una promesa común no es un diferenciador. Si no hay
   evidencia en el repo ni en las respuestas de Iñigo, pregunta; no rellenes.
3. **Movimiento.** UNA acción concreta que una persona pueda hacer esta semana, sin
   presupuesto ni rediseño de marca, que haga el diferenciador **visible**, no solo afirmado.
   Nombra el riesgo real de liderar con ello.
4. **Prueba.** Define qué señal indicaría éxito y repite el movimiento unas 10 veces antes de
   juzgarlo. Un movimiento suelto no es una vaca púrpura; un patrón que otros pueden señalar sí.

## Formato de salida (fijo, por producto)

```
Producto: <id del proyecto en projects.yaml>
Punto de mezcla: <dónde suena igual que los rivales> → evidencia: <texto/URL del repo>
Lenguaje intercambiable: <palabras o promesas que comparte con rivales>
Lo que se rebaja: <cosa concreta> → fuente: <repo | respuesta de Iñigo>
Distinto vs mejor: <confirmación de que es distinto, no solo mejor>
Si lideras con ello: <ventaja realista> · <riesgo realista>
Movimiento: <acción concreta, una persona, sin presupuesto>
Dónde aparece primero: <mensaje | oferta | cómo se abre la conversación>
Deja de hacer: <lo que hoy lo entierra>
Señal de éxito: <boca a boca espontáneo en este negocio concreto> · revisar tras ~10 repeticiones
Para kuxar-title-optimizer: <una línea con el diferenciador, lista para el title/description>
Propuesta para projects.yaml: differentiator: "<frase corta>"  (solo si Iñigo la aprueba)
```

## Reglas

- Todo lo afirmado es verdad del producto hoy y tiene fuente (repo o respuesta explícita de
  Iñigo). Marca como "no verificado" lo que no la tenga.
- **Nunca inventes** reseñas, clientes, cifras, precios, plazos ni garantías. Las únicas
  promesas comerciales confirmadas están en `CLAUDE.md` (en proyectos a medida el código es del
  cliente al terminar; Parte será suscripción mensual). No añadas más.
- Marca: "Kuxar Studio" y "Kaku!" (con exclamación). La web habla en "nosotros" (3
  desarrolladores independientes) y no nombra personas ni forma legal salvo decisión nueva.
- No escribas en `projects.yaml` ni en la web por tu cuenta: propone el texto y espera el OK.
- Aplica el cambio a la web solo tras una primera ronda de uso real del movimiento.
- Una vaca púrpura por producto; no fuerces un único diferenciador para todo el estudio.
- Para medir: búsquedas de marca en Search Console, citas del agente de Gemini y menciones
  o respuestas reales. Con poco tráfico serán legibles en meses; dilo.

## Orden recomendado

1. `studio` (software a medida): un solo caso entregado, rivales claros y página comercial
   aún en diseño, así que cambiar el enfoque cuesta poco.
2. Kaku!: más rivales y más ruido; se hace después, con lo aprendido.

## Cuándo NO usarla

- Sin respuestas reales de Iñigo a la Fase 0 (se detiene y las pide).
- Para elegir una táctica SEO concreta (usa `kuxar-striking-distance`, `kuxar-competitor-gap`).
- Para medir si una página aporta algo nuevo (usa `kuxar-information-gain`).
- Para productos sin competidores reconocibles o sin página (PDF-Blender, Nadir y BlindNote
  quedan fuera por ahora).
