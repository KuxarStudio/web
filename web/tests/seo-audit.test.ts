import { describe, expect, it } from 'vitest';
import { auditPage, auditSite, buildGraph, clickDepths, fileToUrl, parsePage, resolveInternal, topicParity } from '../scripts/seo-audit/lib.mjs';

const page = (body: string, head = '<title>Hola | Kuxar Studio</title><meta name="description" content="Descripción"><link rel="canonical" href="https://kuxarstudio.com/x/">') =>
  `<!doctype html><html lang="es"><head>${head}</head><body>${body}</body></html>`;
const types = (findings: { type: string }[]) => findings.map((f) => f.type);

describe('parsePage', () => {
  it('extrae título, descripción, canonical, lang y encabezados', () => {
    const p = parsePage(page('<h1>Uno</h1><h2>Dos</h2>'));
    expect(p.title).toBe('Hola | Kuxar Studio');
    expect(p.description).toBe('Descripción');
    expect(p.canonical).toBe('https://kuxarstudio.com/x/');
    expect(p.lang).toBe('es');
    expect(p.headings.map((h: { level: number }) => h.level)).toEqual([1, 2]);
  });

  it('detecta redirecciones de Astro (sin <head>) y noindex', () => {
    expect(parsePage('<!doctype html><title>Redirecting to: /a/</title><meta http-equiv="refresh" content="0;url=/a/">').redirect).toBe(true);
    expect(parsePage(page('<h1>x</h1>', '<meta name="robots" content="noindex, follow">')).noindex).toBe(true);
  });

  it('ignora el contenido de scripts y estilos al leer enlaces', () => {
    const p = parsePage(page('<h1>x</h1><script>var a = "<a href=\'/falso/\'>x</a>"</script><a href="/real/">Real</a>'));
    expect(p.links.map((l: { href: string }) => l.href)).toEqual(['/real/']);
  });
});

describe('auditPage', () => {
  it('pasa con una página correcta', () => {
    expect(auditPage('/x/', parsePage(page('<h1>Título</h1><img src="a.png" alt="a"><a href="/y/">Guía de kana</a>')))).toEqual([]);
  });

  it('marca h1 ausente o múltiple, img sin alt, enlaces y botones vacíos', () => {
    const t = types(auditPage('/x/', parsePage(page('<img src="a.png"><a href="/y/"></a><button></button>'))));
    expect(t).toEqual(expect.arrayContaining(['missing-h1', 'img-no-alt', 'empty-link', 'empty-button']));
    expect(types(auditPage('/x/', parsePage(page('<h1>a</h1><h1>b</h1>'))))).toContain('multiple-h1');
  });

  it('acepta alt vacío (decorativa) y enlaces con aria-label', () => {
    const t = types(auditPage('/x/', parsePage(page('<h1>a</h1><img src="a.png" alt=""><a href="/y/" aria-label="Inicio"><svg></svg></a>'))));
    expect(t).not.toContain('img-no-alt');
    expect(t).not.toContain('empty-link');
  });

  it('avisa de anclas genéricas, título largo y descripción larga', () => {
    const long = 'x'.repeat(61);
    const p = parsePage(page('<h1>a</h1><a href="/y/">Haz clic aquí</a>', `<title>${long}</title><meta name="description" content="${'d'.repeat(161)}"><link rel="canonical" href="https://kuxarstudio.com/x/">`));
    expect(types(auditPage('/x/', p))).toEqual(expect.arrayContaining(['generic-anchor', 'title-long', 'description-long']));
  });

  it('exige label en los campos de formulario', () => {
    const sin = types(auditPage('/x/', parsePage(page('<h1>a</h1><input name="email" id="e">'))));
    const con = types(auditPage('/x/', parsePage(page('<h1>a</h1><label for="e">Email</label><input name="email" id="e">'))));
    expect(sin).toContain('input-no-label');
    expect(con).not.toContain('input-no-label');
  });

  it('avisa si el producto aparece como "Kaku" sin exclamación', () => {
    expect(types(auditPage('/x/', parsePage(page('<h1>a</h1><p>Prueba Kaku hoy.</p>'))))).toContain('brand-name');
    expect(types(auditPage('/x/', parsePage(page('<h1>a</h1><p>Prueba Kaku! hoy.</p>'))))).not.toContain('brand-name');
  });

  it('no exige canonical ni descripción a las páginas noindex', () => {
    const t = types(auditPage('/x/', parsePage(page('<h1>a</h1>', '<title>t</title><meta name="robots" content="noindex">'))));
    expect(t).not.toContain('missing-canonical');
    expect(t).not.toContain('description-missing');
  });
});

describe('grafo de enlaces', () => {
  const site = 'https://kuxarstudio.com';
  const mk = (links: string[]) => parsePage(page(`<h1>x</h1>${links.map((l) => `<a href="${l}">Texto</a>`).join('')}`));

  it('resuelve enlaces relativos, ignora externos, mailto y anclas', () => {
    expect(resolveInternal('../b/', '/a/c/', site)).toEqual({ path: '/a/b/', search: '' });
    expect(resolveInternal('https://otro.com/', '/', site)).toBeNull();
    expect(resolveInternal('mailto:a@b.c', '/', site)).toBeNull();
    expect(resolveInternal('#contacto', '/', site)).toBeNull();
    expect(resolveInternal('/a/?q=1#x', '/', site)).toEqual({ path: '/a/', search: '?q=1' });
  });

  it('detecta enlaces rotos, a redirecciones y calcula profundidad', () => {
    const pages = new Map<string, unknown>([
      ['/', mk(['/a/', '/roto/', '/viejo/'])],
      ['/a/', mk(['/b/'])],
      ['/b/', mk(['/c/'])],
      ['/c/', mk(['/d/'])],
      ['/d/', mk([])],
      ['/huerfana/', mk([])],
      ['/viejo/', parsePage('<title>Redirecting</title><meta http-equiv="refresh" content="0;url=/a/">')],
    ]);
    const g = buildGraph(pages, () => false, site);
    expect(g.broken).toEqual([{ from: '/', to: '/roto/' }]);
    expect(g.toRedirect).toEqual([{ from: '/', to: '/viejo/' }]);
    const depth = clickDepths(g.outgoing, ['/']);
    expect(depth.get('/d/')).toBe(4);
    expect(depth.has('/huerfana/')).toBe(false);

    const { findings } = auditSite({ pages, exists: () => false, siteOrigin: site, important: ['/b/'] });
    const t = types(findings);
    expect(t).toEqual(expect.arrayContaining(['broken-link', 'link-to-redirect', 'click-depth', 'orphan-page', 'low-inlinks']));
  });

  it('un archivo estático existente no cuenta como enlace roto', () => {
    const pages = new Map<string, unknown>([['/', mk(['/logo.png'])]]);
    expect(buildGraph(pages, (p: string) => p === '/logo.png', site).broken).toEqual([]);
  });

  it('dos portadas (ES y EN) cuentan como raíces', () => {
    const pages = new Map<string, unknown>([['/', mk([])], ['/en/', mk(['/en/g/'])], ['/en/g/', mk([])]]);
    const g = buildGraph(pages, () => false, site);
    expect(clickDepths(g.outgoing, ['/', '/en/']).get('/en/g/')).toBe(1);
  });
});

describe('fileToUrl', () => {
  it('convierte rutas de dist en URLs', () => {
    expect(fileToUrl('index.html')).toBe('/');
    expect(fileToUrl('guias/x/index.html')).toBe('/guias/x/');
    expect(fileToUrl('devlog.html')).toBe('/devlog.html');
  });
});

describe('topicParity', () => {
  const topicMap = {
    projects: {
      kaku: {
        topics: [
          { key: 'a', status: 'live' },
          { key: 'b', status: 'live' },
          { key: 'c', status: 'planned' },
        ],
      },
    },
  };

  it('todo en orden: cobertura = live / total', () => {
    const guides = [
      { key: 'a', project: 'kaku', es: '/guias/a/', en: '/en/guides/a/' },
      { key: 'b', project: 'kaku', es: '/guias/b/', en: '/en/guides/b/' },
    ];
    const r = topicParity({ topicMap, guides, sitemapUrls: new Set(['/guias/a/', '/en/guides/a/', '/guias/b/', '/en/guides/b/']) });
    expect(r.findings).toEqual([]);
    expect(r.coverage.kaku).toMatchObject({ live: 2, planned: 1, total: 3 });
  });

  it('detecta guía huérfana, tema invisible y traducción ausente', () => {
    const guides = [
      { key: 'a', project: 'kaku', es: '/guias/a/' }, // falta EN
      { key: 'z', project: 'kaku', es: '/guias/z/', en: '/en/guides/z/' }, // no está en el mapa
    ];
    const r = topicParity({ topicMap, guides, sitemapUrls: new Set(['/guias/a/']) });
    const t = types(r.findings);
    expect(t).toEqual(expect.arrayContaining(['topic-missing-translation', 'topic-invisible', 'topic-orphan']));
    expect(r.coverage.kaku.live).toBe(0);
  });

  it('una guía en el mapa pero ausente del sitemap es invisible', () => {
    const guides = [
      { key: 'a', project: 'kaku', es: '/guias/a/', en: '/en/guides/a/' },
      { key: 'b', project: 'kaku', es: '/guias/b/', en: '/en/guides/b/' },
    ];
    const r = topicParity({ topicMap, guides, sitemapUrls: new Set(['/guias/a/', '/en/guides/a/', '/guias/b/']) });
    expect(r.findings).toHaveLength(1);
    expect(r.findings[0]).toMatchObject({ type: 'topic-invisible', url: '/en/guides/b/' });
  });
});
