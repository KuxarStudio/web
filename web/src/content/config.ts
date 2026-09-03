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
