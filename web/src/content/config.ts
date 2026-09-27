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
    /** Ruta interna a la entrada de devlog más reciente del proyecto. */
    devlog: z.string().optional(),
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
  }),
});

export const collections = { projects, tools, devlog, work };
