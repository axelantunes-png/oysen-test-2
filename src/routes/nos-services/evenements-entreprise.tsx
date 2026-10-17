import type { CSSProperties } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { DELAI_REPONSE_H, RC_PRO } from '../../components/home/content'
import { Arrow } from '../../components/home/icons'
import { Lien } from '../../components/Lien'
import { canonical } from '../../lib/canonical'

/*
 * Chemin depuis la racine du projet, et non relatif : sur une route imbriquée,
 * le découpage de TanStack Start réécrit le module et le chemin relatif n'est
 * plus résolvable côté serveur (« Denied ID »).
 */
import entrepriseCss from '/src/styles/entreprise.css?url'

/*
 * Les valeurs entre crochets sont des affirmations à faire valider par le
 * client (un délai, une jauge, un montant). Comme sur l'accueil, elles
 * restent visibles à l'écran tant qu'elles ne sont pas fournies : une
 * valeur plausible passerait inaperçue en relecture.
 */

/* Le formulaire de contact, ouvert sur les questions « Événement
   d'entreprise » (voir Formulaire.tsx). */
const CONTACT_ENTREPRISE = '/contact?profil=entreprise&besoin=organisation'

const TITRE = 'Organisation d’événements d’entreprise à Toulouse | Oysen'
const DESCRIPTION =
  'Séminaire, soirée, convention, lancement, inauguration : Oysen conçoit, coordonne et réalise votre événement d’entreprise à Toulouse et en Occitanie, son et lumière compris.'

export const Route = createFileRoute('/nos-services/evenements-entreprise')({
  head: () => ({
    meta: [
      { title: TITRE },
      { name: 'description', content: DESCRIPTION },
    ],
    links: [
      canonical('/nos-services/evenements-entreprise'),
      { rel: 'stylesheet', href: entrepriseCss },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(DONNEES_STRUCTUREES),
      },
    ],
  }),
  component: Entreprise,
})

/**
 * La page « Événements d'entreprise ».
 *
 * Elle parle à la personne à qui l'on a confié l'événement en plus de son
 * poste : responsable de la communication ou des ressources humaines,
 * office manager, assistant de direction. Sa peur tient en une scène, le
 * micro qui ne marche pas devant la direction ; sa demande, en une phrase,
 * un seul interlocuteur.
 *
 * Dans la salle sombre du site. Son signe est le conducteur de régie, le
 * déroulé minute par minute d'un jour J : un extrait se pose sur la photo
 * du hero, ses essais se cochent un à un avant l'ouverture des portes. Les
 * repères du dispositif (S4) en reprennent la voix, en mono.
 */
function Entreprise() {
  return (
    <main className="page-entreprise">
      <Hero />
      <Formats />
      <Dispositif />
      <Benefices />
      <Preuves />
      <Questions />
      <Appel />
    </main>
  )
}

/* La tête d'une section : surtitre, titre et, au besoin, une phrase. */
function Tete({
  surtitre,
  titre,
  id,
  texte,
  centree = false,
}: {
  surtitre: string
  titre: string
  id: string
  texte?: string
  centree?: boolean
}) {
  return (
    <div className={`entreprise-tete${centree ? ' entreprise-tete--centree' : ''}`}>
      <p className="section__eyebrow">{surtitre}</p>
      <h2 className="section__title" id={id}>
        {titre}
      </h2>
      {texte ? <p className="entreprise-tete__texte">{texte}</p> : null}
    </div>
  )
}

/* ---- S1 · Le hero ----
   La salle avant l'ouverture des portes. La photo en fond, éteinte et
   teintée ; en haut à droite, la rampe d'éclairage : trois faisceaux
   (ceux de l'accueil) qui croisent la salle et tombent sur le texte,
   centré. En bas, sur toute la largeur, le conducteur du jour J : un fil
   de 07:30 à l'ouverture des portes, que la lumière parcourt en cochant
   chaque essai. Puis trois preuves.
   (Version précédente : archives/entreprise-hero-v1.) */

const PREUVES = [
  'Toulouse, Haute-Garonne et Occitanie',
  'Son et lumière avec notre propre matériel',
  'Tout est testé avant l’arrivée du premier participant',
]

/* Un déroulé type, pas un événement réel : les heures sont un exemple.
   `essai` : le repère se coche, c'est un test fait avant l'ouverture. */
const CONDUCTEUR: { heure: string; action: string; essai?: boolean }[] = [
  { heure: '07:30', action: 'Arrivée de l’équipe, accueil des prestataires' },
  { heure: '08:00', action: 'Son, lumière et vidéo testés', essai: true },
  { heure: '08:15', action: 'Micros de secours en place', essai: true },
  { heure: '08:30', action: 'Répétition des intervenants', essai: true },
  { heure: '09:00', action: 'Ouverture des portes' },
]

function Hero() {
  return (
    <section className="entreprise-hero" aria-labelledby="entreprise-title">
      {/*
        À REMPLACER par une vraie photo d'un événement Oysen en
        configuration entreprise : une salle prête avant l'ouverture des
        portes, ou la régie pendant une prise de parole. À défaut, une
        photo de montage.
      */}
      <img
        className="entreprise-hero__fond"
        src="/images/services/evenement-entreprise-1200.jpg"
        srcSet="/images/services/evenement-entreprise-800.jpg 800w, /images/services/evenement-entreprise-1200.jpg 1200w"
        sizes="100vw"
        width={1200}
        height={1500}
        alt=""
        decoding="async"
      />

      {/* Le voile de la salle, et la rampe : trois faisceaux. Décor. */}
      <div className="entreprise-hero__salle" aria-hidden="true">
        <span className="entreprise-hero__faisceaux">
          <i />
          <i />
          <i />
        </span>
      </div>

      <div className="entreprise-hero__inner">
        <div className="entreprise-hero__texte">
          {/* Le h1 est le surtitre, porteur de la requête (événements
              d'entreprise, Toulouse, Occitanie) ; la grande phrase en
              dessous reste l'accroche, en simple paragraphe. */}
          <h1 className="section__eyebrow" id="entreprise-title">
            Organisation d’événements d’entreprise · Toulouse et Occitanie
          </h1>
          <p className="entreprise-hero__titre">
            Un événement fidèle à vos valeurs, maîtrisé dans les moindres détails
          </p>
          <p className="entreprise-hero__lede">
            Séminaire, soirée, convention, inauguration : un seul prestataire
            conçoit, coordonne et réalise votre événement, technique comprise.
          </p>

          <div className="entreprise-hero__actions">
            <div className="entreprise-hero__appel">
              <Lien className="btn btn--solid" href={CONTACT_ENTREPRISE}>
                Recevoir un devis détaillé
              </Lien>
              <p className="entreprise-hero__rassurance">
                Premier échange sans engagement · réponse sous{' '}
                {DELAI_REPONSE_H}&nbsp;h
              </p>
            </div>
            {/*
              À RÉACTIVER quand la page partenaires existera (dès que le
              client aura ses partenaires) : vérifier son adresse, puis
              retirer le commentaire.

            <Lien className="lien-clair" href="/nos-partenaires">
              Découvrir nos partenaires
              <Arrow className="lien-clair__fleche" />
            </Lien>
            */}
          </div>
        </div>
      </div>

      {/* Le conducteur du jour J : ce qui se passe avant que le premier
          participant n'entre. */}
      <figure className="jour-j">
        <figcaption className="jour-j__tete">
          <span>Jour J</span>
        </figcaption>
        <ol className="jour-j__fil">
          {CONDUCTEUR.map((repere, rang) => (
            <li
              className={`jour-j__repere${repere.essai ? ' jour-j__repere--essai' : ''}`}
              key={repere.heure}
              style={{ '--rang': rang } as CSSProperties}
            >
              <span className="jour-j__heure">{repere.heure}</span>
              <span className="jour-j__action">{repere.action}</span>
              {repere.essai ? <span className="jour-j__statut">Testé</span> : null}
            </li>
          ))}
        </ol>
      </figure>

      <ul className="entreprise-preuves">
        {PREUVES.map((preuve) => (
          <li key={preuve}>{preuve}</li>
        ))}
      </ul>
    </section>
  )
}

/* ---- S2 · Les formats couverts ----
   Six cartes, une par format : pour quelles occasions, ce que nous
   prenons en charge, ce qui en résulte. Les cartes ne sont pas des
   liens, et la section n'a pas de bouton : celui du dispositif suit. */

const FORMATS: {
  nom: string
  pour: string
  charge: string[]
  resultat: string
  avalider?: string
}[] = [
  {
    nom: 'Séminaire',
    pour: 'Une ou plusieurs journées, pour une équipe, un service ou un comité de direction.',
    charge: [
      'Un lieu adapté à votre effectif, plénière et salles de travail',
      'Restauration, et hébergement au-delà d’une journée',
      'Sonorisation des prises de parole, projection',
    ],
    resultat: 'L’ordre du jour tient, et l’on entend chaque intervenant jusqu’au dernier rang.',
  },
  {
    nom: 'Soirée d’entreprise',
    pour: 'Fin d’année, anniversaire de l’entreprise, soirée clients.',
    charge: [
      'Lieu, traiteur et animation',
      'Mise en lumière et sonorisation',
      'Un seul déroulé pour l’ensemble',
    ],
    resultat: 'Vous accueillez vos invités au lieu de surveiller l’heure du service.',
  },
  {
    nom: 'Convention',
    pour: 'Le rendez-vous où la direction s’adresse à toute l’entreprise.',
    charge: [
      'Scène, sonorisation de la plénière, écran et régie',
      'Répétition de vos intervenants avant l’ouverture',
    ],
    resultat: 'Le message passe, sans temps mort entre deux prises de parole.',
  },
  {
    nom: 'Lancement de produit',
    pour: 'Devant vos clients, vos partenaires ou la presse : tout doit marcher du premier coup.',
    charge: [
      'Mise en scène et mise en lumière du produit',
      'Son et vidéo',
      'Répétition du déroulé avec vous',
    ],
    resultat: 'Le jour du lancement, l’attention reste sur le produit.',
  },
  {
    nom: 'Inauguration',
    pour: 'De nouveaux locaux, un site de production, un équipement.',
    charge: [
      'Repérage d’un lieu pas fait pour recevoir : accès, électricité, circulation',
      'Sonorisation des discours',
      'Accueil et cocktail',
    ],
    resultat: 'Vos invités découvrent le lieu, pas les câbles.',
  },
  {
    nom: 'Journée de cohésion',
    pour: 'Team building : une journée hors des murs pour souder une équipe.',
    charge: [
      'Le lieu, et l’activité choisie auprès de prestataires spécialisés',
      'Restauration et transport',
      'Le déroulé de la journée',
    ],
    resultat: 'Vous passez la journée avec votre équipe, sans avoir à la gérer.',
  },
]

function Formats() {
  return (
    <section
      className="section section--entreprise section--entreprise-formats"
      aria-labelledby="formats-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Formats couverts"
          titre="Séminaire, soirée, convention : les événements d’entreprise que nous organisons"
          id="formats-title"
          texte="Pour chacun, nous prenons en charge le lieu, la coordination des prestataires, la technique et la présence le jour J, à Toulouse et en Occitanie."
          centree
        />

        <ul className="formats">
          {FORMATS.map((format) => (
            <li className="format dc01" key={format.nom}>
              <span className="dc01__repere" aria-hidden="true" />
              <span className="dc01__survol" aria-hidden="true" />
              <span className="dc01__zone" aria-hidden="true" />
              <h3 className="format__nom">
                {format.nom}
                {format.avalider ? (
                  <span className="format__pastille">{format.avalider}</span>
                ) : null}
              </h3>
              <p className="format__pour">{format.pour}</p>
              <ul className="format__charge">
                {format.charge.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <p className="format__resultat">{format.resultat}</p>
            </li>
          ))}
        </ul>

      </div>
    </section>
  )
}

/* ---- S4 · Le dispositif en cinq étapes ----
   Une vraie séquence : chaque étape produit ce dont la suivante a
   besoin, d'où les repères numérotés, à la manière des tops d'un
   conducteur. Cinq cartes éclairées, comme la méthode de l'accueil :
   ce que nous faisons, puis ce qui reste de votre côté. */

const ETAPES = [
  {
    nom: 'Le cadrage',
    nous: [
      'Ce que l’événement doit produire, pour qui, quand, pour combien',
      'Le budget, et ce qui est déjà décidé : lieu, traiteur, cahier des charges',
    ],
    vous: 'Vous décrivez votre projet, même s’il n’est pas encore arrêté.',
  },
  {
    nom: 'La proposition chiffrée',
    nous: [
      'Le format, conçu pour votre objectif',
      'Lieux et prestataires présélectionnés',
      'Une proposition détaillée, poste par poste',
    ],
    vous: 'Vous ajustez et validez. Un seul document à présenter à votre direction.',
  },
  {
    nom: 'La préparation',
    nous: [
      'Repérage du lieu : accès, électricité, acoustique',
      'Réservation et coordination des prestataires',
      'Rétroplanning et déroulé minute par minute',
    ],
    vous: 'Vous validez les choix structurants.',
  },
  {
    nom: 'L’installation et les essais',
    nous: [
      'Accueil des prestataires',
      'Son, lumière et vidéo installés',
      'Tout testé avant le premier participant',
    ],
    vous: 'Vous arrivez dans un lieu prêt. Vos intervenants peuvent répéter.',
  },
  {
    nom: 'Le jour J, le démontage et le bilan',
    nous: [
      'Horaires tenus, intervenants et prestataires coordonnés',
      'Chaque imprévu pris en charge',
      'Démontage, puis bilan avec vous',
    ],
    vous: 'Vous accueillez vos invités.',
  },
]

function Dispositif() {
  return (
    <section
      className="section section--entreprise section--entreprise-dispositif"
      aria-labelledby="dispositif-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Notre dispositif"
          titre="L’organisation de votre événement, du premier échange au démontage"
          id="dispositif-title"
          texte="Notre méthode en 5 étapes."
          centree
        />

        <ol className="dispositif">
          {ETAPES.map((etape, index) => (
            <li className="dispositif__carte dc01" key={etape.nom}>
              <span className="dc01__repere" aria-hidden="true" />
              <span className="dc01__survol" aria-hidden="true" />
              <span className="dc01__zone" aria-hidden="true" />
              <p className="dispositif__top">Top {String(index + 1).padStart(2, '0')}</p>
              <h3 className="dispositif__nom">{etape.nom}</h3>
              <dl className="dispositif__details">
                <dt>Nous</dt>
                <dd>
                  <ul className="dispositif__puces">
                    {etape.nous.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </dd>
                <dt>Vous</dt>
                <dd className="dispositif__vous">{etape.vous}</dd>
              </dl>
            </li>
          ))}
        </ol>

        <div className="dispositif__notes">
          <div className="dispositif__note">
            <p className="dispositif__note-titre">Quand nous contacter ?</p>
            <p>
              Idéalement deux à trois mois avant la date pour un séminaire ou une
              soirée, davantage pour une convention. Votre événement
              est plus proche ? Écrivez-nous : le calendrier se resserre, la
              méthode reste la même.
            </p>
          </div>
          <div className="dispositif__note">
            <p className="dispositif__note-titre">Votre projet est déjà engagé ?</p>
            <p>
              Nous le reprenons à l’étape où il en est, avec le lieu et les
              prestataires que vous avez déjà retenus.
            </p>
          </div>
        </div>

        <p className="entreprise-action">
          <Lien className="btn btn--solid" href={CONTACT_ENTREPRISE}>
            Recevoir un devis détaillé
          </Lien>
        </p>
      </div>
    </section>
  )
}

/* ---- S5 · Ce que vous obtenez ----
   Six bénéfices, une phrase chacun. Chaque phrase est accrochée sous sa
   lampe, comme les valeurs de L'agence : un pont (le filet du haut), une
   lampe en son milieu, un cône lavande qui tombe sur la phrase et
   s'allume au survol. */

const BENEFICES = [
  'Un seul contact pour tout l’événement',
  'Un budget que vous pouvez défendre en interne',
  'Un lieu choisi pour votre événement',
  'Le son et la lumière ne dépendent pas d’un tiers',
  'Aucune mauvaise surprise',
  'Une équipe dimensionnée pour votre événement',
]

function Benefices() {
  return (
    <section
      className="section section--entreprise section--entreprise-benefices"
      aria-labelledby="benefices-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Ce que l’on vous garantit"
          titre="Ce que vous obtenez en nous confiant votre événement"
          id="benefices-title"
          centree
        />

        <ul className="benefices">
          {BENEFICES.map((benefice) => (
            <li className="benefice" key={benefice}>
              <h3 className="benefice__titre">{benefice}</h3>
            </li>
          ))}
        </ul>

        <p className="benefices__assurance">
          Oysen est assurée en responsabilité civile professionnelle ({RC_PRO}) ;
          l’attestation vous est transmise sur demande.
        </p>
      </div>
    </section>
  )
}

/* ---- S6 · Ce que vous pouvez vérifier ----
   Aucun cas, logo ni témoignage d'entreprise n'existe encore : la
   version de lancement liste ce qui se vérifie avant de signer, sans
   rien inventer. Les cas (format STAR) attendent dans CAS, vide ; la
   section les affiche dès qu'il y en a un. Pas de bandeau de logos :
   les partenaires n'y entreront qu'avec leur accord écrit, sous « Ils
   travaillent avec nous », jamais « Ils nous font confiance ». */

const VERIFICATIONS: {
  titre: string
  texte: string
  lien?: { href: string; libelle: string }
}[] = [
  {
    titre: 'La méthode, sur pièces',
    texte: 'Dès le premier échange, les documents de préparation d’un événement déjà réalisé : rétroplanning, déroulé minute par minute, plan d’implantation.',
  },
  {
    titre: 'Le matériel',
    texte: 'Notre sonorisation et notre éclairage nous appartiennent. Vous pouvez les voir avant de vous engager.',
  },
  {
    titre: 'La personne qui pilote',
    texte: 'Mathis Amato, fondateur d’Oysen, ingénieur de formation. Votre interlocuteur du premier échange au démontage.',
    lien: { href: '/qui-sommes-nous/le-fondateur', libelle: 'Le parcours du fondateur' },
  },
  {
    titre: 'Les garanties',
    texte: `Assurance responsabilité civile professionnelle (${RC_PRO}), attestation transmise sur demande.`,
  },
]

/*
 * Les cas, deux au plus, à remplir dès qu'une preuve est disponible.
 * Si l'événement précède Oysen, `avantOysen: true` ajoute la mention
 * obligatoire. Premier choix : un événement professionnel d'une
 * précédente expérience ; à défaut, un mariage Oysen à forte contrainte
 * technique, présenté comme une preuve de coordination.
 */
const CAS: {
  titre: string
  situation: string
  tache: string
  action: string
  resultat: string
  avantOysen?: boolean
}[] = []

function Preuves() {
  return (
    <section
      className="section section--entreprise section--entreprise-preuves"
      aria-labelledby="preuves-title"
    >
      <div className="section__inner">
        <div className="verifier">
          <Tete
            surtitre="Avant de signer"
            titre="Ce que vous pouvez vérifier avant de nous confier votre événement"
            id="preuves-title"
          />

          <ul className="verifier__liste">
            {VERIFICATIONS.map((item) => (
              <li className="verifier__item" key={item.titre}>
                <h3 className="verifier__titre">{item.titre}</h3>
                <p className="verifier__texte">{item.texte}</p>
                {item.lien ? (
                  <Lien className="lien-clair" href={item.lien.href}>
                    {item.lien.libelle}
                    <Arrow className="lien-clair__fleche" />
                  </Lien>
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        {CAS.length > 0 ? (
          <ul className="cas-e">
            {CAS.map((cas) => (
              <li className="cas-e__item" key={cas.titre}>
                <h3 className="cas-e__titre">{cas.titre}</h3>
                <dl className="cas-e__star">
                  <dt>Situation</dt>
                  <dd>{cas.situation}</dd>
                  <dt>Ce qui nous a été confié</dt>
                  <dd>{cas.tache}</dd>
                  <dt>Ce que nous avons mis en place</dt>
                  <dd>{cas.action}</dd>
                  <dt>Le jour J</dt>
                  <dd>{cas.resultat}</dd>
                </dl>
                {cas.avantOysen ? (
                  <p className="cas-e__mention">
                    Réalisé par notre fondateur avant la création d’Oysen.
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}

/* ---- S8 · Les questions ----
   Cinq objections, en dépliants comme la FAQ de l'accueil. En réserve,
   si la page passe à sept : « Nous avons déjà réservé un lieu ou un
   traiteur : pouvez-vous reprendre le projet ? » et « Combien de temps à
   l'avance faut-il vous contacter ? », déjà traitées sous les étapes. */

const QUESTIONS = [
  {
    q: 'Oysen est une entreprise récente : pourquoi lui confier notre événement ?',
    a: 'Parce que la fiabilité d’un événement tient à sa préparation, et que la nôtre se vérifie avant de signer : repérage du lieu, rétroplanning, déroulé minute par minute, essais avant l’arrivée des participants. Chaque événement est piloté par notre fondateur, ingénieur de formation. Et nous refusons les projets que nous ne pourrions pas tenir correctement.',
  },
  {
    q: 'Jusqu’à quelle taille d’événement Oysen intervient-elle ?',
    a: 'Notre propre sonorisation couvre jusqu’à 1 500 personnes en extérieur. Au-delà, ou pour un grand écran ou une scène, nous mobilisons des techniciens et des partenaires de notre réseau, sous une coordination unique. Si un projet dépasse ce que nous pouvons tenir, nous vous le disons et vous orientons vers un partenaire.',
  },
  {
    q: 'Vos tarifs sont-ils plus élevés que ceux d’un autre prestataire ?',
    a: 'Nous ne serons pas l’offre la moins chère, et ne cherchons pas à l’être. Notre proposition détaille chaque poste : comparez-la ligne par ligne et voyez ce qui est compris, le repérage, les essais, le matériel de secours, la présence le jour J. C’est sur ces postes, rarement visibles, que se joue la fiabilité d’un événement.',
  },
  {
    q: 'Qui sera notre interlocuteur, et qui sera présent le jour J ?',
    a: 'Le même, du premier échange au démontage : il conçoit l’événement, coordonne les prestataires et se trouve sur place le jour J. Selon l’effectif, des techniciens de notre réseau l’épaulent pour le son, la lumière et la vidéo. Vos prestataires et vos intervenants ont un seul contact, et ce n’est pas vous.',
  },
  {
    q: 'Que se passe-t-il si quelque chose ne fonctionne pas le jour J ?',
    a: 'Nous le préparons avant qu’il n’arrive. Le lieu est repéré en amont, le son, la lumière et la vidéo sont testés avant le premier participant, et du matériel de secours est prévu pour l’essentiel, à commencer par les micros. En cas de retard ou d’imprévu, les prestataires nous appellent, nous. Vous n’avez rien à gérer.',
  },
]

function Questions() {
  return (
    <section
      className="section section--entreprise section--entreprise-questions"
      aria-labelledby="questions-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Questions fréquentes"
          titre="Vos questions avant de nous confier un événement d’entreprise"
          id="questions-title"
          centree
        />

        <div className="faq">
          {QUESTIONS.map((item) => (
            <details className="faq__item" key={item.q}>
              <summary className="faq__q">
                <span className="faq__q-texte">{item.q}</span>
                <span className="faq__signe" aria-hidden="true" />
              </summary>
              <p className="faq__a">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---- L'appel final ----
   La rampe violette de l'accueil, par le bas, et le même libellé que
   tous les boutons de la page. */

function Appel() {
  return (
    <section
      className="section section--appel section--entreprise-appel"
      aria-labelledby="entreprise-appel-title"
    >
      <div className="section__inner">
        <h2 className="section__title appel__title" id="entreprise-appel-title">
          Votre prochain événement,
          <br />
          sans imprévu à gérer.
        </h2>
        <p className="appel__lede">
          Quelques lignes suffisent : le format, la date, le nombre de
          participants, ce qui est déjà décidé.
        </p>
        <div className="appel__actions">
          <Lien className="btn btn--solid" href={CONTACT_ENTREPRISE}>
            Présenter votre projet
          </Lien>
        </div>
        <ul className="appel__garanties">
          <li className="appel__garantie">
            <span className="appel__check" aria-hidden="true">
              ✓
            </span>
            Sans engagement
          </li>
          <li className="appel__garantie">
            <span className="appel__check" aria-hidden="true">
              ✓
            </span>
            Réponse sous {DELAI_REPONSE_H}h
          </li>
          <li className="appel__garantie">
            <span className="appel__check" aria-hidden="true">
              ✓
            </span>
            Si votre projet n’est pas pour nous, on vous le dit
          </li>
        </ul>
      </div>
    </section>
  )
}

/* ---- Données structurées : le service, la FAQ, le fil d'Ariane ---- */

const ADRESSE = '/nos-services/evenements-entreprise'

const DONNEES_STRUCTUREES = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Organisation d’événements d’entreprise',
      serviceType: 'Organisation de séminaires, soirées d’entreprise, conventions et inaugurations',
      description: DESCRIPTION,
      provider: { '@type': 'Organization', name: 'Oysen' },
      areaServed: ['Toulouse', 'Haute-Garonne', 'Occitanie'],
      url: ADRESSE,
    },
    {
      '@type': 'FAQPage',
      mainEntity: QUESTIONS.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: '/' },
        { '@type': 'ListItem', position: 2, name: 'Nos services', item: '/nos-services' },
        { '@type': 'ListItem', position: 3, name: 'Événements d’entreprise', item: ADRESSE },
      ],
    },
  ],
}
