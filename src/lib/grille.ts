import { CADRE_MAX, CADRE_MIN, COLONNES, blocVide, placeParDefaut } from './popups'
import type { BlocPlace, Cadre, ContenuPopup, Placement, TypeDeBloc } from './popups'

/*
 * Le placement des blocs sur la grille millimétrée d'un popup (48
 * colonnes, des lignes de 0,5 rem). Le placement est libre : un bloc se
 * pose où l'on veut dans le cadre, et peut en recouvrir un autre ; seule
 * sa position et sa taille se calent sur la grille. Le cadre (sa largeur,
 * son nombre de lignes) ne dépend jamais des blocs : ils restent dedans. Fonctions pures : chacune rend un
 * nouveau contenu, que l'éditeur enregistre tel quel.
 */

export type Zone = Pick<Placement, 'colonne' | 'largeur' | 'ligne' | 'hauteur'>

/* La plus petite taille d'un bloc, en colonnes et en lignes. */
export const LARGEUR_MIN = 2
export const HAUTEUR_MIN = 2

/** La dernière ligne occupée. */
export function nombreDeLignes(contenu: ContenuPopup) {
  return contenu.blocs.reduce((max, b) => Math.max(max, b.place.ligne + b.place.hauteur - 1), 0)
}

/** Les blocs dans l'ordre de lecture : de haut en bas, puis de gauche à droite (l'ordre sur téléphone). */
export function ordreDeLecture(blocs: BlocPlace[]) {
  return [...blocs].sort((a, b) => a.place.ligne - b.place.ligne || a.place.colonne - b.place.colonne)
}

/** Les lignes du cadre (sans cadre : pas de limite). */
function lignesDu(contenu: ContenuPopup) {
  return contenu.cadre?.lignes ?? Infinity
}

/** Une zone ramenée dans le cadre, calée sur la grille, à la taille minimale. */
export function borner(zone: Zone, lignes = Infinity): Zone {
  const largeur = Math.min(COLONNES, Math.max(LARGEUR_MIN, Math.round(zone.largeur)))
  const hauteur = Math.min(Math.max(HAUTEUR_MIN, lignes), Math.max(HAUTEUR_MIN, Math.round(zone.hauteur)))
  const colonne = Math.min(COLONNES - largeur + 1, Math.max(1, Math.round(zone.colonne)))
  const ligne = Math.min(Math.max(1, lignes - hauteur + 1), Math.max(1, Math.round(zone.ligne)))
  return { colonne, largeur, ligne, hauteur }
}

function avecPlace(contenu: ContenuPopup, id: string, champs: Partial<Placement>): ContenuPopup {
  return {
    ...contenu,
    blocs: contenu.blocs.map((b) => (b.id === id ? { ...b, place: { ...b.place, ...champs } } : b)),
  }
}

/** Le plan au-dessus de tous les autres. */
function planDuDessus(contenu: ContenuPopup) {
  return contenu.blocs.reduce((max, b) => Math.max(max, b.place.plan), 0) + 1
}

/**
 * Ajoute un bloc, à sa taille habituelle. À une position donnée (dépôt
 * depuis la palette) : son coin haut gauche s'y cale, et sa largeur se
 * réduit pour tenir dans le popup. Sans position (clic) : sur toute la
 * largeur, sous le reste.
 */
export function ajouterBloc(contenu: ContenuPopup, type: TypeDeBloc, position?: Pick<Zone, 'colonne' | 'ligne'>) {
  const defaut = placeParDefaut(type)
  const zone = borner(
    position
      ? {
          ...position,
          largeur: Math.min(defaut.largeur, COLONNES - Math.round(position.colonne) + 1),
          hauteur: defaut.hauteur,
        }
      : { ...defaut, ligne: nombreDeLignes(contenu) + (contenu.blocs.length ? 3 : 1) },
    lignesDu(contenu),
  )
  const bloc = {
    ...blocVide(type),
    place: { ...defaut, ...zone, plan: position ? planDuDessus(contenu) : 0 },
  } as BlocPlace
  return { contenu: { ...contenu, blocs: [...contenu.blocs, bloc] }, id: bloc.id }
}

/** La colonne entière la plus proche du centre, pour une largeur. */
function colonneCentree(largeur: number) {
  return Math.floor((COLONNES - largeur) / 2) + 1
}

/**
 * Pose le bloc à cette zone (déplacement ou redimensionnement), calée sur
 * la grille, dans le cadre. Un bloc centré le reste tant qu'on ne le
 * déplace pas sur le côté (il s'élargit alors des deux côtés à la fois).
 */
export function placerBloc(contenu: ContenuPopup, id: string, zone: Zone): ContenuPopup {
  const bloc = contenu.blocs.find((b) => b.id === id)
  const place = borner(zone, lignesDu(contenu))
  if (!bloc?.place.centre) return avecPlace(contenu, id, place)
  if (place.colonne !== bloc.place.colonne) return avecPlace(contenu, id, { ...place, centre: false })
  return avecPlace(contenu, id, { ...place, colonne: colonneCentree(place.largeur) })
}

/** Un cadre ramené à ses limites, calé à la demi-rem en largeur. */
export function bornerCadre(cadre: Cadre): Cadre {
  return {
    largeur: Math.min(CADRE_MAX.largeur, Math.max(CADRE_MIN.largeur, Math.round(cadre.largeur * 2) / 2)),
    lignes: Math.min(CADRE_MAX.lignes, Math.max(CADRE_MIN.lignes, Math.round(cadre.lignes))),
  }
}

/** Change le cadre ; les blocs qui en sortiraient remontent (ou rétrécissent) pour y rester. */
export function changerCadre(contenu: ContenuPopup, cadre: Cadre): ContenuPopup {
  const nouveau = bornerCadre(cadre)
  return {
    ...contenu,
    cadre: nouveau,
    blocs: contenu.blocs.map((b) => ({ ...b, place: { ...b.place, ...borner(b.place, nouveau.lignes) } })),
  }
}

/** Décale le bloc d'autant de colonnes et de lignes (flèches). */
export function decalerBloc(contenu: ContenuPopup, id: string, colonnes: number, lignes: number): ContenuPopup {
  const bloc = contenu.blocs.find((b) => b.id === id)
  if (!bloc) return contenu
  const p = bloc.place
  return placerBloc(contenu, id, { ...p, colonne: p.colonne + colonnes, ligne: p.ligne + lignes })
}

/** Centre le bloc sur toute la ligne, exactement, quelle que soit sa largeur. */
export function centrerDansLaLargeur(contenu: ContenuPopup, id: string): ContenuPopup {
  const bloc = contenu.blocs.find((b) => b.id === id)
  if (!bloc) return contenu
  return avecPlace(contenu, id, { colonne: colonneCentree(bloc.place.largeur), centre: true })
}

/** Le bloc prend toute la largeur du popup. */
export function pleineLargeur(contenu: ContenuPopup, id: string): ContenuPopup {
  return avecPlace(contenu, id, { colonne: 1, largeur: COLONNES, centre: false })
}

/** Passe le bloc devant, ou derrière, les blocs qu'il recouvre. */
export function changerDePlan(contenu: ContenuPopup, id: string, sens: 'devant' | 'derriere'): ContenuPopup {
  if (sens === 'devant') return avecPlace(contenu, id, { plan: planDuDessus(contenu) })
  const dessous = contenu.blocs.reduce((min, b) => Math.min(min, b.place.plan), 0) - 1
  return avecPlace(contenu, id, { plan: dessous })
}

/** Combien de lignes le bloc peut prendre au plus, du haut du bloc au bas du cadre. */
export function hauteurMax(contenu: ContenuPopup, bloc: BlocPlace) {
  return lignesDu(contenu) - bloc.place.ligne + 1
}

/**
 * Agrandit les blocs dont le contenu dépasse, jusqu'au bas du cadre au
 * plus : l'éditeur mesure, pour chacun, combien de lignes son contenu
 * demande. Jamais de rétrécissement.
 */
export function ajusterHauteurs(contenu: ContenuPopup, besoins: Record<string, number>): ContenuPopup {
  if (!Object.keys(besoins).length) return contenu
  return {
    ...contenu,
    blocs: contenu.blocs.map((b) => {
      const besoin = Math.min(besoins[b.id] ?? 0, hauteurMax(contenu, b))
      return besoin > b.place.hauteur ? { ...b, place: { ...b.place, hauteur: besoin } } : b
    }),
  }
}

export function changerPlace(contenu: ContenuPopup, id: string, champs: Partial<Placement>): ContenuPopup {
  return avecPlace(contenu, id, champs)
}

export function supprimerBloc(contenu: ContenuPopup, id: string): ContenuPopup {
  return { ...contenu, blocs: contenu.blocs.filter((b) => b.id !== id) }
}

export function remplacerBloc(contenu: ContenuPopup, bloc: BlocPlace): ContenuPopup {
  return { ...contenu, blocs: contenu.blocs.map((b) => (b.id === bloc.id ? bloc : b)) }
}
