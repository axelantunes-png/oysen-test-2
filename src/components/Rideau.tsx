import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

/*
 * Le rideau d'intro : le logo révélé par trois projecteurs, puis levé sur
 * la page. Minutage et positions des projecteurs dans app.css.
 */

/**
 * Le logo définitif : blanc sur fond transparent. Le rideau prend une copie
 * en WebP de 1650 × 1100 (logo-oysen.png fait 3000 × 2000) : affiché à 815px
 * au plus, il reste net jusqu'à deux pixels d'écran par pixel, et pèse 64 Ko
 * au lieu de 244. Toutes les mesures plus bas restent celles du PNG.
 */
const LOGO = '/images/logo-oysen-rideau-1650.webp'

/**
 * L'encre du logo et son halo, figés : ce que donnait le filtre ink-boost
 * (encre isolée, flou de 4.5, puis l'encre nette par-dessus), enregistré une
 * fois pour toutes. Le filtre était recalculé à chaque image de l'animation,
 * alors que son résultat ne bouge jamais. À refaire si le logo change.
 */
const ENCRE = '/images/logo-oysen-rideau-encre-1650.webp'

/**
 * La scène est 3x plus large que le cadre du logo : les faisceaux peuvent
 * balayer hors cadre. Le repère (cadre de 973 × 542 au centre) est celui de
 * l'ancien logo provisoire : les pivots et les courses des projecteurs, dans
 * app.css, y sont écrits au pixel, et le logo définitif y est posé sans
 * rien déplacer.
 */
const SCENE_W = 2919
const SCENE_H = 1626
const IMG_X = 973
const IMG_Y = 542

/**
 * Le logo définitif dans ce repère. Mesuré au pixel sur les deux fichiers :
 * le mot va du bord du O (x 171) au bord du N (x 2660) dans le PNG, et de
 * 132 à 808 dans l'ancien cadre. À cette échelle, les lampes du Y tombent
 * sur les pivots des projecteurs à un pixel près : (1220, 651) et
 * (1372, 651), pour (1219, 652) et (1373, 652) dans app.css.
 */
const LOGO_ECHELLE = (808 - 132) / (2660 - 171)
const LOGO_X = IMG_X + 132 - 171 * LOGO_ECHELLE
const LOGO_Y = IMG_Y + 201 - 638 * LOGO_ECHELLE
const LOGO_W = 3000 * LOGO_ECHELLE
const LOGO_H = 2000 * LOGO_ECHELLE

/**
 * Le cœur du Y, là où les trois faisceaux se rejoignent au repos (x 870,
 * y 940 dans le PNG). Les deux faisceaux du haut y suivent l'axe de leur
 * bras à quelques pixels près sur toute la longueur.
 */
const CONVERGENCE = {
  x: LOGO_X + 870 * LOGO_ECHELLE,
  y: LOGO_Y + 940 * LOGO_ECHELLE,
}

/**
 * Chaque faisceau est un projecteur monté au sommet de sa propre branche
 * du Y et braqué vers le point de convergence. Positions et
 * angles de repos dans app.css (pivot--l / --r / --d).
 */
const BEAM_LEN = 1500
const BEAM_HALF = 158 // demi-angle du cône visible : ~6deg, comme sur le JPEG
/**
 * Le cône du masque est bien plus large que le faisceau visible : la
 * lumière « déborde » et éclaire le logo au-delà du trait lui-même.
 */
const MASK_HALF = 330

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

/**
 * Le rideau : l'intro aux projecteurs, qui se lève ensuite sur le site.
 *
 * Posé dans la racine, il existe sur toutes les pages. Il ne se joue qu'à
 * l'arrivée sur le site ou au rechargement : le script de la racine
 * (RIDEAU_SCRIPT) le coupe avant le premier affichage quand on vient d'une
 * autre page du site.
 */
export function IntroCurtain() {
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

          {/* Le logo, tel quel : le fichier définitif n'a plus rien à masquer. */}
          <g id="wordmark">
            <image
              href={LOGO}
              x={LOGO_X}
              y={LOGO_Y}
              width={LOGO_W}
              height={LOGO_H}
            />
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

          {/*
            Masque de luminance : ne laisse passer que l'encre claire, et
            un halo flou autour. Le blanc du lettrage est déjà quasi saturé :
            un fondu additif ne s'y voit presque pas. En laissant la
            brillance déborder de quelques pixels sur le violet, elle gagne
            le relief qui lui manquait. Encre et halo sont figés dans ENCRE.
          */}
          <mask
            id="ink"
            maskUnits="userSpaceOnUse"
            style={{ maskType: 'luminance' }}
          >
            <image
              href={ENCRE}
              x={LOGO_X}
              y={LOGO_Y}
              width={LOGO_W}
              height={LOGO_H}
            />
          </mask>
        </defs>

        <g mask="url(#reveal)">
          <rect x="0" y="0" width={SCENE_W} height={SCENE_H} fill="#5a2677" />
          <use href="#wordmark" />
        </g>

        {/* La lumière elle-même, en mode additif. */}
        <g className="beams">
          <Pivots shape="#beam" />
          <ellipse
            className="bloom"
            cx={CONVERGENCE.x}
            cy={CONVERGENCE.y}
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
            y={LOGO_Y}
            width={SCENE_W}
            height={LOGO_H}
            fill="url(#g-gloss)"
          />
        </g>
      </svg>
    </div>
  )
}

/**
 * Décide, avant le premier affichage, si le rideau se joue.
 *
 * Il se joue à l'arrivée sur le site (lien externe, adresse tapée, favori)
 * et au rechargement. Il ne se joue pas quand on vient d'une autre page du
 * site, ni sur un retour arrière, ni pour qui demande moins d'animations
 * (app.css le masque déjà pour eux). Dans ces cas, `data-rideau="non"` sur
 * <html> le retire et ramène à zéro le délai des entrées qui l'attendaient
 * (--apres-rideau, app.css).
 *
 * Sans JavaScript, rien n'est posé : le rideau se joue, comme avant.
 */
export const RIDEAU_SCRIPT = `(function () {
  try {
    var nav = performance.getEntriesByType('navigation')[0];
    var type = nav ? nav.type : 'navigate';
    var interne = false;
    try {
      interne = !!document.referrer &&
        new URL(document.referrer).origin === location.origin;
    } catch (e) {}
    var joue = type === 'reload' || (type === 'navigate' && !interne);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) joue = false;
    if (!joue) document.documentElement.setAttribute('data-rideau', 'non');
  } catch (e) {}
})();`

/** Le rideau se joue-t-il sur ce chargement ? À lire côté navigateur. */
export function rideauJoue() {
  return document.documentElement.dataset.rideau !== 'non'
}

/**
 * Changer de page ne recharge plus le document : RIDEAU_SCRIPT ne repasse
 * pas, et les heros attendraient encore la levée d'un rideau qui ne se joue
 * plus (--apres-rideau). Dès le premier changement de page, avant que la
 * suivante ne s'affiche, on pose donc `data-rideau="non"` comme le script
 * l'aurait fait : plus de rideau, plus rien à attendre.
 */
export function useRideauApresNavigation() {
  const router = useRouter()

  useEffect(
    () =>
      router.subscribe('onBeforeNavigate', (evenement) => {
        if (evenement.pathChanged) {
          document.documentElement.dataset.rideau = 'non'
        }
      }),
    [router],
  )
}
