// Contenido de Parte compartido entre la home y /parte/. Un único origen
// para que el pitch no se desincronice entre páginas.
export const parteTagline = 'El presupuesto de la visita, antes de irte de la obra.';

export const parteAudience = 'Para pymes de fontanería, instalaciones y reformas.';

export const parteSteps = [
  {
    title: 'Tomas notas en la visita',
    desc: 'Dictas o escribes lo que ves y añades fotos si hacen falta, desde el móvil.',
  },
  {
    title: 'Se arma el presupuesto',
    desc: 'Con tus tarifas y tus presupuestos anteriores: materiales, mano de obra y lo que falte por preguntar.',
  },
  {
    title: 'Tú lo revisas',
    desc: 'Precio, alcance y margen. No sale nada sin que lo veas y lo ajustes.',
  },
  {
    title: 'Lo envías desde el móvil',
    desc: 'Un presupuesto profesional y editable, listo según sales de casa del cliente.',
  },
];

/** Enlace al formulario de contacto (en el footer de cada página) que
 * etiqueta el mensaje como solicitud de acceso anticipado. `page` es la ruta actual. */
export const parteTrialHref = (page: string) => `${page}?asunto=parte#contacto`;

/** Preguntas frecuentes de empresas. Solo hechos confirmados por el equipo
 *  (ver CLAUDE.md): no añadir precios, plazos ni garantías sin confirmar. */
export const businessFaq = [
  {
    q: '¿De quién es el código de un proyecto a medida?',
    a: 'Tuyo, cuando lo terminamos.',
  },
  {
    q: '¿Parte ya se puede usar?',
    a: 'Todavía no, está en diseño. Puedes pedir acceso anticipado y te avisamos cuando esté listo.',
  },
  {
    q: '¿Cuánto cuesta Parte?',
    a: 'Será una suscripción mensual. El precio aún no está definido.',
  },
  {
    q: '¿Solo hacéis Parte?',
    a: 'No. También desarrollamos apps y herramientas a medida para empresas.',
  },
];
