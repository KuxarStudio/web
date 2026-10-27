import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Cada colección lee los .md de su carpeta en src/content/<nombre>/. El id de
// cada entrada es el nombre de archivo sin extensión (lo que antes era `slug`).
const md = (dir: string) => glob({ pattern: '**/*.md', base: `./src/content/${dir}` });

// Medio que se muestra en el marco de teléfono de la tarjeta de proyecto.
// Vídeo corto en bucle (mp4 + webm opcional, sin audio) o imagen. Si un
// proyecto no tiene medio, la tarjeta muestra una ficha tipográfica.
const media = z.object({
  kind: z.enum(['video', 'image']),
  src: z.string(),
  webm: z.string().optional(),
  poster: z.string().optional(),
  alt: z.string(),
});

// Traducciones al inglés de un elemento de contenido, dentro del propio
// frontmatter (`en:`). Solo los campos de texto; el resto se hereda. Ver
// `localize()` en src/i18n/index.ts.
const projects = defineCollection({
  loader: md('projects'),
  schema: z.object({
    title: z.string(),
    category: z.enum(['juego', 'aprendizaje']),
    status: z.enum(['en-desarrollo', 'proximamente', 'disponible']),
    description: z.string(),
    stack: z.array(z.string()),
    media: media.optional(),
    /** Progreso de desarrollo (fases), para la ficha cuando no hay medio. */
    progress: z
      .object({ current: z.number().int().min(0), total: z.number().int().min(1), label: z.string() })
      .refine((p) => p.current <= p.total, { message: "current no puede superar total" })
      .optional(),
    repo: z.url().optional(),
    githubRepo: z.string().optional(),
    googlePlay: z.url().optional(),
    appStore: z.url().optional(),
    steam: z.url().optional(),
    /** Ruta interna a la página propia del proyecto (ficha SEO), si existe. */
    page: z.string().optional(),
    /** Ruta interna a la entrada de devlog más reciente del proyecto. */
    devlog: z.string().optional(),
    featured: z.boolean().default(true),
    order: z.number().default(0),
    en: z
      .object({
        description: z.string().optional(),
        media: media.partial().optional(),
        progress: z.object({ label: z.string() }).optional(),
        /** Ruta de la página propia en inglés (p. ej. /en/kaku/). */
        page: z.string().optional(),
        /** Ruta de la entrada de devlog en inglés. */
        devlog: z.string().optional(),
        googlePlay: z.url().optional(),
      })
      .optional(),
  }),
});

const tools = defineCollection({
  loader: md('tools'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    stack: z.array(z.string()),
    installCmd: z.string(),
    repo: z.url().optional(),
    githubRepo: z.string().optional(),
    releasesUrl: z.url().optional(),
    en: z.object({ description: z.string() }).optional(),
  }),
});

const devlogSchema = z.object({
  title: z.string(),
  date: z.date(),
  project: z.string(),
  excerpt: z.string(),
});

const devlog = defineCollection({ loader: md('devlog'), schema: devlogSchema });

// Entradas del devlog en inglés. Mismo nombre de archivo que la entrada en
// español = mismo slug (/devlog/x/ <-> /en/devlog/x/). Una entrada sin
// traducir simplemente no aparece en la versión inglesa.
const devlogEn = defineCollection({ loader: md('devlog-en'), schema: devlogSchema });

// Encargos para clientes (software a medida). Distinto de `projects`
// (productos propios: juegos y apps, con marco de móvil y enlaces a tienda):
// aquí la tarjeta muestra una captura en marco de navegador y, en vez de una
// tienda, un enlace a demo (a veces protegida con contraseña) y/o al cliente.
const work = defineCollection({
  loader: md('work'),
  schema: z.object({
    title: z.string(),
    /** Descripción genérica del cliente, sin nombre propio (privacidad). */
    client: z.string(),
    description: z.string(),
    stack: z.array(z.string()),
    /** Captura de la app en marco de navegador (no de móvil). */
    image: z.object({ src: z.string(), alt: z.string() }),
    status: z.enum(['entregado', 'en-desarrollo']),
    demoUrl: z.url().optional(),
    /** Nota junto al enlace de demo, p. ej. "protegida con contraseña". */
    demoNote: z.string().optional(),
    featured: z.boolean().default(true),
    order: z.number().default(0),
    en: z
      .object({
        client: z.string().optional(),
        description: z.string().optional(),
        stack: z.array(z.string()).optional(),
        image: z.object({ alt: z.string() }).optional(),
        demoNote: z.string().optional(),
      })
      .optional(),
  }),
});

// Guías (clusters de contenido). Una guía "pilar" por proyecto y varias guías
// "cluster" que cuelgan de ella (campo `pillar` = slug del pilar). Misma
// convención que el devlog, pero con slug propio por idioma (URLs localizadas):
// la versión ES y la EN se emparejan por `key`. Ver src/lib/guides.ts.
const guideSchema = z.object({
  /** Clave que une la versión ES y EN de una guía (el slug sí es distinto por idioma). */
  key: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.date(),
  /** Fecha de la última revisión real del contenido (alimenta dateModified). */
  updated: z.date().optional(),
  /** Id del proyecto al que pertenece el cluster (p. ej. 'kaku'). */
  project: z.string(),
  role: z.enum(['pillar', 'cluster']),
  /** Solo en `cluster`: `key` de la guía pilar a la que enlaza. */
  pillar: z.string().optional(),
  order: z.number().default(0),
}).refine((g) => g.role === 'pillar' || !!g.pillar, { message: 'Un cluster necesita `pillar`' });

const guides = defineCollection({ loader: md('guides'), schema: guideSchema });
const guidesEn = defineCollection({ loader: md('guides-en'), schema: guideSchema });

export const collections = { projects, tools, devlog, 'devlog-en': devlogEn, work, guides, 'guides-en': guidesEn };
