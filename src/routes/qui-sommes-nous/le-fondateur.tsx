import { createFileRoute } from '@tanstack/react-router'
import type { CSSProperties, ReactNode } from 'react'

import { Arrow } from '../../components/home/icons'
import { Lien } from '../../components/Lien'

/*
 * Chemin depuis la racine du projet, et non relatif : sur une route imbriquée,
 * le découpage de TanStack Start réécrit le module et le chemin relatif n'est
 * plus résolvable côté serveur (« Denied ID »).
 */
import fondateurCss from '/src/styles/fondateur.css?url'

export const Route = createFileRoute('/qui-sommes-nous/le-fondateur')({
  head: () => ({
    meta: [
      { title: 'Mathis Amato, fondateur d’Oysen' },
      {
        name: 'description',
        content:
          'Ingénieur travaux et fondateur d’Oysen : le parcours de Mathis Amato, ce qu’il sait faire sur un événement et ce que le terrain lui a appris.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: fondateurCss },
    ],
  }),
  component: Fondateur,
})

/*
 * Le portrait détouré, sur fond transparent (WebP avec transparence),
 * coupé à mi-cuisses. Tant qu'il vaut null, une silhouette tient sa place.
 *
 * EXEMPLE, À REMPLACER par le vrai portrait du fondateur : exporter le
 * nouveau fichier aux mêmes noms (600 et 900 px de large) dans
 * public/images/fondateur/, rien d'autre à changer.
 */
const PORTRAIT: string | null = '/images/fondateur/fondateur-portrait-900.webp'
const PORTRAIT_SRCSET =
  '/images/fondateur/fondateur-portrait-600.webp 600w, /images/fondateur/fondateur-portrait-900.webp 900w'

/**
 * La page « Le fondateur ».
 *
 * Le hero pose deux mondes en fond : à gauche le chantier (la trame du
 * plan, le gris de la charte), à droite la scène (les projecteurs, le
 * lavande). Le fondateur se tient à droite, éclairé des deux côtés, son nom
 * à sa gauche.
 *
 * La suite est un récit à la première personne, mis en page sobrement :
 * une colonne de lecture, un parcours daté, des savoir-faire, un
 * événement, ses articles, puis l'appel.
 *
 * Tout ce qui est en faux texte est marqué « À REMPLACER » dans le code.
 */
function Fondateur() {
  return (
    <main className="fondateur-page">
      <Ouverture />
      <Introduction />
      <Parcours />
      <Savoirs />
      <Marquant />
      <Articles />
      <Appel />
    </main>
  )
}

/* ---- Le hero ---- */

function Ouverture() {
  return (
    <section className="fondateur-hero" aria-labelledby="fondateur-title">
      {/* La salle en fond, la scène éclairée à droite, derrière le
          fondateur ; la gauche reste dans l'ombre, sous le texte. */}
      <div className="fondateur-hero__decor" aria-hidden="true">
        <img
          className="fondateur-hero__fond"
          src="/images/fondateur/fondateur-fond-1536.webp"
          srcSet="/images/fondateur/fondateur-fond-960.webp 960w, /images/fondateur/fondateur-fond-1536.webp 1536w"
          sizes="100vw"
          width={1536}
          height={1024}
          alt=""
          decoding="async"
        />
      </div>

      <div className="fondateur-hero__scene">
        <div className="fondateur-hero__texte">
          <h1
            className="section__eyebrow fondateur-hero__surtitre"
            id="fondateur-title"
          >
            Découvrez le fondateur d’Oysen, agence événementielle
          </h1>

          <p className="fondateur-hero__nom">
            <span className="fondateur-hero__prenom">Mathis</span>{' '}
            <span className="fondateur-hero__famille">Amato</span>
          </p>

          <p className="fondateur-hero__role">Ingénieur, fondateur d’Oysen.</p>

          <p className="fondateur-hero__citation">
            «&nbsp;Un événement ne se résume pas à une prestation technique.
            Il se conçoit, se structure et se réalise avec la même exigence
            qu’un projet d’ingénierie.&nbsp;»
          </p>
        </div>

        <figure className="fondateur-hero__portrait">
          {PORTRAIT ? (
            <img
              className="fondateur-hero__corps"
              src={PORTRAIT}
              srcSet={PORTRAIT_SRCSET}
              sizes="(max-width: 760px) 72vw, 34rem"
              width={900}
              height={1350}
              alt="Portrait de Mathis Amato"
              decoding="async"
            />
          ) : (
            <Silhouette />
          )}
        </figure>
      </div>
    </section>
  )
}

/*
 * En attendant le portrait : une tête et des épaules, sans visage. Elle
 * reçoit l'éclairage de la vraie photo, pour juger la mise en page.
 */
function Silhouette() {
  return (
    <svg
      className="fondateur-hero__corps fondateur-hero__silhouette"
      viewBox="0 0 400 500"
      role="img"
      aria-label="Portrait de Mathis Amato, à venir"
    >
      <defs>
        <linearGradient id="silhouette-matiere" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c2635" />
          <stop offset="1" stopColor="#15111a" />
        </linearGradient>
      </defs>
      <path
        fill="url(#silhouette-matiere)"
        d="M200 40C250 40 282 80 282 140C282 200 256 246 222 262L224 300C280 318 340 336 368 380C388 412 396 460 400 500H0C4 460 12 412 32 380C60 336 120 318 176 300L178 262C144 246 118 200 118 140C118 80 150 40 200 40Z"
      />
      <text className="fondateur-hero__visee" x="200" y="440" textAnchor="middle">
        Portrait détouré à fournir
      </text>
    </svg>
  )
}


/*
 * La tête d'une section : surtitre et titre à gauche, et à droite, quand
 * la section en a un, ce qui l'accompagne (un lien, une fiche).
 */
function Tete({
  surtitre,
  titre,
  id,
  children,
  carte = false,
}: {
  surtitre: string
  titre: string
  id: string
  children?: ReactNode
  /* Les calques du design cards 01, pour une tête posée en carte sur
     téléphone (fondateur.css) ; masqués ailleurs. */
  carte?: boolean
}) {
  return (
    <div className="fondateur-tete">
      {carte ? (
        <>
          <span className="dc01__repere" aria-hidden="true" />
          <span className="dc01__survol" aria-hidden="true" />
          <span className="dc01__zone" aria-hidden="true" />
        </>
      ) : null}
      <div className="fondateur-tete__titres">
        <p className="section__eyebrow">{surtitre}</p>
        <h2 className="section__title" id={id}>
          {titre}
        </h2>
      </div>
      {children ? <div className="fondateur-tete__cote">{children}</div> : null}
    </div>
  )
}

/* ---- 1 · L'introduction ----
   Sans titre, directement sous le hero : le décor de celui-ci s'y éteint.
   L'accroche en grand à gauche, la suite en regard, puis trois repères
   sur toute la largeur. */

const REPERES = [
  { label: 'Aujourd’hui', valeur: 'Ingénieur travaux', detail: 'dans le bâtiment' },
  { label: 'Formation', valeur: 'Génie civil', detail: 'UPSSITECH, Toulouse' },
  { label: 'Depuis 2026', valeur: 'Fondateur d’Oysen', detail: 'agence événementielle' },
]

function Introduction() {
  return (
    <section
      className="section section--fondateur section--fondateur-intro"
      aria-label="Introduction"
    >
      <div className="section__inner">
        <div className="intro-fondateur">
          <p className="intro-fondateur__accroche">
            Sur un événement, on me trouve rarement au milieu de la piste.
            Plutôt à la régie, un œil sur la salle, l’autre sur le déroulé.
            C’est ma place depuis mes premières soirées, il y a plus de
            10&nbsp;ans.
          </p>

          <div className="intro-fondateur__texte">
            <p className="intro-fondateur__chapeau">
              Aujourd’hui, je suis ingénieur travaux dans le bâtiment et
              fondateur d’Oysen.
            </p>
            <p>
              J’utilise mon expérience en organisation événementielle et mon
              expertise en tant qu’ingénieur comme moteur pour faire d’Oysen
              une référence en matière d’agence événementielle.
            </p>
          </div>
        </div>

        <ul className="reperes">
          {REPERES.map((repere) => (
            <li className="repere" key={repere.label}>
              <span className="repere__label">{repere.label}</span>
              <span className="repere__valeur">{repere.valeur}</span>
              <span className="repere__detail">{repere.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---- 2 · Formation et parcours ----
   Sur ordinateur, une frise horizontale sur toute la largeur : les étapes
   s'accrochent au fil alternativement au-dessus et au-dessous, chacune sur
   deux colonnes. Sur tablette et téléphone, le fil devient vertical.
   Oysen, au bout du fil, a le seul losange plein. */

const ETAPES = [
  {
    date: '2015–2026',
    titre: 'Premières soirées',
    texte:
      'Soirées, anniversaires, fêtes de village : d’abord derrière les platines, très vite à la technique.',
  },
  {
    date: 'Avant 2020',
    titre: 'Bac STI2D, puis prépa TSI',
    texte: 'Une filière technologique, puis deux ans de prépa scientifique.',
  },
  {
    date: '2020',
    titre: 'UPSSITECH, Toulouse',
    texte:
      'École d’ingénieurs de l’Université Paul Sabatier, spécialité génie civil.',
  },
  {
    date: '2021–2022',
    titre: 'Président du BDE',
    texte:
      'Le week-end d’intégration et d’autres événements étudiants : un budget, des partenaires, la logistique de 150 participants, des règles de sécurité.',
  },
  {
    date: '2022–2024',
    titre: 'Ingénieur études de prix',
    texte:
      'Dans le bâtiment. Chiffrer un ouvrage avant qu’il existe, évaluer sa faisabilité, repérer les risques avant qu’ils ne coûtent.',
  },
  {
    date: 'Depuis 2024',
    titre: 'Ingénieur travaux',
    texte:
      'Faire avancer ensemble les entreprises d’un chantier, en tenant délais, budget et qualité.',
  },
  {
    date: '2026',
    titre: 'Oysen',
    texte:
      'Le matériel acheté soirée après soirée devient le parc de l’entreprise.',
  },
]

function Parcours() {
  return (
    <section
      className="section section--fondateur section--fondateur-parcours"
      aria-labelledby="parcours-title"
    >
      <div className="section__inner">
        <Tete surtitre="Parcours" titre="Formation et parcours" id="parcours-title" carte />

        <ol className="frise">
          {ETAPES.map((etape, index) => (
            <li
              className="jalon"
              key={etape.titre}
              style={{ '--col': index + 1 } as CSSProperties}
            >
              <div className="jalon__bloc">
                <p className="jalon__date">{etape.date}</p>
                <h3 className="jalon__titre">{etape.titre}</h3>
                <p className="jalon__texte">{etape.texte}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---- 3 · Ce que je sais faire ----
   Cinq cartes sur toute la largeur : trois, puis deux plus larges.
   Chacune porte le poste qu'elle concerne et son pictogramme, pris dans
   le métier comme ceux de l'accueil, au même trait. */

const SAVOIRS = [
  {
    poste: 'Repérage',
    /* Le plan de la salle, sa cote, et la porte par où l'on décharge. */
    trace: 'M3.5 20.5v-12h17v12zM3.5 5h17M3.5 4v2M20.5 4v2M10 20.5v-4.5h4v4.5',
    titre: 'Repérer un lieu',
    texte:
      'En une visite, relever ce qui comptera le jour J : les accès pour décharger, l’alimentation électrique, la hauteur sous plafond, les horaires imposés par le lieu.',
  },
  {
    poste: 'Son',
    /* Une enceinte, et le son qui porte jusqu'au fond. */
    trace: 'M4.5 3.5h8v17h-8zM10.5 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM11.5 15a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM15.5 9.5a4 4 0 0 1 0 5M18 7a7.5 7.5 0 0 1 0 10',
    titre: 'Sonoriser',
    texte:
      'Dimensionner le système selon la jauge et la salle, puis placer les enceintes pour que le fond entende la même chose que le premier rang. Un son bien placé n’a pas besoin d’être fort.',
  },
  {
    poste: 'Lumière',
    /* Un projecteur et son cône, jusqu'au sol. */
    trace: 'M9.5 3.5h5v4h-5zM11 7.5L7 20.5M13 7.5l4 13M5 20.5h14',
    titre: 'Éclairer',
    texte:
      'Une entrée, un discours, une piste de danse ne s’éclairent pas de la même façon. La bonne lumière crée la bonne ambiance.',
  },
  {
    poste: 'Structure',
    /* Un portique : la poutre triangulée, les pieds, le lest. */
    trace: 'M4 21V4.5h16V21M4 8h16M4 4.5l4 3.5 4-3.5 4 3.5 4-3.5M2.5 21h3M18.5 21h3',
    titre: 'Monter une structure qui tient',
    texte:
      'Dehors, tout se joue sur le lestage et la prise au vent. Mon expérience d’ingénieur dans le bâtiment me permet de penser et de monter une structure parfaitement sécurisée.',
  },
  {
    poste: 'Régie',
    /* La console et ses faders, chacun à sa hauteur. */
    trace: 'M3 16.5h18v4H3zM3 16.5l2-12h14l2 12M8 7v7M12 7v7M16 7v7M6.8 11h2.4M10.8 9h2.4M14.8 12.5h2.4',
    titre: 'Tenir une régie',
    texte:
      'Enchaîner les temps forts sans blanc : lancer le bon son au bon moment, suivre le déroulé, s’adapter quand il change.',
  },
]

function Savoirs() {
  return (
    <section
      className="section section--fondateur section--fondateur-savoirs"
      aria-labelledby="savoirs-title"
    >
      <div className="section__inner">
        <Tete surtitre="Savoir-faire" titre="Mon expertise en matière d’organisation événementielle" id="savoirs-title" />

        <ul className="savoirs">
          {SAVOIRS.map((savoir) => (
            <li className="savoir dc01" key={savoir.titre}>
              {/* Design cards 01 (app.css) : le trait du haut, la bordure
                  du survol et la zone de survol prolongée. */}
              <span className="dc01__repere" aria-hidden="true" />
              <span className="dc01__survol" aria-hidden="true" />
              <span className="dc01__zone" aria-hidden="true" />

              <div className="savoir__tete">
                <span className="savoir__poste">{savoir.poste}</span>
                <svg
                  className="savoir__picto"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d={savoir.trace}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="savoir__titre">{savoir.titre}</h3>
              <p className="savoir__texte">{savoir.texte}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---- 4 · Un événement qui m'a marqué ----
   La fiche de l'événement en regard du titre, puis le récit en trois
   temps, côte à côte. */

/* La fiche et le récit d'un gala de 600 personnes, en salle des fêtes. */
const FICHE = [
  { label: 'Lieu', valeur: 'Salle des fêtes' },
  { label: 'Année', valeur: '2022' },
  { label: 'Invités', valeur: '600' },
]

const TEMPS = [
  {
    titre: 'Ce qui était difficile',
    texte:
      'Accueillir 600 personnes dans de bonnes conditions, et restituer la salle à 7h00, après un gala fini à 3h du matin.',
  },
  {
    titre: 'Ce que j’ai fait',
    texte:
      'J’ai coordonné tout le projet, de la première idée au dernier coup de balai : lieu, billetterie, restauration, sécurité, Croix-Rouge, prestataires et technique.',
  },
  {
    titre: 'Ce que j’en ai retenu',
    texte:
      'La billetterie est un vrai outil de pilotage, et le démontage doit être prévu dès la conception de l’événement.',
  },
]

function Marquant() {
  return (
    <section
      className="section section--fondateur section--fondateur-marquant"
      aria-labelledby="marquant-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Sur le terrain"
          titre="Un événement qui m’a marqué"
          id="marquant-title"
        >
          {/* La fiche, en design cards 01 (app.css) : la carte porte les
              calques, la liste de définitions reste à l'intérieur. */}
          <div className="fiche dc01 dc01--impaire">
            <span className="dc01__repere" aria-hidden="true" />
            <span className="dc01__survol" aria-hidden="true" />
            <span className="dc01__zone" aria-hidden="true" />

            <dl className="fiche__grille">
              {FICHE.map((ligne) => (
                <div className="fiche__case" key={ligne.label}>
                  <dt>{ligne.label}</dt>
                  <dd>{ligne.valeur}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Tete>

        <div className="temps">
          {TEMPS.map((temps) => (
            <div className="temps__bloc" key={temps.titre}>
              <h3 className="temps__titre">{temps.titre}</h3>
              <p className="temps__texte">{temps.texte}</p>
            </div>
          ))}
        </div>

        <Lien className="lien-fleche marquant__lien" href="/nos-souvenirs">
          D’autres événements dans Nos souvenirs
          <Arrow className="lien-fleche__icone" />
        </Lien>
      </div>
    </section>
  )
}

/* ---- 5 · Ce que j'écris ----
   Ses trois derniers articles du blog. En attendant les vrais, trois
   cartes en faux texte (À REMPLACER par la liste automatique). */

const ARTICLES = [
  {
    date: 'Lorem 2026',
    titre: 'Lorem ipsum dolor sit amet',
    extrait:
      'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
  },
  {
    date: 'Lorem 2026',
    titre: 'Ut enim ad minim veniam',
    extrait:
      'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    date: 'Lorem 2026',
    titre: 'Duis aute irure dolor',
    extrait:
      'In reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
]

function Articles() {
  return (
    <section
      className="section section--fondateur section--fondateur-articles"
      aria-labelledby="articles-title"
    >
      <div className="section__inner">
        <Tete surtitre="Blog" titre="Apprenez-en plus sur l’organisation événementielle" id="articles-title" />

        <ul className="articles">
          {ARTICLES.map((article) => (
            <li key={article.titre}>
              <Lien className="article" href="/blog">
                <span className="article__date">{article.date}</span>
                <span className="article__titre">{article.titre}</span>
                <span className="article__extrait">{article.extrait}</span>
                <span className="article__lire">
                  Lire l’article
                  <Arrow className="article__fleche" />
                </span>
              </Lien>
            </li>
          ))}
        </ul>

        {/* Le lien vers tout le blog, centré sous les cartes. */}
        <p className="articles__tous">
          <Lien className="lien-fleche" href="/blog">
            Tous les articles
            <Arrow className="lien-fleche__icone" />
          </Lien>
        </p>
      </div>
    </section>
  )
}

/* ---- 6 · La sortie ----
   La même que celle de la page « L'agence » : la rampe violette par le
   bas, une question, deux chemins, aucune pression. */

function Appel() {
  return (
    <section
      className="section section--fondateur section--fondateur-appel"
      aria-labelledby="appel-fondateur-title"
    >
      <div className="section__inner">
        <h2 className="section__title" id="appel-fondateur-title">
          Vous souhaitez organiser un événement&nbsp;?
        </h2>

        <p className="fondateur-sortie__lede">
          Découvrez l’ensemble de nos services en matière d’organisation
          événementielle.
        </p>

        <div className="fondateur-sortie__actions">
          <Lien className="btn btn--solid" href="/nos-services">
            Voir nos services
          </Lien>
        </div>

        <div className="fondateur-sortie__direct">
          <p className="fondateur-sortie__direct-texte">
            Ou contactez-nous directement
          </p>

          <Lien className="btn btn--ghost" href="/contact">
            Imaginer mon événement
          </Lien>
        </div>
      </div>
    </section>
  )
}
