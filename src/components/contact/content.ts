import { DELAI_REPONSE_H } from '../home/content'

/*
 * Le contenu de la page Contact et de son formulaire, séparé de leur mise
 * en forme. Le formulaire lit tout ici : les options, les six blocs de
 * l'étape 3, les messages d'erreur.
 */

export { DELAI_REPONSE_H }

/** À CONFIRMER par le client : l'adresse n'existe encore nulle part. */
export const EMAIL = 'contact@oysen.fr'

/** Dépôt de fichiers : taille par fichier, en Mo, et nombre de fichiers. */
export const TAILLE_MAX_MO = 10
export const NB_FICHIERS_MAX = 3

/** Les extensions et types acceptés par la zone de dépôt. */
export const FORMATS_ACCEPTES = [
  '.pdf',
  '.docx',
  '.xlsx',
  '.png',
  '.jpg',
  '.jpeg',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png',
  'image/jpeg',
].join(',')

/* ---- Les deux déroulants de tête ---- */

export type Profil =
  | 'entreprise'
  | 'particulier'
  | 'collectivite'
  | 'culturel'
  | 'professionnel'

export type Besoin = 'organisation' | 'technique' | 'location'

export const PROFILS: readonly { valeur: Profil; libelle: string }[] = [
  { valeur: 'entreprise', libelle: 'Une entreprise' },
  { valeur: 'particulier', libelle: 'Un particulier' },
  { valeur: 'collectivite', libelle: 'Une collectivité ou une institution' },
  { valeur: 'culturel', libelle: 'Une association ou un organisateur culturel' },
  { valeur: 'professionnel', libelle: 'Un professionnel de l’événementiel' },
]

export const BESOINS: readonly { valeur: Besoin; libelle: string }[] = [
  { valeur: 'organisation', libelle: 'Une organisation complète' },
  { valeur: 'technique', libelle: 'Une prestation technique' },
  { valeur: 'location', libelle: 'Une location de matériel' },
]

/** Un professionnel de l'événementiel ne confie pas l'organisation entière. */
export function besoinsPour(profil: Profil | '') {
  if (!profil) return []
  return profil === 'professionnel'
    ? BESOINS.filter((besoin) => besoin.valeur !== 'organisation')
    : BESOINS
}

/** Le libellé du champ « Structure », selon le profil ; masqué si particulier. */
export const LIBELLE_STRUCTURE: Record<Profil, string | null> = {
  entreprise: 'Votre entreprise',
  collectivite: 'Votre collectivité ou établissement',
  culturel: 'Votre association ou structure',
  professionnel: 'Votre structure',
  particulier: null,
}

/* ---- Étape 1 : les choix uniques ---- */

export const PERSONNES = [
  'Moins de 50',
  '50 à 100',
  '100 à 250',
  '250 à 500',
  'Plus de 500',
  'Je ne sais pas encore',
]

export const DUREES = [
  'Quelques heures',
  'Une demi-journée',
  'Une journée',
  'Plusieurs jours',
  'Je ne sais pas encore',
]

/* ---- Étape 3 : les six blocs ---- */

export type BlocId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export type Question = {
  id: string
  label: string
  type: 'unique' | 'multiple' | 'texte' | 'zone'
  options?: readonly string[]
  placeholder?: string
  /** L'option qui ouvre un champ texte libre. */
  autre?: string
  /** L'option qui ouvre la zone de dépôt de fichiers. */
  depot?: string
}

export type Bloc = { titre: string; questions: readonly Question[] }

/** Quel bloc afficher à l'étape 3, selon les deux déroulants de tête. */
export function resoudreBloc(profil: Profil | '', besoin: Besoin | ''): BlocId | null {
  if (besoin === 'technique') return 'E'
  if (besoin === 'location') return 'F'
  if (besoin !== 'organisation') return null
  switch (profil) {
    case 'entreprise':
      return 'A'
    case 'particulier':
      return 'B'
    case 'collectivite':
      return 'C'
    case 'culturel':
      return 'D'
    default:
      return null
  }
}

const OUI_NON_EN_COURS = ['Oui', 'Non', 'En cours']

export const BLOCS: Record<BlocId, Bloc> = {
  A: {
    titre: 'Événement d’entreprise',
    questions: [
      {
        id: 'A1',
        label: 'Quel type d’événement organisez-vous ?',
        type: 'unique',
        options: [
          'Séminaire',
          'Soirée d’entreprise',
          'Convention',
          'Lancement de produit',
          'Inauguration',
          'Autre',
        ],
      },
      {
        id: 'A2',
        label: 'Quels espaces seront utilisés ?',
        type: 'unique',
        options: [
          'Une seule salle',
          'Plusieurs espaces',
          'Intérieur + extérieur',
          'Je ne sais pas encore',
        ],
      },
      {
        id: 'A3',
        label: 'Quelles prestations recherchez-vous ?',
        type: 'multiple',
        options: [
          'Son',
          'Lumière',
          'Structure',
          'Scène',
          'DJ / animation',
          'Régie technique',
          'Accompagnement complet',
        ],
      },
      {
        id: 'A4',
        label:
          'Disposez-vous d’un cahier des charges, d’un plan ou d’une fiche technique ?',
        type: 'unique',
        options: OUI_NON_EN_COURS,
        depot: 'Oui',
      },
    ],
  },
  B: {
    titre: 'Mariage et événement privé',
    questions: [
      {
        id: 'B1',
        label: 'Quel type d’événement préparez-vous ?',
        type: 'unique',
        options: ['Mariage', 'Anniversaire', 'Soirée privée', 'Autre'],
      },
      {
        id: 'B2',
        label: 'Quels moments souhaitez-vous sonoriser ou animer ?',
        type: 'multiple',
        options: [
          'Cérémonie',
          'Cocktail',
          'Repas',
          'Soirée dansante',
          'Plusieurs de ces moments',
        ],
      },
      {
        id: 'B3',
        label: 'Quelles prestations recherchez-vous ?',
        type: 'multiple',
        options: [
          'Organisation générale et conception',
          'DJ',
          'Sonorisation',
          'Décoration',
          'Traiteur',
          'Photographe et vidéaste',
          'Voitures anciennes',
          'Photobooth',
          'Éclairage',
          'Mise en lumière du lieu',
          'Structure / scène',
          'Magie',
          'Animation',
          'Autre',
        ],
        autre: 'Autre',
      },
      {
        id: 'B4',
        label: 'Avez-vous des attentes particulières ?',
        type: 'texte',
        placeholder:
          'Ambiance musicale, première danse, animations, mise en lumière, contraintes du lieu…',
      },
    ],
  },
  C: {
    titre: 'Collectivité et institution',
    questions: [
      {
        id: 'C1',
        label: 'Quel type de manifestation organisez-vous ?',
        type: 'unique',
        options: [
          'Cérémonie',
          'Inauguration',
          'Manifestation publique',
          'Marché ou événement local',
          'Vœux / réception',
          'Autre',
        ],
      },
      {
        id: 'C2',
        label: 'L’événement se déroule où ?',
        type: 'unique',
        options: ['Intérieur', 'Extérieur', 'Intérieur + extérieur'],
      },
      {
        id: 'C3',
        label: 'Quelles prestations souhaitez-vous ?',
        type: 'multiple',
        options: [
          'Sonorisation',
          'Éclairage',
          'Structure / scène',
          'Régie technique',
          'Montage / démontage',
          'Prestation complète',
        ],
      },
      {
        id: 'C4',
        label: 'Quel niveau d’accompagnement souhaitez-vous ?',
        type: 'multiple',
        options: [
          'Location de matériel',
          'Livraison et installation',
          'Installation + techniciens',
          'Prise en charge technique complète',
        ],
      },
      {
        id: 'C5',
        label: 'Disposez-vous d’un cahier des charges ou de documents techniques ?',
        type: 'unique',
        options: OUI_NON_EN_COURS,
        depot: 'Oui',
      },
    ],
  },
  D: {
    titre: 'Festival et événement culturel',
    questions: [
      {
        id: 'D1',
        label: 'Quel type d’événement culturel organisez-vous ?',
        type: 'unique',
        options: ['Festival', 'Concert', 'Spectacle', 'Événement culturel', 'Autre'],
      },
      {
        id: 'D2',
        label: 'Combien de jours dure l’événement ?',
        type: 'unique',
        options: ['1 jour', '2 jours', '3 jours', '4 jours ou plus'],
      },
      {
        id: 'D3',
        label: 'Quelles prestations recherchez-vous ?',
        type: 'multiple',
        options: [
          'Sonorisation',
          'Éclairage',
          'Scène / structure',
          'Régie',
          'Techniciens',
          'Prestation technique complète',
          'Autre',
        ],
        autre: 'Autre',
      },
      {
        id: 'D4',
        label: 'Disposez-vous d’une fiche technique ou d’un rider ?',
        type: 'unique',
        options: OUI_NON_EN_COURS,
        depot: 'Oui',
      },
      {
        id: 'D5',
        label: 'Quelles sont les principales contraintes de votre événement ?',
        type: 'zone',
        placeholder:
          'Horaires, site, voisinage, accès, plusieurs scènes, artistes, montage et démontage…',
      },
    ],
  },
  E: {
    titre: 'Prestation technique',
    questions: [
      {
        id: 'E1',
        label: 'De quelles compétences avez-vous besoin ?',
        type: 'multiple',
        options: [
          'Son',
          'Lumière',
          'Régie générale',
          'Technicien son',
          'Technicien lumière',
          'Montage / démontage',
          'Équipe technique complète',
        ],
      },
      {
        id: 'E2',
        label: 'Quelle est la durée de la prestation ?',
        type: 'multiple',
        options: [
          'Une journée',
          'Plusieurs jours',
          'Montage uniquement',
          'Exploitation uniquement',
          'Montage + exploitation + démontage',
        ],
      },
      {
        id: 'E3',
        label: 'Disposez-vous d’une fiche technique ou d’un cahier des charges ?',
        type: 'unique',
        options: OUI_NON_EN_COURS,
        depot: 'Oui',
      },
      {
        id: 'E4',
        label:
          'Quelles sont les contraintes ou particularités techniques de votre projet ?',
        type: 'zone',
      },
    ],
  },
  F: {
    titre: 'Location de matériel',
    questions: [
      {
        id: 'F1',
        label: 'Quel matériel recherchez-vous ?',
        type: 'multiple',
        options: [
          'Sonorisation',
          'Éclairage',
          'Structure',
          'Scène / praticable',
          'Effets (étincelles froides, fumée lourde)',
          'DJ',
          'Autre',
        ],
      },
      {
        id: 'F2',
        label: 'Pour quelle durée souhaitez-vous louer le matériel ?',
        type: 'unique',
        options: [
          '1 jour',
          '2 à 3 jours (week-end)',
          '4 à 7 jours',
          'Plus d’une semaine',
          'À définir',
        ],
      },
      {
        id: 'F3',
        label: 'Souhaitez-vous récupérer le matériel ou être livré ?',
        type: 'unique',
        options: [
          'Retrait sur place',
          'Livraison',
          'Livraison + installation',
          'Je ne sais pas encore',
        ],
      },
      {
        id: 'F4',
        label: 'Avez-vous déjà identifié le matériel dont vous avez besoin ?',
        type: 'unique',
        options: [
          'Oui, j’ai une liste précise',
          'J’ai une idée mais j’ai besoin de conseils',
          'Non, j’ai besoin d’être conseillé',
        ],
        depot: 'Oui, j’ai une liste précise',
      },
    ],
  },
}

/* ---- Les messages d'erreur ---- */

export const ERREURS = {
  profil: 'Indiquez qui vous êtes pour que nous affichions les bonnes questions.',
  besoin: 'Indiquez ce que vous cherchez.',
  date: 'Indiquez une date, ou cochez « Date encore à définir ».',
  datePassee: 'Cette date est déjà passée. Choisissez une date à venir.',
  personnes:
    'Choisissez une option. « Je ne sais pas encore » convient très bien.',
  duree: 'Choisissez une option. « Je ne sais pas encore » convient très bien.',
  prenom: 'Indiquez votre prénom.',
  email: 'Cette adresse semble incomplète. Format attendu : nom@domaine.fr',
  telephone: 'Le numéro semble incomplet. Format attendu : 06 12 34 56 78',
  consentement: 'Cochez cette case pour que nous puissions vous répondre.',
  fichierLourd: `Ce fichier dépasse ${TAILLE_MAX_MO} Mo. Envoyez-le par e-mail si besoin.`,
  fichierFormat:
    'Ce format n’est pas accepté. Envoyez un PDF, un Word, un Excel ou une image.',
  fichiersTrop: `${NB_FICHIERS_MAX} fichiers au maximum. Envoyez les autres par e-mail.`,
  serveur: `L’envoi n’a pas abouti. Réessayez, ou écrivez-nous directement à ${EMAIL}.`,
}
