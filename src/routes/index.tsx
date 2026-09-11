import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

const LOGO = '/logo-oysen-provisoire.jpeg'
const TAGLINE = 'ARCHITECTE D’ÉVÉNEMENTS'

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

const BEAMS = ['l', 'r', 'd'] as const

const NAV_LINKS = [
  { href: '#prestations', label: 'Prestations' },
  { href: '#realisations', label: 'Réalisations' },
  { href: '#agence', label: 'L’agence' },
  { href: '#contact', label: 'Contact' },
]

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

          <g id="beam-mask">
            <polygon
              points={`0,0 ${-MASK_HALF},${-BEAM_LEN} ${MASK_HALF},${-BEAM_LEN}`}
              fill="url(#g-mask)"
            />
          </g>

          {/*
            Le logo, son ancienne baseline recouverte d'un aplat violet, et
            la nouvelle baseline en vrai texte. Le JPEG ne porte aucun profil
            ICC (marqueur JFIF seul), il est donc rendu en sRGB brut : le
            #5a1e76 de l'aplat correspond exactement au violet de l'image et
            le raccord est invisible.
          */}
          <g id="wordmark">
            <image
              href={LOGO}
              x={IMG_X}
              y={IMG_Y}
              width={IMG_W}
              height={IMG_H}
            />
            <rect
              x={ERASE.x}
              y={ERASE.y}
              width={ERASE.w}
              height={ERASE.h}
              fill="#5a1e76"
            />
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

function Home() {
  return (
    <>
      <header className="nav">
        <a className="nav__brand" href="/">
          OYSEN
        </a>
        <nav className="nav__links" aria-label="Navigation principale">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <a className="nav__cta" href="#contact">
          Demander un devis
        </a>
      </header>

      <main className="hero">
        <p className="hero__eyebrow">Architecte d’événements</p>
        <h1 className="hero__title">
          Nous dessinons des événements
          <br />
          dont on se souvient.
        </h1>
        <p className="hero__lede">
          De la première intention à la dernière lumière, Oysen conçoit et
          orchestre vos lancements, conventions et célébrations privées.
        </p>
        <div className="hero__actions">
          <a className="btn btn--solid" href="#contact">
            Parler de votre projet
          </a>
          <a className="btn btn--ghost" href="#realisations">
            Voir nos réalisations
          </a>
        </div>
      </main>

      <IntroCurtain />
    </>
  )
}
