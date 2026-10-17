import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { PERSONNES } from '../../components/contact/content'
import { PHONE_DISPLAY, PHONE_TEL } from '../../components/home/content'
import { Arrow } from '../../components/home/icons'
import { Lien } from '../../components/Lien'
import { canonical } from '../../lib/canonical'

/*
 * Chemin depuis la racine du projet, et non relatif : sur une route imbriquée,
 * le découpage de TanStack Start réécrit le module et le chemin relatif n'est
 * plus résolvable côté serveur (« Denied ID »).
 */
import locationCss from '/src/styles/location.css?url'

const TITRE = 'Location de matériel son, lumière et structures à Toulouse | Oysen'
const DESCRIPTION =
  'Louez du matériel de sonorisation, d’éclairage et des structures pour des événements jusqu’à 1 500 personnes, à Toulouse et en Occitanie. Réponse avec un devis.'

export const Route = createFileRoute('/nos-services/location-de-materiel')({
  head: () => ({
    meta: [
      { title: TITRE },
      { name: 'description', content: DESCRIPTION },
    ],
    links: [
      canonical('/nos-services/location-de-materiel'),
      { rel: 'stylesheet', href: locationCss },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(DONNEES_STRUCTUREES),
      },
    ],
  }),
  component: Location,
})

/**
 * La page « Location de matériel ».
 *
 * Elle s'adresse à quelqu'un qui loue le matériel seul, sans technicien :
 * ce que nous équipons, comment ça marche, ce qui évite les mauvaises
 * surprises, puis un appel ou le formulaire de disponibilité.
 *
 * Dans la salle sombre du site. Les faisceaux, constants d'une page à
 * l'autre, partent ici du sol : deux projecteurs posés aux angles bas du
 * hero se croisent vers le haut, comme des lumières au pied d'une
 * structure. Le matériel, littéralement, éclaire la page.
 */
function Location() {
  return (
    <main className="page-location">
      <Hero />
      <Materiel />
      <Etapes />
      <Reassurance />
      <Technicien />
      <Questions />
      <Disponibilite />
    </main>
  )
}

/* La tête d'une section : un surtitre au besoin, le titre, une phrase au
   besoin. */
function Tete({
  surtitre,
  titre,
  id,
  texte,
}: {
  surtitre?: string
  titre: string
  id: string
  texte?: string
}) {
  return (
    <div className="loc-tete">
      {surtitre ? <p className="section__eyebrow">{surtitre}</p> : null}
      <h2 className="section__title" id={id}>
        {titre}
      </h2>
      {texte ? <p className="loc-tete__texte">{texte}</p> : null}
    </div>
  )
}

/*
 * Le bouton d'appel. Le numéro n'est pas dans le HTML servi, comme sur
 * l'accueil : les aspirateurs d'adresses qui lisent la page sans exécuter
 * le JavaScript repartent les mains vides. Au clic, le numéro s'affiche et
 * l'appel part (sur téléphone).
 */
function Appeler({ className }: { className: string }) {
  const [affiche, setAffiche] = useState(false)

  if (affiche) {
    return (
      <a className={`${className} loc-numero`} href={`tel:${PHONE_TEL}`}>
        {PHONE_DISPLAY}
      </a>
    )
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        setAffiche(true)
        window.location.href = `tel:${PHONE_TEL}`
      }}
    >
      Nous appeler
    </button>
  )
}

/* ---- S1 · Le hero ----
   La salle éteinte, la console en fond. Deux projecteurs posés au sol, aux
   angles bas, se croisent vers le haut derrière le texte, centré. */

function Hero() {
  return (
    <section className="loc-hero" aria-labelledby="location-title">
      {/*
        À REMPLACER au besoin par une photo du matériel Oysen : console,
        enceintes ou projecteurs prêts à partir.
      */}
      <img
        className="loc-hero__fond"
        src="/images/services/console-fond-1024.jpg"
        srcSet="/images/services/console-fond-800.jpg 800w, /images/services/console-fond-1024.jpg 1024w"
        sizes="100vw"
        width={1024}
        height={1024}
        alt=""
        decoding="async"
      />

      {/* Le voile, et les trois faisceaux de l'accueil, tombés du haut.
          Décor. */}
      <div className="loc-hero__salle" aria-hidden="true">
        <span className="loc-hero__faisceaux">
          <i />
          <i />
          <i />
        </span>
      </div>

      <div className="loc-hero__texte">
        <p className="section__eyebrow">Location de matériel · Toulouse et Occitanie</p>
        <h1 className="loc-hero__titre" id="location-title">
          Louez du matériel son, lumière et structures pour votre événement
        </h1>
        <p className="loc-hero__lede">
          Vous louez le matériel seul, sans prestation technique. Sono, éclairage
          et structures pour jusqu’à 1&nbsp;500 personnes. Appelez-nous ou envoyez
          votre demande : nous vous répondons avec un devis.
        </p>
        <div className="loc-hero__actions">
          <Appeler className="btn btn--solid" />
          <a className="btn btn--ghost" href="#disponibilite-title">
            Vérifier une disponibilité
          </a>
        </div>
      </div>
    </section>
  )
}

/* ---- S2 · Le matériel ----
   Cinq sous-sections, une par corps de métier, en grandes cartes
   éclairées : le son et la lumière en grand sur la première rangée, les
   structures, la vidéo et les accessoires sur la seconde. Chacune porte
   son nom, son pictogramme (ceux du fondateur, au même trait), la
   capacité quand elle s'applique, et ses équipements en liste.

   Les équipements reprennent le vocabulaire du métier : à valider avec
   le client selon son parc réel. */

const CORPS: {
  nom: string
  /* Le pictogramme, sur une grille de 24, au trait. */
  trace: string
  capacite?: string
  equipements: string[]
}[] = [
  {
    nom: 'Son',
    /* Une enceinte, et le son qui porte jusqu'au fond. */
    trace:
      'M4.5 3.5h8v17h-8zM10.5 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM11.5 15a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM15.5 9.5a4 4 0 0 1 0 5M18 7a7.5 7.5 0 0 1 0 10',
    capacite: 'Jusqu’à 1 500 personnes',
    equipements: [
      'Enceintes',
      'Caissons de basses',
      'Consoles de mixage',
      'Micros filaires et sans fil',
      'Retours de scène',
    ],
  },
  {
    nom: 'Lumière',
    /* Un projecteur et son cône, jusqu'au sol. */
    trace: 'M9.5 3.5h5v4h-5zM11 7.5L7 20.5M13 7.5l4 13M5 20.5h14',
    capacite: 'Jusqu’à 1 500 personnes',
    equipements: [
      'Projecteurs LED',
      'Lyres asservies',
      'Découpes',
      'Machines à brouillard',
      'Machines à étincelles froides',
      'Machines à fumée lourde',
      'Consoles lumière',
    ],
  },
  {
    nom: 'Structures',
    /* Un portique : la poutre triangulée, les pieds, le lest. */
    trace: 'M4 21V4.5h16V21M4 8h16M4 4.5l4 3.5 4-3.5 4 3.5 4-3.5M2.5 21h3M18.5 21h3',
    capacite: 'Jusqu’à 1 500 personnes',
    equipements: ['Praticables', 'Structures alu', 'Pieds de levage', 'Totems'],
  },
  {
    nom: 'Vidéo',
    /* Un mur d'écrans, ses dalles, sur son pied. */
    trace: 'M3.5 4.5h17v11h-17zM3.5 10h17M9.2 4.5v11M14.8 4.5v11M12 15.5v4M8.5 20h7',
    equipements: ['Vidéoprojecteurs', 'Écrans LED', 'Écrans de projection'],
  },
  {
    nom: 'Accessoires',
    /* Un flight case : sa poignée, son couvercle, sa fermeture. */
    trace: 'M3.5 7.5h17v12h-17zM9 7.5V5h6v2.5M3.5 11.5h17M10.5 11.5v2h3v-2',
    equipements: [
      'Câbles et rallonges',
      'Multiprises',
      'Pieds d’enceintes et de micros',
      'Flight cases',
      'Gaffer',
    ],
  },
]

function Materiel() {
  return (
    <section
      className="section section--location section--location-materiel"
      aria-labelledby="materiel-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Ce que nous équipons"
          titre="Le matériel proposé selon les besoins de votre événement"
          id="materiel-title"
        />

        <div className="corps-grille">
          {CORPS.map((corps) => (
            <article className="corps dc01" key={corps.nom} aria-labelledby={`corps-${corps.nom}`}>
              <span className="dc01__repere" aria-hidden="true" />
              <span className="dc01__survol" aria-hidden="true" />
              <span className="dc01__zone" aria-hidden="true" />
              <div className="corps__tete">
                <h3 className="corps__nom" id={`corps-${corps.nom}`}>
                  {corps.nom}
                </h3>
                <svg
                  className="corps__picto"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d={corps.trace}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {corps.capacite ? <p className="corps__capacite">{corps.capacite}</p> : null}
              <ul className="corps__liste">
                {corps.equipements.map((equipement) => (
                  <li key={equipement}>{equipement}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---- S3 · Comment ça marche ----
   Cinq étapes, une vraie séquence : numérotées, reliées par un fil à
   losanges. La première phrase de chaque étape en est le titre. */

const ETAPES: { titre: string; texte?: ReactNode }[] = [
  {
    titre: 'Vous nous contactez.',
    texte: (
      <>
        Par téléphone ou avec le <a href="#disponibilite-title">formulaire</a>.
      </>
    ),
  },
  { titre: 'Nous déterminons ensemble le matériel dont vous avez besoin.' },
  { titre: 'Vous recevez un devis, puis vous réservez.' },
  { titre: 'Retrait ou livraison, selon les conditions.' },
  {
    titre: 'Vous nous rendez le matériel.',
    texte: 'Nous le contrôlons au retour.',
  },
]

function Etapes() {
  return (
    <section
      className="section section--location section--location-etapes"
      aria-labelledby="etapes-loc-title"
    >
      <div className="section__inner">
        <Tete surtitre="La location" titre="Comment ça marche" id="etapes-loc-title" />

        <ol className="loc-etapes">
          {ETAPES.map((etape, index) => (
            <li className="loc-etape" key={etape.titre}>
              <span className="loc-etape__numero" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="loc-etape__titre">{etape.titre}</h3>
              {etape.texte ? <p className="loc-etape__texte">{etape.texte}</p> : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---- S4 · Louez sans mauvaise surprise ----
   Le noir complet. Trois réponses, chacune sous sa lampe, accrochées au
   même pont : le traitement des garanties de « Événements d'entreprise ». */

const GARDES = [
  {
    question: 'Vous ne savez pas quel matériel choisir ?',
    reponse:
      'Nous vous conseillons et nous vous proposons la configuration adaptée à votre événement.',
  },
  {
    question: 'Et si le matériel tombe en panne ?',
    reponse:
      'Le matériel est vérifié avant chaque location. Une assistance est disponible selon les conditions prévues.',
  },
  {
    question: 'Ce que comprend notre tarif',
    reponse:
      'Du matériel adapté, vérifié et préparé, avec un accompagnement pour choisir les équipements.',
  },
]

function Reassurance() {
  return (
    <section
      className="section section--location section--location-reassurance"
      aria-labelledby="reassurance-loc-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Nos engagements"
          titre="Louez sans mauvaise surprise"
          id="reassurance-loc-title"
        />

        <ul className="gardes">
          {GARDES.map((garde) => (
            <li className="garde" key={garde.question}>
              <h3 className="garde__question">{garde.question}</h3>
              <p className="garde__reponse">{garde.reponse}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---- S5 · Besoin d'un technicien ? ----
   Une plaque éclairée par le haut, comme sous un projecteur : la question,
   la réponse, et le lien vers la prestation technique. */

function Technicien() {
  return (
    <section
      className="section section--location section--location-technicien"
      aria-labelledby="technicien-title"
    >
      <div className="section__inner">
        <div className="plaque">
          <h2 className="section__title plaque__titre" id="technicien-title">
            Besoin d’un technicien&nbsp;?
          </h2>
          <p className="plaque__texte">
            La location se fait sans technicien. Si vous voulez quelqu’un pour
            installer et faire fonctionner la technique, c’est un autre service.
          </p>
          <Lien className="loc-lien" href="/nos-services/prestation-technique">
            Voir la prestation technique
            <Arrow className="loc-lien__fleche" />
          </Lien>
        </div>
      </div>
    </section>
  )
}

/* ---- S6 · Les questions ----
   Trois questions, en dépliants comme la FAQ de l'accueil. */

const QUESTIONS = [
  {
    q: 'Comment louer du matériel ?',
    a: 'Appelez-nous ou remplissez le formulaire. Nous vérifions vos dates et nous vous envoyons un devis.',
  },
  {
    q: 'Pourquoi ne voit-on pas le matériel en ligne ?',
    a: 'Pour l’instant, la location se fait par contact direct. Chaque événement est différent : nous choisissons le matériel avec vous.',
  },
  {
    q: 'Et si mon événement dépasse 1 500 personnes ?',
    a: 'Parlez-nous de votre projet. Nous regarderons ensemble ce qui est possible.',
  },
  {
    q: 'Une caution est-elle demandée ?',
    a: 'Oui, une caution est demandée pour chaque location. Elle vous est rendue au retour du matériel, après vérification.',
  },
]

function Questions() {
  return (
    <section
      className="section section--location section--location-questions"
      aria-labelledby="loc-questions-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Questions fréquentes"
          titre="Location de matériel : vos questions"
          id="loc-questions-title"
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

/* ---- S7 · Vérifier une disponibilité ----
   Le formulaire, dans une carte éclairée, aux champs du formulaire de
   contact. Tout est obligatoire, sauf le message ; la case de
   consentement est celle du formulaire de contact. La validation se fait au
   moment où l'on quitte un champ, et à l'envoi ; un champ en erreur se
   revalide à la saisie.

   EN ATTENTE de l'API, comme le formulaire de contact : l'envoi est
   simulé, puis le visiteur arrive sur la page de remerciement. */

const TYPES = [
  'Mariage ou événement privé',
  'Événement d’entreprise',
  'Festival, concert ou spectacle',
  'Événement public',
  'Autre',
]

const MATERIELS = ['Son', 'Lumière', 'Structures', 'Vidéo', 'Accessoires']

type Champs = {
  nom: string
  email: string
  telephone: string
  debut: string
  fin: string
  lieu: string
  type: string
  personnes: string
  materiel: string[]
  message: string
  consentement: boolean
}

type Cle = Exclude<keyof Champs, 'message'>

const VIDE: Champs = {
  nom: '',
  email: '',
  telephone: '',
  debut: '',
  fin: '',
  lieu: '',
  type: '',
  personnes: '',
  materiel: [],
  message: '',
  consentement: false,
}

const ORDRE: Cle[] = [
  'nom',
  'email',
  'telephone',
  'debut',
  'fin',
  'lieu',
  'type',
  'personnes',
  'materiel',
  'consentement',
]

function valider(cle: Cle, d: Champs): string {
  switch (cle) {
    case 'nom':
      return d.nom.trim() ? '' : 'Indiquez votre nom.'
    case 'email':
      if (!d.email.trim()) return 'Indiquez votre adresse e-mail.'
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())
        ? ''
        : 'Cette adresse e-mail semble incomplète, par exemple nom@domaine.fr.'
    case 'telephone':
      if (!d.telephone.trim()) return 'Indiquez un numéro de téléphone.'
      return d.telephone.replace(/\D/g, '').length >= 10
        ? ''
        : 'Ce numéro semble incomplet : dix chiffres au moins.'
    case 'debut':
      return d.debut ? '' : 'Indiquez la date de début.'
    case 'fin':
      if (!d.fin) return 'Indiquez la date de fin.'
      return !d.debut || d.fin >= d.debut
        ? ''
        : 'La date de fin ne peut pas précéder la date de début.'
    case 'lieu':
      return d.lieu.trim() ? '' : 'Indiquez le lieu de l’événement.'
    case 'type':
      return d.type ? '' : 'Choisissez le type d’événement.'
    case 'personnes':
      return d.personnes ? '' : 'Choisissez le nombre de personnes.'
    case 'materiel':
      return d.materiel.length ? '' : 'Cochez au moins un type de matériel.'
    case 'consentement':
      return d.consentement
        ? ''
        : 'Cochez cette case pour que nous puissions vous répondre.'
  }
}

/* Un champ : son libellé, le contrôle, son message d'erreur. */
function Champ({
  label,
  pour,
  erreur,
  facultatif = false,
  children,
}: {
  label: string
  pour: string
  erreur?: string
  facultatif?: boolean
  children: ReactNode
}) {
  return (
    <div className="champ">
      <label className="champ__label" htmlFor={pour}>
        {label}
        {facultatif ? (
          <span className="champ__precision"> (facultatif)</span>
        ) : (
          <span className="champ__requis" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children}
      <div className="champ__erreur-zone" id={`${pour}-erreur`} aria-live="polite">
        {erreur ? <p className="champ__erreur">{erreur}</p> : null}
      </div>
    </div>
  )
}

function Disponibilite() {
  const navigate = useNavigate()
  const [champs, setChamps] = useState<Champs>(VIDE)
  const [erreurs, setErreurs] = useState<Partial<Record<Cle, string>>>({})
  const [envoi, setEnvoi] = useState(false)

  const changer = (patch: Partial<Champs>, cle: Cle | 'message') => {
    const suivants = { ...champs, ...patch }
    setChamps(suivants)
    if (cle !== 'message' && erreurs[cle]) {
      setErreurs((e) => ({ ...e, [cle]: valider(cle, suivants) }))
    }
  }

  const quitter = (cle: Cle) =>
    setErreurs((e) => ({ ...e, [cle]: valider(cle, champs) }))

  /* Les attributs d'accessibilité d'un champ, selon son erreur. */
  const aria = (cle: Cle, id: string) =>
    erreurs[cle]
      ? { 'aria-invalid': true as const, 'aria-describedby': `${id}-erreur` }
      : {}

  const soumettre = async (event: FormEvent) => {
    event.preventDefault()
    if (envoi) return

    const trouvees: Partial<Record<Cle, string>> = {}
    for (const cle of ORDRE) {
      const message = valider(cle, champs)
      if (message) trouvees[cle] = message
    }
    setErreurs(trouvees)

    const premiere = ORDRE.find((cle) => trouvees[cle])
    if (premiere) {
      document.getElementById(`dispo-${premiere}`)?.focus()
      return
    }

    setEnvoi(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    await navigate({ to: '/contact/merci' })
  }

  return (
    <section
      className="section section--location section--location-dispo"
      aria-labelledby="disponibilite-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Votre demande"
          titre="Vérifier une disponibilité"
          id="disponibilite-title"
          texte="Vos dates, votre lieu, le matériel qu’il vous faut : nous vérifions et nous vous répondons avec un devis."
        />

        <form className="dispo" noValidate onSubmit={soumettre}>
          <div className="dispo__grille">
            <Champ label="Nom" pour="dispo-nom" erreur={erreurs.nom}>
              <input
                className="champ__input"
                id="dispo-nom"
                name="nom"
                autoComplete="name"
                value={champs.nom}
                onChange={(e) => changer({ nom: e.target.value }, 'nom')}
                onBlur={() => quitter('nom')}
                {...aria('nom', 'dispo-nom')}
              />
            </Champ>

            <Champ label="E-mail" pour="dispo-email" erreur={erreurs.email}>
              <input
                className="champ__input"
                id="dispo-email"
                name="email"
                type="email"
                autoComplete="email"
                value={champs.email}
                onChange={(e) => changer({ email: e.target.value }, 'email')}
                onBlur={() => quitter('email')}
                {...aria('email', 'dispo-email')}
              />
            </Champ>

            <Champ label="Téléphone" pour="dispo-telephone" erreur={erreurs.telephone}>
              <input
                className="champ__input"
                id="dispo-telephone"
                name="telephone"
                type="tel"
                autoComplete="tel"
                value={champs.telephone}
                onChange={(e) => changer({ telephone: e.target.value }, 'telephone')}
                onBlur={() => quitter('telephone')}
                {...aria('telephone', 'dispo-telephone')}
              />
            </Champ>

            <Champ label="Lieu" pour="dispo-lieu" erreur={erreurs.lieu}>
              <input
                className="champ__input"
                id="dispo-lieu"
                name="lieu"
                placeholder="Commune ou nom du lieu"
                value={champs.lieu}
                onChange={(e) => changer({ lieu: e.target.value }, 'lieu')}
                onBlur={() => quitter('lieu')}
                {...aria('lieu', 'dispo-lieu')}
              />
            </Champ>

            <Champ label="Date de début" pour="dispo-debut" erreur={erreurs.debut}>
              <input
                className="champ__input"
                id="dispo-debut"
                name="debut"
                type="date"
                value={champs.debut}
                onChange={(e) => changer({ debut: e.target.value }, 'debut')}
                onBlur={() => quitter('debut')}
                {...aria('debut', 'dispo-debut')}
              />
            </Champ>

            <Champ label="Date de fin" pour="dispo-fin" erreur={erreurs.fin}>
              <input
                className="champ__input"
                id="dispo-fin"
                name="fin"
                type="date"
                min={champs.debut || undefined}
                value={champs.fin}
                onChange={(e) => changer({ fin: e.target.value }, 'fin')}
                onBlur={() => quitter('fin')}
                {...aria('fin', 'dispo-fin')}
              />
            </Champ>

            <Champ label="Type d’événement" pour="dispo-type" erreur={erreurs.type}>
              <select
                className="champ__select"
                id="dispo-type"
                name="type"
                value={champs.type}
                onChange={(e) => changer({ type: e.target.value }, 'type')}
                onBlur={() => quitter('type')}
                {...aria('type', 'dispo-type')}
              >
                <option value="">Choisir</option>
                {TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Champ>

            <Champ
              label="Nombre de personnes"
              pour="dispo-personnes"
              erreur={erreurs.personnes}
            >
              <select
                className="champ__select"
                id="dispo-personnes"
                name="personnes"
                value={champs.personnes}
                onChange={(e) => changer({ personnes: e.target.value }, 'personnes')}
                onBlur={() => quitter('personnes')}
                {...aria('personnes', 'dispo-personnes')}
              >
                <option value="">Choisir</option>
                {PERSONNES.map((personnes) => (
                  <option key={personnes} value={personnes}>
                    {personnes}
                  </option>
                ))}
              </select>
            </Champ>
          </div>

          {/* Le matériel : un groupe de cases, avec sa légende. */}
          <fieldset
            className="champ dispo__materiel"
            aria-describedby={erreurs.materiel ? 'dispo-materiel-erreur' : undefined}
          >
            <legend className="champ__label">
              Matériel souhaité
              <span className="champ__requis" aria-hidden="true">
                {' '}
                *
              </span>
            </legend>
            <div className="dispo__cases">
              {MATERIELS.map((materiel, rang) => (
                <label className="case" key={materiel}>
                  <input
                    className="case__input"
                    id={rang === 0 ? 'dispo-materiel' : undefined}
                    type="checkbox"
                    name="materiel"
                    value={materiel}
                    checked={champs.materiel.includes(materiel)}
                    onChange={(e) =>
                      changer(
                        {
                          materiel: e.target.checked
                            ? [...champs.materiel, materiel]
                            : champs.materiel.filter((m) => m !== materiel),
                        },
                        'materiel',
                      )
                    }
                    aria-invalid={erreurs.materiel ? true : undefined}
                  />
                  <span className="case__marque" aria-hidden="true" />
                  <span className="case__texte">{materiel}</span>
                </label>
              ))}
            </div>
            <div className="champ__erreur-zone" id="dispo-materiel-erreur" aria-live="polite">
              {erreurs.materiel ? <p className="champ__erreur">{erreurs.materiel}</p> : null}
            </div>
          </fieldset>

          <Champ label="Message" pour="dispo-message" facultatif>
            <textarea
              className="champ__input champ__zone"
              id="dispo-message"
              name="message"
              placeholder="Ce que vous avez déjà en tête : horaires, accès, contraintes du lieu…"
              value={champs.message}
              onChange={(e) => changer({ message: e.target.value }, 'message')}
            />
          </Champ>

          {/* Le consentement : le même que sur le formulaire de contact. */}
          <div className="champ">
            <label className="case">
              <input
                className="case__input"
                id="dispo-consentement"
                type="checkbox"
                name="consentement"
                checked={champs.consentement}
                onChange={(e) =>
                  changer({ consentement: e.target.checked }, 'consentement')
                }
                onBlur={() => quitter('consentement')}
                aria-invalid={erreurs.consentement ? true : undefined}
                aria-describedby={
                  erreurs.consentement
                    ? 'dispo-consentement-aide dispo-consentement-erreur'
                    : 'dispo-consentement-aide'
                }
              />
              <span className="case__marque" aria-hidden="true" />
              <span className="case__texte">
                J’accepte qu’Oysen utilise ces informations pour répondre à ma
                demande.
                <span className="champ__requis" aria-hidden="true">
                  {' '}
                  *
                </span>
              </span>
            </label>
            <p className="champ__aide champ__aide--case" id="dispo-consentement-aide">
              Vos informations ne sont ni revendues ni utilisées pour de la
              prospection.{' '}
              <Lien className="dispo__lien" href="/politique-de-confidentialite">
                Politique de confidentialité
              </Lien>
            </p>
            <div
              className="champ__erreur-zone"
              id="dispo-consentement-erreur"
              aria-live="polite"
            >
              {erreurs.consentement ? (
                <p className="champ__erreur">{erreurs.consentement}</p>
              ) : null}
            </div>
          </div>

          <div className="dispo__actions">
            <button className="btn btn--solid" type="submit" disabled={envoi}>
              {envoi ? 'Envoi en cours…' : 'Vérifier une disponibilité'}
            </button>
            <p className="dispo__note">
              <span className="champ__requis" aria-hidden="true">
                *
              </span>{' '}
              Champs obligatoires
            </p>
          </div>
        </form>
      </div>
    </section>
  )
}

/* ---- Données structurées : le service, la FAQ, le fil d'Ariane ---- */

const ADRESSE = '/nos-services/location-de-materiel'

const DONNEES_STRUCTUREES = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Location de matériel son, lumière et structures',
      serviceType: 'Location de sonorisation, d’éclairage et de structures pour événements',
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
        { '@type': 'ListItem', position: 3, name: 'Location de matériel', item: ADRESSE },
      ],
    },
  ],
}
