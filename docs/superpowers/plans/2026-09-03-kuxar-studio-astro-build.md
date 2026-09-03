# Kuxar Studio — Astro Build Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the real Astro site for Kuxar Studio in `web/`, implementing the "Taller Dinámico" design, content collections for projects/tools/devlog, live GitHub stats at build time, dark mode, and a GitHub Actions deploy to GitHub Pages.

**Architecture:** Static Astro site (no UI framework, no backend). Content lives in Astro content collections (markdown + Zod schema). Design system is plain CSS custom properties (light/dark via `[data-theme]`). One build-time utility (`src/lib/github.ts`) calls the GitHub REST API to enrich public-repo project cards with live stars/last-commit data; everything else is static at build time. Deploy via GitHub Actions to the repo's own GitHub Pages.

**Tech Stack:** Astro (`^5.0.0`), vanilla CSS, vanilla JS (no client framework), Vitest (dev-only, for the one pure-logic module), Google Fonts (Space Grotesk, JetBrains Mono), GitHub Actions + `actions/deploy-pages`.

**Spec:** `docs/superpowers/specs/2026-09-03-kuxar-studio-web-design.md`

## Global Constraints

- All internal links must be built from `import.meta.env.BASE_URL`, never hardcoded as `/...` — `astro.config.mjs` sets `base: '/web'` for this interim deploy, and a hardcoded absolute path would 404 under that base.
- `build.format: 'file'` in `astro.config.mjs` — routes must emit as `name.html`, not `name/index.html`, because the spec explicitly calls for `/portfolio.html` and `/devlog.html`.
- `githubRepo` (and any GitHub API call) is only ever set for **public** repos. Today that's only `KuxarStudio/PDF-Blender` — see spec's repo-visibility table. Never add `githubRepo` for Nadir, Kaku!, or BlindNote without the user explicitly making those repos public first.
- No "España" / "Madrid" / any specific place name anywhere in rendered content — use "Internet-based" (already the case in the design tokens carried over from the spec).
- Everything must run on free tiers: Astro static build, GitHub Actions free minutes, GitHub Pages on a public repo, Google Fonts. No paid service anywhere.
- Category accent colors (`--juego`, `--aprendizaje`, `--herramienta`) and `--on-accent` / `--term-bg` are identical in light and dark mode — never redefine them inside `[data-theme="dark"]`.
- `getRepoStats()` must never throw — any failure (network, 404, rate limit) returns `null` and the caller degrades gracefully (card just omits the stats badge). The build must never fail because GitHub's API had a bad moment.

---

### Task 1: Scaffold the Astro project

**Files:**
- Create: `web/package.json`
- Create: `web/astro.config.mjs`
- Create: `web/tsconfig.json`
- Create: `web/public/favicon.svg`
- Create: `web/src/pages/index.astro`

**Interfaces:**
- Produces: a buildable Astro project at `web/` with `npm run build` emitting `web/dist/index.html`. Every later task builds on this.

- [ ] **Step 1: Create `web/package.json`**

```json
{
  "name": "kuxar-studio-web",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run"
  },
  "dependencies": {
    "astro": "^5.0.0"
  },
  "devDependencies": {
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Create `web/astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kuxarstudio.github.io',
  base: '/web',
  build: {
    format: 'file',
  },
});
```

- [ ] **Step 3: Create `web/tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Create `web/public/favicon.svg`**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#f2ede1"/>
  <path d="M4 4h20l4 4v20H4z" fill="#161f2b"/>
  <path d="M4 4h20l4 4H4z" fill="#161f2b"/>
</svg>
```

- [ ] **Step 5: Create a minimal `web/src/pages/index.astro`**

```astro
---
---
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Kuxar Studio</title>
  </head>
  <body>
    <h1>Kuxar Studio</h1>
  </body>
</html>
```

- [ ] **Step 6: Install dependencies**

Run (from `web/`): `npm install`
Expected: `node_modules/` created, `package-lock.json` created, no errors.

- [ ] **Step 7: Build and verify**

Run (from `web/`): `npm run build`
Expected: exits 0, `web/dist/index.html` exists and contains `<h1>Kuxar Studio</h1>`.

- [ ] **Step 8: Commit**

```bash
git add web/package.json web/package-lock.json web/astro.config.mjs web/tsconfig.json web/public/favicon.svg web/src/pages/index.astro
git commit -m "feat: scaffold Astro project"
```

---

### Task 2: Content collections — schema and real content

**Files:**
- Create: `web/src/content/config.ts`
- Create: `web/src/content/projects/nadir.md`
- Create: `web/src/content/projects/kaku.md`
- Create: `web/src/content/projects/blindnote.md`
- Create: `web/src/content/tools/pdf-blender.md`
- Create: `web/src/content/devlog/blindnote-rankings.md`
- Create: `web/src/content/devlog/nadir-primer-nivel.md`
- Create: `web/src/content/devlog/kaku-trazos.md`

**Interfaces:**
- Consumes: nothing (pure content layer).
- Produces: `getCollection('projects' | 'tools' | 'devlog')` — every later task that renders content imports from `astro:content` and relies on this exact schema (field names below are load-bearing for Tasks 6–9).

- [ ] **Step 1: Create `web/src/content/config.ts`**

```ts
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.enum(['juego', 'aprendizaje']),
    status: z.enum(['en-desarrollo', 'proximamente', 'disponible']),
    description: z.string(),
    stack: z.array(z.string()),
    thumbnail: z.string().optional(),
    thumbnailLabel: z.string(),
    repo: z.string().url().optional(),
    githubRepo: z.string().optional(),
    googlePlay: z.string().url().optional(),
    appStore: z.string().url().optional(),
    steam: z.string().url().optional(),
    featured: z.boolean().default(true),
    order: z.number().default(0),
  }),
});

const tools = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    stack: z.array(z.string()),
    installCmd: z.string(),
    repo: z.string().url().optional(),
    githubRepo: z.string().optional(),
    releasesUrl: z.string().url().optional(),
  }),
});

const devlog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    project: z.string(),
    excerpt: z.string(),
  }),
});

export const collections = { projects, tools, devlog };
```

- [ ] **Step 2: Create `web/src/content/projects/nadir.md`**

```markdown
---
title: "Nadir: Protocol 1-Star"
category: "juego"
status: "en-desarrollo"
description: "Un misterio para móvil construido en Godot, diseñado para pantalla táctil."
stack: ["Godot", "GDScript"]
thumbnailLabel: "gif · próximamente"
featured: true
order: 1
---
```

*(Sin `repo` ni `githubRepo`: el repositorio real, `KuxarStudio/nadir--protocol-1-star`, es privado — ver spec. No añadir ese campo a menos que el repo se haga público.)*

- [ ] **Step 3: Create `web/src/content/projects/kaku.md`**

```markdown
---
title: "Kaku!"
category: "aprendizaje"
status: "disponible"
description: "Hiragana, katakana y kanji con reconocimiento de trazos en tiempo real."
stack: ["Android", "Kotlin"]
thumbnailLabel: "gif · trazos en vivo"
googlePlay: "https://play.google.com/store/apps/details?id=com.kaku.kaku&hl=es_419"
featured: true
order: 2
---
```

- [ ] **Step 4: Create `web/src/content/projects/blindnote.md`**

```markdown
---
title: "BlindNote"
category: "juego"
status: "proximamente"
description: "Adivina canciones de oído, compite en rankings globales."
stack: ["Godot"]
thumbnailLabel: "captura · próximamente"
featured: true
order: 3
---
```

- [ ] **Step 5: Create `web/src/content/tools/pdf-blender.md`**

```markdown
---
title: "PDF-Blender"
description: "Fusiona, divide, desprotege y compara PDFs corporativos. 100% offline — nada sale de tu equipo."
stack: ["Python"]
installCmd: "pip install pdf-blender"
repo: "https://github.com/KuxarStudio/PDF-Blender"
githubRepo: "KuxarStudio/PDF-Blender"
releasesUrl: "https://github.com/KuxarStudio/PDF-Blender/releases/latest"
---
```

- [ ] **Step 6: Create `web/src/content/devlog/blindnote-rankings.md`**

```markdown
---
title: "BlindNote — diseñando el sistema de rankings globales"
date: 2026-08-29
project: "Juego"
excerpt: "Matchmaking y scoring por rondas, antes de tocar una línea de UI."
---

Antes de tocar una sola pantalla, decidimos cómo se calcula el ranking: cada
partida puntúa por rapidez de acierto y racha, no solo por aciertos totales,
para que una sesión corta y buena valga tanto como una larga y mediocre.

El matchmaking por rondas agrupa a jugadores de nivel similar sin necesitar
un sistema ELO completo desde el día uno — eso llegará cuando haya
suficientes partidas para que tenga sentido.
```

- [ ] **Step 7: Create `web/src/content/devlog/nadir-primer-nivel.md`**

```markdown
---
title: "Nadir: Protocol 1-Star — primer nivel jugable de principio a fin"
date: 2026-08-14
project: "Juego"
excerpt: "Puzzles, ritmo de exploración y los primeros ajustes táctiles."
---

El primer nivel de Nadir ya se juega de principio a fin: llegada, tres
puzzles ambientales y una salida que cambia según cómo los resuelvas.

El foco de estas dos semanas fue el ritmo de exploración en pantalla
táctil — cuánto tarda un jugador en encontrar la primera pista sin que se
sienta perdido ni guiado de más.
```

- [ ] **Step 8: Create `web/src/content/devlog/kaku-trazos.md`**

```markdown
---
title: "Kaku! — afinando el reconocimiento de trazos"
date: 2026-07-30
project: "Aprendizaje"
excerpt: "Ajustando tolerancias para que se sienta justo sin dejar de ser exigente."
---

El reconocimiento de trazos de Kaku! ahora tolera variaciones razonables de
orden y presión sin dejar pasar errores reales de trazo.

El equilibrio entre "exigente" y "frustrante" se ha ajustado a base de
probarlo con trazos reales, no solo con los ejemplos perfectos del dataset.
```

- [ ] **Step 9: Verify the schema validates (build)**

Run (from `web/`): `npm run build`
Expected: exits 0 — a schema mismatch (wrong enum value, missing required field) fails the build with a Zod error naming the file, which is the point of the schema.

- [ ] **Step 10: Commit**

```bash
git add web/src/content
git commit -m "feat: add content collections for projects, tools, and devlog"
```

---

### Task 3: GitHub API utility (build-time repo stats)

**Files:**
- Create: `web/src/lib/github.ts`
- Test: `web/tests/github.test.ts`

**Interfaces:**
- Produces: `getRepoStats(githubRepo: string): Promise<RepoStats | null>` and the `RepoStats` type (`{ stars: number; lastCommitSha: string; lastCommitDate: string }`) — Tasks 6, 7, 8 import this exact signature.

- [ ] **Step 1: Add Vitest config — create `web/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
  },
});
```

- [ ] **Step 2: Write the failing test — create `web/tests/github.test.ts`**

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getRepoStats } from '../src/lib/github';

describe('getRepoStats', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('returns stars and last commit info when both requests succeed', async () => {
    global.fetch = vi.fn(async (url: string) => {
      if (url.endsWith('/repos/KuxarStudio/PDF-Blender')) {
        return {
          ok: true,
          json: async () => ({ stargazers_count: 3 }),
        } as Response;
      }
      if (url.includes('/commits')) {
        return {
          ok: true,
          json: async () => [
            { sha: 'abc1234567890', commit: { committer: { date: '2026-08-01T00:00:00Z' } } },
          ],
        } as Response;
      }
      throw new Error(`unexpected url: ${url}`);
    }) as unknown as typeof fetch;

    const stats = await getRepoStats('KuxarStudio/PDF-Blender');
    expect(stats).toEqual({
      stars: 3,
      lastCommitSha: 'abc1234',
      lastCommitDate: '2026-08-01T00:00:00Z',
    });
  });

  it('returns null when the repo request is not ok', async () => {
    global.fetch = vi.fn(async () => ({ ok: false, json: async () => ({}) }) as Response) as unknown as typeof fetch;
    const stats = await getRepoStats('KuxarStudio/private-repo');
    expect(stats).toBeNull();
  });

  it('returns null when fetch throws', async () => {
    global.fetch = vi.fn(async () => {
      throw new Error('network down');
    }) as unknown as typeof fetch;
    const stats = await getRepoStats('KuxarStudio/PDF-Blender');
    expect(stats).toBeNull();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run (from `web/`): `npx vitest run tests/github.test.ts`
Expected: FAIL — `Cannot find module '../src/lib/github'`.

- [ ] **Step 4: Write the implementation — create `web/src/lib/github.ts`**

```ts
export interface RepoStats {
  stars: number;
  lastCommitSha: string;
  lastCommitDate: string;
}

export async function getRepoStats(githubRepo: string): Promise<RepoStats | null> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const [repoRes, commitsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${githubRepo}`, { headers }),
      fetch(`https://api.github.com/repos/${githubRepo}/commits?per_page=1`, { headers }),
    ]);

    if (!repoRes.ok || !commitsRes.ok) return null;

    const repoJson = await repoRes.json();
    const commitsJson = await commitsRes.json();
    const latestCommit = Array.isArray(commitsJson) ? commitsJson[0] : null;
    if (!latestCommit) return null;

    return {
      stars: repoJson.stargazers_count ?? 0,
      lastCommitSha: String(latestCommit.sha).slice(0, 7),
      lastCommitDate: latestCommit.commit.committer.date,
    };
  } catch {
    return null;
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run (from `web/`): `npx vitest run tests/github.test.ts`
Expected: PASS — 3 tests passing.

- [ ] **Step 6: Commit**

```bash
git add web/src/lib/github.ts web/tests/github.test.ts web/vitest.config.ts web/package.json
git commit -m "feat: add build-time GitHub API stats utility with tests"
```

---

### Task 4: Design system CSS and base layout

**Files:**
- Create: `web/src/styles/global.css`
- Create: `web/src/layouts/BaseLayout.astro`
- Modify: `web/src/pages/index.astro`

**Interfaces:**
- Consumes: nothing.
- Produces: `BaseLayout.astro` accepting a `title: string` prop, rendering `<slot />` inside `<body>`, importing `global.css`, with the theme-init inline script and shared `[data-reveal]` IntersectionObserver script. Every page in Tasks 7–9 wraps its content in `<BaseLayout title="...">`.

- [ ] **Step 1: Create `web/src/styles/global.css`**

```css
:root{
  --paper:#f2ede1;
  --paper-2:#eae3d2;
  --paper-rgb:242,237,225;
  --ink:#161f2b;
  --ink-soft:#3d4b59;
  --ink-mute:#5b6b7d;
  --line: rgba(22,31,43,0.14);
  --line-soft: rgba(22,31,43,0.08);
  --blue:#2f5fb0;
  --live:#17b890;
  --juego:#6a4cff;
  --aprendizaje:#17b890;
  --herramienta:#c9820a;
  --on-accent:#14101c;
  --term-bg:#1e2636;
}
:root[data-theme="dark"]{
  --paper:#15181d;
  --paper-2:#1c2028;
  --paper-rgb:21,24,29;
  --ink:#e9e4d8;
  --ink-soft:#b9c0cc;
  --ink-mute:#838c99;
  --line: rgba(233,228,216,0.14);
  --line-soft: rgba(233,228,216,0.05);
}
*{box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{
  margin:0;
  background:
    linear-gradient(var(--line-soft) 1px, transparent 1px) 0 0/32px 32px,
    linear-gradient(90deg, var(--line-soft) 1px, transparent 1px) 0 0/32px 32px,
    var(--paper);
  color:var(--ink);
  font-family:'Space Grotesk', sans-serif;
  -webkit-font-smoothing:antialiased;
  transition:background-color .2s ease, color .2s ease;
}
a{color:inherit;}
.mono{font-family:'JetBrains Mono', monospace;}
.wrap{max-width:1180px;margin:0 auto;padding:0 28px;}

header{position:sticky;top:0;z-index:50;background:rgba(var(--paper-rgb),0.92);backdrop-filter:blur(6px);border-bottom:2px solid var(--ink);}
.headbar{display:flex;align-items:center;justify-content:space-between;padding:16px 28px;max-width:1180px;margin:0 auto;}
.logo{display:flex;align-items:center;gap:10px;font-weight:700;letter-spacing:0.02em;font-size:1.05rem;text-decoration:none;color:var(--ink);}
.logo .mark{width:26px;height:26px;background:var(--ink);clip-path:polygon(0 0,100% 0,100% 70%,70% 100%,0 100%);display:inline-block;}
.live-badge{display:flex;align-items:center;gap:6px;font-family:'JetBrains Mono',monospace;font-size:0.7rem;color:var(--ink-mute);text-transform:uppercase;letter-spacing:0.05em;}
.live-dot{width:7px;height:7px;border-radius:50%;background:var(--live);box-shadow:0 0 0 0 rgba(23,184,144,0.5);animation:pulse 2s infinite;}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(23,184,144,0.45);}70%{box-shadow:0 0 0 7px rgba(23,184,144,0);}100%{box-shadow:0 0 0 0 rgba(23,184,144,0);}}
nav{display:flex;gap:4px;font-family:'JetBrains Mono',monospace;font-size:0.78rem;letter-spacing:0.03em;text-transform:uppercase;}
nav a{padding:8px 14px;text-decoration:none;color:var(--ink-soft);border:1.5px solid transparent;}
nav a:hover{border-color:var(--ink);color:var(--ink);}
.head-right{display:flex;align-items:center;gap:14px;}
.head-tools{display:flex;align-items:center;gap:6px;padding-left:14px;border-left:1.5px solid var(--line);}
.lang-toggle{display:flex;align-items:center;font-family:'JetBrains Mono',monospace;font-size:0.74rem;letter-spacing:0.03em;border:1.5px solid var(--line);}
.lang-toggle button{font:inherit;letter-spacing:inherit;background:none;border:none;color:var(--ink-mute);padding:6px 9px;cursor:pointer;}
.lang-toggle button.active{background:var(--ink);color:var(--paper);}
.icon-btn{width:32px;height:32px;display:flex;align-items:center;justify-content:center;border:1.5px solid var(--line);background:none;color:var(--ink);cursor:pointer;padding:0;}
.icon-btn:hover{border-color:var(--ink);}
.icon-btn svg{width:16px;height:16px;}
.icon-moon{display:none;}
:root[data-theme="dark"] .icon-sun{display:none;}
:root[data-theme="dark"] .icon-moon{display:block;}

.hero{padding:76px 0 60px;}
.hero-grid{display:grid;grid-template-columns:1.4fr 1fr;gap:52px;align-items:start;}
.eyebrow{font-family:'JetBrains Mono',monospace;font-size:0.78rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--blue);margin:0 0 18px;display:flex;align-items:center;gap:10px;}
.eyebrow::before{content:"";width:22px;height:2px;background:var(--blue);display:inline-block;}
h1{font-size:clamp(2.3rem,4.4vw,3.9rem);line-height:1.06;font-weight:700;margin:0 0 24px;letter-spacing:-0.01em;min-height:3.2em;}
.cur{display:inline-block;width:0.5ch;background:var(--ink);height:0.85em;vertical-align:-0.1em;animation:blink 1s step-end infinite;}
@keyframes blink{50%{opacity:0;}}
.lede{font-size:1.1rem;color:var(--ink-soft);max-width:46ch;line-height:1.55;margin:0 0 32px;opacity:0;animation:rise .6s ease .9s forwards;}
@keyframes rise{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
.cta-row{display:flex;gap:14px;flex-wrap:wrap;opacity:0;animation:rise .6s ease 1.05s forwards;}
.btn{font-family:'JetBrains Mono',monospace;font-size:0.8rem;letter-spacing:0.03em;text-transform:uppercase;padding:13px 22px;text-decoration:none;display:inline-block;clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);transition:transform .15s ease;}
.btn:hover{transform:translateY(-2px);}
.btn-primary{background:var(--ink);color:var(--paper);}
.btn-primary:hover{background:var(--blue);}
.btn-ghost{border:1.5px solid var(--ink);color:var(--ink);}
.btn-ghost:hover{background:var(--ink);color:var(--paper);}

.term{border:2px solid var(--ink);background:var(--term-bg);color:#dfe6ee;clip-path:polygon(0 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%);overflow:hidden;}
.term-bar{display:flex;align-items:center;gap:7px;padding:11px 16px;background:#0f1620;border-bottom:1px solid rgba(255,255,255,0.1);}
.term-dot{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,0.25);}
.term-title{margin-left:6px;font-family:'JetBrains Mono',monospace;font-size:0.7rem;color:rgba(255,255,255,0.5);}
.term-body{padding:22px 22px 24px;font-family:'JetBrains Mono',monospace;font-size:0.82rem;}
.term-line{padding:6px 0;display:flex;justify-content:space-between;gap:10px;border-bottom:1px dotted rgba(255,255,255,0.12);color:rgba(223,230,238,0.9);}
.term-line span:first-child{color:rgba(223,230,238,0.5);}
.term-line b{font-weight:500;color:#dfe6ee;}
.term-legend{display:flex;gap:14px;margin-top:16px;flex-wrap:wrap;}
.legend-item{display:flex;align-items:center;gap:7px;font-family:'JetBrains Mono',monospace;font-size:0.7rem;text-transform:uppercase;color:rgba(223,230,238,0.7);}
.swatch{width:10px;height:10px;display:inline-block;}
.term-cursor{display:inline-block;width:0.55em;height:1em;background:rgba(255,255,255,0.5);vertical-align:-0.15em;margin-left:2px;animation:blink 1s step-end infinite;}

section{padding:72px 0;}
.section-head{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:38px;border-bottom:2px solid var(--ink);padding-bottom:16px;}
.section-num{font-family:'JetBrains Mono',monospace;font-size:0.78rem;color:var(--ink-mute);}
h2{font-size:1.85rem;font-weight:700;margin:0;letter-spacing:-0.01em;}

.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:26px;}
.card{position:relative;border:2px solid var(--ink);background:var(--paper-2);clip-path:polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,22px 100%,0 calc(100% - 22px));padding:26px 26px 22px;transition:all .2s ease;opacity:0;transform:translateY(16px);display:flex;flex-direction:column;}
.card.in{opacity:1;transform:translateY(0);}
.card:hover{transform:translateY(-4px);box-shadow:6px 10px 0 var(--ink);}
.stripe{position:absolute;top:0;left:0;right:0;height:6px;}
.stamp{position:absolute;top:14px;right:-6px;font-family:'JetBrains Mono',monospace;font-size:0.65rem;letter-spacing:0.06em;padding:4px 10px 4px 8px;color:var(--on-accent);font-weight:600;transform:rotate(2deg);}
.card-title{font-size:1.35rem;font-weight:700;margin:14px 0 8px;padding-right:66px;}
.card-thumb{
  aspect-ratio:16/9;border:1.5px solid var(--ink);margin-bottom:16px;overflow:hidden;
  display:flex;align-items:center;justify-content:center;position:relative;
  background:
    repeating-linear-gradient(135deg, rgba(22,31,43,0.06) 0 10px, transparent 10px 20px),
    var(--paper);
}
.card-thumb img,.card-thumb video{width:100%;height:100%;object-fit:cover;display:block;}
.card-thumb-label{font-family:'JetBrains Mono',monospace;font-size:0.68rem;text-transform:uppercase;letter-spacing:0.05em;color:var(--ink-mute);background:var(--paper);border:1px solid var(--line);padding:5px 10px;}
.card-desc{color:var(--ink-soft);font-size:0.94rem;line-height:1.5;margin:0 0 16px;max-width:42ch;}
.card-meta{border-top:1px dotted var(--line);padding-top:12px;display:flex;justify-content:space-between;align-items:center;margin-top:auto;}
.hash{font-family:'JetBrains Mono',monospace;font-size:0.72rem;color:var(--blue);}
.card-link{font-family:'JetBrains Mono',monospace;font-size:0.76rem;text-decoration:none;color:var(--ink);border-bottom:1px solid var(--ink);}
.card-link:hover{color:var(--blue);border-color:var(--blue);}

.log-list{border:2px solid var(--ink);}
.log-row{position:relative;display:grid;grid-template-columns:150px 1fr auto;gap:20px;align-items:center;padding:18px 22px;border-bottom:1px solid var(--line);background:var(--paper-2);opacity:0;transform:translateY(12px);transition:opacity .5s ease, transform .5s ease, background .2s ease, box-shadow .2s ease;}
.log-row.in{opacity:1;transform:translateY(0);}
.log-row:last-child{border-bottom:none;}
.log-row:hover{background:var(--paper);transform:translateY(-4px);box-shadow:0 6px 14px -6px rgba(22,31,43,0.35);z-index:1;}
.log-date{font-family:'JetBrains Mono',monospace;font-size:0.76rem;color:var(--ink-mute);display:flex;align-items:center;gap:8px;}
.log-title{font-weight:700;font-size:1.02rem;}
.log-title a{text-decoration:none;color:var(--ink);}
.log-title a:hover{color:var(--blue);}
.log-excerpt{color:var(--ink-soft);font-size:0.88rem;margin-top:4px;max-width:58ch;}
.log-tag{font-family:'JetBrains Mono',monospace;font-size:0.66rem;text-transform:uppercase;padding:4px 8px;border:1px solid var(--ink);white-space:nowrap;}

.view-all{display:flex;justify-content:center;margin-top:28px;}
.view-all a{font-family:'JetBrains Mono',monospace;font-size:0.82rem;text-decoration:none;color:var(--ink);border-bottom:1.5px solid var(--ink);padding-bottom:2px;transition:color .15s ease,border-color .15s ease;}
.view-all a:hover{color:var(--blue);border-color:var(--blue);}

.tool-card{border:2px solid var(--ink);background:var(--paper-2);padding:28px;display:flex;gap:24px;align-items:flex-start;clip-path:polygon(0 0,100% 0,100% 100%,16px 100%,0 calc(100% - 16px));}
.tool-icon{width:52px;height:52px;border:2px solid var(--ink);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-weight:700;background:var(--herramienta);color:var(--on-accent);clip-path:polygon(0 0,100% 0,100% 70%,70% 100%,0 100%);}
.tool-cmd{font-family:'JetBrains Mono',monospace;font-size:0.78rem;background:var(--ink);color:var(--paper);padding:8px 12px;display:inline-block;margin-top:12px;}
.tool-download{margin-top:14px;font-size:0.76rem;padding:11px 18px;display:inline-block;}
.ghost-card{border:2px dashed var(--line);padding:26px;display:flex;align-items:center;justify-content:center;color:var(--ink-mute);font-family:'JetBrains Mono',monospace;font-size:0.84rem;margin-top:18px;}

footer{border-top:2px solid var(--ink);padding:46px 0 40px;margin-top:30px;}
.foot-grid{display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:24px;}
.foot-manifesto{max-width:38ch;font-size:0.95rem;color:var(--ink-soft);line-height:1.5;}
.foot-links{display:flex;flex-direction:column;gap:10px;font-family:'JetBrains Mono',monospace;font-size:0.8rem;}
.foot-links a{display:inline-flex;align-items:center;gap:9px;text-decoration:none;color:var(--ink);transition:color .15s ease;}
.foot-links a:hover{color:var(--blue);}
.foot-links svg{width:15px;height:15px;flex-shrink:0;}
.foot-bottom{margin-top:32px;padding-top:18px;border-top:1px dotted var(--line);font-family:'JetBrains Mono',monospace;font-size:0.72rem;color:var(--ink-mute);display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;}

.archive{padding-top:56px;}

@media(max-width:820px){
  .hero-grid{grid-template-columns:1fr;}
  .grid{grid-template-columns:1fr;}
  nav{display:none;}
  .log-row{grid-template-columns:1fr;gap:6px;}
}
@media (prefers-reduced-motion: reduce){
  *{animation-duration:0.01ms !important;animation-iteration-count:1 !important;transition-duration:0.01ms !important;}
  .lede,.cta-row,.card,.log-row{opacity:1 !important;transform:none !important;}
}
```

- [ ] **Step 2: Create `web/src/layouts/BaseLayout.astro`**

```astro
---
export interface Props {
  title: string;
  description?: string;
}
const { title, description = 'Kuxar Studio — juegos, apps de aprendizaje y herramientas, hechos con oficio.' } = Astro.props;
const base = import.meta.env.BASE_URL;
---
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href={`${base}favicon.svg`} />
    <title>{title}</title>
    <script is:inline>
      (function () {
        try {
          var t = localStorage.getItem('kuxar-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
          document.documentElement.setAttribute('data-theme', t);
        } catch (e) {}
      })();
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
    <style is:global>
      @import "../styles/global.css";
    </style>
  </head>
  <body>
    <slot />
    <script>
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              io.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.15 }
      );
      document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
    </script>
  </body>
</html>
```

- [ ] **Step 3: Modify `web/src/pages/index.astro` to use the layout**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Kuxar Studio">
  <h1>Kuxar Studio</h1>
</BaseLayout>
```

- [ ] **Step 4: Build and verify**

Run (from `web/`): `npm run build`
Expected: exits 0, `web/dist/index.html` contains the grid background CSS variables and the theme-init inline script.

- [ ] **Step 5: Commit**

```bash
git add web/src/styles/global.css web/src/layouts/BaseLayout.astro web/src/pages/index.astro
git commit -m "feat: add design system CSS and base layout with dark mode"
```

---

### Task 5: Header and Footer components

**Files:**
- Create: `web/src/components/Header.astro`
- Create: `web/src/components/Footer.astro`

**Interfaces:**
- Consumes: `getCollection` from `astro:content` (for the live project/tool count badge).
- Produces: `<Header />` and `<Footer />` with no required props — used as-is in every page from Task 7 onward.

*Note on scope: `ThemeToggle` and `LangToggle` are implemented as markup + a scoped `<script>` inside `Header.astro` rather than as separate component files — they're a dozen lines each with no reuse elsewhere, so splitting them out would be indirection without benefit (YAGNI). If a second header-like surface ever needs them, extract then.*

- [ ] **Step 1: Create `web/src/components/Header.astro`**

```astro
---
import { getCollection } from 'astro:content';
const base = import.meta.env.BASE_URL;
const projectCount = (await getCollection('projects')).length;
const toolCount = (await getCollection('tools')).length;
const activeCount = projectCount + toolCount;
---
<header>
  <div class="headbar">
    <a class="logo" href={base}><span class="mark"></span>KUXAR STUDIO</a>
    <div class="head-right">
      <span class="live-badge"><span class="live-dot"></span>{activeCount} proyectos activos</span>
      <nav>
        <a href={`${base}portfolio.html`}>Portfolio</a>
        <a href={`${base}devlog.html`}>Devlog</a>
        <a href={`${base}#herramientas`}>Herramientas</a>
        <a href={`${base}#contacto`}>Contacto</a>
      </nav>
      <div class="head-tools">
        <div class="lang-toggle" role="group" aria-label="Idioma">
          <button type="button" id="lang-es" class="active" aria-pressed="true">ES</button>
          <button type="button" id="lang-en" aria-pressed="false">EN</button>
        </div>
        <button type="button" id="theme-toggle" class="icon-btn" aria-label="Cambiar a modo oscuro">
          <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>
          <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"></path></svg>
        </button>
      </div>
    </div>
  </div>
</header>

<script>
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle')!;
  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  function syncThemeBtn() {
    const isDark = currentTheme() === 'dark';
    themeBtn.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  }
  syncThemeBtn();
  themeBtn.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('kuxar-theme', next);
    } catch (e) {}
    syncThemeBtn();
  });

  const langEs = document.getElementById('lang-es')!;
  const langEn = document.getElementById('lang-en')!;
  function setLang(btn: HTMLElement, other: HTMLElement) {
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    other.classList.remove('active');
    other.setAttribute('aria-pressed', 'false');
  }
  langEs.addEventListener('click', () => setLang(langEs, langEn));
  langEn.addEventListener('click', () => setLang(langEn, langEs));
</script>
```

- [ ] **Step 2: Create `web/src/components/Footer.astro`**

```astro
---
const base = import.meta.env.BASE_URL;
---
<footer id="contacto">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <a class="logo" href={base}><span class="mark"></span>KUXAR STUDIO</a>
        <p class="foot-manifesto">Juegos, apps de aprendizaje y herramientas, hechos con oficio. Escríbenos si quieres hablar de un proyecto.</p>
      </div>
      <div class="foot-links">
        <a href="mailto:jack.projekts@gmail.com">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 6-10 7L2 6"></path></svg>
          jack.projekts@gmail.com
        </a>
        <a href="https://github.com/KuxarStudio" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.21.66.8.55A10.94 10.94 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z"></path></svg>
          github.com/KuxarStudio
        </a>
      </div>
    </div>
    <div class="foot-bottom"><span>© 2026 Kuxar Studio</span></div>
  </div>
</footer>
```

- [ ] **Step 3: Wire both into `web/src/pages/index.astro` and build**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
---
<BaseLayout title="Kuxar Studio">
  <Header />
  <h1>Kuxar Studio</h1>
  <Footer />
</BaseLayout>
```

Run (from `web/`): `npm run build`
Expected: exits 0, `web/dist/index.html` contains `4 proyectos activos` (3 projects + 1 tool) and both SVG icons from Footer.

- [ ] **Step 4: Commit**

```bash
git add web/src/components/Header.astro web/src/components/Footer.astro web/src/pages/index.astro
git commit -m "feat: add Header and Footer components"
```

---

### Task 6: ProjectCard, DevlogRow, and ToolCard components

**Files:**
- Create: `web/src/components/ProjectCard.astro`
- Create: `web/src/components/DevlogRow.astro`
- Create: `web/src/components/ToolCard.astro`

**Interfaces:**
- Consumes: `RepoStats | null` type from `../lib/github` (Task 3), `CollectionEntry<'projects' | 'tools' | 'devlog'>` from `astro:content` (Task 2).
- Produces: `<ProjectCard project={CollectionEntry<'projects'>} stats={RepoStats | null} />`, `<DevlogRow entry={CollectionEntry<'devlog'>} />`, `<ToolCard tool={CollectionEntry<'tools'>} stats={RepoStats | null} />` — Tasks 7–9 render these directly.

- [ ] **Step 1: Create `web/src/components/ProjectCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
import type { RepoStats } from '../lib/github';

interface Props {
  project: CollectionEntry<'projects'>;
  stats: RepoStats | null;
}
const { project, stats } = Astro.props;
const { title, category, status, description, stack, thumbnail, thumbnailLabel, googlePlay, appStore, steam, repo } = project.data;

const categoryLabel: Record<string, string> = { juego: 'JUEGO', aprendizaje: 'APRENDIZAJE' };
const statusLabel: Record<string, string> = {
  'en-desarrollo': 'en desarrollo',
  proximamente: 'próximamente',
  disponible: 'disponible',
};

const primaryLink = googlePlay
  ? { href: googlePlay, label: 'Google Play →' }
  : appStore
    ? { href: appStore, label: 'App Store →' }
    : steam
      ? { href: steam, label: 'Steam →' }
      : repo
        ? { href: repo, label: 'Repositorio →' }
        : null;
---
<div class="card" data-reveal>
  <div class="stripe" style={`background:var(--${category})`}></div>
  <div class="stamp" style={`background:var(--${category})`}>{categoryLabel[category]}</div>
  <div class="card-title">{title}</div>
  <div class="card-thumb">
    {thumbnail ? <img src={thumbnail} alt={`Captura de ${title}`} loading="lazy" /> : <span class="card-thumb-label">{thumbnailLabel}</span>}
  </div>
  <p class="card-desc">{description}</p>
  <div class="card-meta">
    <span class="hash">{stats ? `#${stats.lastCommitSha} · ${statusLabel[status]}` : statusLabel[status]}</span>
    {primaryLink && <a class="card-link" href={primaryLink.href} target="_blank" rel="noopener">{primaryLink.label}</a>}
  </div>
</div>
```

- [ ] **Step 2: Create `web/src/components/DevlogRow.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props {
  entry: CollectionEntry<'devlog'>;
}
const { entry } = Astro.props;
const base = import.meta.env.BASE_URL;
const formattedDate = entry.data.date
  .toISOString()
  .slice(0, 10)
  .replace(/-/g, '·');
---
<div class="log-row" data-reveal>
  <span class="log-date">{formattedDate}</span>
  <div>
    <div class="log-title"><a href={`${base}devlog/${entry.slug}.html`}>{entry.data.title}</a></div>
    <p class="log-excerpt">{entry.data.excerpt}</p>
  </div>
  <span class="log-tag">{entry.data.project}</span>
</div>
```

- [ ] **Step 3: Create `web/src/components/ToolCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
import type { RepoStats } from '../lib/github';

interface Props {
  tool: CollectionEntry<'tools'>;
  stats: RepoStats | null;
}
const { tool, stats } = Astro.props;
const { title, description, installCmd, releasesUrl } = tool.data;
const initials = title
  .split(/[\s-]+/)
  .map((w) => w[0])
  .join('')
  .slice(0, 2)
  .toUpperCase();
---
<div class="tool-card">
  <div class="tool-icon">{initials}</div>
  <div>
    <div class="card-title" style="padding-right:0;">{title}</div>
    <p class="card-desc">{description}</p>
    <span class="tool-cmd">$ {installCmd}</span>
    {stats && <p class="hash" style="margin-top:10px;">★ {stats.stars} · último commit #{stats.lastCommitSha}</p>}
    <br />
    {releasesUrl && (
      <a class="btn btn-ghost tool-download" href={releasesUrl} target="_blank" rel="noopener">Descargar versión ejecutable</a>
    )}
  </div>
</div>
```

- [ ] **Step 4: Build and verify**

Run (from `web/`): `npm run build`
Expected: exits 0 (components aren't wired into a page yet, so this just confirms no TypeScript/syntax errors — Astro type-checks `.astro` files during build).

- [ ] **Step 5: Commit**

```bash
git add web/src/components/ProjectCard.astro web/src/components/DevlogRow.astro web/src/components/ToolCard.astro
git commit -m "feat: add ProjectCard, DevlogRow, and ToolCard components"
```

---

### Task 7: Assemble the homepage

**Files:**
- Modify: `web/src/pages/index.astro`

**Interfaces:**
- Consumes: `Header`, `Footer`, `ProjectCard`, `DevlogRow`, `ToolCard` (Tasks 5–6), `getRepoStats` (Task 3), `getCollection` (Task 2).

- [ ] **Step 1: Replace `web/src/pages/index.astro` with the full homepage**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import ProjectCard from '../components/ProjectCard.astro';
import DevlogRow from '../components/DevlogRow.astro';
import ToolCard from '../components/ToolCard.astro';
import { getRepoStats } from '../lib/github';

const base = import.meta.env.BASE_URL;

const allProjects = await getCollection('projects');
const featuredProjects = allProjects
  .filter((p) => p.data.featured)
  .sort((a, b) => a.data.order - b.data.order)
  .slice(0, 4);
const featuredStats = await Promise.all(
  featuredProjects.map((p) => (p.data.githubRepo ? getRepoStats(p.data.githubRepo) : Promise.resolve(null)))
);

const allDevlog = (await getCollection('devlog')).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
const latestDevlog = allDevlog.slice(0, 3);

const tools = await getCollection('tools');
const toolStats = await Promise.all(
  tools.map((t) => (t.data.githubRepo ? getRepoStats(t.data.githubRepo) : Promise.resolve(null)))
);
---
<BaseLayout title="Kuxar Studio — juegos, apps y herramientas hechos con oficio">
  <Header />

  <div id="top" class="hero">
    <div class="wrap hero-grid">
      <div>
        <p class="eyebrow">Estudio independiente · Internet-based</p>
        <h1 id="typed"></h1>
        <p class="lede">Diseñamos y construimos juegos, apps de aprendizaje y herramientas — cada proyecto planeado como una pieza de ingeniería, no como un experimento suelto.</p>
        <div class="cta-row">
          <a class="btn btn-primary" href="#portfolio">Ver proyectos</a>
          <a class="btn btn-ghost" href="https://github.com/KuxarStudio" target="_blank" rel="noopener">GitHub ↗</a>
        </div>
      </div>
      <div class="term">
        <div class="term-bar">
          <span class="term-dot"></span><span class="term-dot"></span><span class="term-dot"></span>
          <span class="term-title">kuxar@studio:~$ cat ficha.json<span class="term-cursor"></span></span>
        </div>
        <div class="term-body">
          <div class="term-line"><span>disciplinas</span><b>Juegos · Apps · Herramientas</b></div>
          <div class="term-line"><span>motor</span><b>Godot / GDScript</b></div>
          <div class="term-line"><span>movil</span><b>Android / Kotlin</b></div>
          <div class="term-line"><span>backend</span><b>Python · Firebase</b></div>
          <div class="term-line"><span>sede</span><b>Internet-based</b></div>
          <div class="term-legend">
            <span class="legend-item"><span class="swatch" style="background:var(--juego)"></span>Juego</span>
            <span class="legend-item"><span class="swatch" style="background:var(--aprendizaje)"></span>Aprendizaje</span>
            <span class="legend-item"><span class="swatch" style="background:var(--herramienta)"></span>Herramienta</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <section id="portfolio">
    <div class="wrap">
      <div class="section-head"><h2>Portfolio</h2><span class="section-num mono">01 — PROYECTOS</span></div>
      <div class="grid">
        {featuredProjects.map((project, i) => <ProjectCard project={project} stats={featuredStats[i]} />)}
      </div>
      <div class="view-all"><a href={`${base}portfolio.html`}>Ver archivo completo →</a></div>
    </div>
  </section>

  <section id="devlog" style="background:var(--paper-2);border-top:2px solid var(--ink);border-bottom:2px solid var(--ink);">
    <div class="wrap">
      <div class="section-head" style="border-color:var(--ink);"><h2>Devlog</h2><span class="section-num mono">02 — BITÁCORA</span></div>
      <div class="log-list">
        {latestDevlog.map((entry) => <DevlogRow entry={entry} />)}
      </div>
      <div class="view-all"><a href={`${base}devlog.html`}>Ver bitácora completa →</a></div>
    </div>
  </section>

  <section id="herramientas">
    <div class="wrap">
      <div class="section-head"><h2>Herramientas</h2><span class="section-num mono">03 — HERRAMIENTAS</span></div>
      {tools.map((tool, i) => <ToolCard tool={tool} stats={toolStats[i]} />)}
      <div class="ghost-card">+ Más herramientas en camino</div>
    </div>
  </section>

  <Footer />

  <script>
    const el = document.getElementById('typed')!;
    const full = 'Software con vocación de oficio.';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      el.textContent = full;
    } else {
      let i = 0;
      const tick = () => {
        el.textContent = full.slice(0, i);
        if (i < full.length) {
          i++;
          setTimeout(tick, 26);
        } else {
          el.innerHTML = full + '<span class="cur"></span>';
        }
      };
      tick();
    }
  </script>
</BaseLayout>
```

- [ ] **Step 2: Build and verify**

Run (from `web/`): `npm run build`
Expected: exits 0. Check `web/dist/index.html` contains: exactly 3 elements with class `card` (Nadir, Kaku!, BlindNote — all 3 entries in the `projects` collection; PDF-Blender does NOT appear here, it's in `tools` and only renders in the Herramientas section), 3 elements with class `log-row`, both `view-all` links, and the `Google Play →` link for Kaku!.

- [ ] **Step 3: Run the dev server and manually verify in a browser**

Run (from `web/`): `npm run dev`
Open `http://localhost:4321/web/` and confirm: headline types itself in, terminal panel shows "Internet-based" as sede, portfolio cards fade in on scroll, dark mode toggle switches the whole page including the stamp/tool-icon text staying legible, Kaku!'s card links to its real Google Play page, Nadir/BlindNote cards show no external link (private repos, no store link yet), PDF-Blender's tool card shows the "Descargar versión ejecutable" button linking to the real release.

- [ ] **Step 4: Commit**

```bash
git add web/src/pages/index.astro
git commit -m "feat: assemble homepage with hero, portfolio, devlog, and tools"
```

---

### Task 8: Portfolio archive page

**Files:**
- Create: `web/src/pages/portfolio.astro`

**Interfaces:**
- Consumes: `ProjectCard`, `Header`, `Footer`, `getRepoStats`, `getCollection('projects')`.

- [ ] **Step 1: Create `web/src/pages/portfolio.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import ProjectCard from '../components/ProjectCard.astro';
import { getRepoStats } from '../lib/github';

const allProjects = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
const stats = await Promise.all(
  allProjects.map((p) => (p.data.githubRepo ? getRepoStats(p.data.githubRepo) : Promise.resolve(null)))
);
---
<BaseLayout title="Portfolio — Kuxar Studio">
  <Header />
  <section class="archive">
    <div class="wrap">
      <div class="section-head">
        <h2>Portfolio completo</h2>
        <span class="section-num mono">{allProjects.length} PROYECTOS</span>
      </div>
      <div class="grid">
        {allProjects.map((project, i) => <ProjectCard project={project} stats={stats[i]} />)}
      </div>
    </div>
  </section>
  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Build and verify**

Run (from `web/`): `npm run build`
Expected: exits 0, `web/dist/portfolio.html` exists and contains 3 elements with class `card` (all of `projects`, unfiltered — unlike the homepage's `featured`/`slice(0,4)` limit).

- [ ] **Step 3: Commit**

```bash
git add web/src/pages/portfolio.astro
git commit -m "feat: add full portfolio archive page"
```

---

### Task 9: Devlog archive and individual post pages

**Files:**
- Create: `web/src/pages/devlog.astro`
- Create: `web/src/pages/devlog/[slug].astro`

**Interfaces:**
- Consumes: `DevlogRow`, `Header`, `Footer`, `getCollection('devlog')`.

- [ ] **Step 1: Create `web/src/pages/devlog.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import DevlogRow from '../components/DevlogRow.astro';

const allDevlog = (await getCollection('devlog')).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---
<BaseLayout title="Devlog — Kuxar Studio">
  <Header />
  <section class="archive">
    <div class="wrap">
      <div class="section-head">
        <h2>Bitácora completa</h2>
        <span class="section-num mono">{allDevlog.length} ENTRADAS</span>
      </div>
      <div class="log-list">
        {allDevlog.map((entry) => <DevlogRow entry={entry} />)}
      </div>
    </div>
  </section>
  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Create `web/src/pages/devlog/[slug].astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/Header.astro';
import Footer from '../../components/Footer.astro';

export async function getStaticPaths() {
  const entries = await getCollection('devlog');
  return entries.map((entry) => ({ params: { slug: entry.slug }, props: { entry } }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
const formattedDate = entry.data.date.toISOString().slice(0, 10).replace(/-/g, '·');
---
<BaseLayout title={`${entry.data.title} — Kuxar Studio`}>
  <Header />
  <section class="archive">
    <div class="wrap" style="max-width:760px;">
      <p class="log-date mono">{formattedDate} · <span class="log-tag" style="border:none;padding:0;">{entry.data.project}</span></p>
      <h1 style="margin-top:12px;">{entry.data.title}</h1>
      <div style="font-size:1.05rem;line-height:1.7;color:var(--ink-soft);margin-top:24px;">
        <Content />
      </div>
    </div>
  </section>
  <Footer />
</BaseLayout>
```

- [ ] **Step 3: Build and verify**

Run (from `web/`): `npm run build`
Expected: exits 0. Confirm `web/dist/devlog.html` exists with 3 `log-row` elements, and `web/dist/devlog/blindnote-rankings.html`, `web/dist/devlog/nadir-primer-nivel.html`, `web/dist/devlog/kaku-trazos.html` all exist and each contains its entry's full markdown body (rendered as `<p>` tags).

- [ ] **Step 4: Commit**

```bash
git add web/src/pages/devlog.astro "web/src/pages/devlog/[slug].astro"
git commit -m "feat: add devlog archive and individual post pages"
```

---

### Task 10: GitHub Actions deploy to GitHub Pages

**Files:**
- Create: `.github/workflows/deploy.yml` (repo root, not under `web/`)

**Interfaces:**
- Consumes: `web/package.json` build script (Task 1).
- Produces: a live site at `https://kuxarstudio.github.io/web/` on every push to `main`.

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: web/package-lock.json

      - name: Install dependencies
        working-directory: web
        run: npm ci

      - name: Run tests
        working-directory: web
        run: npm test

      - name: Build
        working-directory: web
        run: npm run build
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - uses: actions/configure-pages@v5

      - uses: actions/upload-pages-artifact@v3
        with:
          path: web/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add GitHub Actions workflow to deploy to GitHub Pages"
```

- [ ] **Step 3: Push to the remote**

```bash
git push -u origin main
```

Expected: push succeeds (repo `KuxarStudio/web` is public, remote already configured).

- [ ] **Step 4: Configure the repo's Pages source to GitHub Actions**

```bash
gh api -X PUT repos/KuxarStudio/web/pages -f build_type=workflow
```

If the repo has no Pages site yet, this returns 404 — in that case create it first:

```bash
gh api -X POST repos/KuxarStudio/web/pages -f build_type=workflow
```

Expected: one of the two succeeds with a 201/204, confirming Pages source is now "GitHub Actions" rather than a branch.

- [ ] **Step 5: Watch the workflow run and verify the live site**

```bash
gh run watch --exit-status
```

Expected: run completes successfully. Then:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://kuxarstudio.github.io/web/
```

Expected: `200`.

---

## Post-plan note (not a task — informational)

This deploys a **working preview** at `kuxarstudio.github.io/web/`, not the studio's real domain. Per the spec, pointing the production `kuxarstudio.github.io` (or a future custom domain) at this content is a separate, deliberate cutover the user approves explicitly when the site is ready — never done as a side effect of this plan.
