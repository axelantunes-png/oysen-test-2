import { NB_PARTENAIRES, RC_PRO } from '../home/content'

/*
 * Le contenu de la page « L'agence », séparé de sa mise en forme.
 *
 * Même règle que sur l'accueil : les valeurs entre crochets sont des
 * affirmations opposables, elles ne peuvent pas être inventées, et les
 * crochets restent visibles à l'écran tant qu'elles ne sont pas fournies.
 */

/**
 * S1. L'encart « En bref », à droite du discours d'ouverture.
 *
 * Trois faits vérifiables, pas trois qualités que nous nous attribuons : une
 * page qui promet d'être honnête n'ouvre pas sur des adjectifs. Chacun est
 * développé d'une phrase, sinon l'encart n'est qu'une liste de mots.
 */
export type Bref = {
  nom: string
  texte: string
}

export const EN_BREF: readonly Bref[] = [
  {
    nom: 'Haute-Garonne et Occitanie',
    texte:
      'Basés à Toulouse, sept départements desservis. Au-delà, sur devis, avec les frais annoncés avant.',
  },
  {
    nom: 'Parc matériel en propre',
    texte:
      'Sonorisation jusqu’à 1500 personnes, éclairage, structure, écran LED. Et les techniciens avec.',
  },
  {
    nom: `RC pro ${RC_PRO}`,
    texte:
      'Responsabilité civile professionnelle, pour les lieux et les marchés qui l’exigent.',
  },
]

/**
 * S1. La légende du plan d'implantation, repère par repère.
 *
 * Chaque poste dit d'où il vient : du parc Oysen ou du réseau. La régie ne
 * porte pas de numéro, elle porte le losange : c'est le point où tout
 * aboutit, pas un lot de plus.
 */
export type Poste = {
  repere: string
  nom: string
  source: string
}

export const LEGENDE: readonly Poste[] = [
  { repere: '01', nom: 'Son', source: 'jusqu’à 1500 personnes, parc Oysen' },
  { repere: '02', nom: 'Lumière', source: 'parc Oysen' },
  { repere: '03', nom: 'Scène et structure', source: 'parc Oysen' },
  { repere: '04', nom: 'Écran LED', source: 'parc Oysen' },
  {
    repere: '05',
    nom: 'Traiteur, bar',
    source: `réseau de ${NB_PARTENAIRES} prestataires`,
  },
  {
    repere: '06',
    nom: 'Sécurité',
    source: `réseau de ${NB_PARTENAIRES} prestataires`,
  },
  {
    repere: '07',
    nom: 'Décoration',
    source: `réseau de ${NB_PARTENAIRES} prestataires`,
  },
]

export const LEGENDE_REGIE: Poste = {
  repere: '◆',
  nom: 'Régie',
  source: 'votre seul interlocuteur, du premier appel au rangement',
}

/**
 * S2. Notre histoire, en quatre étapes, dans l'ordre où elles sont arrivées.
 *
 * `accroche` ouvre l'étape d'une phrase détachée ; `conviction` la referme,
 * mise en valeur : c'est la phrase que la page veut qu'on retienne.
 */
export type Etape = {
  titre: string
  accroche?: string
  texte: string
  conviction?: string
}

export const HISTOIRE: readonly Etape[] = [
  {
    titre: 'La passion & la vision',
    texte:
      'Tout commence avec Mathis Amato, notre fondateur. D’un côté, la passion de l’événementiel, des DJ sets et… des boules à facettes. De l’autre, la rigueur des études d’ingénieur BTP. Pendant plusieurs années, l’organisation d’événements rythme son quotidien, guidée par une envie simple : marquer les esprits et créer du lien.',
  },
  {
    titre: 'Un choix difficile',
    texte:
      'Alors que l’envie de se lancer à 100 % se concrétise, la crise sanitaire survient et stoppe net l’industrie de l’événementiel. Le choix de la raison s’impose : Mathis se consacre pleinement à la gestion de chantiers.',
  },
  {
    titre: 'Le déclic & le savoir-faire unique',
    accroche: 'Mais ce détour forcé devient une force.',
    texte:
      'Sur les chantiers, une certitude émerge : concevoir un événement demande la même exigence, la même précision et la même maîtrise technique que la réalisation d’un ouvrage. L’idée d’Oysen mûrit, renforcée par ces années de gestion complexe et de méthode.',
  },
  {
    titre: 'Le grand saut',
    texte:
      'Fin 2026, l’évidence s’impose : Oysen voit officiellement le jour. Aujourd’hui, nous mettons cette double culture, la rigueur de l’ingénierie et la passion du spectacle, au service de vos événements, avec une conviction :',
    conviction: 'un événement réussi se construit dans les détails.',
  },
]

/**
 * S5. Trois valeurs, trois preuves.
 *
 * La preuve est une démarche vérifiable, jamais une déclaration : on ne dit
 * pas « nous sommes rigoureux », on dit qu'il y a une check-list avant
 * chaque départ.
 *
 * Texte fourni par le client, resserré en trois points par valeur. Ce sont
 * des engagements pris par écrit : ils doivent rester tenables (check-list,
 * solution de secours, essais finis avant l'arrivée du public).
 */
export type Valeur = {
  nom: string
  /** Trois points par valeur, courts : la plaque se lit d'un coup d'œil. */
  points: readonly string[]
}

export const VALEURS: readonly Valeur[] = [
  {
    nom: 'Rigueur',
    points: [
      'Chaque détail anticipé',
      'Les mêmes procédures, de la préparation à l’exploitation',
      'Une check-list avant chaque départ',
    ],
  },
  {
    nom: 'Fiabilité',
    points: [
      'Matériel vérifié et entretenu en préventif',
      'Un secours pour chaque équipement critique',
      'Essais terminés avant l’arrivée du public',
    ],
  },
  {
    nom: 'Réactivité',
    points: [
      'Une structure légère, qui décide vite',
      'Une organisation adaptée à chaque événement',
      'Un interlocuteur, et il répond',
    ],
  },
]

/**
 * S6. Notre approche : les cinq réflexes du chantier, tels que le client les
 * formule. Le verbe en grand, sa suite en petit : ce sont des réflexes, pas
 * des étapes, ils ne sont donc pas numérotés.
 */
export type Reflexe = {
  verbe: string
  suite: string
}

export const REFLEXES: readonly Reflexe[] = [
  { verbe: 'Analyser', suite: 'avant de proposer' },
  { verbe: 'Planifier', suite: 'avant d’engager' },
  { verbe: 'Coordonner', suite: 'sans relâche' },
  { verbe: 'Maîtriser', suite: 'les contraintes techniques' },
  { verbe: 'Anticiper', suite: 'les imprévus' },
]

/**
 * S7. Le fondateur : depuis combien d'années il conçoit et coordonne des
 * événements.
 */
export const FONDATEUR_ANNEES = '10'
