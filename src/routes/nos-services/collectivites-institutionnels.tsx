import type { CSSProperties, ReactNode } from 'react'
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
import collectiviteCss from '/src/styles/collectivite.css?url'

/* Le formulaire de contact, ouvert sur les questions « Collectivité et
   institution » (bloc C, voir Formulaire.tsx). */
const CONTACT_COLLECTIVITE = '/contact?profil=collectivite&besoin=organisation'

const PRESTATION_TECHNIQUE = '/nos-services/prestation-technique'

const TITRE = 'Événements des collectivités à Toulouse et en Occitanie | Oysen'
const DESCRIPTION =
  'Fête de ville, inauguration, cérémonie, commémoration : Oysen prépare, équipe et coordonne les événements publics des collectivités à Toulouse et en Occitanie, avec son propre matériel.'

export const Route = createFileRoute('/nos-services/collectivites-institutionnels')({
  head: () => ({
    meta: [
      { title: TITRE },
      { name: 'description', content: DESCRIPTION },
    ],
    links: [
      canonical('/nos-services/collectivites-institutionnels'),
      { rel: 'stylesheet', href: collectiviteCss },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(DONNEES_STRUCTUREES),
      },
    ],
  }),
  component: Collectivites,
})

/**
 * La page « Collectivités et institutions ».
 *
 * Elle parle à un chargé de mission, à une direction générale des
 * services, à un élu. Leur question : l'événement sera-t-il sûr, conforme,
 * et tiendra-t-il son horaire ?
 *
 * Dans la salle sombre du site, sur le modèle d'Événements d'entreprise :
 * la photo en fond du hero, les faisceaux de l'accueil, et en bas le
 * déroulé d'une matinée de cérémonie, de l'arrivée de l'équipe au début à
 * l'heure. (Version précédente : archives/collectivite-v1.)
 */
function Collectivites() {
  return (
    <main className="page-collectivite">
      <Hero />
      <Evenements />
      <Dossiers />
      <Securite />
      <Methode />
      <Questions />
      <Appel />
    </main>
  )
}

/* La tête d'une section : son titre et, au besoin, une phrase. */
function Tete({
  titre,
  id,
  texte,
  centree = false,
}: {
  titre: ReactNode
  id: string
  texte?: ReactNode
  centree?: boolean
}) {
  return (
    <div className={`coll-tete${centree ? ' coll-tete--centree' : ''}`}>
      <h2 className="section__title" id={id}>
        {titre}
      </h2>
      {texte ? <p className="coll-tete__texte">{texte}</p> : null}
    </div>
  )
}

/* ---- S1 · Le hero ----
   La photo en fond, au réglage de l'accueil et de L'agence ; les trois
   faisceaux de l'accueil ; le texte centré ; en bas, la frise du jour J.
   Pas de bandeau de preuves : tout ce qu'il dirait est déjà dans la page. */

/* Un déroulé type, pas un événement réel : les heures sont un exemple.
   `essai` : le repère se coche, c'est un test fait avant l'arrivée du
   public. */
const JOUR_J: { heure: string; action: string; essai?: boolean }[] = [
  { heure: '08:00', action: 'Arrivée de l’équipe' },
  { heure: '08:30', action: 'Son et lumière installés et testés', essai: true },
  { heure: '09:30', action: 'Essai des micros avec les élus', essai: true },
  { heure: '10:30', action: 'Accueil du public' },
  { heure: '11:00', action: 'La cérémonie commence, à l’heure' },
]

function Hero() {
  return (
    <section className="coll-hero" aria-labelledby="collectivite-title">
      {/*
        À REMPLACER par une vraie photo d'une installation Oysen en
        extérieur, sur une place ou un parvis : pupitre et sonorisation
        prêts avant l'arrivée du public. Aucun élu reconnaissable sans son
        accord écrit.
      */}
      <img
        className="coll-hero__fond"
        src="/images/services/collectivites-institutions-1200.jpg"
        srcSet="/images/services/collectivites-institutions-800.jpg 800w, /images/services/collectivites-institutions-1200.jpg 1200w"
        sizes="100vw"
        width={1200}
        height={1500}
        alt=""
        decoding="async"
      />

      {/* Le voile de la salle, et les trois faisceaux. Décor. */}
      <div className="coll-hero__salle" aria-hidden="true">
        <span className="coll-hero__faisceaux">
          <i />
          <i />
          <i />
        </span>
      </div>

      <div className="coll-hero__inner">
        <div className="coll-hero__texte">
          {/* Le h1 est le surtitre, porteur de la requête (organisation
              événementielle, collectivités, Toulouse, Occitanie) ; la
              grande phrase en dessous reste l'accroche, en simple
              paragraphe, comme sur Événements d'entreprise. */}
          <h1 className="section__eyebrow" id="collectivite-title">
            Organisation événementielle pour collectivités · Toulouse,
            Haute-Garonne, Occitanie
          </h1>
          <p className="coll-hero__titre">
            Votre événement, conforme à vos attentes et à vos exigences.
          </p>
          <p className="coll-hero__lede">
            <span className="coll-hero__promesse">
              Sécurité, technique, conformité légale : tout est pensé en amont
              pour un événement sans accroc.
            </span>{' '}
            Fête, cérémonie, inauguration : un seul prestataire prépare, équipe
            et coordonne votre événement, avec son propre matériel.
          </p>

          <div className="coll-hero__appel">
            <Lien className="btn btn--solid" href={CONTACT_COLLECTIVITE}>
              Recevoir un devis détaillé
            </Lien>
            <p className="coll-hero__rassurance">
              Sans engagement · Réponse sous {DELAI_REPONSE_H}&nbsp;h
            </p>
          </div>
        </div>
      </div>

      {/* La frise du jour J : la matinée d'une cérémonie, jusqu'à son
          début, à l'heure. */}
      <figure className="coll-jour">
        <figcaption className="coll-jour__tete">Jour J</figcaption>
        <ol className="coll-jour__fil">
          {JOUR_J.map((repere, rang) => (
            <li
              className={`coll-jour__repere${repere.essai ? ' coll-jour__repere--essai' : ''}`}
              key={repere.heure}
              style={{ '--rang': rang } as CSSProperties}
            >
              <span className="coll-jour__heure">{repere.heure}</span>
              <span className="coll-jour__action">{repere.action}</span>
            </li>
          ))}
        </ol>
      </figure>
    </section>
  )
}

/* ---- S2 · Les événements organisés ----
   Six cartes en design cards 01 (.dc01, app.css), chacune sous son
   projecteur, comme les formats d'Événements d'entreprise. Puis la sortie
   vers la technique seule. */

const EVENEMENTS = [
  {
    nom: 'Fête de ville',
    texte: 'Scène, son, lumière, et la coordination des associations et des exposants.',
  },
  {
    nom: 'Inauguration',
    texte: 'Micros et son des discours, même sur un site pas encore équipé.',
  },
  {
    nom: 'Cérémonie et vœux',
    texte: 'Salle, son, projection, et un déroulé calé avec votre cabinet.',
  },
  {
    nom: 'Commémoration',
    texte: 'Un son discret devant le monument, chaque musique lancée au bon moment.',
  },
  {
    nom: 'Marché de Noël',
    texte: 'Lumière, musique d’ambiance et électricité pour les chalets.',
  },
  {
    nom: 'Événement sportif',
    texte: 'Annonces sur tout le site, podium et remise des prix.',
  },
]

function Evenements() {
  return (
    <section
      className="section section--collectivite section--collectivite-evenements"
      aria-labelledby="evenements-title"
    >
      <div className="section__inner">
        <Tete
          titre="Les événements que nous organisons pour les collectivités"
          id="evenements-title"
          centree
        />

        <ul className="coll-types">
          {EVENEMENTS.map((item) => (
            <li className="coll-type dc01" key={item.nom}>
              <span className="dc01__repere" aria-hidden="true" />
              <span className="dc01__survol" aria-hidden="true" />
              <span className="dc01__zone" aria-hidden="true" />
              <h3 className="coll-type__nom">{item.nom}</h3>
              <p className="coll-type__texte">{item.texte}</p>
            </li>
          ))}
        </ul>

        <p className="coll-sortie">
          Vos services organisent déjà l’événement ? Nous pouvons fournir la
          technique seule.{' '}
          <Lien className="coll-lien" href={PRESTATION_TECHNIQUE}>
            Prestation technique
            <Arrow className="coll-lien__fleche" />
          </Lien>
        </p>
      </div>
    </section>
  )
}

/* ---- S3 · Les dossiers ----
   La section mise en avant : sur le dégradé de la bande « En bref » de
   L'agence, quatre grandes cartes en design cards 01, deux par rangée,
   leurs projecteurs tournés vers le centre. Chaque dossier porte son
   numéro, comme une pièce versée au dossier. */

const DOSSIERS = [
  {
    nom: 'Le plan d’implantation',
    texte: 'Scène, stands, accès des secours, horaires de montage. Vos services s’en servent pour leurs arrêtés.',
  },
  {
    nom: 'Le dossier de sécurité',
    texte: 'Quand l’événement l’exige. Nous le montons avec vous.',
  },
  {
    nom: 'Les documents des structures',
    texte: 'Pour une scène ou un chapiteau, les justificatifs de conformité et de bon montage.',
  },
  {
    nom: 'Les pièces du marché public',
    texte: `Attestation d’assurance de ${RC_PRO}, attestations fiscale et sociale, mémoire technique.`,
  },
]

function Dossiers() {
  return (
    <section
      className="section section--collectivite section--collectivite-dossiers"
      aria-labelledby="dossiers-title"
    >
      <div className="section__inner">
        <Tete
          titre={
            <>
              Une communication claire avec vos services,
              <br />
              des documents sur mesure.
            </>
          }
          id="dossiers-title"
          texte={
            <>
              Un événement public repose aussi sur des dossiers clairs et
              complets, pour que tout le monde soit protégé.
              <br />
              Nous préparons pour vous :
            </>
          }
          centree
        />

        <ul className="coll-dossiers">
          {DOSSIERS.map((dossier, index) => (
            <li className="coll-dossier dc01" key={dossier.nom}>
              <span className="dc01__repere" aria-hidden="true" />
              <span className="dc01__survol" aria-hidden="true" />
              <span className="dc01__zone" aria-hidden="true" />
              <p className="coll-dossier__numero" aria-hidden="true">
                Dossier {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="coll-dossier__nom">{dossier.nom}</h3>
              <p className="coll-dossier__texte">{dossier.texte}</p>
            </li>
          ))}
        </ul>

        <p className="coll-action">
          <Lien className="btn btn--solid" href={CONTACT_COLLECTIVITE}>
            Recevoir un devis détaillé
          </Lien>
        </p>
      </div>
    </section>
  )
}

/* ---- S4 · La sécurité et l'accessibilité ----
   À gauche la tête, à droite ce que nous faisons, point par point. Sous
   la liste, la personne qui dirige Oysen. */

const SECURITE = [
  'Le matériel est vérifié avant chaque départ, avec une liste de contrôle.',
  'Les équipements essentiels ont du matériel de secours.',
  'Un passage praticable en fauteuil mène à l’espace PMR, face à la scène ou au pupitre.',
  'Les câbles au sol sont couverts, pour que personne ne trébuche.',
]

function Securite() {
  return (
    <section
      className="section section--collectivite section--collectivite-securite"
      aria-labelledby="securite-title"
    >
      <div className="section__inner">
        <div className="securite">
          <Tete
            titre="Sécurité et accessibilité"
            id="securite-title"
            texte="Le maire est responsable de la sécurité d’un événement public. Voici ce que nous faisons de notre côté :"
          />

          <div className="securite__corps">
            <ul className="securite__liste">
              {SECURITE.map((point) => (
                <li className="securite__item" key={point}>
                  {point}
                </li>
              ))}
            </ul>

            <div className="securite__pilote">
              <p>
                Oysen est dirigée par Mathis Amato, ingénieur : chaque événement
                est pensé et préparé dans le détail.
              </p>
              <Lien className="coll-lien" href="/qui-sommes-nous/le-fondateur">
                Le parcours du fondateur
                <Arrow className="coll-lien__fleche" />
              </Lien>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---- S5 · La méthode en cinq étapes ----
   Cinq cartes en design cards 01, sous une rampe de cinq projecteurs,
   comme le dispositif d'Événements d'entreprise. */

const ETAPES = [
  {
    nom: 'Votre demande',
    texte: 'Nous partons de votre cahier des charges ou de votre consultation. Vous n’en avez pas ? Nous définissons le besoin avec vous.',
  },
  {
    nom: 'Un devis à présenter à vos élus',
    texte: 'Chaque poste est détaillé, pour que la dépense soit facile à justifier.',
  },
  {
    nom: 'Un calendrier calé sur vos délais',
    texte: 'Nous comptons à l’envers depuis la date de l’événement : chaque démarche a sa date. À Toulouse, un événement sur l’espace public se déclare au moins trois mois avant.',
  },
  {
    nom: 'Le jour J, avec vos services',
    texte: 'Services techniques, police municipale, prestataires : nous coordonnons tout le monde, du montage au démontage.',
  },
  {
    nom: 'Un bilan pour rendre compte',
    texte: 'Vous recevez un bilan écrit : déroulé, imprévus, dépenses. La facture passe par Chorus Pro.',
  },
]

function Methode() {
  return (
    <section
      className="section section--collectivite section--collectivite-methode"
      aria-labelledby="methode-coll-title"
    >
      <div className="section__inner">
        <Tete
          titre="Notre méthode pour les collectivités"
          id="methode-coll-title"
          centree
        />

        <ol className="coll-etapes">
          {ETAPES.map((etape, index) => (
            <li className="coll-etape dc01" key={etape.nom}>
              <span className="dc01__repere" aria-hidden="true" />
              <span className="dc01__survol" aria-hidden="true" />
              <span className="dc01__zone" aria-hidden="true" />
              <p className="coll-etape__numero" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="coll-etape__nom">{etape.nom}</h3>
              <p className="coll-etape__texte">{etape.texte}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---- S6 · Les questions ----
   Cinq questions, en dépliants comme la FAQ de l'accueil. */

const QUESTIONS = [
  {
    q: 'Avez-vous déjà travaillé pour des collectivités ?',
    a: 'Pas encore sous le nom Oysen. Avant Oysen, notre fondateur a déjà assuré la technique d’événements ouverts au public. Il connaît aussi les marchés publics de l’intérieur : il y a travaillé comme ingénieur, avant de créer Oysen.',
  },
  {
    q: 'Votre entreprise est-elle assez structurée pour notre événement ?',
    a: 'Oui. Selon la taille de l’événement, nous renforçons l’équipe avec des techniciens indépendants et des intermittents. Si un besoin dépasse nos moyens, nous faisons appel à nos partenaires de confiance.',
  },
  {
    q: 'Êtes-vous assurés pour un événement ouvert au public ?',
    a: `Oui. Oysen est assurée en responsabilité civile professionnelle à hauteur de ${RC_PRO}. L’attestation est jointe à notre proposition : vous pouvez la verser à votre dossier dès le départ.`,
  },
  {
    q: 'Comment le budget voté est-il respecté ?',
    a: 'Notre devis détaille chaque poste : vous savez dès le départ ce que vous payez. Si un changement s’impose en cours de préparation, il est chiffré et validé par vous avant d’être engagé. Le bilan final compare les dépenses au devis.',
  },
  {
    q: 'Comment être sûr du sérieux d’un prestataire ?',
    a: 'En regardant comment il prépare. Chez nous, tout est écrit avant le jour J : plan d’implantation, calendrier, déroulé. Notre matériel nous appartient et il est vérifié avant chaque départ. Et si un projet dépasse ce que nous pouvons tenir correctement, nous vous le disons.',
  },
]

function Questions() {
  return (
    <section
      className="section section--collectivite section--collectivite-questions"
      aria-labelledby="coll-questions-title"
    >
      <div className="section__inner">
        <Tete
          titre="Questions fréquentes des collectivités"
          id="coll-questions-title"
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

/* ---- S7 · L'appel final ----
   La rampe violette de l'accueil, par le bas, et le même bouton que le
   hero. */

function Appel() {
  return (
    <section
      className="section section--appel section--collectivite-appel"
      aria-labelledby="collectivite-appel-title"
    >
      <div className="section__inner">
        <h2 className="section__title appel__title" id="collectivite-appel-title">
          Préparons votre prochain événement
        </h2>
        <p className="appel__lede">
          Cinq informations suffisent : la date, le lieu, le type d’événement, le
          public attendu, vos besoins.
        </p>
        <div className="appel__actions">
          <Lien className="btn btn--solid" href={CONTACT_COLLECTIVITE}>
            Recevoir un devis détaillé
          </Lien>
        </div>
        <ul className="appel__garanties">
          <li className="appel__garantie">
            <span className="appel__check" aria-hidden="true">
              ✓
            </span>
            Sans engagement
          </li>
        </ul>
      </div>
    </section>
  )
}

/* ---- Données structurées : le service, la FAQ, le fil d'Ariane ---- */

const ADRESSE = '/nos-services/collectivites-institutionnels'

const DONNEES_STRUCTUREES = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Organisation d’événements pour les collectivités',
      serviceType: 'Organisation de fêtes de ville, inaugurations, cérémonies et commémorations',
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
        { '@type': 'ListItem', position: 3, name: 'Collectivités et institutions', item: ADRESSE },
      ],
    },
  ],
}
