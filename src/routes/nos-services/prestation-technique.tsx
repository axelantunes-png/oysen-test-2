import type { CSSProperties } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { Arrow } from '../../components/home/icons'

/*
 * Chemin depuis la racine du projet, et non relatif : sur une route imbriquée,
 * le découpage de TanStack Start réécrit le module et le chemin relatif n'est
 * plus résolvable côté serveur (« Denied ID »).
 */
import techniqueCss from '/src/styles/technique.css?url'

/*
 * Les valeurs entre crochets sont à fournir ou à confirmer par le client.
 * Comme sur l'accueil, elles restent visibles à l'écran tant qu'elles ne
 * le sont pas : une valeur plausible passerait inaperçue en relecture.
 */

/* Le formulaire de contact. Un professionnel de l'événementiel arrive sur
   les questions de prestation technique (bloc E, voir Formulaire.tsx). */
const CONTACT = '/contact'
const CONTACT_AGENCE = '/contact?profil=professionnel&besoin=technique'

const TITRE = 'Prestation technique son, lumière, vidéo à Toulouse | Oysen'
const DESCRIPTION =
  'Son, lumière, vidéo, structures et régie : notre matériel et nos techniciens, du montage au démontage, à Toulouse et en Occitanie. Sous-traitance pour les agences.'

export const Route = createFileRoute('/nos-services/prestation-technique')({
  head: () => ({
    meta: [
      { title: TITRE },
      { name: 'description', content: DESCRIPTION },
    ],
    links: [{ rel: 'stylesheet', href: techniqueCss }],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(DONNEES_STRUCTUREES),
      },
    ],
  }),
  component: Technique,
})

/**
 * La page « Prestation technique ».
 *
 * Elle parle à un organisateur qui a déjà tout, sauf la technique, et à
 * une agence qui a le client mais pas le parc. Les deux veulent la même
 * chose : que ça marche, sans mauvaise surprise.
 *
 * Dans la salle sombre du site. Les faisceaux, constants d'une page à
 * l'autre, tombent ici d'un vrai pont lumière : une poutre en aluminium
 * triangulée traverse le haut du hero, cinq projecteurs y sont accrochés.
 * C'est le sujet même de la page, la structure et la lumière.
 */
function Technique() {
  return (
    <main className="page-technique">
      <Hero />
      <Formules />
      <Domaines />
      <PourQui />
      <Parc />
      <Questions />
      <Appel />
    </main>
  )
}

/* La tête d'une section : surtitre, titre, et une phrase au besoin. */
function Tete({
  surtitre,
  titre,
  id,
  texte,
}: {
  surtitre: string
  titre: string
  id: string
  texte?: string
}) {
  return (
    <div className="tech-tete">
      <p className="section__eyebrow">{surtitre}</p>
      <h2 className="section__title" id={id}>
        {titre}
      </h2>
      {texte ? <p className="tech-tete__texte">{texte}</p> : null}
    </div>
  )
}

/* Le lien lavande et sa flèche. */
function Lien({ href, children }: { href: string; children: string }) {
  return (
    <a className="tech-lien" href={href}>
      {children}
      <Arrow className="tech-lien__fleche" />
    </a>
  )
}

/* Les pictogrammes, sur une grille de 24, au trait : ceux du fondateur
   (son, lumière, structure, régie), et trois au même dessin. */
const PICTOS = {
  son: 'M4.5 3.5h8v17h-8zM10.5 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM11.5 15a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM15.5 9.5a4 4 0 0 1 0 5M18 7a7.5 7.5 0 0 1 0 10',
  lumiere: 'M9.5 3.5h5v4h-5zM11 7.5L7 20.5M13 7.5l4 13M5 20.5h14',
  video: 'M3.5 4.5h17v11h-17zM3.5 10h17M9.2 4.5v11M14.8 4.5v11M12 15.5v4M8.5 20h7',
  structure: 'M4 21V4.5h16V21M4 8h16M4 4.5l4 3.5 4-3.5 4 3.5 4-3.5M2.5 21h3M18.5 21h3',
  /* Une armoire électrique, son éclair. */
  electricite: 'M5.5 3.5h13v17h-13zM13 7l-3 5h4l-3 5',
  /* Deux postes reliés par les ondes. */
  reseau: 'M7 9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM22 9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM4.5 12v8.5M19.5 12v8.5M9.5 9.5h5M8.5 6.5a5 5 0 0 1 7 0',
  regie: 'M3 16.5h18v4H3zM3 16.5l2-12h14l2 12M8 7v7M12 7v7M16 7v7M6.8 11h2.4M10.8 9h2.4M14.8 12.5h2.4',
}

function Picto({ trace, className }: { trace: string; className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d={trace}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ---- S1 · Le hero ----
   Le pont lumière en haut, cinq projecteurs dessous, leurs faisceaux
   sur la scène ; le texte centré, éclairé par eux. */

const DOMAINES_HERO = ['Son', 'Lumière', 'Vidéo', 'Structure', 'Régie']

function Hero() {
  return (
    <section className="tech-hero" aria-labelledby="technique-title">
      {/*
        À REMPLACER au besoin par une photo d'une installation Oysen : un
        plateau monté, la régie en place, avant l'arrivée du public.
      */}
      <img
        className="tech-hero__fond"
        src="/images/services/prestation-technique-1200.jpg"
        srcSet="/images/services/prestation-technique-800.jpg 800w, /images/services/prestation-technique-1200.jpg 1200w"
        sizes="100vw"
        width={1200}
        height={1500}
        alt=""
        decoding="async"
      />

      {/* Le pont, les cinq projecteurs, leurs faisceaux. Décor. */}
      <div className="tech-hero__salle" aria-hidden="true">
        <span className="pont" />
        <span className="pont__projecteurs">
          {DOMAINES_HERO.map((domaine, rang) => (
            <span
              className="pont__projecteur"
              key={domaine}
              style={{ '--rang': rang } as CSSProperties}
            >
              {/* Le faisceau part de la lentille et suit l'orientation
                  du projecteur. */}
              <i className="pont__lampe">
                <i className="pont__faisceau" />
              </i>
            </span>
          ))}
        </span>
      </div>

      <div className="tech-hero__texte">
        {/* Le h1 est le surtitre, porteur de la requête ; la grande
            phrase en dessous reste l'accroche, en simple paragraphe. */}
        <h1 className="section__eyebrow" id="technique-title">
          Prestation technique événementielle · Toulouse et Occitanie
        </h1>
        <p className="tech-hero__titre">
          <span className="tech-hero__ligne">Le bon technicien.</span>{' '}
          <span className="tech-hero__ligne">Le bon matériel.</span>{' '}
          <span className="tech-hero__ligne">À la bonne date.</span>
        </p>
        <p className="tech-hero__lede">
          Son, lumière, vidéo, structures et régie. Nos techniciens s’occupent
          de tout, du montage au démontage, avec le matériel adapté à votre
          événement.
        </p>
        <div className="tech-hero__actions">
          <a className="btn btn--solid" href={CONTACT}>
            Connaître les disponibilités
          </a>
        </div>
        <p className="tech-hero__domaines">
          {DOMAINES_HERO.map((domaine) => (
            <span key={domaine}>{domaine}</span>
          ))}
        </p>
      </div>
    </section>
  )
}

/* ---- S2 · Prestation ou location ----
   Un vrai tableau : deux façons de travailler, ligne à ligne. La
   colonne de la prestation est éclairée. */

const COMPARAISON = [
  { ligne: 'Le matériel', prestation: 'Nous l’apportons', location: 'Il est mis à votre disposition' },
  { ligne: 'Les techniciens', prestation: 'Présents sur place', location: 'Aucun' },
  {
    ligne: 'Installation et exploitation',
    prestation: 'Nous livrons, installons, réglons et exploitons',
    location: 'Non',
  },
  { ligne: 'Démontage', prestation: 'Nous démontons et reprenons le matériel', location: 'Retour du matériel' },
  {
    ligne: 'C’est pour vous si',
    prestation: 'Vous voulez être tranquille le jour J',
    location: 'Vous savez déjà ce qu’il vous faut',
  },
]

function Formules() {
  return (
    <section
      className="section section--technique section--technique-formules"
      aria-labelledby="formules-tech-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Prestation ou location"
          titre="Avec nos techniciens, ou sans ?"
          id="formules-tech-title"
          texte="Deux façons de travailler avec nous. Choisissez la vôtre."
        />

        <div className="comparaison">
          <table className="comparaison__table">
            <thead>
              <tr>
                <td />
                <th scope="col" className="comparaison__prestation">
                  Prestation technique
                </th>
                <th scope="col" className="comparaison__location">
                  Location de matériel
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARAISON.map((ligne) => (
                <tr key={ligne.ligne}>
                  <th scope="row">{ligne.ligne}</th>
                  <td className="comparaison__prestation" data-label="Prestation technique">
                    {ligne.prestation}
                  </td>
                  <td className="comparaison__location" data-label="Location de matériel">
                    {ligne.location}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Le lien vers la location, sous sa colonne. */}
            <tfoot>
              <tr>
                <td colSpan={2} />
                <td className="comparaison__lien">
                  <Lien href="/nos-services/location-de-materiel">Voir la location de matériel</Lien>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="comparaison__suite">
          <p className="comparaison__sortie">
            Vous souhaitez un accompagnement complet&nbsp;?{' '}
            <a href="/nos-services">Découvrez nos services</a>.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ---- S3 · Les domaines d'intervention ----
   Sept cartes éclairées, chacune sous son projecteur, avec son
   pictogramme : quatre sur la première rangée, trois sur la seconde. */

const DOMAINES = [
  { nom: 'Son', trace: PICTOS.son, apport: 'Chacun entend bien, partout dans le lieu.' },
  {
    nom: 'Lumière',
    trace: PICTOS.lumiere,
    apport: 'La scène, la salle et l’ambiance sont mises en valeur.',
  },
  { nom: 'Vidéo et écran LED', trace: PICTOS.video, apport: 'Un écran modulaire, adapté à votre lieu.' },
  {
    nom: 'Structures aluminium',
    trace: PICTOS.structure,
    apport: 'Le son, la lumière et les écrans au bon endroit.',
  },
  {
    nom: 'Électricité',
    trace: PICTOS.electricite,
    apport: 'Une distribution électrique pour tout alimenter sans risque.',
  },
  {
    nom: 'Réseau de communication',
    trace: PICTOS.reseau,
    apport: 'Les équipes et le matériel restent reliés.',
  },
  {
    nom: 'Régie',
    trace: PICTOS.regie,
    apport: 'Des techniciens pilotent le son, la lumière et la vidéo pendant l’événement.',
  },
]

function Domaines() {
  return (
    <section
      className="section section--technique section--technique-domaines"
      aria-labelledby="domaines-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Domaines d’intervention"
          titre="Son, lumière, vidéo : notre expertise technique événementielle"
          id="domaines-title"
        />

        <ul className="domaines">
          {DOMAINES.map((domaine) => (
            <li className="domaine" key={domaine.nom}>
              <Picto trace={domaine.trace} className="domaine__picto" />
              <h3 className="domaine__nom">{domaine.nom}</h3>
              <p className="domaine__apport">{domaine.apport}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---- S4 · Pour qui ----
   Les agences en grand, à gauche, sous la lumière ; les quatre autres
   publics en regard, à droite. */

const PUBLICS = [
  {
    nom: 'Organisateurs',
    texte:
      'Vous avez le lieu, le programme et les autres prestataires. Il ne manque que la technique : nous nous en occupons.',
  },
  {
    nom: 'Collectivités et institutions',
    texte:
      'Fêtes locales, inaugurations, cérémonies : une technique installée à l’heure, prête quand le public arrive.',
  },
  {
    nom: 'Salles et lieux de réception',
    texte: 'Vos clients ont besoin de son, de lumière ou d’un écran. Nous venons les installer.',
  },
  {
    nom: 'Particuliers',
    texte:
      'Un mariage, une fête privée : vous avez le lieu et les invités. Nous apportons le son, la lumière ou l’écran, et nos techniciens les installent et les pilotent pour que vous profitiez de votre journée.',
  },
]

function PourQui() {
  return (
    <section
      className="section section--technique section--technique-publics"
      aria-labelledby="publics-tech-title"
    >
      <div className="section__inner">
        <Tete surtitre="Pour qui" titre="Des prestations techniques pour les professionnels de l’événementiel" id="publics-tech-title" />

        <div className="publics-tech">
          <article className="agences" id="agences" aria-labelledby="agences-title">
            <p className="agences__label">Agences et confrères</p>
            <h3 className="agences__titre" id="agences-title">
              Vous avez le client. Il vous manque la technique&nbsp;?
            </h3>
            <p className="agences__texte">
              Nous travaillons en sous-traitance pour d’autres agences et d’autres
              professionnels. Nous intervenons sur la partie technique : matériel,
              installation, exploitation.
            </p>
            <p className="agences__texte">
              Dites-nous votre besoin : nous vous répondons avec une proposition
              adaptée.
            </p>
            <a className="btn btn--solid agences__bouton" href={CONTACT_AGENCE}>
              Écrire en tant qu’agence
            </a>
          </article>

          <ul className="publics-tech__autres">
            {PUBLICS.map((profil) => (
              <li className="public-tech" key={profil.nom}>
                <h3 className="public-tech__nom">{profil.nom}</h3>
                <p className="public-tech__texte">{profil.texte}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ---- S5 · Le parc et les partenaires ----
   Quatre engagements en colonnes, le bandeau des marques à remplir,
   puis l'encart « Plus grand ? ». */

const ENGAGEMENTS = [
  { nom: 'Capacité', texte: 'Notre parc couvre un événement de 1 500 personnes.' },
  {
    nom: 'Contrôle',
    texte: 'Matériel contrôlé et entretenu avant chaque prestation, vérifié avant le départ.',
  },
  { nom: 'Sécurité', texte: 'Règles de sécurité respectées, techniciens compétents.' },
  {
    nom: 'Sur mesure',
    texte: 'Les moyens suivent la jauge, le lieu et vos besoins techniques.',
  },
]

/* Les marques du parc : à remplacer par le logo (une image, à la place du
   texte entre crochets) et le nom du modèle. */
const MARQUES = Array.from({ length: 6 }, () => ({
  logo: '[Logo]',
  nom: '[Nom du matériel]',
}))

function Parc() {
  return (
    <section
      className="section section--technique section--technique-parc"
      aria-labelledby="parc-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Parc et partenaires"
          titre="Un parc complet, contrôlé avant chaque prestation"
          id="parc-title"
        />

        <ul className="engagements">
          {ENGAGEMENTS.map((engagement) => (
            <li className="engagement" key={engagement.nom}>
              <h3 className="engagement__nom">{engagement.nom}</h3>
              <p className="engagement__texte">{engagement.texte}</p>
            </li>
          ))}
        </ul>

        <ul className="marques" aria-label="Marques et modèles du parc">
          {MARQUES.map((marque, rang) => (
            <li className="marques__item" key={rang}>
              <span className="marques__logo">{marque.logo}</span>
              <span className="marques__nom">{marque.nom}</span>
            </li>
          ))}
        </ul>

        <div className="plus-grand">
          <h3 className="plus-grand__titre">Plus grand&nbsp;?</h3>
          <p className="plus-grand__texte">
            Pour un événement plus important ou un besoin spécifique, nous
            complétons avec du matériel loué ou des partenaires spécialisés.
          </p>
          {/*
            À RÉACTIVER quand la page partenaires existera (dès que le client
            aura ses partenaires) : vérifier son adresse, puis retirer le
            commentaire. Même lien que sur « Événements d'entreprise ».

          <Lien href="/nos-partenaires">Voir nos partenaires</Lien>
          */}
        </div>
      </div>
    </section>
  )
}

/* ---- S6 · Les questions ----
   Quatre questions, en dépliants comme la FAQ de l'accueil. */

const QUESTIONS = [
  {
    q: 'Avez-vous le matériel dont j’ai besoin ?',
    a: 'Dites-nous la date, le lieu, le type d’événement, la jauge et le matériel souhaité. Nous calculons le matériel nécessaire. Si votre événement dépasse notre parc, nous louons le complément.',
  },
  {
    q: 'Qui intervient sur place ?',
    a: 'Nos techniciens installent, règlent et exploitent le matériel pendant votre événement.',
  },
  {
    q: 'Quels sont vos délais de réservation ?',
    a: 'Dès que vous avez une date. Nous regardons d’abord si nous sommes libres, puis nous chiffrons. [À confirmer : délai de réservation]',
  },
  {
    q: 'Livrez-vous et installez-vous ?',
    a: 'Oui. Nous apportons le matériel, nous l’installons et nous le reprenons. [À confirmer : zone couverte et frais de déplacement]',
  },
]

function Questions() {
  return (
    <section
      className="section section--technique section--technique-questions"
      aria-labelledby="tech-questions-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Questions fréquentes"
          titre="Prestation technique événementielle : vos questions"
          id="tech-questions-title"
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
      className="section section--appel section--technique-appel"
      aria-labelledby="technique-appel-title"
    >
      <div className="section__inner">
        <h2 className="section__title appel__title" id="technique-appel-title">
          Parlez-nous de votre technique.
        </h2>
        <p className="appel__lede">
          Donnez-nous la date, le lieu, le type d’événement, le matériel souhaité.
          Nous revenons vers vous avec une proposition adaptée.
        </p>
        <div className="appel__actions">
          <a className="btn btn--solid" href={CONTACT}>
            Connaître les disponibilités
          </a>
        </div>
      </div>
    </section>
  )
}

/* ---- Données structurées : le service, la FAQ, le fil d'Ariane ---- */

const ADRESSE = '/nos-services/prestation-technique'

const DONNEES_STRUCTUREES = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Prestation technique événementielle',
      serviceType: 'Sonorisation, éclairage, vidéo, structures et régie pour événements',
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
        { '@type': 'ListItem', position: 3, name: 'Prestation technique', item: ADRESSE },
      ],
    },
  ],
}
