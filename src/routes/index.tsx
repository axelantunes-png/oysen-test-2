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
  NB_AVIS_GOOGLE,
  NB_PARTENAIRES,
  NOTE_GOOGLE,
  RC_PRO,
  ZONE,
} from '../components/home/content'

export const Route = createFileRoute('/')({
  component: Home,
})

const LOGO = '/logo-oysen-provisoire.jpeg'
const TAGLINE = 'ARCHITECTE D’ÉVÉNEMENTS'

/**
 * La dernière ligne du titre tourne. « Inoubliables » ouvre toujours la
 * séquence : c'est la promesse principale, les deux autres la nuancent.
 *
 * Accordés au pluriel avec « souvenirs », et ponctués : le point voyage avec
 * le mot, sinon il flotterait à droite de la boîte à largeur fixe.
 */
const MOTS = ['inoubliables.', 'spectaculaires.', 'surprenants.']

/** Le plus long : il fixe la largeur, la ligne ne bouge donc jamais. */
const MOT_LE_PLUS_LONG = 'spectaculaires.'

const CYCLE_MS = 2800

/*
 * Quand la rotation démarre. Le rideau part à 4 s (intro) + 1,21 s
 * (balayage) et met 1,2 s à se lever ; le titre suit 0,12 s plus tard et met
 * 0,7 s à apparaître. La phrase est donc en place à 7,23 s, et les mots
 * commencent à tourner deux secondes après. Ces valeurs viennent de
 * `app.css` (--intro, --gloss-sweep, --rise, --hero-pas, --hero-fondu) : à
 * changer des deux côtés.
 */
const RIDEAU_MS = 4000 + 1210 + 1200
const PHRASE_MS = 120 + 700
const ATTENTE_MS = 2000
const DEPART_MOTS_MS = RIDEAU_MS + PHRASE_MS + ATTENTE_MS

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
    }, DEPART_MOTS_MS)

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

/**
 * La scène est 3x plus large que le logo : les faisceaux peuvent balayer
 * hors cadre pendant que le logo, lui, reste affiché à sa résolution
 * native (973x542) et donc parfaitement net.
 */
const SCENE_W = 2919
const SCENE_H = 1626
const IMG_X = 973
const IMG_Y = 542
const IMG_W = 973
const IMG_H = 542

/** Repère image -> repère scène. */
const sx = (x: number) => IMG_X + x
const sy = (y: number) => IMG_Y + y

/**
 * Chaque faisceau est un projecteur monté au sommet de sa propre branche
 * du Y et braqué vers le point de convergence (322, 283). Positions et
 * angles de repos dans app.css (pivot--l / --r / --d).
 */
const BEAM_LEN = 1500
const BEAM_HALF = 158 // demi-angle du cône visible : ~6deg, comme sur le JPEG
/**
 * Le cône du masque est bien plus large que le faisceau visible : la
 * lumière « déborde » et éclaire le logo au-delà du trait lui-même.
 */
const MASK_HALF = 330

/** Ancienne baseline du JPEG, mesurée au pixel : x 393-813, y 384-410. */
const ERASE = { x: sx(360), y: sy(376), w: 470, h: 44 }

/**
 * La rustine est prélevée dans la bande unie du haut du JPEG (y 20-64),
 * au-dessus des faisceaux, puis redescendue sur l'ancienne baseline.
 * 44px de haut, soit exactement la hauteur à couvrir.
 */
const PATCH_SRC_Y = 20
const PATCH_DY = 376 - PATCH_SRC_Y

const BEAMS = ['l', 'r', 'd'] as const

/** Les trois pivots, réutilisés à l'identique pour le masque et pour la lumière. */
function Pivots({ shape }: { shape: string }) {
  return (
    <>
      {BEAMS.map((b) => (
        <g key={b} className={`pivot pivot--${b}`}>
          <use href={shape} />
        </g>
      ))}
    </>
  )
}

/** Le rideau : l'intro aux projecteurs, qui se lève ensuite sur le site. */
function IntroCurtain() {
  return (
    <div className="stage" aria-hidden="true">
      <svg className="scene" viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}>
        <defs>
          {/*
            La lumière est vive à la lampe (offset 0) et s'éteint à 0.62 :
            au repos le faisceau couvre exactement sa branche sans déborder
            au-delà du point de convergence.
          */}
          <linearGradient
            id="g-halo"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="0"
            y2={-BEAM_LEN}
          >
            <stop offset="0" stopColor="#cdb8ff" stopOpacity="0.30" />
            <stop offset="0.12" stopColor="#c3aaff" stopOpacity="0.24" />
            <stop offset="0.35" stopColor="#b79cff" stopOpacity="0.12" />
            <stop offset="0.55" stopColor="#b79cff" stopOpacity="0.04" />
            <stop offset="0.7" stopColor="#b79cff" stopOpacity="0.008" />
            <stop offset="0.8" stopColor="#b79cff" stopOpacity="0" />
          </linearGradient>

          <linearGradient
            id="g-mid"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="0"
            y2={-BEAM_LEN}
          >
            <stop offset="0" stopColor="#f0e8ff" stopOpacity="0.55" />
            <stop offset="0.1" stopColor="#e7dbff" stopOpacity="0.50" />
            <stop offset="0.3" stopColor="#d9c8ff" stopOpacity="0.30" />
            <stop offset="0.48" stopColor="#d9c8ff" stopOpacity="0.10" />
            <stop offset="0.6" stopColor="#d9c8ff" stopOpacity="0.015" />
            <stop offset="0.68" stopColor="#d9c8ff" stopOpacity="0" />
          </linearGradient>

          <linearGradient
            id="g-core"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="0"
            y2={-BEAM_LEN}
          >
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="0.08" stopColor="#fdfaff" stopOpacity="0.85" />
            <stop offset="0.25" stopColor="#f3ecff" stopOpacity="0.55" />
            <stop offset="0.42" stopColor="#eee4ff" stopOpacity="0.22" />
            <stop offset="0.55" stopColor="#eee4ff" stopOpacity="0.05" />
            <stop offset="0.62" stopColor="#eee4ff" stopOpacity="0" />
          </linearGradient>

          <linearGradient
            id="g-mask"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="0"
            y2={-BEAM_LEN}
          >
            <stop offset="0" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.15" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="0.35" stopColor="#fff" stopOpacity="0.7" />
            <stop offset="0.55" stopColor="#fff" stopOpacity="0.3" />
            <stop offset="0.72" stopColor="#fff" stopOpacity="0.06" />
            <stop offset="0.85" stopColor="#fff" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="g-bloom">
            <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
            <stop offset="0.35" stopColor="#e3d2ff" stopOpacity="0.28" />
            <stop offset="1" stopColor="#c9aaff" stopOpacity="0" />
          </radialGradient>

          {/* Bande de brillance, en diagonale. */}
          <linearGradient id="g-gloss" gradientTransform="rotate(16 0.5 0.5)">
            <stop offset="0.38" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.44" stopColor="#fff" stopOpacity="0.32" />
            <stop offset="0.48" stopColor="#fff" stopOpacity="0.82" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="0.52" stopColor="#fff" stopOpacity="0.82" />
            <stop offset="0.56" stopColor="#fff" stopOpacity="0.32" />
            <stop offset="0.62" stopColor="#fff" stopOpacity="0" />
          </linearGradient>

          {/*
            Écrase le violet vers le noir et pousse le blanc vers le blanc :
            le masque « ink » qui en découle isole donc uniquement l'encre
            claire du logo. Le violet #5a1e76 tombe à 0, le blanc reste à 1.
          */}
          <filter id="ink-boost" colorInterpolationFilters="sRGB">
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer result="ink">
              <feFuncR type="linear" slope="3.2" intercept="-0.62" />
              <feFuncG type="linear" slope="3.2" intercept="-0.62" />
              <feFuncB type="linear" slope="3.2" intercept="-0.62" />
            </feComponentTransfer>
            {/*
              Un halo flou vient s'ajouter à l'encre nette. Le blanc du
              lettrage est déjà quasi saturé : un fondu additif ne s'y voit
              presque pas. En laissant la brillance déborder de quelques
              pixels sur le violet, elle gagne le relief qui lui manquait.
            */}
            <feGaussianBlur in="ink" stdDeviation="4.5" result="halo" />
            <feMerge>
              <feMergeNode in="halo" />
              <feMergeNode in="ink" />
            </feMerge>
          </filter>

          {/* Le faisceau visible : halo large + corps + coeur brillant. */}
          <g id="beam">
            <polygon
              points={`0,0 ${-BEAM_HALF},${-BEAM_LEN} ${BEAM_HALF},${-BEAM_LEN}`}
              fill="url(#g-halo)"
            />
            <polygon
              points={`0,0 ${-BEAM_HALF * 0.5},${-BEAM_LEN} ${BEAM_HALF * 0.5},${-BEAM_LEN}`}
              fill="url(#g-mid)"
            />
            <polygon
              points={`0,0 ${-BEAM_HALF * 0.17},${-BEAM_LEN} ${BEAM_HALF * 0.17},${-BEAM_LEN}`}
              fill="url(#g-core)"
            />
          </g>

          {/* Fenêtre de la rustine : exactement l'ancienne baseline. */}
          <clipPath id="erase-clip">
            <rect
              x={ERASE.x}
              y={ERASE.y}
              width={ERASE.w}
              height={ERASE.h}
            />
          </clipPath>

          <g id="beam-mask">
            <polygon
              points={`0,0 ${-MASK_HALF},${-BEAM_LEN} ${MASK_HALF},${-BEAM_LEN}`}
              fill="url(#g-mask)"
            />
          </g>

          {/*
            Le logo, son ancienne baseline recouverte, et la nouvelle en vrai
            texte.

            La rustine n'est PAS un aplat de couleur : c'est une bande unie
            prélevée en haut du JPEG lui-même, redescendue sur l'ancienne
            baseline. Un aplat #5a1e76 semblait pourtant exact — il l'était
            sur desktop — mais le JPEG ne porte aucun profil ICC : sur les
            écrans grand gamut (iPhone), Safari ne lui applique pas la même
            transformation couleur qu'à un fill SVG, réputé sRGB. Les deux
            violets divergeaient et le rectangle réapparaissait. En prenant
            les pixels dans l'image, la rustine subit exactement le même
            traitement que ce qui l'entoure : l'écart devient impossible.
          */}
          <g id="wordmark">
            <image
              href={LOGO}
              x={IMG_X}
              y={IMG_Y}
              width={IMG_W}
              height={IMG_H}
            />
            <g clipPath="url(#erase-clip)">
              <image
                href={LOGO}
                x={IMG_X}
                y={IMG_Y + PATCH_DY}
                width={IMG_W}
                height={IMG_H}
              />
            </g>
            <text className="tagline" x={sx(813)} y={sy(410)} textAnchor="end">
              {TAGLINE}
            </text>
          </g>

          {/*
            Le logo n'apparaît que là où passent les faisceaux, puis le
            rideau s'ouvre sur toute la scène. Le violet de fond fait partie
            du calque révélé : la lumière ne bute donc plus sur le bord de
            l'image, ce qui faisait apparaître un « cadre ».
          */}
          <mask id="reveal" maskUnits="userSpaceOnUse">
            <rect
              className="curtain"
              x="0"
              y="0"
              width={SCENE_W}
              height={SCENE_H}
              fill="#fff"
            />
            <Pivots shape="#beam-mask" />
          </mask>

          {/* Masque de luminance : ne laisse passer que l'encre claire. */}
          <mask
            id="ink"
            maskUnits="userSpaceOnUse"
            style={{ maskType: 'luminance' }}
          >
            <g filter="url(#ink-boost)">
              <use href="#wordmark" />
            </g>
          </mask>
        </defs>

        <g mask="url(#reveal)">
          <rect x="0" y="0" width={SCENE_W} height={SCENE_H} fill="#5a1e76" />
          <use href="#wordmark" />
        </g>

        {/* La lumière elle-même, en mode additif. */}
        <g className="beams">
          <Pivots shape="#beam" />
          <ellipse
            className="bloom"
            cx={sx(322)}
            cy={sy(283)}
            rx="300"
            ry="300"
            fill="url(#g-bloom)"
          />
        </g>

        {/* Brillance sur l'encre claire, une fois l'intro finie. */}
        <g className="gloss-layer" mask="url(#ink)">
          <rect
            className="gloss"
            x="0"
            y={IMG_Y}
            width={SCENE_W}
            height={IMG_H}
            fill="url(#g-gloss)"
          />
        </g>
      </svg>
    </div>
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
              Organisation d’événements
              <span aria-hidden="true">·</span>
              {ZONE}
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
              <span className="sr-only"> sur 5</span> sur Google (
              {NB_AVIS_GOOGLE} avis)
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

      <IntroCurtain />
    </>
  )
}
