import type { BaliseIconName } from './icons'

/*
 * Le contenu de la page d'accueil, séparé de sa mise en forme.
 *
 * Les valeurs entre crochets sont des affirmations factuelles opposables :
 * un délai de réponse engageant, une jauge, un montant de responsabilité
 * civile. Elles ne peuvent pas être inventées, donc les crochets restent
 * visibles à l'écran tant que le client ne les a pas fournies — une valeur
 * plausible passerait inaperçue en relecture.
 */

/** Zone d'intervention. */
export const ZONE = 'Toulouse'

/** À RENSEIGNER — délai de réponse annoncé sur tous les appels à l'action. */
export const DELAI_REPONSE_H = '[X]'

/** Nombre de prestataires du réseau Oysen. */
export const NB_PARTENAIRES = '13'

/** Note Google affichée dans le bandeau du hero. */
export const NOTE_GOOGLE = '5'

/** À RENSEIGNER — nombre d'avis Google sur lequel repose la note. */
export const NB_AVIS_GOOGLE = '[N]'

/** À RENSEIGNER : nombre d'événements réalisés, dans la bande de réassurance. */
export const NB_EVENEMENTS = '[N]'

/**
 * Les départements desservis, affichés dans le pied de page. L'ordre est
 * celui fourni par le client : la Haute-Garonne d'abord, les limitrophes
 * ensuite.
 */
export const DEPARTEMENTS = [
  'Haute-Garonne (31)',
  'Gers (32)',
  'Tarn (81)',
  'Tarn-et-Garonne (82)',
  'Ariège (09)',
  'Aude (11)',
  'Hautes-Pyrénées (65)',
]

/** Montant de la RC professionnelle. */
export const RC_PRO = '15 M€'

/**
 * Le numéro n'est pas dans le HTML servi : il n'apparaît qu'au clic. Les
 * aspirateurs d'adresses qui lisent la page sans exécuter le JS repartent
 * les mains vides.
 */
export const PHONE_DISPLAY = '06 60 44 51 30'
export const PHONE_TEL = '+33660445130'

/**
 * Les cinq portes d'entrée.
 *
 * L'ordre est celui de l'affichage : les trois premières forment la rangée
 * du haut sur grand écran, choisies par le client. Les deux dernières
 * occupent la rangée du bas, sans ordre imposé.
 *
 * La ligne de qualification fait le travail le plus utile de la page : elle
 * doit permettre de se reconnaître — et d'écarter les quatre autres — en
 * moins de deux secondes. D'où des noms de choses, pas des bénéfices.
 *
 * « Location de matériel », présente au menu, n'est volontairement pas une
 * porte : elle s'adresse à quelqu'un qui sait déjà ce qu'il veut.
 *
 * `photo` : `name` est le nom de base des fichiers de public/images/services/,
 * livrés en deux largeurs (-800.jpg et -1200.jpg), déjà recadrés en 4/5 sur
 * le sujet du service. `focus` est le point à garder quand la carte change
 * de proportions (object-position, 50% 50% par défaut). L'`alt` décrit la
 * scène, pas le service : le titre de la carte le dit déjà. Sans photo, la
 * carte affiche son emplacement réservé.
 */
export type TriEntry = {
  title: string
  href: string
  qualif: string
  photo?: { name: string; alt: string; focus?: string }
}

export const TRI: TriEntry[] = [
  {
    title: 'Événements d’entreprise',
    href: '/nos-services/evenements-entreprise',
    qualif: 'Séminaire, soirée, convention, lancement',
    photo: {
      name: 'evenement-entreprise',
      alt: 'Grand chapiteau vitré de nuit, guirlandes lumineuses et longues tablées dressées aux bougies.',
      focus: '50% 40%',
    },
  },
  {
    title: 'Mariage et événement privé',
    href: '/nos-services/mariages-evenements-prives',
    qualif: 'Un événement qui compte vraiment, un moment d’exception !',
    photo: {
      name: 'mariage-evenement-prive',
      alt: 'Salle de réception sous charpente bois, tables rondes dressées en blanc et chemins de table verts.',
      focus: '50% 55%',
    },
  },
  {
    title: 'Prestation technique',
    href: '/nos-services/prestation-technique',
    qualif: 'Son, lumière, structure',
    photo: {
      name: 'prestation-technique',
      alt: 'Console lumière en régie, écran de programmation allumé au-dessus des rangées de faders.',
      focus: '50% 45%',
    },
  },
  {
    title: 'Collectivités et institutions',
    href: '/nos-services/collectivites-institutionnels',
    qualif:
      'Inaugurations, manifestations publiques, cérémonies (marchés et gré à gré)',
    photo: {
      name: 'collectivites-institutions',
      alt: 'Salle de gala aux suspensions en osier, écran de projection allumé au fond, régie son au premier plan.',
      focus: '50% 35%',
    },
  },
  {
    title: 'Festivals et événements culturels',
    href: '/nos-services/festivals-evenements-culturels',
    photo: {
      name: 'festivals-evenements-culturels',
      alt: 'Piste de danse sous des projecteurs bleus, public face à une scène montée sur structure aluminium.',
      focus: '50% 45%',
    },
    qualif: 'Jauge, sécurité, licence, SACEM : la chaîne complète',
  },
]

/**
 * S3. Les quatre balises du jeu de piste, dans l'ordre d'affichage choisi
 * par le client : les prestataires, le lieu, le budget, la réglementation.
 *
 * Chaque colonne : un titre, cinq démarches en `puces`, et une phrase de
 * chute en `detail`, posée en bas de colonne sous son filet.
 */
export type Balise = {
  icon: BaliseIconName
  titre: string
  puces: readonly string[]
  detail: string
}

export const BALISES: readonly Balise[] = [
  {
    icon: 'prestataires',
    titre: 'Les prestataires',
    puces: [
      'Les trouver',
      'Comparer les devis',
      'Vérifier les assurances',
      'Caler les plannings',
      'Les coordonner le jour J',
    ],
    detail:
      'Faire travailler ensemble les prestataires d’un événement vous coûte de l’énergie !',
  },
  {
    icon: 'lieu',
    titre: 'Le lieu',
    puces: [
      'Trouver le lieu',
      'Le visiter',
      'Valider les disponibilités',
      'Négocier',
      'Contractualiser',
    ],
    detail: 'Bien choisir un lieu pour organiser un événement vous coûte du temps !',
  },
  {
    icon: 'budget',
    titre: 'Le budget',
    puces: [
      'Estimer l’enveloppe',
      'Collecter les devis',
      'Arbitrer les postes',
      'Absorber les imprévus',
      'Suivre les dépassements',
    ],
    detail: 'Un budget d’événement mal suivi vous coûte de l’argent !',
  },
  {
    icon: 'reglementation',
    titre: 'La réglementation',
    puces: [
      'Déclarer l’événement en mairie',
      'Respecter les normes de sécurité',
      'Souscrire les bonnes assurances',
      'Déclarer la musique à la SACEM',
      'Prévoir le dispositif de secours',
    ],
    detail: 'Organiser un événement engage votre responsabilité !',
  },
]

/**
 * S5. Les trois mouvements du guide : le constat qui a fait naître Oysen,
 * la décision qui en découle, la méthode qui la rend tenable. L'ordre porte
 * une information, c'est un enchaînement de cause à effet.
 *
 * Chaque mouvement : un intitulé, une phrase pour les deux derniers, et une
 * courte liste. Le premier n'a pas de phrase : ses deux lignes sont le
 * constat.
 */
export type Mouvement = {
  label: string
  phrase?: string
  puces: readonly string[]
}

export const MOUVEMENTS: readonly Mouvement[] = [
  {
    label: 'Née d’un constat',
    puces: [
      'Les agences ne possèdent pas de matériel',
      'Les techniciens ne font pas d’organisation',
    ],
  },
  {
    label: 'Notre décision ?',
    phrase: 'On s’occupe de tout, pour vous.',
    puces: ['Conception', 'Coordination', 'Technique'],
  },
  {
    label: 'Comment ?',
    phrase:
      'Grâce à la méthode de notre fondateur, ancien ingénieur, habitué à structurer des projets exigeants.',
    puces: ['Rétroplanning', 'Budget tenu', 'Plan B par poste critique'],
  },
]

/**
 * S6. La méthode, telle que le client la décrit : quatre étapes, ce qui s'y
 * passe, ce que le client reçoit à la fin de chacune.
 *
 * C'est une vraie séquence, chaque étape produit ce dont la suivante a
 * besoin, donc la numérotation porte une information et n'est pas une
 * décoration.
 */
export type Etape = {
  numero: string
  nom: string
  deroule: string
  livrable: string
}

export const METHODE: readonly Etape[] = [
  {
    numero: '1',
    nom: 'Cadrage',
    deroule:
      'Qualification du besoin, analyse des contraintes techniques, visite du site',
    livrable: 'Une proposition chiffrée et un déroulé',
  },
  {
    numero: '2',
    nom: 'Sourcing',
    deroule:
      'Recherche du lieu, sélection et négociation des prestataires, contractualisation',
    livrable: 'Une short-list argumentée et un budget ligne à ligne',
  },
  {
    numero: '3',
    nom: 'Production',
    deroule:
      'Rétroplanning, conformité, préparation et contrôle du matériel, essais techniques avant l’arrivée du public, matériel de secours sur les postes critiques',
    livrable: 'Un rétroplanning daté et un dossier de conformité',
  },
  {
    numero: '4',
    nom: 'Régie',
    deroule: 'Exploitation, coordination des intervenants, démontage',
    livrable: 'Un interlocuteur unique sur place, du montage au démontage',
  },
]

/**
 * S7. Les trois témoignages filmés, en format portrait.
 *
 * ⚠️ PROVISOIRE : les trois vidéos de `public/videos/temoignages/` sont des
 * exemples fournis pour caler la mise en page. Elles devront être
 * remplacées par les vraies avant la mise en ligne.
 *
 * `video` est le nom du fichier, sans extension. Sans lui, la carte affiche
 * son emplacement réservé.
 */
export type Temoignage = { nom: string; evenement: string; video?: string }

export const TEMOIGNAGES: readonly Temoignage[] = [
  { nom: 'Axel Antunes', evenement: 'Mariage', video: 't1' },
  { nom: 'Marine', evenement: 'Anniversaire', video: 't2' },
  { nom: 'Mr Pastèque', evenement: 'Cérémonie d’ouverture', video: 't3' },
]

/**
 * Trois réalisations, format « résultat d'abord » : ce qui a été levé passe
 * avant le nom de l'événement.
 *
 * À FOURNIR — tant que ces trois cas ne sont pas réels et publiables, mieux
 * vaut retirer la section que l'afficher en crochets.
 */
export const REALISATIONS = [
  {
    type: 'Séminaire d’entreprise',
    jauge: '[N] personnes',
    lieu: '[Lieu]',
    contrainte:
      '[La contrainte levée : ce qui rendait l’événement difficile, et comment il a quand même eu lieu.]',
    href: '/nos-souvenirs',
  },
  {
    type: 'Festival',
    jauge: '[N] personnes',
    lieu: '[Lieu]',
    contrainte: '[La contrainte levée.]',
    href: '/nos-souvenirs',
  },
  {
    type: 'Inauguration publique',
    jauge: '[N] personnes',
    lieu: '[Lieu]',
    contrainte: '[La contrainte levée.]',
    href: '/nos-souvenirs',
  },
]

/**
 * Quatre questions, réponse directe en tête, 40 à 60 mots : le format que
 * les moteurs de réponse extraient le plus volontiers. Affichées en clair
 * plutôt qu'en accordéon — un contenu replié est un contenu à moitié lu.
 *
 * À VALIDER : les engagements qu'elles contiennent (frais de déplacement
 * annoncés au devis, avis systématique) doivent être tenables.
 */
export const FAQ = [
  {
    q: 'Quels types d’événements organisez-vous ?',
    a: `Cinq familles : événements d’entreprise, manifestations de collectivités et d’institutions, mariages et événements privés, festivals et événements culturels, et prestation technique pour ceux qui pilotent eux-mêmes. Nous intervenons sur toute la chaîne, de la recherche de lieu au démontage, ou sur une seule partie si vous le préférez.`,
  },
  {
    q: 'Sur quelle zone intervenez-vous ?',
    a: `${ZONE} et sa région. Nous nous déplaçons au-delà lorsque le projet le justifie ; les frais de déplacement sont alors annoncés dans le devis, jamais ajoutés ensuite. Notre parc matériel partant du même endroit que nos équipes, la logistique reste sous notre contrôle plutôt que sous celui d’un loueur.`,
  },
  {
    q: 'Combien coûte l’organisation d’un événement ?',
    a: 'Cela dépend de trois variables : le nombre de personnes, le niveau technique attendu et la durée. Nous ne publions pas de grille tarifaire, elle serait fausse dans la plupart des cas. En revanche, dès le premier échange, nous vous donnons un ordre de grandeur avant toute proposition détaillée.',
  },
  {
    q: 'À quel moment faut-il vous contacter ?',
    a: 'Le plus tôt possible, et si possible avant d’avoir réservé le lieu : c’est le choix qui contraint tout le reste : jauge, technique, sécurité, budget. Un délai court n’est pas rédhibitoire pour autant ; dites-le nous dès le premier message, nous vous dirons franchement ce qui reste faisable.',
  },
]
