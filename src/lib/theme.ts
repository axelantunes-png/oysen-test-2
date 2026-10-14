/*
 * Le thème d'une page qui n'a pas le sien : la page contact et sa page de
 * remerciement s'ouvrent dans les couleurs de la page mariage quand on en
 * vient (?theme=mariage dans l'adresse), sombres sinon (theme-mariage.css).
 *
 * Lu par la route, et non dans le navigateur : le serveur et le navigateur
 * voient la même chose, la page arrive directement claire, sans flash.
 */

import { useRouterState } from '@tanstack/react-router'

export type Theme = 'mariage'

/* Les autres paramètres (profil, besoin…) passent tels quels : le
   formulaire les lit dans l'adresse. */
export type RechercheTheme = Record<string, unknown> & { theme?: Theme }

export function lireTheme(search: Record<string, unknown>): RechercheTheme {
  return {
    ...search,
    theme: search.theme === 'mariage' ? 'mariage' : undefined,
  }
}

/* La classe à poser sur <main>. */
export function classeTheme(theme: Theme | undefined): string {
  return theme === 'mariage' ? 'theme-mariage' : ''
}

/* La barre du navigateur, sur téléphone : le papier de la page mariage. */
export function couleurTheme(theme: Theme | undefined): string {
  return theme === 'mariage' ? '#f6f3ef' : '#141118'
}

const PAGE_MARIAGE = '/nos-services/mariages-evenements-prives'

/*
 * L'adresse de la page contact pour la barre et le pied de page : avec le
 * thème quand on est sur la page mariage, ou déjà sur une page contact
 * claire ; sans, partout ailleurs.
 */
export function useLienContact(): string {
  const avecTheme = useRouterState({
    select: (state) => {
      const chemin = state.location.pathname.replace(/\/+$/, '')
      const search = state.location.search as Record<string, unknown>
      return chemin === PAGE_MARIAGE || search.theme === 'mariage'
    },
  })
  return avecTheme ? '/contact?theme=mariage' : '/contact'
}
