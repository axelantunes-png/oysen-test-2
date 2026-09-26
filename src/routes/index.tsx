import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { Appel } from '../components/home/Appel'
import { Faq } from '../components/home/Faq'
import { Guide } from '../components/home/Guide'
import { Methode } from '../components/home/Methode'
import { Preuves } from '../components/home/Preuves'
import { Probleme } from '../components/home/Probleme'
import { Reassurance } from '../components/home/Reassurance'
import { Realisations } from '../components/home/Realisations'
import { Tri } from '../components/home/Tri'
import {
  NB_PARTENAIRES,
  NOTE_GOOGLE,
  RC_PRO,
  ZONE,
} from '../components/home/content'
import { rideauJoue } from '../components/Rideau'

export const Route = createFileRoute('/')({
  component: Home,
})

/**
 * La dernière ligne du titre tourne. « Inoubliables » ouvre toujours la
 * séquence : c'est la promesse principale, les deux autres la nuancent.
 *
 * Accordés au pluriel avec « souvenirs », sans ponctuation finale.
 */
const MOTS = ['inoubliables', 'spectaculaires', 'surprenants']

/** Le plus long : il fixe la largeur, la ligne ne bouge donc jamais. */
const MOT_LE_PLUS_LONG = 'spectaculaires'

const CYCLE_MS = 2800

/*
 * Quand la rotation démarre. Le rideau part à 3,2 s (intro) + 0,968 s
 * (balayage) et met 0,96 s à se lever ; le titre suit 0,12 s plus tard et met
 * 0,7 s à apparaître. La phrase est donc en place à 5,948 s, et les mots
 * commencent à tourner deux secondes après. Ces valeurs viennent de
 * `app.css` (--intro, --gloss-sweep, --rise, --hero-pas, --hero-fondu) : à
 * changer des deux côtés. Quand le rideau ne se joue pas (on arrive d'une
 * autre page du site), il ne compte plus.
 */
const RIDEAU_MS = 3200 + 968 + 960
const PHRASE_MS = 120 + 700
const ATTENTE_MS = 2000

/**
 * Un mot en remplace un autre comme on change de plan d'éclairage : l'ancien
 * s'éteint en montant, le suivant s'allume en arrivant par en dessous.
 *
 * Les mots sont masqués aux lecteurs d'écran — un titre qui se réécrit
 * toutes les trois secondes est illisible à l'oreille. Une version fixe leur
 * est servie à côté.
 */
function MotQuiTourne() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    /* Un texte qui se remplace tout seul est un mouvement : on s'abstient. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const suivant = () => setIndex((courant) => (courant + 1) % MOTS.length)

    /*
     * Le premier mot tient la phrase pendant deux secondes : le temps de la
     * lire une fois avant qu'elle ne se mette à changer.
     */
    let cycle: ReturnType<typeof setInterval> | undefined

    const depart = setTimeout(() => {
      suivant()
      cycle = setInterval(suivant, CYCLE_MS)
    }, (rideauJoue() ? RIDEAU_MS : 0) + PHRASE_MS + ATTENTE_MS)

    return () => {
      clearTimeout(depart)
      if (cycle) clearInterval(cycle)
    }
  }, [])

  return (
    <span className="hero__cycle">
      <span className="hero__cycle-sizer" aria-hidden="true">
        {MOT_LE_PLUS_LONG}
      </span>

      {MOTS.map((mot, i) => (
        <span
          key={mot}
          className={`hero__cycle-word${i === index ? ' is-current' : ''}`}
          aria-hidden="true"
        >
          {mot}
        </span>
      ))}

      <span className="sr-only">{MOTS[0]}</span>
    </span>
  )
}

/*
 * S1 — Hero.
 *
 * Un aiguillage, pas une page de vente : le surtitre situe l'activité et la
 * zone, le H1 porte le bénéfice commun aux cinq cibles, le sous-titre pose
 * le périmètre et lève l'objection du « combien d'interlocuteurs ? », puis
 * deux sorties seulement. Le bandeau de faits ferme le bloc.
 */
function Home() {
  return (
    <>
      <main>
        <section className="hero" aria-label="Oysen, architecte d’événements">
          {/*
            Photo d'ambiance, purement décorative : alt vide, les lecteurs
            d'écran l'ignorent. Deux tailles, le navigateur prend la plus
            petite qui couvre l'écran.
          */}
          <img
            className="hero__photo"
            src="/images/hero-1920.jpg"
            srcSet="/images/hero-1280.jpg 1280w, /images/hero-1920.jpg 1920w"
            sizes="100vw"
            width={1920}
            height={1280}
            alt=""
            decoding="async"
          />

          {/*
            Les trois projecteurs du rideau, restés allumés une fois l'intro
            finie. Purement décoratifs : la page se lit sans eux.
          */}
          <span className="hero__lights" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>

          <div className="hero__inner">
            <p className="hero__eyebrow">
              Agence événementielle à {ZONE}
            </p>

            <h1 className="hero__title">
              Vivez vos événements simplement.
              <span className="hero__title-payoff">
                Créez des souvenirs
                <MotQuiTourne />
              </span>
            </h1>

            <p className="hero__lede">
              Nous cherchons le lieu, sélectionnons les prestataires,
              coordonnons la technique et pilotons le jour J.
              <strong className="hero__lede-claim">
                Oysen s’occupe de tout.
              </strong>
            </p>

            <div className="hero__actions">
              <a className="btn btn--solid" href="/contact">
                Imaginer mon événement
              </a>
              <a className="btn btn--ghost" href="/nos-souvenirs">
                Voir nos souvenirs
              </a>
            </div>
          </div>

          {/* Trois faits vérifiables, disponibles dès le lancement. */}
          <ul className="hero__proof">
            <li>
              {NOTE_GOOGLE}
              <span className="hero__star" aria-hidden="true">
                ★
              </span>
              <span className="sr-only"> sur 5</span> sur Google
            </li>
            <li>Parc matériel en propre</li>
            <li>{NB_PARTENAIRES} prestataires partenaires</li>
            <li>RC pro {RC_PRO}</li>
          </ul>
        </section>

        {/*
          L'ordre suit le raisonnement, pas l'envie de parler de soi : on
          aiguille d'abord, on nomme la douleur ensuite, et Oysen n'apparaît
          qu'après. La FAQ passe avant l'appel final — on lève les dernières
          objections juste avant de demander, et la page se termine sur
          l'action.
        */}
        <Tri />
        <Probleme />
        <Guide />
        <Reassurance />
        <Methode />
        <Preuves />
        <Realisations />
        <Faq />
        <Appel />
      </main>

    </>
  )
}
