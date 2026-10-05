// Identidad del estudio como entidad: UN nombre, UNA url y los perfiles externos
// que lo confirman. BaseLayout (Organization JSON-LD) y la página "Estudio"
// leen de aquí, así el nombre y los `sameAs` no pueden divergir entre páginas.
//
// Regla de las notas de SEO: mismo nombre exacto en todas partes ("Kuxar Studio",
// producto "Kaku!"), y cada perfil que se añada aquí debe existir de verdad y
// enlazar de vuelta a kuxarstudio.com. No añadir perfiles que aún no existan.

export const STUDIO_NAME = 'Kuxar Studio';

/** Perfiles externos verificables de la organización (JSON-LD `sameAs`). */
export const SAME_AS: readonly string[] = [
  'https://github.com/KuxarStudio',
  'https://play.google.com/store/apps/developer?id=Kuxar+Studio',
  // Cuando existan y enlacen a la web, añadir aquí (y en la página Estudio):
  // LinkedIn de empresa, YouTube, itch.io, AlternativeTo, Product Hunt…
];

export const STUDIO_EMAIL = 'admin@kuxarstudio.com';

/** Organización como nodo reutilizable. */
export const organizationId = (site: string) => `${site}/#organization`;
