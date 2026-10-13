import { PAGES_DU_SITE, nomDePage } from './pages-du-site'

/*
 * Le modèle des popups promotionnels, partagé par le CMS (création) et le
 * site (affichage). Table « popups », créée par supabase/sql1.sql.
 *
 * Le contenu est une grille fine, comme un papier millimétré : chaque bloc
 * (titre, offre, image, bouton…) s'y cale librement, par son coin haut
 * gauche et sa taille, avec son centrage et ses marges.
 * Les trois modèles standard ne sont que des grilles déjà remplies : une
 * fois appliqués, tout se modifie comme une grille construite à la main.
 * Le placement lui-même se manipule dans lib/grille.ts.
 */

export type Format = 'petit' | 'moyen' | 'grand'
export type Frequence = 'chaque_page' | 'visite' | 'une_fois' | 'jours'
export type AlignementH = 'gauche' | 'centre' | 'droite'
export type AlignementV = 'haut' | 'centre' | 'bas'
/** Toutes les pages, toutes sauf certaines, ou seulement certaines (sql2.sql). */
export type Ciblage = 'toutes' | 'sauf' | 'certaines'

export type LienPopup = { libelle: string; href: string }

export type Bloc =
  | { id: string; type: 'surtitre'; texte: string }
  | { id: string; type: 'titre'; texte: string }
  | { id: string; type: 'sous_titre'; texte: string }
  | { id: string; type: 'texte'; texte: string }
  | { id: string; type: 'offre'; texte: string; detail: string }
  | { id: string; type: 'date'; texte: string }
  | { id: string; type: 'image'; url: string; alt: string }
  | { id: string; type: 'bouton'; libelle: string; href: string; style: 'plein' | 'contour' }
  | { id: string; type: 'liens'; liens: LienPopup[] }
  | { id: string; type: 'separateur' }

export type TypeDeBloc = Bloc['type']

/**
 * La grille d'un popup, comme un papier millimétré : 48 colonnes sur la
 * largeur de l'encart, des lignes de 0,5 rem. Chaque bloc s'y cale par son
 * coin haut gauche et sa taille ; deux blocs peuvent se superposer.
 */
export const COLONNES = 48
/** La hauteur d'une ligne de la grille, en rem (aussi dans popup.css). */
export const PAS_LIGNE = 0.5

/** Les marges intérieures d'un bloc, en rem. */
export type Marges = { haut: number; droite: number; bas: number; gauche: number }

/**
 * La place d'un bloc, colonnes et lignes comptées à partir de 1. La hauteur
 * est un minimum : un contenu plus haut agrandit le bloc (et, dans le CMS,
 * sa hauteur enregistrée).
 */
export type Placement = {
  colonne: number
  largeur: number
  ligne: number
  hauteur: number
  alignH: AlignementH
  alignV: AlignementV
  marges: Marges
  /** Le plan, pour les blocs superposés : le plus grand passe devant. */
  plan: number
  /**
   * Centré sur toute la ligne, quelle que soit sa largeur (au demi-carreau
   * près, ce que la colonne seule ne permet pas). La colonne garde la
   * position entière la plus proche.
   */
  centre?: boolean
}

export type BlocPlace = Bloc & { place: Placement }

/**
 * Le cadre du popup : sa largeur (en rem) et sa hauteur (en lignes de la
 * grille). Il se règle à part, par ses poignées ou par les tailles
 * prédéfinies : les blocs n'en changent jamais la taille, ils restent dedans.
 */
export type Cadre = { largeur: number; lignes: number }

/**
 * Le thème du popup : sombre (celui du site, par défaut, sans clé) ou
 * mariage (les couleurs claires de la page Mariage et événement privé).
 */
export type Theme = 'mariage'

export type ContenuPopup = { version: 3; blocs: BlocPlace[]; cadre?: Cadre; theme?: Theme }

/** La largeur du cadre pour chaque taille prédéfinie, en rem. */
export const LARGEURS_FORMAT: Record<Format, number> = { petit: 24, moyen: 34, grand: 50 }

/** Les limites du cadre : largeur en rem, hauteur en lignes. */
export const CADRE_MIN: Cadre = { largeur: 18, lignes: 8 }
export const CADRE_MAX: Cadre = { largeur: 60, lignes: 160 }

/* La hauteur d'un cadre neuf et vide, en lignes, selon sa taille. */
const LIGNES_PAR_DEFAUT: Record<Format, number> = { petit: 32, moyen: 40, grand: 48 }

/**
 * Le cadre du popup. Un contenu enregistré avant les cadres réglables en
 * reçoit un : la largeur de sa taille, et la hauteur de ses blocs plus une
 * marge.
 */
export function cadreDe(contenu: ContenuPopup, format: Format): Cadre {
  if (contenu.cadre) return contenu.cadre
  const fin = contenu.blocs.reduce((max, b) => Math.max(max, b.place.ligne + b.place.hauteur - 1), 0)
  return { largeur: LARGEURS_FORMAT[format], lignes: fin ? fin + 2 : LIGNES_PAR_DEFAUT[format] }
}

/** La taille prédéfinie la plus proche d'une largeur (le format enregistré en base). */
export function formatProche(largeur: number): Format {
  const formats = Object.keys(LARGEURS_FORMAT) as Format[]
  return formats.reduce((meilleur, f) =>
    Math.abs(LARGEURS_FORMAT[f] - largeur) < Math.abs(LARGEURS_FORMAT[meilleur] - largeur) ? f : meilleur,
  )
}

/* Les formats précédents, convertis à la lecture : lignes découpées en colonnes (1), puis grille de 12 colonnes (2). */
type AncienneLigne = {
  disposition: '1' | '1-1' | '1-2' | '2-1' | '1-1-1'
  alignement: 'gauche' | 'centre'
  colonnes: { blocs: Bloc[] }[]
}
type ContenuV1 = { lignes: AncienneLigne[] }
type PlacementV2 = Omit<Placement, 'plan'>
type ContenuV2 = { version: 2; blocs: (Bloc & { place: PlacementV2 })[] }

export type Popup = {
  id: string
  nom: string
  actif: boolean
  /** Création commencée, pas encore terminée : enregistré seul, jamais activé. */
  brouillon: boolean
  date_debut: string
  date_fin: string
  ciblage: Ciblage
  pages_exclues: string[]
  pages: string[]
  frequence: Frequence
  frequence_jours: number
  format: Format
  contenu: ContenuPopup
  cree_le: string
  modifie_le: string
}

/** Un popup en cours d'écriture : sans identifiant tant qu'il n'est pas enregistré. */
export type Brouillon = Omit<Popup, 'id' | 'cree_le' | 'modifie_le'> & { id?: string }

/* ---- Les choix proposés au client ---- */

export const FORMATS: { valeur: Format; nom: string; description: string }[] = [
  { valeur: 'petit', nom: 'Compacte', description: 'Un message court, une colonne' },
  { valeur: 'moyen', nom: 'Standard', description: 'Le format courant' },
  { valeur: 'grand', nom: 'Large', description: 'Avec photo ou en plusieurs colonnes' },
]

export const FREQUENCES: { valeur: Frequence; nom: string }[] = [
  { valeur: 'chaque_page', nom: 'À chaque page vue' },
  { valeur: 'visite', nom: 'Une fois par visite' },
  { valeur: 'une_fois', nom: 'Une seule fois, puis plus jamais pour ce visiteur' },
  { valeur: 'jours', nom: 'Une fois tous les X jours' },
]

export const TYPES_DE_BLOC: { type: TypeDeBloc; nom: string; description: string }[] = [
  { type: 'surtitre', nom: 'Surtitre', description: 'Petite ligne au-dessus du titre' },
  { type: 'titre', nom: 'Titre', description: 'Le message principal' },
  { type: 'sous_titre', nom: 'Sous-titre', description: 'Précise le titre' },
  { type: 'texte', nom: 'Explication', description: 'Quelques lignes de texte' },
  { type: 'offre', nom: 'Offre', description: 'Une valeur en grand, ex. -15 %' },
  { type: 'date', nom: 'Date', description: 'Jusqu’à quand, en texte libre' },
  { type: 'image', nom: 'Image', description: 'Une photo déposée' },
  { type: 'bouton', nom: 'Bouton', description: 'Vers une page ou une adresse' },
  { type: 'liens', nom: 'Liens', description: 'Un ou plusieurs liens texte' },
  { type: 'separateur', nom: 'Séparateur', description: 'Un filet horizontal' },
]

export const CIBLAGES: { valeur: Ciblage; nom: string }[] = [
  { valeur: 'toutes', nom: 'Toutes les pages' },
  { valeur: 'sauf', nom: 'Toutes les pages sauf…' },
  { valeur: 'certaines', nom: 'Seulement certaines pages' },
]

export const DUREES = [3, 7, 15, 30]

export function nomDuType(type: TypeDeBloc) {
  return TYPES_DE_BLOC.find((t) => t.type === type)?.nom ?? type
}

/* ---- Construire la grille ---- */

export function nouvelId() {
  return crypto.randomUUID()
}

export function blocVide(type: TypeDeBloc): Bloc {
  const id = nouvelId()
  switch (type) {
    case 'offre':
      return { id, type, texte: '', detail: '' }
    case 'image':
      return { id, type, url: '', alt: '' }
    case 'bouton':
      return { id, type, libelle: '', href: '/contact', style: 'plein' }
    case 'liens':
      return { id, type, liens: [{ libelle: '', href: '/' }] }
    case 'separateur':
      return { id, type }
    default:
      return { id, type, texte: '' }
  }
}

/** La hauteur de départ d'un bloc, en lignes de la grille : de quoi tenir son contenu habituel. */
export const HAUTEURS: Record<TypeDeBloc, number> = {
  surtitre: 3,
  titre: 7,
  sous_titre: 5,
  texte: 8,
  offre: 9,
  date: 3,
  image: 24,
  bouton: 7,
  liens: 4,
  separateur: 2,
}

/** Une place par défaut : toute la largeur, la hauteur habituelle du type, sans marge. */
export function placeParDefaut(type: TypeDeBloc, champs: Partial<Placement> = {}): Placement {
  return {
    colonne: 1,
    largeur: COLONNES,
    ligne: 1,
    hauteur: HAUTEURS[type],
    alignH: 'gauche',
    alignV: 'haut',
    marges: { haut: 0, droite: 0, bas: 0, gauche: 0 },
    plan: 0,
    ...champs,
  }
}

/** Un bloc encore vide : l'aperçu du CMS en montre la place. */
export function estVide(bloc: Bloc) {
  switch (bloc.type) {
    case 'offre':
      return !bloc.texte && !bloc.detail
    case 'image':
      return !bloc.url
    case 'bouton':
      return !bloc.libelle
    case 'liens':
      return !bloc.liens.some((l) => l.libelle)
    case 'separateur':
      return false
    default:
      return !bloc.texte
  }
}

/* Les largeurs des dispositions du format 1, en colonnes d'une grille de 12. */
const LARGEURS_V1: Record<AncienneLigne['disposition'], number[]> = {
  '1': [12],
  '1-1': [6, 6],
  '1-2': [4, 8],
  '2-1': [8, 4],
  '1-1-1': [4, 4, 4],
}

/** Format 1 vers format 2 : chaque colonne devient une bande de la grille de 12, ses blocs s'y empilent. */
function v1VersV2(contenu: ContenuV1): ContenuV2 {
  const blocs: ContenuV2['blocs'] = []
  let ligne = 1
  for (const ancienne of contenu.lignes) {
    const largeurs = LARGEURS_V1[ancienne.disposition] ?? [12]
    const hauteur = Math.max(1, ...ancienne.colonnes.map((c) => c.blocs.length))
    let colonne = 1
    ancienne.colonnes.forEach((col, rang) => {
      const largeur = largeurs[rang] ?? 12
      col.blocs.forEach((bloc, i) => {
        blocs.push({
          ...bloc,
          place: {
            colonne,
            largeur,
            ligne: ligne + i,
            hauteur: i === col.blocs.length - 1 ? hauteur - i : 1,
            alignH: ancienne.alignement === 'centre' ? 'centre' : 'gauche',
            alignV: 'haut',
            marges: { haut: 0, droite: 0, bas: 0, gauche: 0 },
          },
        })
      })
      colonne += largeur
    })
    ligne += hauteur
  }
  return { version: 2, blocs }
}

/**
 * Format 2 vers format 3 : les colonnes de 12 passent en 48 ; chaque
 * ligne de l'ancienne grille prend la hauteur habituelle de son bloc le
 * plus haut, et un écart d'une ligne sépare les anciennes lignes. Le CMS
 * agrandit ensuite tout bloc trop petit pour son contenu.
 */
function v2VersV3(contenu: ContenuV2): ContenuPopup {
  const total = contenu.blocs.reduce((max, b) => Math.max(max, b.place.ligne + b.place.hauteur - 1), 0)
  const hauteurs = Array.from({ length: total + 1 }, (_, l) =>
    Math.max(
      2,
      ...contenu.blocs.filter((b) => b.place.ligne === l && b.place.hauteur === 1).map((b) => HAUTEURS[b.type]),
    ),
  )
  const ECART = 2
  const debuts: number[] = []
  let y = 1
  for (let l = 1; l <= total; l++) {
    debuts[l] = y
    y += (hauteurs[l] ?? 2) + ECART
  }
  return {
    version: 3,
    blocs: contenu.blocs.map((b) => {
      const debut = debuts[b.place.ligne] ?? 1
      const fin = b.place.ligne + b.place.hauteur
      const hauteur = (debuts[fin] ?? y) - ECART - debut
      return {
        ...b,
        place: {
          ...b.place,
          colonne: (b.place.colonne - 1) * 4 + 1,
          largeur: b.place.largeur * 4,
          ligne: debut,
          hauteur: Math.max(2, hauteur),
          plan: 0,
        },
      } as BlocPlace
    }),
  }
}

/**
 * Le contenu tel que la base le rend, ramené au format 3 (grille
 * millimétrée). Les popups des formats précédents gardent leur
 * disposition.
 */
export function normaliserContenu(brut: unknown): ContenuPopup {
  const contenu = brut as Partial<ContenuPopup | ContenuV2 | ContenuV1> | null
  if (!contenu) return { version: 3, blocs: [] }
  if ('blocs' in contenu && Array.isArray(contenu.blocs)) {
    return contenu.version === 3 ? (contenu as ContenuPopup) : v2VersV3(contenu as ContenuV2)
  }
  if ('lignes' in contenu && Array.isArray(contenu.lignes)) return v2VersV3(v1VersV2(contenu as ContenuV1))
  return { version: 3, blocs: [] }
}

/* ---- Les trois modèles standard ---- */

/** Un bloc sans son identifiant, type par type. */
type SansId<T> = T extends unknown ? Omit<T, 'id'> : never

/**
 * Empile des blocs dans une bande de la grille (colonne de départ et
 * largeur), à partir d'une ligne, chacun à sa hauteur habituelle, séparés
 * d'un écart de 2 lignes (1 rem).
 */
function pile(
  contenus: SansId<Bloc>[],
  bande: Partial<Placement> & { ligne?: number },
): BlocPlace[] {
  let ligne = bande.ligne ?? 1
  return contenus.map((contenu) => {
    const place = placeParDefaut(contenu.type, { ...bande, ligne })
    ligne += place.hauteur + 2
    return { id: nouvelId(), ...contenu, place } as BlocPlace
  })
}

/** Le contenu d'un modèle avec son cadre : la largeur de sa taille, ses blocs plus une marge. */
function avecCadre(format: Format, contenu: ContenuPopup): ContenuPopup {
  return { ...contenu, cadre: { largeur: LARGEURS_FORMAT[format], lignes: finDe(contenu.blocs) + 1 } }
}

/** La ligne qui suit le dernier bloc. */
function finDe(blocs: BlocPlace[]) {
  return blocs.reduce((max, b) => Math.max(max, b.place.ligne + b.place.hauteur), 1)
}

export const MODELES: {
  id: string
  nom: string
  description: string
  format: Format
  contenu: () => ContenuPopup
}[] = [
  {
    id: 'annonce',
    nom: 'Centré',
    description: 'Un message court, sans photo',
    format: 'moyen',
    contenu: () => avecCadre('moyen', {
      version: 3,
      blocs: pile(
        [
          { type: 'surtitre', texte: 'Offre spéciale' },
          { type: 'titre', texte: 'Votre titre ici' },
          { type: 'sous_titre', texte: 'Un sous-titre qui précise l’offre' },
          { type: 'offre', texte: '-15 %', detail: 'sur votre prestation' },
          { type: 'date', texte: 'Jusqu’au 30 juin' },
          { type: 'texte', texte: 'Quelques lignes pour expliquer l’offre et ses conditions.' },
          { type: 'bouton', libelle: 'J’en profite', href: '/contact', style: 'plein' },
        ],
        { alignH: 'centre' },
      ),
    }),
  },
  {
    id: 'deux-colonnes',
    nom: 'Offre + texte',
    description: 'L’offre en grand à gauche',
    format: 'grand',
    contenu: () => {
      const texte = pile(
        [
          { type: 'surtitre', texte: 'Offre de saison' },
          { type: 'titre', texte: 'Votre titre ici' },
          { type: 'texte', texte: 'Quelques lignes pour expliquer l’offre et ses conditions.' },
          { type: 'bouton', libelle: 'Demander un devis', href: '/contact', style: 'plein' },
        ],
        { colonne: 19, largeur: 30 },
      )
      const hauteurTexte = finDe(texte) - 1
      const offre = pile(
        [
          { type: 'offre', texte: '-20 %', detail: 'sur la location de matériel' },
          { type: 'date', texte: 'Du 1er au 15 décembre' },
        ],
        { largeur: 16, ligne: Math.max(1, Math.round((hauteurTexte - 14) / 2)) },
      )
      const bas = pile(
        [
          { type: 'separateur' },
          {
            type: 'liens',
            liens: [{ libelle: 'Voir la location de matériel', href: '/nos-services/location-de-materiel' }],
          },
        ],
        { ligne: finDe([...texte, ...offre]) + 2 },
      )
      return avecCadre('grand', { version: 3, blocs: [...offre, ...texte, ...bas] })
    },
  },
  {
    id: 'photo',
    nom: 'Photo + texte',
    description: 'Une photo à gauche',
    format: 'grand',
    contenu: () => {
      const texte = pile(
        [
          { type: 'surtitre', texte: 'Offre spéciale mariage' },
          { type: 'titre', texte: 'Votre titre ici' },
          { type: 'sous_titre', texte: 'Un sous-titre qui précise l’offre' },
          { type: 'offre', texte: '-10 %', detail: 'pour toute réservation' },
          { type: 'texte', texte: 'Quelques lignes pour expliquer l’offre et ses conditions.' },
          {
            type: 'bouton',
            libelle: 'Découvrir l’offre',
            href: '/nos-services/mariages-evenements-prives',
            style: 'plein',
          },
        ],
        { colonne: 26, largeur: 23 },
      )
      const photo: BlocPlace = {
        id: nouvelId(),
        type: 'image',
        url: '',
        alt: '',
        place: placeParDefaut('image', { largeur: 23, hauteur: finDe(texte) - 1 }),
      }
      return avecCadre('grand', { version: 3, blocs: [photo, ...texte] })
    },
  },
]

/**
 * Le modèle dont le contenu garde la forme : une photo à gauche du texte,
 * l'offre à gauche du texte, ou un message centré sur toute la largeur.
 * Aucun si le client s'en est écarté.
 */
export function modeleReconnu(contenu: ContenuPopup): string | null {
  const { blocs } = contenu
  if (!blocs.length) return null
  const aGauche = (type: TypeDeBloc) =>
    blocs.some((b) => b.type === type && b.place.colonne <= 4 && b.place.largeur <= COLONNES / 2)
  if (aGauche('image')) return 'photo'
  if (aGauche('offre')) return 'deux-colonnes'
  if (blocs.every((b) => b.place.largeur >= COLONNES - 4 && b.place.alignH === 'centre')) return 'annonce'
  return null
}

/* ---- Les dates ----
   Le CMS travaille en jours (« AAAA-MM-JJ », heure de Paris du navigateur) ;
   la base, en instants. La fin est exclusive : dernier jour inclus + 1. */

export function jourISO(date: Date) {
  const a = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const j = String(date.getDate()).padStart(2, '0')
  return `${a}-${m}-${j}`
}

export function aujourdhui() {
  return jourISO(new Date())
}

/** Minuit, heure locale, du jour donné. */
export function minuit(jour: string) {
  const [a, m, j] = jour.split('-').map(Number)
  return new Date(a ?? 1970, (m ?? 1) - 1, j ?? 1)
}

export function ajouterJours(jour: string, nombre: number) {
  const date = minuit(jour)
  date.setDate(date.getDate() + nombre)
  return jourISO(date)
}

/** Nombre de jours entre deux jours (b - a). */
export function ecartEnJours(a: string, b: string) {
  return Math.round((minuit(b).getTime() - minuit(a).getTime()) / 86_400_000)
}

export function debutVersJour(instant: string) {
  return jourISO(new Date(instant))
}

export function jourVersDebut(jour: string) {
  return minuit(jour).toISOString()
}

/** Le dernier jour d'affichage, inclus. */
export function finVersDernierJour(instant: string) {
  return jourISO(new Date(new Date(instant).getTime() - 1))
}

export function dernierJourVersFin(jour: string) {
  return minuit(ajouterJours(jour, 1)).toISOString()
}

export function dateLisible(jour: string) {
  return minuit(jour).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/* ---- Statut ---- */

export type Statut = {
  actif: boolean
  /** Le détail affiché sous le statut : en ligne, programmé, terminé… */
  detail: string
}

/**
 * Actif ou inactif, tel que le client le lit. Un popup terminé reste dans
 * le CMS mais passe inactif, même s'il est resté activé.
 */
export function statut(popup: Pick<Popup, 'actif' | 'date_debut' | 'date_fin'>, maintenant = Date.now()): Statut {
  const debut = new Date(popup.date_debut).getTime()
  const fin = new Date(popup.date_fin).getTime()
  const dernierJour = dateLisible(finVersDernierJour(popup.date_fin))

  if (fin <= maintenant) return { actif: false, detail: `Terminé le ${dernierJour}` }
  if (!popup.actif) return { actif: false, detail: 'Désactivé' }
  if (debut > maintenant) {
    return {
      actif: true,
      detail: `Programmé : du ${dateLisible(debutVersJour(popup.date_debut))} au ${dernierJour}`,
    }
  }
  return { actif: true, detail: `En ligne jusqu’au ${dernierJour} inclus` }
}

/* ---- Les catégories de la liste ---- */

export type Categorie = 'en-ligne' | 'programme' | 'brouillon' | 'termine'

export const CATEGORIES: { valeur: Categorie; nom: string; pluriel: string }[] = [
  { valeur: 'en-ligne', nom: 'En ligne', pluriel: 'En ligne' },
  { valeur: 'programme', nom: 'Programmé', pluriel: 'Programmés' },
  { valeur: 'brouillon', nom: 'Brouillon', pluriel: 'Brouillons' },
  { valeur: 'termine', nom: 'Terminé', pluriel: 'Terminés' },
]

/**
 * Où le popup se range dans la liste : en brouillon tant que sa création
 * n'est pas terminée, terminé une fois ses dates passées, en ligne s'il
 * s'affiche aujourd'hui. Le reste (pas commencé, ou désactivé avant sa
 * fin) est programmé.
 */
export function categorie(
  popup: Pick<Popup, 'actif' | 'brouillon' | 'date_debut' | 'date_fin'>,
  maintenant = Date.now(),
): Categorie {
  if (popup.brouillon) return 'brouillon'
  if (new Date(popup.date_fin).getTime() <= maintenant) return 'termine'
  if (popup.actif && new Date(popup.date_debut).getTime() <= maintenant) return 'en-ligne'
  return 'programme'
}

/** « Du 12 au 26 octobre », « Du 1er avril au 30 juin », l'année seulement si elle n'est pas l'actuelle. */
export function periodeLisible(premierJour: string, dernierJour: string) {
  const a = minuit(premierJour)
  const b = minuit(dernierJour)
  const jour = (date: Date) => (date.getDate() === 1 ? '1er' : String(date.getDate()))
  const mois = (date: Date) => date.toLocaleDateString('fr-FR', { month: 'long' })
  const anneeEnCours = new Date().getFullYear()
  const memeAnnee = a.getFullYear() === b.getFullYear()
  const anneeA = memeAnnee ? '' : ` ${a.getFullYear()}`
  const anneeB = memeAnnee && b.getFullYear() === anneeEnCours ? '' : ` ${b.getFullYear()}`

  if (premierJour === dernierJour) return `Le ${jour(a)} ${mois(a)}${anneeB}`
  if (memeAnnee && a.getMonth() === b.getMonth()) {
    return `Du ${jour(a)} au ${jour(b)} ${mois(b)}${anneeB}`
  }
  return `Du ${jour(a)} ${mois(a)}${anneeA} au ${jour(b)} ${mois(b)}${anneeB}`
}

/* ---- Les pages ---- */

type CiblageDePages = Pick<Popup, 'ciblage' | 'pages' | 'pages_exclues'>

/** Le popup s'affiche-t-il sur cette page ? */
export function cibleLaPage(popup: CiblageDePages, chemin: string) {
  if (popup.ciblage === 'toutes') return true
  if (popup.ciblage === 'sauf') return !popup.pages_exclues.includes(chemin)
  return popup.pages.includes(chemin)
}

/** Les pages du site que le popup vise, parmi celles que le CMS connaît. */
function pagesVisees(popup: CiblageDePages) {
  return PAGES_DU_SITE.map((page) => page.chemin).filter((chemin) => cibleLaPage(popup, chemin))
}

export function pagesLisibles(popup: CiblageDePages) {
  if (popup.ciblage === 'toutes') return 'Toutes les pages'
  if (popup.ciblage === 'sauf') {
    return popup.pages_exclues.length
      ? `Toutes les pages sauf : ${popup.pages_exclues.map(nomDePage).join(', ')}`
      : 'Toutes les pages'
  }
  if (popup.pages.length === 0) return 'Aucune page'
  return popup.pages.map(nomDePage).join(', ')
}

export type Chevauchement = {
  noms: [string, string]
  pages: string
  /** Les deux popups, dans le même ordre que leurs noms. */
  ids: [string | undefined, string | undefined]
  /** Les jours où ils s'affichent ensemble (premier et dernier, inclus). */
  premierJour: string
  dernierJour: string
  /** Une seule page en commun : « la page … aura », sinon « les pages … auront ». */
  nombreDePages: number
}

/**
 * Les popups qui s'afficheront ensemble sur une même page : tous deux
 * activés, des périodes qui se recouvrent, au moins une page en commun.
 * Le site les empile alors l'un sous l'autre : on prévient, sans empêcher.
 */
export function chevauchements(
  popups: (Pick<Popup, 'nom' | 'actif' | 'date_debut' | 'date_fin'> & CiblageDePages & { id?: string })[],
) {
  const maintenant = Date.now()
  const enJeu = popups.filter((p) => p.actif && new Date(p.date_fin).getTime() > maintenant)
  const resultat: Chevauchement[] = []

  enJeu.forEach((a, i) => {
    enJeu.slice(i + 1).forEach((b) => {
      const periodes =
        new Date(a.date_debut).getTime() < new Date(b.date_fin).getTime() &&
        new Date(b.date_debut).getTime() < new Date(a.date_fin).getTime()
      if (!periodes) return

      const deB = pagesVisees(b)
      const communes = pagesVisees(a).filter((chemin) => deB.includes(chemin))
      if (!communes.length) return
      const debut = Math.max(new Date(a.date_debut).getTime(), new Date(b.date_debut).getTime())
      const fin = Math.min(new Date(a.date_fin).getTime(), new Date(b.date_fin).getTime())
      resultat.push({
        noms: [a.nom, b.nom],
        ids: [a.id, b.id],
        premierJour: debutVersJour(new Date(debut).toISOString()),
        dernierJour: finVersDernierJour(new Date(fin).toISOString()),
        nombreDePages: communes.length,
        pages:
          communes.length === PAGES_DU_SITE.length
            ? 'toutes les pages'
            : communes.map(nomDePage).join(', '),
      })
    })
  })

  return resultat
}

/* ---- Les images ---- */

/** Où les images déposées se trouvent dans leur adresse publique. */
const DOSSIER_IMAGES = '/storage/v1/object/public/popups/'

/** Les fichiers du stockage « popups » qu'utilise ce contenu. */
export function imagesDuContenu(contenu: ContenuPopup) {
  return contenu.blocs
    .flatMap((bloc) => (bloc.type === 'image' && bloc.url.includes(DOSSIER_IMAGES) ? [bloc.url] : []))
    .map((url) => decodeURIComponent(url.slice(url.indexOf(DOSSIER_IMAGES) + DOSSIER_IMAGES.length)))
}

/* ---- Un popup neuf ---- */

export function brouillonNeuf(): Brouillon {
  const debut = aujourdhui()
  const modele = MODELES[0]
  return {
    nom: '',
    actif: false,
    brouillon: true,
    date_debut: jourVersDebut(debut),
    date_fin: dernierJourVersFin(ajouterJours(debut, 14)),
    ciblage: 'toutes',
    pages: [],
    pages_exclues: [],
    frequence: 'visite',
    frequence_jours: 7,
    format: modele?.format ?? 'moyen',
    contenu: modele ? modele.contenu() : { version: 3, blocs: [] },
  }
}
