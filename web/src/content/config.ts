import { defineCollection, z } from 'astro:content';

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
  type: 'content',
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
    repo: z.string().url().optional(),
    githubRepo: z.string().optional(),
    googlePlay: z.string().url().optional(),
    appStore: z.string().url().optional(),
    steam: z.string().url().optional(),
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
        googlePlay: z.string().url().optional(),
      })
      .optional(),
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
    en: z.object({ description: z.string() }).optional(),
  }),
});

const devlogSchema = z.object({
  title: z.string(),
  date: z.date(),
  project: z.string(),
  excerpt: z.string(),
});

const devlog = defineCollection({ type: 'content', schema: devlogSchema });

// Entradas del devlog en inglés. Mismo nombre de archivo que la entrada en
// español = mismo slug (/devlog/x/ <-> /en/devlog/x/). Una entrada sin
// traducir simplemente no aparece en la versión inglesa.
const devlogEn = defineCollection({ type: 'content', schema: devlogSchema });

// Encargos para clientes (software a medida). Distinto de `projects`
// (productos propios: juegos y apps, con marco de móvil y enlaces a tienda):
// aquí la tarjeta muestra una captura en marco de navegador y, en vez de una
// tienda, un enlace a demo (a veces protegida con contraseña) y/o al cliente.
const work = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    /** Descripción genérica del cliente, sin nombre propio (privacidad). */
    client: z.string(),
    description: z.string(),
    stack: z.array(z.string()),
    /** Captura de la app en marco de navegador (no de móvil). */
    image: z.object({ src: z.string(), alt: z.string() }),
    status: z.enum(['entregado', 'en-desarrollo']),
    demoUrl: z.string().url().optional(),
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

export const collections = { projects, tools, devlog, 'devlog-en': devlogEn, work };
