import type { CSSProperties, ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { DELAI_REPONSE_H } from '../../components/home/content'
import { Arrow } from '../../components/home/icons'
import { Lien } from '../../components/Lien'
import { canonical } from '../../lib/canonical'

/*
 * Chemin depuis la racine du projet, et non relatif : sur une route imbriquée,
 * le découpage de TanStack Start réécrit le module et le chemin relatif n'est
 * plus résolvable côté serveur (« Denied ID »).
 */
import festivalCss from '/src/styles/festival.css?url'

/*
 * Les valeurs entre crochets sont des affirmations à faire valider par le
 * client (une jauge, un délai, un inventaire). Comme sur l'accueil, elles
 * restent visibles à l'écran tant qu'elles ne sont pas fournies : une
 * valeur plausible passerait inaperçue en relecture.
 *
 */

/* Le formulaire de contact, ouvert sur les questions « Festival et
   événement culturel » (bloc D, voir Formulaire.tsx). */
const CONTACT_FESTIVAL = '/contact?profil=culturel&besoin=organisation'

const TITRE = 'Régie et technique de festival à Toulouse et en Occitanie | Oysen'
const DESCRIPTION =
  'Festival, concert, spectacle, saison culturelle : Oysen prépare le plateau, répond aux fiches techniques et exploite le son et la lumière, à Toulouse et en Occitanie.'

export const Route = createFileRoute('/nos-services/festivals-evenements-culturels')({
  head: () => ({
    meta: [
      { title: TITRE },
      { name: 'description', content: DESCRIPTION },
    ],
    links: [
      canonical('/nos-services/festivals-evenements-culturels'),
      { rel: 'stylesheet', href: festivalCss },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(DONNEES_STRUCTUREES),
      },
    ],
  }),
  component: Festival,
})

/**
 * La page « Festivals et événements culturels ».
 *
 * Un texte court et direct, centré sur la prestation technique : un
 * matériel choisi pour le lieu, ce qui évite la panne, trois étapes, les
 * questions, le devis.
 *
 * Dans la salle sombre du site, avec le hero de « Événements d'entreprise » :
 * deux rampes face à face dont les faisceaux se croisent sur le texte, et
 * en bas la frise du jour J, des balances au premier groupe sur scène. Le
 * reste reprend la même lumière : trois projecteurs (le lieu, le public,
 * le spectacle) qui convergent sur le matériel, les précautions contre la
 * panne chacune sous sa lampe, les étapes en cartes éclairées, et le noir
 * complet pour le risque.
 */
function Festival() {
  return (
    <main className="page-festival">
      <Hero />
      <Choix />
      <Panne />
      <Etapes />
      <Questions />
      <Appel />
    </main>
  )
}

/* La tête d'une section : un surtitre au besoin, le titre et, au besoin,
   une phrase. */
function Tete({
  surtitre,
  titre,
  id,
  texte,
  centree = false,
}: {
  surtitre?: string
  titre: string
  id: string
  texte?: string
  centree?: boolean
}) {
  return (
    <div className={`fest-tete${centree ? ' fest-tete--centree' : ''}`}>
      {surtitre ? <p className="section__eyebrow">{surtitre}</p> : null}
      <h2 className="section__title" id={id}>
        {titre}
      </h2>
      {texte ? <p className="fest-tete__texte">{texte}</p> : null}
    </div>
  )
}

/* ---- S1 · Le hero ----
   Sur le format du hero « Événements d'entreprise » : le plateau en fond,
   éteint et teinté ; le texte centré ; en bas, sur toute la largeur, la
   frise du jour J, que la lumière parcourt ; puis les preuves.
   Ici, deux rampes se font face, en haut à gauche et en haut à droite :
   leurs faisceaux se croisent sur le texte, comme un éclairage de scène.
   (Version précédente : archives/festival-hero-v1.) */

const PREUVES = [
  'Toulouse, Haute-Garonne et Occitanie',
  'Un seul interlocuteur, du repérage au démontage',
  'Sonorisation et éclairage avec notre propre matériel',
  'Balances terminées avant l’ouverture des portes',
  'Matériel de secours sur les équipements critiques',
]

/* Une soirée type, pas un événement réel : les heures sont un exemple.
   `essai` : le repère se coche, c'est fait avant l'ouverture des portes. */
const JOUR_J: { heure: string; action: string; essai?: boolean }[] = [
  { heure: '14:00', action: 'Plateau monté, système calé', essai: true },
  { heure: '16:00', action: 'Balances des artistes', essai: true },
  { heure: '18:00', action: 'Niveaux réglés, secours en place', essai: true },
  { heure: '18:30', action: 'Ouverture des portes' },
  { heure: '19:00', action: 'Premier groupe sur scène, à l’heure' },
]

function Hero() {
  return (
    <section className="festival-hero" aria-labelledby="festival-title">
      {/*
        À REMPLACER par une vraie photo d'un plateau Oysen avant
        l'ouverture des portes : scène éclairée, régie en place, public
        absent. À défaut, une régie en exploitation pendant un concert.
        Aucun artiste reconnaissable sans son accord écrit.
      */}
      <img
        className="festival-hero__fond"
        src="/images/services/festivals-evenements-culturels-1200.jpg"
        srcSet="/images/services/festivals-evenements-culturels-800.jpg 800w, /images/services/festivals-evenements-culturels-1200.jpg 1200w"
        sizes="100vw"
        width={1200}
        height={1500}
        alt=""
        decoding="async"
      />

      {/* Le voile de la salle, et les deux rampes face à face. Décor. */}
      <div className="festival-hero__salle" aria-hidden="true">
        <span className="festival-hero__faisceaux">
          <i />
          <i />
          <i />
          <i />
        </span>
      </div>

      <div className="festival-hero__inner">
        <div className="festival-hero__texte">
          {/* Le h1 est le surtitre, porteur de la requête (organisation de
              festivals, Toulouse, Occitanie) ; la grande phrase en dessous
              reste l'accroche, en simple paragraphe. */}
          <h1 className="section__eyebrow" id="festival-title">
            Organisation de festivals et d’événements culturels · Toulouse,
            Haute-Garonne, Occitanie
          </h1>
          <p className="festival-hero__titre">
            Toute l’organisation de votre festival, avec un seul interlocuteur.
          </p>
          <p className="festival-hero__lede">
            Son, lumière, vidéo, scène, électricité : installés, réglés et
            exploités par la même équipe, du montage au démontage.
          </p>

          <div className="festival-hero__actions">
            <div className="festival-hero__appel">
              <Lien className="btn btn--solid" href={CONTACT_FESTIVAL}>
                Recevoir un devis détaillé
              </Lien>
              <p className="festival-hero__rassurance">
                Fiche technique ou cahier des charges à joindre, si vous en avez
                un · sans engagement · réponse sous {DELAI_REPONSE_H}&nbsp;h
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Le jour J : ce qui est fait avant que le premier groupe monte sur
          scène. */}
      <figure className="fest-jour-j">
        <figcaption className="fest-jour-j__tete">Jour J</figcaption>
        <ol className="fest-jour-j__fil">
          {JOUR_J.map((repere, rang) => (
            <li
              className={`fest-jour-j__repere${repere.essai ? ' fest-jour-j__repere--essai' : ''}`}
              key={repere.heure}
              style={{ '--rang': rang } as CSSProperties}
            >
              <span className="fest-jour-j__heure">{repere.heure}</span>
              <span className="fest-jour-j__action">{repere.action}</span>
              {repere.essai ? <span className="fest-jour-j__statut">Fait</span> : null}
            </li>
          ))}
        </ol>
      </figure>

      <ul className="fest-preuves">
        {PREUVES.map((preuve) => (
          <li key={preuve}>{preuve}</li>
        ))}
      </ul>
    </section>
  )
}

/* ---- S2 · Un matériel choisi pour votre lieu ----
   Trois choses décident du matériel : le lieu, le public, le spectacle.
   Ce sont trois projecteurs, nommés, dont les faisceaux convergent sur
   la rangée des cinq familles de matériel : la rangée s'éclaire par le
   haut. Sous elle, un bandeau sur toute la largeur : les logos du
   matériel, et sous chacun le nom du matériel. */

const CRITERES = ['Le lieu', 'Le public', 'Le spectacle']

/* Les détails ajoutés aux familles reprennent ce que le client citait
   dans les versions précédentes (moyens techniques) : à valider. */
const FAMILLES: { nom: string; details: string[] }[] = [
  {
    nom: 'Sonorisation',
    details: ['Enceintes', 'Consoles', 'Micros', 'Retours de scène'],
  },
  {
    nom: 'Éclairage',
    details: ['Projecteurs de scène', 'Mise en lumière du site', 'Console lumière'],
  },
  {
    nom: 'Vidéo',
    details: ['Écrans et murs LED', 'Projection', 'Captation'],
  },
  {
    nom: 'Scène et structures',
    details: ['Scène', 'Praticables', 'Ponts et pieds de levage'],
  },
  {
    nom: 'Distribution électrique',
    details: ['Groupe électrogène', 'Armoires et câblage', 'Raccordement par un électricien'],
  },
]

/* Les emplacements du bandeau : à remplacer par le logo de la marque
   (une image, à la place du texte entre crochets) et le nom du modèle. */
const MATERIEL = Array.from({ length: 6 }, () => ({
  logo: '[Logo]',
  nom: '[Nom du matériel]',
}))

function Choix() {
  return (
    <section
      className="section section--festival section--festival-choix"
      aria-labelledby="choix-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Le matériel"
          titre="Sonorisation, éclairage, scène : sélectionner le matériel adéquat pour votre événement"
          id="choix-title"
          texte="Nous choisissons le matériel après avoir vu le lieu. Trois critères : le lieu, le public et le spectacle."
          centree
        />

        <div className="choix">
          {/* Les trois critères, chacun sa lampe. */}
          <ul className="choix__criteres" aria-label="Ce qui décide du matériel">
            {CRITERES.map((critere) => (
              <li key={critere}>{critere}</li>
            ))}
          </ul>

          {/* Les trois faisceaux, qui convergent sur la rangée. Décor. */}
          <svg
            className="choix__faisceaux"
            viewBox="0 0 1000 200"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <linearGradient id="choix-cone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="currentColor" stopOpacity="0.32" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0.04" />
              </linearGradient>
            </defs>
            <polygon points="160,0 174,0 760,200 140,200" fill="url(#choix-cone)" />
            <polygon points="493,0 507,0 900,200 100,200" fill="url(#choix-cone)" />
            <polygon points="826,0 840,0 860,200 240,200" fill="url(#choix-cone)" />
          </svg>

          <ul className="familles">
            {FAMILLES.map((famille) => (
              <li className="famille dc01" key={famille.nom}>
                <span className="dc01__repere" aria-hidden="true" />
                <span className="dc01__survol" aria-hidden="true" />
                <span className="dc01__zone" aria-hidden="true" />
                <h3 className="famille__nom">{famille.nom}</h3>
                <ul className="famille__details">
                  {famille.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Le bandeau du matériel, sur toute la largeur : un logo, et sous
          lui le nom du matériel. En attente des vrais logos et modèles. */}
      <ul className="materiel" aria-label="Notre matériel">
        {MATERIEL.map((item, rang) => (
          <li className="materiel__item" key={rang}>
            <span className="materiel__logo">{item.logo}</span>
            <span className="materiel__nom">{item.nom}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ---- S3 · La panne ----
   Le noir complet, celui des problèmes sur le reste du site. Les quatre
   précautions, chacune sous sa lampe, accrochées au même pont : le
   traitement des bénéfices de « Événements d'entreprise ». Dessous,
   notre approche et le parcours de celui qui la porte. */

/* Chaque précaution, avec son mot clé (`mot`) mis en avant, au violet
   de la charte. */
const CONTROLES: { avant: string; mot: string; apres: string }[] = [
  { avant: 'Checklist de ', mot: 'vérification', apres: ' du matériel avant le départ.' },
  { avant: '', mot: 'Essais', apres: ' techniques avant l’arrivée du public.' },
  { avant: 'Matériel de ', mot: 'secours', apres: ' pour les équipements critiques.' },
  { avant: 'Nous restons ', mot: 'présents', apres: ' du début à la fin !' },
]

function Panne() {
  return (
    <section
      className="section section--festival section--festival-panne"
      aria-labelledby="panne-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="L’anticipation"
          titre="Anticiper pour éviter qu’une panne gâche votre événement"
          id="panne-title"
          texte="Nos points de contrôle :"
          centree
        />

        <ul className="vigies">
          {CONTROLES.map((controle) => (
            <li className="vigie" key={controle.mot}>
              <p className="vigie__texte">
                {controle.avant}
                <span className="vigie__mot">{controle.mot}</span>
                {controle.apres}
              </p>
            </li>
          ))}
        </ul>

        <div className="approche">
          <p>
            Notre approche s’inspire de l’ingénierie : chaque événement est pensé,
            préparé et coordonné dans le détail. Oysen est dirigée par Mathis
            Amato, ingénieur.
          </p>
          <Lien className="fest-lien" href="/qui-sommes-nous/le-fondateur">
            Le parcours du fondateur
            <Arrow className="fest-lien__fleche" />
          </Lien>
        </div>
      </div>
    </section>
  )
}

/* ---- S4 · Cinq étapes ----
   Une vraie séquence : cinq cartes numérotées, éclairées chacune sous son
   projecteur, comme le dispositif de « Événements d'entreprise ». Au
   survol, une barre de lumière court de carte en carte, dans l'ordre. La
   carte du jour J, celle pour laquelle tout le reste existe, est allumée
   en permanence. */

const ETAPES_P: { nom: string; texte: string; jourJ?: boolean }[] = [
  {
    nom: 'Étude technique',
    texte: 'Nous étudions vos contraintes : horaires, accès, voisinage, nombre de scènes, artistes.',
  },
  {
    nom: 'Solutions et devis',
    texte: 'Nous définissons l’équipe et les solutions techniques. Vous recevez un devis.',
  },
  {
    nom: 'Planification',
    texte: 'Devis validé, nous planifions la prestation et préparons la logistique.',
  },
  {
    nom: 'Jour J',
    texte: 'Nous coordonnons les intervenants. Les configurations techniques sont sauvegardées quand c’est possible.',
    jourJ: true,
  },
  {
    nom: 'Après l’événement',
    texte: 'Nous vérifions et entretenons le matériel. Nous faisons un retour d’expérience avec vous.',
  },
]

function Etapes() {
  return (
    <section
      className="section section--festival section--festival-etapes"
      aria-labelledby="etapes-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="La méthode"
          titre="5 étapes pour un événement réussi"
          id="etapes-title"
          centree
        />

        <ol className="etapes-p">
          {ETAPES_P.map((etape, index) => (
            <li
              className={`etape-p dc01${etape.jourJ ? ' etape-p--jour-j' : ''}`}
              key={etape.nom}
            >
              <span className="dc01__repere" aria-hidden="true" />
              <span className="dc01__survol" aria-hidden="true" />
              <span className="dc01__zone" aria-hidden="true" />
              <span className="etape-p__numero" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="etape-p__nom">{etape.nom}</h3>
              <p className="etape-p__texte">{etape.texte}</p>
            </li>
          ))}
        </ol>

        <p className="etapes-p__conclusion">
          Une méthode éprouvée, pour des événements sans accroc !
        </p>
      </div>
    </section>
  )
}

/* ---- S5 · Vos questions ----
   Six questions, en dépliants comme la FAQ de l'accueil. */

const QUESTIONS = [
  {
    q: 'Avez-vous assez de matériel pour notre événement ?',
    a: 'Le matériel est choisi selon le lieu, le public et le spectacle. S’il en faut plus, nous louons le complément. Pour un besoin particulier, nous faisons appel à un partenaire spécialisé.',
  },
  {
    q: 'Avez-vous de l’expérience dans l’organisation de festivals ?',
    a: 'Oui. Avant Oysen, notre fondateur a assuré des prestations techniques sur des événements avec public : installation, exploitation et démontage.',
  },
  {
    q: 'Combien coûtent vos prestations techniques pour l’organisation d’un festival ?',
    a: 'Chaque prestation est chiffrée sur devis, selon votre événement.',
  },
  {
    q: 'Pouvez-vous gérer une partie seulement de la technique ?',
    a: 'Oui, une partie ou l’ensemble. On définit ça ensemble lors du premier brief.',
  },
  {
    q: 'Pouvez-vous intervenir sur plusieurs jours ?',
    a: 'Oui. Nous assurons le montage, l’exploitation et le démontage.',
  },
  {
    q: 'Quand faut-il vous contacter ?',
    a: 'Le plus tôt possible. Un festival se prépare plusieurs mois à l’avance.',
  },
]

function Questions() {
  return (
    <section
      className="section section--festival section--festival-questions"
      aria-labelledby="fest-questions-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Questions fréquentes"
          titre="Organisation de festivals et d’événements culturels : vos questions"
          id="fest-questions-title"
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

/* ---- S6 · Le devis ----
   La rampe violette de l'accueil, par le bas. Les six informations
   posées en étiquettes, puis le bouton. */

const INFORMATIONS = [
  'La date',
  'Le lieu',
  'Le type d’événement',
  'La jauge',
  'Vos besoins techniques',
  'La durée',
]

function Appel() {
  return (
    <section
      className="section section--appel section--festival-appel"
      aria-labelledby="festival-appel-title"
    >
      <div className="section__inner">
        <h2 className="section__title appel__title" id="festival-appel-title">
          Commençons à planifier votre événement
        </h2>
        <p className="appel__lede">Six informations suffisent :</p>
        <ul className="informations">
          {INFORMATIONS.map((information) => (
            <li key={information}>{information}</li>
          ))}
        </ul>
        <div className="appel__actions">
          <Lien className="btn btn--solid" href={CONTACT_FESTIVAL}>
            Recevoir un devis détaillé
          </Lien>
        </div>
        <p className="appel__sous-bouton">Sans engagement</p>
      </div>
    </section>
  )
}

/* ---- Données structurées : le service, la FAQ, le fil d'Ariane ---- */

const ADRESSE = '/nos-services/festivals-evenements-culturels'

const DONNEES_STRUCTUREES = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Régie et technique de festivals et d’événements culturels',
      serviceType: 'Régie générale, sonorisation et éclairage de festivals, concerts et spectacles',
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
        { '@type': 'ListItem', position: 3, name: 'Festivals et événements culturels', item: ADRESSE },
      ],
    },
  ],
}
