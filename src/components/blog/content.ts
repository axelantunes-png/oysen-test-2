/*
 * Les articles de la page « Blog ».
 *
 * CONTENU D'EXEMPLE, inventé pour mettre la page en place : titres et
 * résumés sont des pistes, pas des articles écrits. À remplacer par les
 * vrais articles ; les règles et délais cités devront être vérifiés à la
 * date de publication.
 *
 * `photo` : nom de base des fichiers de public/images/services/, en
 * attendant les illustrations des articles.
 */

export type Article = {
  slug: string
  /* La rubrique, en tête de carte. */
  rubrique: string
  titre: string
  date: string
  lecture: string
  resume: string
  photo: string
  focus?: string
}

export const ARTICLES: Article[] = [
  {
    slug: 'retroplanning-seminaire-toulouse',
    rubrique: 'Entreprise',
    titre: 'Organiser un séminaire à Toulouse : le rétroplanning, mois par mois',
    date: '6 octobre 2026',
    lecture: '6 min',
    resume: 'Du choix du lieu à la répétition des intervenants : ce qu’il faut avoir décidé, et quand.',
    photo: 'evenement-entreprise',
  },
  {
    slug: 'mariage-reserver-prestataires',
    rubrique: 'Mariage',
    titre: 'Mariage : combien de temps à l’avance réserver ses prestataires ?',
    date: '29 septembre 2026',
    lecture: '5 min',
    resume: 'Lieu, traiteur, photographe, musique : l’ordre dans lequel réserver, et pourquoi.',
    photo: 'mariage-evenement-prive',
  },
  {
    slug: 'evenement-espace-public-demarches',
    rubrique: 'Collectivités',
    titre: 'Un événement sur l’espace public : les démarches et leurs délais',
    date: '22 septembre 2026',
    lecture: '7 min',
    resume: 'Déclaration, arrêtés, dossier de sécurité : ce que la mairie attend, et à quel moment.',
    photo: 'collectivites-institutions',
  },
  {
    slug: 'dimensionner-sonorisation',
    rubrique: 'Technique',
    titre: 'Comment dimensionner la sonorisation selon le nombre d’invités',
    date: '15 septembre 2026',
    lecture: '4 min',
    resume: 'Salle ou plein air, discours ou concert : les repères pour que chacun entende bien.',
    photo: 'prestation-technique',
  },
  {
    slug: 'festival-points-a-anticiper',
    rubrique: 'Festivals',
    titre: 'Festival : sécurité, jauge et déclarations, les points à anticiper',
    date: '8 septembre 2026',
    lecture: '8 min',
    resume: 'Les questions à régler avant l’ouverture de la billetterie, pas la semaine d’avant.',
    photo: 'festivals-evenements-culturels',
  },
  {
    slug: 'soiree-entreprise-erreurs',
    rubrique: 'Entreprise',
    titre: 'Soirée d’entreprise : cinq erreurs qui coûtent cher',
    date: '1er septembre 2026',
    lecture: '5 min',
    resume: 'Un lieu trop petit, un son sous-dimensionné, un déroulé flou : comment les éviter.',
    photo: 'evenement-entreprise',
    focus: '30% 50%',
  },
]
