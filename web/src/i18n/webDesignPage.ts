// Copy de la página de diseño web (/diseno-web/, /en/web-design/).
// Regla del repo: nada de precios, plazos ni garantías inventadas. Lo único
// confirmado es que el código es del cliente al terminar; el resto describe
// cómo trabajamos y lo que se puede comprobar en esta misma web.
import type { Lang } from './index';

interface Titled {
  title: string;
  desc: string;
}

export interface WebDesignPageCopy {
  title: string;
  description: string;
  breadcrumb: string;
  back: string;
  eyebrow: string;
  h1: string;
  sub: string;
  cta: string;
  howLink: string;
  proof: string[];
  mock: { caption: string; desktopAlt: string; mobileAlt: string };
  includes: { h2: string; intro: string; items: Titled[] };
  kinds: {
    h2: string;
    intro: string;
    items: (Titled & { link?: { label: string; target: 'kaku' | 'parte' | 'case' } })[];
  };
  process: { h2: string; intro: string; outLabel: string; steps: (Titled & { out: string })[] };
  caseStudy: {
    h2: string;
    paragraphs: string[];
    facts: [string, string][];
    appTitle: string;
    appIntro: string;
  };
  faqTitle: string;
  faq: { q: string; a: string }[];
  closing: { h2: string; text: string };
  /** `serviceType` del JSON-LD. */
  serviceType: string;
}

export const webDesignPage: Record<Lang, WebDesignPageCopy> = {
  es: {
    title: 'Diseño web a medida para empresas | Kuxar Studio',
    description:
      'Diseñamos y programamos webs a medida para empresas: rápidas, pensadas para el móvil, con SEO técnico y en varios idiomas. El código es tuyo.',
    breadcrumb: 'Diseño web',
    back: '← Kuxar Studio para empresas',
    eyebrow: 'Diseño web',
    h1: 'Diseño web a medida, pensado para que te encuentren.',
    sub: 'Diseñamos y programamos la web de tu empresa desde cero: adaptada al móvil, rápida y con el SEO técnico hecho desde la base. Sin plantillas, y al terminar el código es tuyo.',
    cta: 'Cuéntanos tu proyecto',
    howLink: 'Cómo trabajamos →',
    proof: ['El código es tuyo', 'Sin plantillas', 'Móvil primero'],
    mock: {
      caption: 'kuxarstudio.com, la web que estás viendo: diseñada y programada por nosotros.',
      desktopAlt: 'Página de inicio de kuxarstudio.com en un navegador de escritorio.',
      mobileAlt: 'La misma página de inicio de kuxarstudio.com en un teléfono.',
    },
    includes: {
      h2: 'Qué incluye',
      intro: 'Lo mismo que hemos aplicado a nuestra propia web, aplicado a la tuya.',
      items: [
        {
          title: 'Diseño a medida',
          desc: 'Partimos de tu negocio y de quién te busca, no de una plantilla. Revisas el diseño antes de que escribamos una línea de código.',
        },
        {
          title: 'Pensada primero para el móvil',
          desc: 'Gran parte de las visitas llegan desde el teléfono, así que diseñamos y probamos ahí primero, y después ampliamos a escritorio.',
        },
        {
          title: 'SEO técnico desde la base',
          desc: 'Títulos y descripciones por página, datos estructurados, sitemap y enlazado interno, para que los buscadores entiendan qué ofreces.',
        },
        {
          title: 'Rápida y fácil de mantener',
          desc: 'Siempre que encaja, webs estáticas: cargan casi al instante, tienen menos piezas que se puedan romper y alojarlas cuesta poco o nada.',
        },
        {
          title: 'En los idiomas que necesites',
          desc: 'Cada idioma con su propia dirección y las etiquetas que los buscadores usan para enseñar la versión correcta a cada persona.',
        },
        {
          title: 'Conectada con lo que ya usas',
          desc: 'Formularios que llegan a tu email, reservas, tu CRM o la API que haga falta. Y analítica solo si el visitante la acepta.',
        },
      ],
    },
    kinds: {
      h2: 'Qué tipo de web necesitas',
      intro: 'Tres puntos de partida habituales. Si lo tuyo no encaja en ninguno, también lo hablamos.',
      items: [
        {
          title: 'Web de empresa',
          desc: 'Quiénes sois, qué ofrecéis y cómo contactar. Para que quien te busque encuentre una web clara, rápida y al día.',
        },
        {
          title: 'Landing de producto o servicio',
          desc: 'Una página centrada en una sola cosa, con una llamada a la acción clara. Como las que hemos hecho para nuestros productos.',
          link: { label: 'Ver la landing de Kaku! →', target: 'kaku' },
        },
        {
          title: 'Web con funcionalidades',
          desc: 'Reservas, área privada o un panel propio. Cuando la web necesita lógica, la desarrollamos como software a medida.',
          link: { label: 'Ver un ejemplo: GoCita →', target: 'case' },
        },
      ],
    },
    process: {
      h2: 'Cómo trabajamos',
      intro: 'Cuatro pasos, y en cada uno sabes qué recibes.',
      outLabel: 'Recibes',
      steps: [
        {
          title: 'Hablamos',
          desc: 'Nos cuentas tu negocio, a quién quieres llegar y qué tiene que conseguir la web.',
          out: 'una propuesta con el alcance y el precio.',
        },
        {
          title: 'Diseñamos',
          desc: 'Estructura de páginas y diseño visual, empezando por el móvil. Lo revisas y lo ajustamos antes de programar.',
          out: 'el diseño, para revisarlo.',
        },
        {
          title: 'Construimos',
          desc: 'Programamos la web, montamos los contenidos y la probamos en móvil, tablet y escritorio.',
          out: 'una versión de prueba que puedes navegar.',
        },
        {
          title: 'Publicamos',
          desc: 'La subimos a tu dominio, enviamos el sitemap a Google Search Console y te entregamos todo.',
          out: 'la web publicada y su código.',
        },
      ],
    },
    caseStudy: {
      h2: 'La prueba: esta web',
      paragraphs: [
        '**kuxarstudio.com la hemos diseñado y programado nosotros**, con los mismos criterios que aplicamos a un encargo.',
        'Está en español e inglés, se adapta al móvil, tiene modo claro y oscuro, y cada cambio pasa una **auditoría SEO automática** antes de publicarse: si hay un enlace roto o falta un título, no sale.',
      ],
      facts: [
        ['Tecnología', 'Astro, web estática'],
        ['Alojamiento', 'GitHub Pages, sin coste de servidor'],
        ['Idiomas', 'Español e inglés, con hreflang'],
        ['Buscadores', 'Datos estructurados y sitemap'],
        ['Calidad', 'Auditoría SEO en cada publicación'],
        ['Privacidad', 'Analítica solo con consentimiento'],
      ],
      appTitle: 'Y cuando la web necesita lógica',
      appIntro: 'Para un taller mecánico hicimos una aplicación web a medida para gestionar su agenda de citas.',
    },
    faqTitle: 'Preguntas frecuentes',
    faq: [
      {
        q: '¿De quién es la web cuando la terminamos?',
        a: 'Tuya. Al terminar te entregamos el código.',
      },
      {
        q: '¿Cuánto cuesta una web a medida?',
        a: 'Depende de lo que necesites: número de páginas, idiomas y funcionalidades. Cuéntanos tu proyecto y te enviamos una propuesta con el alcance y el precio.',
      },
      {
        q: '¿Usáis WordPress o plantillas?',
        a: 'No partimos de plantillas. Elegimos la tecnología según el proyecto; para webs de contenido preferimos webs estáticas, como esta (hecha con Astro), porque son rápidas, seguras y baratas de alojar.',
      },
      {
        q: '¿Podré cambiar yo los textos?',
        a: 'Si lo necesitas, lo planteamos desde el principio para que puedas editar los contenidos sin tocar código. Coméntalo en la primera conversación.',
      },
      {
        q: '¿Hacéis webs en varios idiomas?',
        a: 'Sí. Esta misma web está en español e inglés, cada idioma con su propia dirección y las etiquetas hreflang que usa Google.',
      },
      {
        q: '¿Y si después necesito una app o una herramienta?',
        a: 'La web puede crecer con tu negocio: también desarrollamos apps y herramientas a medida, pensadas para conectarse con lo que ya tienes.',
      },
    ],
    closing: {
      h2: '¿Hablamos de tu web?',
      text: 'Cuéntanos a qué se dedica tu empresa y qué necesitas. Te respondemos por email.',
    },
    serviceType: 'Diseño y desarrollo web a medida',
  },
  en: {
    title: 'Custom web design for businesses | Kuxar Studio',
    description:
      'We design and build custom websites for businesses: fast, mobile first, with technical SEO and in several languages. The code is yours.',
    breadcrumb: 'Web design',
    back: '← Kuxar Studio for businesses',
    eyebrow: 'Web design',
    h1: 'Custom web design, built to be found.',
    sub: 'We design and build your company website from scratch: mobile first, fast and with technical SEO built in from the start. No templates, and when we finish the code is yours.',
    cta: 'Tell us about your project',
    howLink: 'How we work →',
    proof: ['The code is yours', 'No templates', 'Mobile first'],
    mock: {
      caption: 'kuxarstudio.com, the site you are looking at: designed and built by us.',
      desktopAlt: 'The kuxarstudio.com homepage in a desktop browser.',
      mobileAlt: 'The same kuxarstudio.com homepage on a phone.',
    },
    includes: {
      h2: 'What is included',
      intro: 'The same things we did for our own website, applied to yours.',
      items: [
        {
          title: 'Custom design',
          desc: 'We start from your business and the people looking for you, not from a template. You review the design before we write a line of code.',
        },
        {
          title: 'Mobile first',
          desc: 'A large share of visits come from phones, so we design and test there first, then scale up to desktop.',
        },
        {
          title: 'Technical SEO from the ground up',
          desc: 'Titles and descriptions for every page, structured data, a sitemap and internal linking, so search engines understand what you offer.',
        },
        {
          title: 'Fast and easy to maintain',
          desc: 'Static sites whenever they fit: they load almost instantly, have fewer moving parts to break and cost little or nothing to host.',
        },
        {
          title: 'In the languages you need',
          desc: 'Each language gets its own address and the tags search engines use to show every visitor the right version.',
        },
        {
          title: 'Connected to what you already use',
          desc: 'Forms that reach your inbox, bookings, your CRM or whatever API you need. And analytics only if the visitor accepts it.',
        },
      ],
    },
    kinds: {
      h2: 'What kind of website do you need?',
      intro: 'Three common starting points. If yours does not fit any of them, let us talk anyway.',
      items: [
        {
          title: 'Company website',
          desc: 'Who you are, what you offer and how to get in touch. So anyone looking for you finds a clear, fast, up-to-date site.',
        },
        {
          title: 'Product or service landing page',
          desc: 'One page focused on one thing, with a clear call to action. Like the ones we built for our own products.',
          link: { label: 'See the Kaku! landing page →', target: 'kaku' },
        },
        {
          title: 'Website with features',
          desc: 'Bookings, a private area or your own dashboard. When the site needs logic, we build it as custom software.',
          link: { label: 'See an example: GoCita →', target: 'case' },
        },
      ],
    },
    process: {
      h2: 'How we work',
      intro: 'Four steps, and at each one you know what you get.',
      outLabel: 'You get',
      steps: [
        {
          title: 'We talk',
          desc: 'You tell us about your business, who you want to reach and what the website needs to achieve.',
          out: 'a proposal with the scope and the price.',
        },
        {
          title: 'We design',
          desc: 'Page structure and visual design, starting with mobile. You review it and we adjust it before building.',
          out: 'the design, to review.',
        },
        {
          title: 'We build',
          desc: 'We code the site, add the content and test it on phone, tablet and desktop.',
          out: 'a preview version you can browse.',
        },
        {
          title: 'We launch',
          desc: 'We put it live on your domain, submit the sitemap to Google Search Console and hand everything over.',
          out: 'the live website and its code.',
        },
      ],
    },
    caseStudy: {
      h2: 'The proof: this website',
      paragraphs: [
        '**We designed and built kuxarstudio.com ourselves**, with the same standards we apply to client work.',
        'It is in Spanish and English, adapts to phones, has light and dark modes, and every change goes through an **automated SEO audit** before it is published: if there is a broken link or a missing title, it does not go live.',
      ],
      facts: [
        ['Technology', 'Astro, static site'],
        ['Hosting', 'GitHub Pages, no server costs'],
        ['Languages', 'Spanish and English, with hreflang'],
        ['Search engines', 'Structured data and sitemap'],
        ['Quality', 'SEO audit on every release'],
        ['Privacy', 'Analytics only with consent'],
      ],
      appTitle: 'And when the website needs logic',
      appIntro: 'For an auto repair shop we built a custom web app to manage their appointment schedule.',
    },
    faqTitle: 'Frequently asked questions',
    faq: [
      {
        q: 'Who owns the website when it is finished?',
        a: 'You do. When we finish, we hand over the code.',
      },
      {
        q: 'How much does a custom website cost?',
        a: 'It depends on what you need: number of pages, languages and features. Tell us about your project and we will send you a proposal with the scope and the price.',
      },
      {
        q: 'Do you use WordPress or templates?',
        a: 'We do not start from templates. We choose the technology to fit the project; for content sites we prefer static sites, like this one (built with Astro), because they are fast, secure and cheap to host.',
      },
      {
        q: 'Will I be able to edit the text myself?',
        a: 'If you need to, we plan for it from the start so you can edit the content without touching code. Mention it in our first conversation.',
      },
      {
        q: 'Do you build multilingual websites?',
        a: 'Yes. This very website is in Spanish and English, each language with its own address and the hreflang tags Google uses.',
      },
      {
        q: 'What if I need an app or a tool later?',
        a: 'The website can grow with your business: we also build custom apps and tools, designed to connect with what you already have.',
      },
    ],
    closing: {
      h2: 'Shall we talk about your website?',
      text: 'Tell us what your company does and what you need. We will reply by email.',
    },
    serviceType: 'Custom web design and development',
  },
};
