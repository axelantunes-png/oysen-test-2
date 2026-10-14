/*
 * Le consentement aux cookies, et Google Analytics qui en dépend.
 *
 * Rien n'est chargé tant que le visiteur n'a pas accepté : le script de
 * Google n'est injecté qu'après « Tout accepter », jamais avant. Le choix est
 * retenu 6 mois sous le nom annoncé dans la politique de confidentialité
 * (tableau des cookies), puis la question est reposée.
 */

export const GA_ID = 'G-37M86CQ1HY'

const CLE = 'oysen-cookies'
const DUREE_MS = 182 * 86_400_000

/** L'événement qui rouvre le bandeau (lien « Gérer mes cookies »). */
export const EVENEMENT_GESTION = 'oysen:gerer-cookies'

export type Choix = 'accepte' | 'refuse'

type Enregistre = { choix: Choix; date: number }

/** Le choix en cours, ou null s'il n'a jamais été fait ou a expiré. */
export function lireChoix(): Choix | null {
  try {
    const brut = window.localStorage.getItem(CLE)
    if (!brut) return null
    const { choix, date } = JSON.parse(brut) as Enregistre
    if (choix !== 'accepte' && choix !== 'refuse') return null
    if (!date || Date.now() - date >= DUREE_MS) return null
    return choix
  } catch {
    return null
  }
}

export function enregistrerChoix(choix: Choix) {
  try {
    const valeur: Enregistre = { choix, date: Date.now() }
    window.localStorage.setItem(CLE, JSON.stringify(valeur))
  } catch {
    /* Stockage bloqué : le bandeau reviendra à la prochaine visite. */
  }
}

/** Le lien « Gérer mes cookies » : rouvre le bandeau, où qu'on soit. */
export function ouvrirGestionCookies() {
  window.dispatchEvent(new Event(EVENEMENT_GESTION))
}

type FenetreGa = Window & {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
} & Record<string, unknown>

/** Le balisage fourni par Google, injecté une seule fois. */
export function chargerAnalytics() {
  const w = window as unknown as FenetreGa
  w[`ga-disable-${GA_ID}`] = false
  if (document.getElementById('oysen-gtag')) return

  w.dataLayer = w.dataLayer || []
  w.gtag = function gtag() {
    // gtag exige l'objet arguments lui-même, pas un tableau.
    w.dataLayer!.push(arguments)
  }
  w.gtag('js', new Date())
  w.gtag('config', GA_ID)

  const script = document.createElement('script')
  script.id = 'oysen-gtag'
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)
}

/**
 * Après un retrait de l'accord : Google cesse d'envoyer (drapeau officiel
 * ga-disable) et ses cookies sont effacés, sur le domaine et ses parents.
 */
export function couperAnalytics() {
  const w = window as unknown as FenetreGa
  w[`ga-disable-${GA_ID}`] = true

  const noms = document.cookie
    .split(';')
    .map((morceau) => morceau.split('=')[0]?.trim() ?? '')
    .filter((nom) => nom === '_ga' || nom.startsWith('_ga_') || nom === '_gid')

  const parties = window.location.hostname.split('.')
  const domaines = ['']
  for (let i = 0; i < parties.length - 1; i++) {
    domaines.push(`; domain=.${parties.slice(i).join('.')}`)
  }

  for (const nom of noms) {
    for (const domaine of domaines) {
      document.cookie = `${nom}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domaine}`
    }
  }
}
