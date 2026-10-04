// Auditoría SEO estática del sitio ya construido (`dist/`). Sin dependencias de
// navegador: lee el HTML, monta el grafo de enlaces internos y devuelve una
// lista de hallazgos. Sustituye (gratis, y en cada PR) a un crawler de pago.
//
// Funciones puras: reciben HTML / mapas y devuelven datos, para poder probarlas
// con vitest sin construir el sitio. El CLI está en ./run.mjs.

/** Qué pasa con cada tipo de hallazgo: `error` rompe el CI, `warn` solo informa. */
export const SEVERITY = {
  'broken-link': 'error',
  'link-to-redirect': 'error',
  'missing-title': 'error',
  'missing-h1': 'error',
  'multiple-h1': 'error',
  'missing-lang': 'error',
  'missing-canonical': 'error',
  'img-no-alt': 'error',
  'empty-link': 'error',
  'empty-button': 'error',
  'input-no-label': 'error',
  'duplicate-title': 'error',
  'topic-orphan': 'error',
  'topic-invisible': 'error',
  'topic-missing-translation': 'error',
  'click-depth': 'warn',
  'orphan-page': 'warn',
  'low-inlinks': 'warn',
  'generic-anchor': 'warn',
  'query-string-link': 'warn',
  'title-long': 'warn',
  'description-missing': 'warn',
  'description-long': 'warn',
  'heading-skip': 'warn',
};

export const MAX_CLICK_DEPTH = 3;
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 160;
export const MIN_INLINKS_IMPORTANT = 3;

const GENERIC_ANCHORS = new Set([
  'click aqui', 'click aquí', 'haz click aqui', 'haz clic aquí', 'clic aquí', 'pincha aquí', 'aqui', 'aquí',
  'click here', 'here', 'read more', 'leer mas', 'leer más', 'más', 'more', 'link', 'enlace', 'este enlace', 'this link',
]);

const decode = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));

const stripTags = (s) => decode(s.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

/** Atributos de una etiqueta de apertura como objeto (minúsculas). */
export function attrs(tag) {
  const out = {};
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  const inner = tag.replace(/^<[a-zA-Z0-9-]+/, '').replace(/\/?>$/, '');
  let m;
  while ((m = re.exec(inner))) out[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4] ?? '');
  return out;
}

/** Quita bloques que no son contenido visible del documento (scripts, estilos, JSON-LD). */
const body = (html) => (/<body[\s\S]*<\/body>/i.exec(html)?.[0] ?? html).replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');

/** Extrae lo relevante de SEO/accesibilidad de una página. */
export function parsePage(html) {
  // Las páginas de redirección de Astro no llevan <head>: se analiza el HTML entero.
  const head = /<head[\s\S]*?<\/head>/i.exec(html)?.[0] ?? html;
  const b = body(html);
  const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(head)?.[1];
  const metas = [...head.matchAll(/<meta\b[^>]*>/gi)].map((m) => attrs(m[0]));
  const description = metas.find((m) => m.name === 'description')?.content;
  const robots = metas.find((m) => m.name === 'robots')?.content ?? '';
  const refresh = metas.some((m) => (m['http-equiv'] ?? '').toLowerCase() === 'refresh');
  const canonical = [...head.matchAll(/<link\b[^>]*>/gi)].map((m) => attrs(m[0])).find((l) => l.rel === 'canonical')?.href;
  const lang = /<html\b[^>]*>/i.exec(html) ? attrs(/<html\b[^>]*>/i.exec(html)[0]).lang : undefined;

  const headings = [...b.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({ level: Number(m[1]), text: stripTags(m[2]) }));

  const links = [];
  for (const m of b.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const a = attrs(`<a ${m[1]}>`);
    if (a.href === undefined) continue;
    const inner = m[2];
    const imgAlt = [...inner.matchAll(/<img\b[^>]*>/gi)].map((i) => attrs(i[0]).alt ?? '').join(' ');
    const text = (stripTags(inner) || imgAlt || a['aria-label'] || a.title || '').trim();
    links.push({ href: a.href, text, rel: a.rel ?? '', hasAccessibleName: !!(stripTags(inner) || imgAlt.trim() || a['aria-label'] || a['aria-labelledby'] || a.title) });
  }

  const imgs = [...b.matchAll(/<img\b[^>]*>/gi)].map((m) => attrs(m[0]));
  const buttons = [...b.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)].map((m) => {
    const a = attrs(`<button ${m[1]}>`);
    return { named: !!(stripTags(m[2]) || a['aria-label'] || a['aria-labelledby'] || a.title || /<img\b[^>]*alt=["'][^"']+/i.test(m[2])) };
  });
  const labelFor = new Set([...b.matchAll(/<label\b[^>]*\bfor=["']([^"']+)["']/gi)].map((m) => m[1]));
  const wrapped = [...b.matchAll(/<label\b[^>]*>([\s\S]*?)<\/label>/gi)].map((m) => m[1]);
  const inputs = [...b.matchAll(/<(input|textarea|select)\b[^>]*>/gi)]
    .map((m) => attrs(m[0]))
    .filter((a) => !['hidden', 'submit', 'button', 'image', 'reset'].includes((a.type ?? '').toLowerCase()) && a.name !== 'botcheck' && a.tabindex !== '-1' && a['aria-hidden'] !== 'true')
    .map((a) => ({ ...a, labelled: !!(a['aria-label'] || a['aria-labelledby'] || (a.id && labelFor.has(a.id)) || wrapped.some((w) => new RegExp(`\\bname=["']${a.name}["']`).test(w))) }));

  return {
    title: title ? stripTags(title) : undefined,
    description,
    robots,
    noindex: /noindex/i.test(robots),
    redirect: refresh,
    canonical,
    lang,
    headings,
    links,
    imgs,
    buttons,
    inputs,
  };
}

/** `dist/a/b/index.html` -> `/a/b/`; `dist/x.html` -> `/x.html`. */
export function fileToUrl(relPath) {
  const p = '/' + relPath.replace(/\\/g, '/');
  if (p.endsWith('/index.html')) return p.slice(0, -'index.html'.length);
  return p;
}

/** Resuelve un href interno contra la URL de la página. Devuelve null si es externo o no navegable. */
export function resolveInternal(href, fromUrl, siteOrigin) {
  const h = href.trim();
  if (!h || h.startsWith('#') || /^(mailto:|tel:|javascript:|data:|sms:)/i.test(h)) return null;
  let u;
  try {
    u = new URL(h, new URL(fromUrl, siteOrigin));
  } catch {
    return null;
  }
  if (u.origin !== new URL(siteOrigin).origin) return null;
  return { path: u.pathname, search: u.search };
}

/**
 * Grafo de enlaces internos.
 * @param pages Map<url, ReturnType<parsePage>>
 * @param exists (path) => boolean   ¿existe como página o archivo estático?
 */
export function buildGraph(pages, exists, siteOrigin) {
  const outgoing = new Map();
  const inlinks = new Map([...pages.keys()].map((u) => [u, new Set()]));
  const broken = [];
  const toRedirect = [];
  const queries = [];
  for (const [url, page] of pages) {
    const targets = new Set();
    for (const link of page.links) {
      const r = resolveInternal(link.href, url, siteOrigin);
      if (!r) continue;
      if (r.search && !/^\?asunto=[\w-]+$/.test(r.search)) queries.push({ from: url, href: link.href }); // ?asunto= precarga el formulario de contacto
      const target = r.path;
      if (pages.has(target)) {
        if (pages.get(target).redirect) toRedirect.push({ from: url, to: target });
        targets.add(target);
        if (target !== url) inlinks.get(target).add(url);
      } else if (!exists(target)) {
        broken.push({ from: url, to: target });
      }
    }
    outgoing.set(url, targets);
  }
  return { outgoing, inlinks, broken, toRedirect, queries };
}

/** Profundidad de clic desde las portadas (BFS multi-origen). Las páginas inalcanzables no aparecen. */
export function clickDepths(outgoing, starts = ['/']) {
  const roots = [].concat(starts).filter((u) => outgoing.has(u));
  const depth = new Map(roots.map((u) => [u, 0]));
  const queue = [...roots];
  while (queue.length) {
    const cur = queue.shift();
    for (const next of outgoing.get(cur) ?? []) {
      if (!depth.has(next)) {
        depth.set(next, depth.get(cur) + 1);
        queue.push(next);
      }
    }
  }
  return depth;
}

const finding = (type, url, detail) => ({ type, severity: SEVERITY[type], url, detail });

/** Comprobaciones por página (on-page + accesibilidad básica). */
export function auditPage(url, p) {
  const out = [];
  if (p.redirect) return out;
  if (!p.title) out.push(finding('missing-title', url, 'sin <title>'));
  else if (p.title.length > TITLE_MAX) out.push(finding('title-long', url, `${p.title.length} caracteres (máx. ${TITLE_MAX}): ${p.title}`));
  if (!p.lang) out.push(finding('missing-lang', url, '<html> sin lang'));
  if (!p.noindex) {
    if (!p.canonical) out.push(finding('missing-canonical', url, 'sin <link rel="canonical">'));
    if (!p.description) out.push(finding('description-missing', url, 'sin meta description'));
    else if (p.description.length > DESCRIPTION_MAX) out.push(finding('description-long', url, `${p.description.length} caracteres (máx. ${DESCRIPTION_MAX})`));
  }
  const h1s = p.headings.filter((h) => h.level === 1);
  if (h1s.length === 0) out.push(finding('missing-h1', url, 'sin <h1>'));
  if (h1s.length > 1) out.push(finding('multiple-h1', url, `${h1s.length} <h1>`));
  let prev = 0;
  for (const h of p.headings) {
    if (prev && h.level > prev + 1) {
      out.push(finding('heading-skip', url, `h${prev} -> h${h.level}: ${h.text}`));
      break;
    }
    prev = h.level;
  }
  for (const img of p.imgs) if (img.alt === undefined) out.push(finding('img-no-alt', url, `<img src="${img.src ?? ''}"> sin alt (usa alt="" si es decorativa)`));
  for (const l of p.links) {
    if (!l.hasAccessibleName) out.push(finding('empty-link', url, `enlace vacío a ${l.href}`));
    else if (GENERIC_ANCHORS.has(l.text.toLowerCase().replace(/[.:!→>]+$/g, '').trim())) out.push(finding('generic-anchor', url, `"${l.text}" -> ${l.href}`));
  }
  for (const b of p.buttons) if (!b.named) out.push(finding('empty-button', url, 'botón sin texto ni aria-label'));
  for (const i of p.inputs) if (!i.labelled) out.push(finding('input-no-label', url, `campo ${i.name ?? i.id ?? i.type ?? ''} sin <label>`));
  return out;
}

/**
 * Auditoría completa del sitio.
 * @param opts.important  URLs "importantes" (las del mapa de temas) para exigir enlaces entrantes mínimos.
 */
/**
 * @param {{ pages: Map<string, any>, exists: (path: string) => boolean, siteOrigin: string, important?: string[], homes?: string[] }} opts
 */
export function auditSite({ pages, exists, siteOrigin, important = [], homes = ['/', '/en/'] }) {
  const findings = [];
  for (const [url, p] of pages) findings.push(...auditPage(url, p));

  // Títulos duplicados entre páginas indexables (ES y EN comparten marca pero no título).
  // Se comparan dentro de cada idioma: un "Devlog | Kuxar Studio" igual en ES y EN no es duplicado.
  const byTitle = new Map();
  for (const [url, p] of pages) {
    if (p.redirect || p.noindex || !p.title) continue;
    const k = `${p.lang ?? ''}\u0000${p.title}`;
    byTitle.set(k, [...(byTitle.get(k) ?? []), url]);
  }
  for (const [k, urls] of byTitle) if (urls.length > 1) findings.push(finding('duplicate-title', urls[0], `"${k.split('\u0000')[1]}" repetido en ${urls.join(', ')}`));

  const g = buildGraph(pages, exists, siteOrigin);
  for (const b of g.broken) findings.push(finding('broken-link', b.from, `enlace roto -> ${b.to}`));
  for (const r of g.toRedirect) findings.push(finding('link-to-redirect', r.from, `enlaza a ${r.to}, que es una redirección: enlaza al destino final`));
  for (const q of g.queries) findings.push(finding('query-string-link', q.from, `parámetros en el enlace ${q.href}`));

  // Cada idioma tiene su portada; el selector de idioma es un control global, no un nivel de navegación.
  const depth = clickDepths(g.outgoing, homes);
  for (const [url, p] of pages) {
    if (p.redirect || p.noindex) continue;
    const d = depth.get(url);
    if (d === undefined) findings.push(finding('orphan-page', url, 'no se llega a ella desde la home siguiendo enlaces'));
    else if (d > MAX_CLICK_DEPTH) findings.push(finding('click-depth', url, `a ${d} clics de la home (máx. ${MAX_CLICK_DEPTH})`));
  }
  for (const url of important) {
    const n = g.inlinks.get(url)?.size ?? 0;
    if (pages.has(url) && n < MIN_INLINKS_IMPORTANT) findings.push(finding('low-inlinks', url, `solo ${n} enlaces internos entrantes (mínimo ${MIN_INLINKS_IMPORTANT})`));
  }
  return { findings, graph: g, depth };
}

/**
 * Paridad entre el mapa de temas y el sitio publicado.
 * @param topicMap  objeto ya parseado de topic-map.yaml
 * @param guides    [{ key, project, es: '/guias/x/'|undefined, en: '/en/guides/y/'|undefined }]
 * @param sitemapUrls Set de rutas (pathname) presentes en el sitemap
 */
export function topicParity({ topicMap, guides, sitemapUrls }) {
  const findings = [];
  /** @type {Record<string, { live: number, planned: number, total: number, ratio: number }>} */
  const coverage = {};
  for (const [projectId, project] of Object.entries(topicMap.projects ?? {})) {
    const mapped = new Map((project.topics ?? []).map((t) => [t.key, t]));
    const live = [...mapped.values()].filter((t) => t.status === 'live');
    let alive = 0;
    for (const t of live) {
      const g = guides.find((x) => x.key === t.key && x.project === projectId);
      if (!g) {
        findings.push(finding('topic-invisible', `topic:${projectId}/${t.key}`, `en el mapa como "live" pero no existe la guía (key "${t.key}")`));
        continue;
      }
      let ok = true;
      for (const lang of ['es', 'en']) {
        if (!g[lang]) {
          ok = false;
          findings.push(finding('topic-missing-translation', `topic:${projectId}/${t.key}`, `falta la versión ${lang.toUpperCase()}`));
        } else if (!sitemapUrls.has(g[lang])) {
          ok = false;
          findings.push(finding('topic-invisible', g[lang], `en el mapa pero ausente del sitemap (${t.key})`));
        }
      }
      if (ok) alive++;
    }
    for (const g of guides.filter((x) => x.project === projectId)) {
      if (!mapped.has(g.key)) findings.push(finding('topic-orphan', g.es ?? g.en ?? `topic:${projectId}/${g.key}`, `guía "${g.key}" sin tema en el mapa de ${projectId}`));
    }
    const total = [...mapped.values()].length;
    coverage[projectId] = { live: alive, planned: total - live.length, total, ratio: total ? alive / total : 0 };
  }
  return { findings, coverage };
}
