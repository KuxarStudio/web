// Copy de las páginas de listado (proyectos, herramientas, devlog).
import type { Lang } from './index';

export interface ListingCopy { title: string; description: string; h1: string; intro: string }

export const projectsPage: Record<Lang, ListingCopy> = {
  es: {
    title: 'Proyectos | Kuxar Studio',
    description: 'Juegos, apps y herramientas de Kuxar Studio: Kaku!, BlindNote, Nadir: Protocol 1-Star y PDF-Blender, con su estado y enlaces.',
    h1: 'Proyectos',
    intro: 'Todo lo que hemos publicado y lo que tenemos en marcha.',
  },
  en: {
    title: 'Projects | Kuxar Studio',
    description: 'Games, apps and tools by Kuxar Studio: Kaku!, BlindNote, Nadir: Protocol 1-Star and PDF-Blender, with their status and links.',
    h1: 'Projects',
    intro: 'Everything we have published and what we have in the works.',
  },
};

export const toolsPage: Record<Lang, ListingCopy> = {
  es: {
    title: 'Herramientas | Kuxar Studio',
    description: 'Herramientas de Kuxar Studio: utilidades offline como PDF-Blender, con su stack y enlaces de descarga.',
    h1: 'Herramientas',
    intro: 'Utilidades que hacemos para nuestro propio trabajo y publicamos para quien las necesite.',
  },
  en: {
    title: 'Tools | Kuxar Studio',
    description: 'Tools by Kuxar Studio: offline utilities such as PDF-Blender, with their stack and download links.',
    h1: 'Tools',
    intro: 'Utilities we build for our own work and publish for anyone who needs them.',
  },
};

export const guidesPage: Record<Lang, ListingCopy & { partOf: string; related: string; pillarLabel: string; back: string }> = {
  es: {
    title: 'Guías | Kuxar Studio',
    description: 'Guías prácticas de Kuxar Studio sobre escritura japonesa y las herramientas que construimos.',
    h1: 'Guías',
    intro: 'Guías prácticas, ordenadas por tema.',
    partOf: 'Parte de la guía',
    related: 'Sigue leyendo',
    pillarLabel: 'Guía completa',
    back: '← Todas las guías',
  },
  en: {
    title: 'Guides | Kuxar Studio',
    description: 'Practical guides from Kuxar Studio on writing Japanese and the tools we build.',
    h1: 'Guides',
    intro: 'Practical guides, grouped by topic.',
    partOf: 'Part of the guide',
    related: 'Keep reading',
    pillarLabel: 'Full guide',
    back: '← All guides',
  },
};

export const devlogPage: Record<Lang, ListingCopy> = {
  es: {
    title: 'Devlog | Kuxar Studio',
    description: 'Notas de desarrollo de Kuxar Studio: decisiones y avances reales de Nadir, Kaku! y BlindNote.',
    h1: 'Devlog',
    intro: 'Cómo avanzan los proyectos, contado por quienes los hacen.',
  },
  en: {
    title: 'Devlog | Kuxar Studio',
    description: 'Development notes from Kuxar Studio: real decisions and progress on Nadir, Kaku! and BlindNote.',
    h1: 'Devlog',
    intro: 'How the projects are going, told by the people building them.',
  },
};
