/*
 * Les réalisations de la page « Nos souvenirs ».
 *
 * CONTENU D'EXEMPLE, inventé pour mettre la page en place : aucun de ces
 * événements n'est une référence réelle. À remplacer par les vraies
 * réalisations (accord écrit du client avant toute citation d'un nom, d'un
 * lieu ou d'une photo ; mention « Réalisé par notre fondateur avant la
 * création d'Oysen » si l'événement la précède).
 *
 * `photo` : nom de base des fichiers de public/images/services/
 * (`-480.webp`, `-800.webp`, `-1200.webp`), en attendant les photos des
 * événements eux-mêmes.
 */

export type Souvenir = {
  slug: string
  /* Le type d'événement, en tête de carte. */
  type: string
  titre: string
  lieu: string
  public: string
  date: string
  resume: string
  photo: string
  /* Le cadrage de la photo dans la carte (object-position). */
  focus?: string
}

export const SOUVENIRS: Souvenir[] = [
  {
    slug: 'seminaire-cabinet-ingenierie',
    type: 'Séminaire d’entreprise',
    titre: 'Deux jours de séminaire pour un cabinet d’ingénierie',
    lieu: 'Toulouse',
    public: '120 personnes',
    date: 'Mars 2026',
    resume: 'Une plénière, quatre salles de travail et un dîner : un seul déroulé, tenu à la minute.',
    photo: 'evenement-entreprise',
  },
  {
    slug: 'mariage-domaine-lauragais',
    type: 'Mariage',
    titre: 'Un mariage en plein air dans le Lauragais',
    lieu: 'Lauragais',
    public: '140 invités',
    date: 'Juin 2026',
    resume: 'Cérémonie laïque, dîner sous les arbres et soirée dansante, avec un plan B prêt en cas d’orage.',
    photo: 'mariage-evenement-prive',
  },
  {
    slug: 'festival-plein-air-tarn',
    type: 'Festival',
    titre: 'Un festival de musique en plein air',
    lieu: 'Tarn',
    public: '1 200 personnes',
    date: 'Juillet 2026',
    resume: 'Deux scènes, une régie commune et un site sans électricité au départ, ouvert à l’heure.',
    photo: 'festivals-evenements-culturels',
  },
  {
    slug: 'voeux-du-maire',
    type: 'Cérémonie publique',
    titre: 'La cérémonie des vœux d’une commune',
    lieu: 'Haute-Garonne',
    public: '300 personnes',
    date: 'Janvier 2026',
    resume: 'Son de la salle, projection et micros réglés pour chaque élu, le déroulé calé avec le cabinet.',
    photo: 'collectivites-institutions',
  },
  {
    slug: 'soiree-fin-annee',
    type: 'Soirée d’entreprise',
    titre: 'Une soirée de fin d’année pour 250 collaborateurs',
    lieu: 'Toulouse',
    public: '250 invités',
    date: 'Décembre 2025',
    resume: 'Lieu, traiteur, animation et mise en lumière : un seul interlocuteur, du devis au démontage.',
    photo: 'evenement-entreprise',
    focus: '30% 50%',
  },
  {
    slug: 'concert-salle-regie',
    type: 'Prestation technique',
    titre: 'Son et lumière d’un concert en salle',
    lieu: 'Toulouse',
    public: '400 personnes',
    date: 'Avril 2026',
    resume: 'Installation, réglages et régie pendant le concert, puis démontage dans la nuit.',
    photo: 'prestation-technique',
  },
]
