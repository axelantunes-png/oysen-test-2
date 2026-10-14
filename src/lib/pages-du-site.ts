/*
 * Les pages publiques du site, telles que le CMS les propose : pages où
 * afficher un popup, destinations des liens et des boutons. Une page créée
 * sur le site s'ajoute ici pour devenir choisissable.
 */
export type PageDuSite = { chemin: string; nom: string }

export const PAGES_DU_SITE: PageDuSite[] = [
  { chemin: '/', nom: 'Accueil' },
  { chemin: '/nos-services', nom: 'Nos services' },
  { chemin: '/nos-services/evenements-entreprise', nom: 'Événements d’entreprise' },
  { chemin: '/nos-services/mariages-evenements-prives', nom: 'Mariages et événements privés' },
  { chemin: '/nos-services/festivals-evenements-culturels', nom: 'Festivals et événements culturels' },
  { chemin: '/nos-services/collectivites-institutionnels', nom: 'Collectivités et institutions' },
  { chemin: '/nos-services/prestation-technique', nom: 'Prestation technique' },
  { chemin: '/nos-services/location-de-materiel', nom: 'Location de matériel' },
  { chemin: '/qui-sommes-nous/l-agence', nom: 'L’agence' },
  { chemin: '/qui-sommes-nous/le-fondateur', nom: 'Le fondateur' },
  { chemin: '/nos-souvenirs', nom: 'Nos souvenirs' },
  { chemin: '/blog', nom: 'Blog' },
  { chemin: '/contact', nom: 'Contact' },
  { chemin: '/mentions-legales', nom: 'Mentions légales' },
  { chemin: '/politique-de-confidentialite', nom: 'Politique de confidentialité' },
]

/** L'adresse, sans barre finale : « /contact/ » vaut « /contact ». */
export function normaliserChemin(chemin: string) {
  return chemin.length > 1 ? chemin.replace(/\/+$/, '') : chemin
}

/** Le nom lisible d'une page, ou son adresse si elle n'est pas listée. */
export function nomDePage(chemin: string) {
  return PAGES_DU_SITE.find((page) => page.chemin === chemin)?.nom ?? chemin
}
