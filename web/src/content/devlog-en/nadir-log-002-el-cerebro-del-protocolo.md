---
title: "Nadir: the brain behind the protocol"
date: 2026-03-13
project: "Nadir: Protocol 1-Star"
excerpt: "Data-driven architecture: the game is built from spreadsheets, with no data hardcoded."
---

We consolidated the **data-driven** architecture. On startup, the game reads
several `.csv` spreadsheets (weapons, enemies, heroes) and populates the world
dynamically, with no data hardcoded. The logic is centralized in
`Database.gd`, so balancing is done by editing data, not scripts.

The final **permadeath** system is also in place: when a hero falls, the engine
locates their resource file and physically deletes it from the device.
