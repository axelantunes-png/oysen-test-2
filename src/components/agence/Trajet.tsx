/*
 * Le tracé de « Notre histoire » : deux voies qui descendent le long des
 * quatre étapes, la scène à gauche et le chantier à droite, et la
 * trajectoire du fondateur qui passe de l'une à l'autre avant de les
 * réunir. Aucun texte sur le rail : les voies sont nommées dans la légende,
 * au-dessus.
 *
 *   01  sur la scène, le chantier en parallèle (les études)
 *   02  la scène s'arrête (tireté), la trajectoire descend au chantier
 *   03  sur le chantier, la scène toujours à l'arrêt
 *   04  les deux voies convergent : le losange, Oysen
 *
 * Chaque étape porte son propre segment. Les segments se touchent bord à
 * bord, la ligne paraît donc continue d'une étape à l'autre, et chaque
 * changement de voie tombe dans l'étape qui le raconte, quelle que soit la
 * hauteur de son texte.
 *
 * Le dessin est écrit à l'horizontale (le temps de 0 à 100, les voies de 0
 * à 60), puis couché à la verticale : le rail descend le long des étapes.
 * Le SVG est étiré à la hauteur de son étape : l'épaisseur des traits est
 * donc fixée à l'écran (non-scaling-stroke), et les marques rondes sont
 * posées en HTML.
 */

type Commande = [string, ...number[]]

type Segment = {
  scene: Commande[]
  /** La scène à l'arrêt : l'événementiel stoppé net par la crise. */
  sceneArret?: boolean
  chantier: Commande[]
  trajet: Commande[]
}

const SCENE = 15
const CHANTIER = 45
const JONCTION = 30

const SCENE_DROITE: Commande[] = [
  ['M', 0, SCENE],
  ['L', 100, SCENE],
]
const CHANTIER_DROIT: Commande[] = [
  ['M', 0, CHANTIER],
  ['L', 100, CHANTIER],
]

const SEGMENTS: readonly Segment[] = [
  {
    scene: SCENE_DROITE,
    chantier: CHANTIER_DROIT,
    trajet: SCENE_DROITE,
  },
  {
    scene: SCENE_DROITE,
    sceneArret: true,
    chantier: CHANTIER_DROIT,
    trajet: [
      ['M', 0, SCENE],
      ['L', 10, SCENE],
      ['C', 35, SCENE, 35, CHANTIER, 60, CHANTIER],
      ['L', 100, CHANTIER],
    ],
  },
  {
    scene: SCENE_DROITE,
    sceneArret: true,
    chantier: CHANTIER_DROIT,
    trajet: CHANTIER_DROIT,
  },
  {
    scene: [
      ['M', 0, SCENE],
      ['C', 40, SCENE, 50, JONCTION, 70, JONCTION],
    ],
    chantier: [
      ['M', 0, CHANTIER],
      ['C', 40, CHANTIER, 50, JONCTION, 70, JONCTION],
    ],
    trajet: [
      ['M', 0, CHANTIER],
      ['C', 40, CHANTIER, 50, JONCTION, 70, JONCTION],
      ['L', 100, JONCTION],
    ],
  },
]

/**
 * Écrit le chemin à la verticale : les axes sont échangés, le temps descend
 * et les voies vont de gauche à droite.
 */
function chemin(commandes: Commande[]) {
  return commandes
    .map(([lettre, ...nombres]) => {
      const points: number[] = []
      for (let i = 0; i < nombres.length; i += 2) {
        points.push(nombres[i + 1] ?? 0, nombres[i] ?? 0)
      }
      return `${lettre}${points.join(' ')}`
    })
    .join(' ')
}

/** Le segment d'une étape, sur toute sa hauteur. */
export function Trajet({ etape }: { etape: number }) {
  const segment = SEGMENTS[etape]
  if (!segment) return null

  return (
    <div className="trajet" aria-hidden="true">
      <svg
        className="trajet__svg"
        viewBox="0 0 60 100"
        preserveAspectRatio="none"
        focusable="false"
      >
        <path
          className={
            segment.sceneArret
              ? 'trajet__voie trajet__voie--scene trajet__voie--arret'
              : 'trajet__voie trajet__voie--scene'
          }
          d={chemin(segment.scene)}
          vectorEffect="non-scaling-stroke"
        />
        <path
          className="trajet__voie trajet__voie--chantier"
          d={chemin(segment.chantier)}
          vectorEffect="non-scaling-stroke"
        />
        <path
          className="trajet__ligne"
          d={chemin(segment.trajet)}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {etape === 0 && <span className="trajet__depart" />}

      {etape === 3 && (
        <>
          <span className="trajet__losange" />
          <span className="trajet__nom">Oysen</span>
        </>
      )}
    </div>
  )
}
