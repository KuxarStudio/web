---
title: "Nadir: el cerebro detrás del protocolo"
date: 2026-03-13
project: "Nadir: Protocol 1-Star"
excerpt: "Arquitectura data-driven: el juego se construye a partir de hojas de cálculo, sin datos fijados en el código."
---

Consolidamos la arquitectura **data-driven**. Al arrancar, el juego interpreta
varias hojas de cálculo `.csv` (armas, enemigos, héroes) y puebla el mundo de
forma dinámica, sin datos fijados en el código. La lógica está centralizada en
`Database.gd`, así que el balanceo se ajusta editando datos, no scripts.

También queda establecida la **muerte permanente** definitiva: cuando un héroe
cae, el motor localiza su archivo de recurso y lo elimina físicamente del
dispositivo.
