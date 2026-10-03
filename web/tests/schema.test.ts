import { describe, it, expect } from 'vitest';
import { blogPosting, breadcrumbForRoute, breadcrumbList, itemList, toolApplication } from '../src/lib/schema';

const SITE = 'https://kuxarstudio.com';

describe('breadcrumbList', () => {
  it('empieza en la home del idioma y numera desde 1', () => {
    const es = breadcrumbList(SITE, 'es', [{ name: 'Proyectos', path: '/portfolio/' }]);
    expect(es.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Proyectos', item: `${SITE}/portfolio/` },
    ]);
    const en = breadcrumbList(SITE, 'en', [{ name: 'Projects', path: '/en/projects/' }]);
    expect(en.itemListElement[0]).toMatchObject({ name: 'Home', item: `${SITE}/en/` });
  });

  it('breadcrumbForRoute usa la ruta del idioma', () => {
    const b = breadcrumbForRoute(SITE, 'en', 'tools', 'Tools');
    expect(b.itemListElement[1].item).toBe(`${SITE}/en/tools/`);
  });
});

describe('blogPosting', () => {
  const base = {
    site: SITE,
    lang: 'es' as const,
    path: '/devlog/x/',
    headline: 'Título',
    description: 'Resumen',
    datePublished: new Date('2026-03-10T00:00:00Z'),
    image: `${SITE}/og-image.png`,
  };

  it('usa fecha ISO corta y la organización como autor', () => {
    const p = blogPosting(base);
    expect(p.datePublished).toBe('2026-03-10');
    expect(p.author).toEqual({ '@id': `${SITE}/#organization` });
    expect(p.mainEntityOfPage['@id']).toBe(`${SITE}/devlog/x/`);
  });

  it('no inventa dateModified ni about', () => {
    const p = blogPosting(base);
    expect('dateModified' in p).toBe(false);
    expect('about' in p).toBe(false);
  });

  it('incluye dateModified y about cuando se dan', () => {
    const p = blogPosting({ ...base, dateModified: new Date('2026-04-01T00:00:00Z'), about: 'Nadir' });
    expect(p.dateModified).toBe('2026-04-01');
    expect(p.about).toEqual({ '@type': 'Thing', name: 'Nadir' });
  });
});

describe('toolApplication', () => {
  it('omite offers y operatingSystem', () => {
    const t = toolApplication({ site: SITE, name: 'PDF-Blender', description: 'd', lang: 'es', url: `${SITE}/herramientas/` });
    expect('offers' in t).toBe(false);
    expect('operatingSystem' in t).toBe(false);
    expect(t['@type']).toBe('SoftwareApplication');
  });
});

describe('itemList', () => {
  it('numera los elementos desde 1', () => {
    const l = itemList([{ name: 'A', url: 'u1' }, { name: 'B', url: 'u2' }]);
    expect(l.itemListElement.map((e) => e.position)).toEqual([1, 2]);
  });
});
