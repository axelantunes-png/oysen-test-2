import type { CSSProperties } from 'react'

/*
 * Le schéma de « Notre approche » : un triangle de structure.
 *
 * Le texte dit « tenir trois choses ensemble ». En ingénierie, le triangle
 * est la seule forme qui ne se déforme pas : c'est pour cela qu'on triangule
 * les charpentes. Le schéma est donc dessiné comme un treillis, trois
 * membrures, trois diagonales vers le centre, un nœud à chaque sommet. Au
 * centre, là où tout se rejoint, le losange d'Oysen : le projet.
 *
 * Unités : viewBox de 400 × 340, triangle équilatéral de 260 de côté.
 */

const A = { x: 200, y: 74.8 }
const B = { x: 70, y: 300 }
const C = { x: 330, y: 300 }
/** Le centre de gravité : là où les trois diagonales se rejoignent. */
const G = { x: 200, y: (A.y + B.y + C.y) / 3 }

/** Le moment où chaque trait se trace, en secondes (voir agence.css). */
function temps(t: number) {
  return { '--t': `${t}s` } as CSSProperties
}

export function Triangle() {
  return (
    <svg
      className="schema__svg"
      viewBox="0 0 400 340"
      role="img"
      aria-labelledby="schema-titre"
    >
      <title id="schema-titre">
        Un triangle qui tient ensemble vos attentes, la technique et
        l’émotion, autour du projet.
      </title>

      {/* Les trois membrures. */}
      <path
        className="schema__trace schema__membrure"
        style={temps(0)}
        pathLength={1}
        d={`M${A.x} ${A.y}L${C.x} ${C.y}L${B.x} ${B.y}Z`}
      />

      {/* Les diagonales, de chaque sommet vers le centre. */}
      {[A, B, C].map((sommet, i) => (
        <line
          key={i}
          className="schema__trace schema__diagonale"
          style={temps(0.7 + i * 0.15)}
          pathLength={1}
          x1={sommet.x}
          y1={sommet.y}
          x2={G.x}
          y2={G.y}
        />
      ))}

      {/* Les nœuds, aux sommets. */}
      {[A, B, C].map((sommet, i) => (
        <circle
          key={i}
          className="schema__apparait schema__noeud"
          style={temps(0.9)}
          cx={sommet.x}
          cy={sommet.y}
          r="7"
        />
      ))}

      <g className="schema__apparait schema__poles" style={temps(1)}>
        <text x={A.x} y={A.y - 26} fontSize="12">
          VOS ATTENTES
        </text>
        <text x={B.x} y={B.y + 34} fontSize="12">
          LA TECHNIQUE
        </text>
        <text x={C.x} y={C.y + 34} fontSize="12">
          L’ÉMOTION
        </text>
      </g>

      {/* Le centre, qui s'allume en dernier. */}
      <polygon
        className="schema__apparait schema__losange"
        style={temps(1.4)}
        points={`${G.x},${G.y - 11} ${G.x + 11},${G.y} ${G.x},${G.y + 11} ${G.x - 11},${G.y}`}
      />
      <text
        className="schema__apparait schema__centre"
        style={temps(1.5)}
        x={G.x}
        y={G.y + 34}
        fontSize="11"
      >
        LE PROJET
      </text>
    </svg>
  )
}
