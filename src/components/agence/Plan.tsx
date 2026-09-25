import type { CSSProperties } from 'react'

/*
 * Le plan d'implantation du hero de « L'agence ».
 *
 * Une salle de réception vue de dessus, dessinée comme sur une planche
 * d'architecte : murs pleins, baies, porte et son débattement, ce qui est
 * suspendu en tireté (le pont lumière), la scène hachurée. Chaque poste porte
 * son repère, et tous les repères sont reliés à la régie : c'est la thèse de
 * la page, tous les métiers aboutissent à un seul interlocuteur.
 *
 * Le plan est un plan type, pas celui d'un événement réel : la légende le dit.
 *
 * Unités : le viewBox fait 640 × 500, un mètre vaut 22 unités (une table
 * ronde de 1,80 m fait 40 unités). L'échelle graphique en bas en découle.
 */

/** Le point de convergence : le losange de la régie. */
const REGIE = { x: 320, y: 418 }

/** Les tables rondes, de gauche à droite puis de haut en bas. */
const TABLES = [100, 175, 465, 540].flatMap((x, colonne) =>
  [185, 275, 365].map((y, rang) => ({ x, y, ordre: colonne * 3 + rang })),
)

/** Huit chaises autour de chaque table, à 28 unités du centre. */
const CHAISES = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4)

/** Les projecteurs accrochés au pont. */
const PROJECTEURS = [180, 236, 292, 348, 404, 460]

/** Les repères, posés à côté du poste qu'ils désignent. */
const REPERES = [
  { numero: '01', x: 160, y: 86 },
  { numero: '02', x: 515, y: 128 },
  { numero: '03', x: 243, y: 62 },
  { numero: '04', x: 397, y: 52 },
  { numero: '05', x: 448, y: 431 },
]

/** Le moment où chaque trait commence, en secondes. */
function temps(t: number, duree?: number) {
  return {
    '--t': `${t}s`,
    ...(duree ? { '--duree': `${duree}s` } : {}),
  } as CSSProperties
}

export function Plan() {
  return (
    <svg
      className="plan__svg"
      viewBox="0 0 640 500"
      role="img"
      aria-labelledby="plan-titre plan-desc"
    >
      <title id="plan-titre">Plan d’implantation type</title>
      <desc id="plan-desc">
        Une salle de réception vue de dessus : scène et écran LED, son,
        lumière, tables rondes, piste et bar. Chaque poste est relié à la
        régie, votre seul interlocuteur.
      </desc>

      <defs>
        <pattern
          id="plan-hachure"
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line className="plan__hachure" x1="0" y1="0" x2="0" y2="7" />
        </pattern>

        <linearGradient id="plan-cone" x1="0" y1="0" x2="0" y2="1">
          <stop className="plan__cone-haut" offset="0" />
          <stop className="plan__cone-bas" offset="1" />
        </linearGradient>
      </defs>

      {/* Les cônes de diffusion des enceintes, sous tout le reste. */}
      <g className="plan__fondu" style={temps(1.5)}>
        <polygon className="plan__cone" points="204,102 118,258 262,270" />
        <polygon className="plan__cone" points="436,102 378,270 522,258" />
      </g>

      {/* Les murs, avec leurs baies et la porte laissées ouvertes. */}
      <path
        className="plan__mur plan__trace"
        style={temps(0, 1.1)}
        pathLength={1}
        d="M20 110V20H620V110M620 210V290M620 390V460H140M80 460H20V390M20 290V210"
      />

      <g className="plan__fondu" style={temps(0.8)}>
        {[110, 290].map((y) => (
          <g key={y}>
            <line className="plan__baie" x1="18" y1={y} x2="18" y2={y + 100} />
            <line className="plan__baie" x1="22" y1={y} x2="22" y2={y + 100} />
            <line className="plan__baie" x1="618" y1={y} x2="618" y2={y + 100} />
            <line className="plan__baie" x1="622" y1={y} x2="622" y2={y + 100} />
          </g>
        ))}
      </g>

      {/* La porte et son débattement. */}
      <line
        className="plan__trait plan__trace"
        style={temps(0.9, 0.4)}
        pathLength={1}
        x1="80"
        y1="460"
        x2="80"
        y2="400"
      />
      <path
        className="plan__dessus plan__fondu"
        style={temps(1.1)}
        d="M80 400A60 60 0 0 1 140 460"
      />

      {/* La scène, hachurée comme un plancher surélevé, et son écran. */}
      <rect
        className="plan__scene plan__trace"
        style={temps(0.5)}
        pathLength={1}
        x="220"
        y="23"
        width="200"
        height="73"
      />
      <line
        className="plan__led plan__trace"
        style={temps(1, 0.6)}
        pathLength={1}
        x1="265"
        y1="33"
        x2="375"
        y2="33"
      />

      {/* Les deux enceintes, de part et d'autre du nez de scène. */}
      <rect
        className="plan__trait plan__trace"
        style={temps(1.2, 0.5)}
        pathLength={1}
        x="196"
        y="80"
        width="16"
        height="22"
      />
      <rect
        className="plan__trait plan__trace"
        style={temps(1.25, 0.5)}
        pathLength={1}
        x="428"
        y="80"
        width="16"
        height="22"
      />

      {/* Le pont lumière : suspendu, donc en tireté. */}
      <g className="plan__fondu" style={temps(1.3)}>
        <line className="plan__dessus" x1="150" y1="128" x2="490" y2="128" />
        {PROJECTEURS.map((x) => (
          <circle key={x} className="plan__projecteur" cx={x} cy="128" r="4.5" />
        ))}
      </g>

      {/* La piste, dégagée devant la scène. */}
      <rect
        className="plan__dessus plan__fondu"
        style={temps(1.2)}
        x="232"
        y="168"
        width="176"
        height="210"
      />

      {/* Les tables, colonne par colonne, puis leurs chaises. */}
      {TABLES.map((table) => (
        <g key={`${table.x}-${table.y}`}>
          <circle
            className="plan__trait plan__trace"
            style={temps(0.9 + table.ordre * 0.06, 0.6)}
            pathLength={1}
            cx={table.x}
            cy={table.y}
            r="20"
          />
          <g className="plan__fondu" style={temps(1.3 + table.ordre * 0.06)}>
            {CHAISES.map((angle) => (
              <circle
                key={angle}
                className="plan__chaise"
                cx={table.x + 28 * Math.cos(angle)}
                cy={table.y + 28 * Math.sin(angle)}
                r="3.5"
              />
            ))}
          </g>
        </g>
      ))}

      {/* Le bar et la régie. */}
      <rect
        className="plan__trait plan__trace"
        style={temps(0.8)}
        pathLength={1}
        x="470"
        y="420"
        width="130"
        height="22"
      />
      <rect
        className="plan__trait plan__trace"
        style={temps(0.85)}
        pathLength={1}
        x="284"
        y="404"
        width="72"
        height="28"
      />

      {/* Les noms des espaces, en lettrage de planche. */}
      <g className="plan__noms plan__fondu" style={temps(1.6)}>
        <text x="320" y="78" fontSize="11">SCÈNE</text>
        <text x="320" y="192" fontSize="11">PISTE</text>
        <text x="535" y="435" fontSize="10">BAR</text>
        <text x="320" y="449" fontSize="10">RÉGIE</text>
      </g>

      {/*
        Les faisceaux : chaque repère rejoint la régie. Tracés après tout le
        reste, du poste vers le losange, pour que l'œil les suive jusqu'à lui.
      */}
      {REPERES.map((repere, i) => (
        <line
          key={repere.numero}
          className="plan__faisceau plan__trace"
          style={temps(2 + i * 0.12, 0.8)}
          pathLength={1}
          x1={repere.x}
          y1={repere.y}
          x2={REGIE.x}
          y2={REGIE.y}
        />
      ))}

      {REPERES.map((repere, i) => (
        <g
          key={repere.numero}
          className="plan__repere plan__fondu"
          style={temps(1.8 + i * 0.08)}
        >
          <circle cx={repere.x} cy={repere.y} r="14" />
          <text x={repere.x} y={repere.y} fontSize="11">
            {repere.numero}
          </text>
        </g>
      ))}

      <polygon
        className="plan__losange"
        style={temps(2.9)}
        points={`${REGIE.x},${REGIE.y - 8} ${REGIE.x + 8},${REGIE.y} ${REGIE.x},${REGIE.y + 8} ${REGIE.x - 8},${REGIE.y}`}
      />

      {/* L'échelle graphique : cinq mètres, un segment sur deux plein. */}
      <g className="plan__echelle plan__fondu" style={temps(1.6)}>
        {[0, 1, 2, 3, 4].map((m) => (
          <rect
            key={m}
            className={m % 2 ? 'plan__echelle-vide' : 'plan__echelle-plein'}
            x={20 + m * 22}
            y="480"
            width="22"
            height="5"
          />
        ))}
        <text className="plan__echelle-texte" x="20" y="498" fontSize="9">
          0
        </text>
        <text className="plan__echelle-texte" x="130" y="498" fontSize="9">
          5 m
        </text>
      </g>
    </svg>
  )
}
