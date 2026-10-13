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

/** Délai de réponse annoncé sur tous les appels à l'action. */
export const DELAI_REPONSE_H = '48'

/** Nombre de prestataires du réseau Oysen. */
export const NB_PARTENAIRES = '13'

/** Note Google affichée dans le bandeau du hero. */
export const NOTE_GOOGLE = '5'

/** Nombre d'événements réalisés, dans la bande de réassurance. */
export const NB_EVENEMENTS = '40'

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
      alt: 'Console de mixage en régie, faders et vumètres allumés, la scène éclairée en violet à l’arrière-plan.',
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
  /** Ce qui se passe, une ligne par démarche. */
  deroule: readonly string[]
  livrable: string
}

export const METHODE: readonly Etape[] = [
  {
    numero: '1',
    nom: 'Cadrage',
    deroule: ['Qualification du besoin', 'Analyse des contraintes techniques'],
    livrable: 'Une proposition chiffrée et un déroulé',
  },
  {
    numero: '2',
    nom: 'Sourcing',
    deroule: [
      'Recherche du lieu',
      'Visite du site',
      'Sélection et négociation des prestataires',
      'Contractualisation',
    ],
    livrable: 'Une short-list argumentée et un budget ligne à ligne',
  },
  {
    numero: '3',
    nom: 'Production',
    deroule: [
      'Rétroplanning',
      'Conformité',
      'Préparation et contrôle du matériel',
      'Essais techniques avant l’arrivée du public',
      'Matériel de secours sur les postes critiques',
    ],
    livrable: 'Un rétroplanning daté et un dossier de conformité',
  },
  {
    numero: '4',
    nom: 'Régie',
    deroule: [
      'Exploitation',
      'Coordination des intervenants',
      'Démontage',
    ],
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
 * Sept questions, réponse directe en tête : le format que les moteurs de
 * réponse extraient le plus volontiers. Affichées en dépliants (Faq.tsx),
 * les réponses restent dans la page et dans le balisage FAQPage.
 *
 * À VALIDER : les engagements qu'elles contiennent (frais de déplacement
 * annoncés au devis, secours sur chaque équipement critique, technicien
 * présent pendant l'événement) doivent être tenables.
 */
export const FAQ = [
  {
    q: 'Que fait une agence événementielle, exactement ?',
    a: 'Une agence événementielle conçoit, coordonne et réalise un événement à la place de son client. Oysen prend en charge la recherche du lieu, la sélection et le pilotage des prestataires, la prestation technique, la présence le jour J et le démontage. Vous pouvez aussi ne confier qu’une partie, la technique seule par exemple.',
  },
  {
    q: 'Combien coûte l’organisation d’un événement d’entreprise ?',
    a: 'Le coût d’un séminaire, d’une soirée d’entreprise ou d’une convention dépend de trois variables : le nombre de participants, le niveau technique et la durée. Oysen ne publie pas de grille tarifaire, elle serait fausse dans la plupart des cas, et donne un ordre de grandeur dès le premier échange.',
  },
  {
    q: 'Combien de temps à l’avance faut-il réserver une agence événementielle ?',
    a: '12 à 18 mois pour un mariage, quelques semaines à plusieurs mois pour un séminaire d’entreprise ou une manifestation publique, quelques jours pour une location de matériel. Un délai court n’est pas rédhibitoire : dites-le dès le premier message, Oysen vous dira ce qui reste faisable.',
  },
  {
    q: 'Quelle agence événementielle choisir à Toulouse ?',
    a: 'Trois critères comptent : qui possède le matériel technique, qui coordonne réellement les prestataires, et qui est présent le jour J. Oysen est une entreprise générale de l’événementiel basée à Toulouse : conception, coordination et technique sont assurées par le même interlocuteur, avec son propre parc son, lumière et structure.',
  },
  {
    q: 'Faut-il passer par une agence ou contacter les prestataires soi-même ?',
    a: 'Contacter directement le traiteur, le DJ, le loueur, le décorateur et l’éclairagiste coûte moins cher sur le papier, mais la coordination reste à votre charge. Une agence événementielle comme Oysen prend ce rôle : un seul contrat, un seul interlocuteur, une seule responsabilité le jour J.',
  },
  {
    q: 'Que se passe-t-il en cas de panne technique pendant un événement ?',
    a: 'Le matériel est vérifié avant chaque départ et les essais sont terminés avant l’arrivée du public. Oysen prévoit une solution de secours sur chaque équipement critique et un technicien reste présent pendant l’événement : un incident se règle sur place, pas au téléphone.',
  },
  {
    q: 'Dans quels départements Oysen organise-t-elle des événements ?',
    a: 'Oysen est une agence événementielle basée à Toulouse qui intervient sur sept départements : Haute-Garonne, Gers, Tarn, Tarn-et-Garonne, Ariège, Aude et Hautes-Pyrénées. Au-delà, c’est possible, les frais de déplacement sont annoncés dans le devis.',
  },
]
