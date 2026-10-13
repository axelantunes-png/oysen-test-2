/*
 * Le plan d'implantation type de « L'agence », dans sa propre section.
 *
 * Une salle de réception vue de dessus : la scène, la piste devant elle,
 * trois tables rondes de chaque côté, le bar, et la régie dans le renfoncement
 * du mur du bas. Chaque poste porte son repère, et les quatre premiers sont
 * reliés à la régie : c'est la thèse de la page, tous les métiers aboutissent
 * à un seul interlocuteur.
 *
 * Le plan est un plan type, pas celui d'un événement réel : l'intitulé le
 * dit. Les cotes sont celles de la maquette.
 */

/** Les tables rondes : deux colonnes de trois. */
const TABLES = [287, 1057].flatMap((x) =>
  [304, 487, 669].map((y) => ({ x, y })),
)

/** Six chaises par table : deux en haut, une de chaque côté, deux en bas. */
const CHAISES = [
  [-38, -66],
  [38, -66],
  [-76, 0],
  [76, 0],
  [-38, 66],
  [38, 66],
] as const

/** Les repères, et le point de la régie que chacun rejoint. */
const REPERES = [
  { numero: '01', x: 449, y: 185, vers: { x: 580, y: 722 } },
  { numero: '02', x: 896, y: 186, vers: { x: 762, y: 722 } },
  { numero: '03', x: 393, y: 674, vers: { x: 582, y: 731 } },
  { numero: '04', x: 948, y: 674, vers: { x: 762, y: 731 } },
  { numero: '05', x: 674, y: 817 },
] as const

export function Plan() {
  return (
    <svg
      className="plan__svg"
      viewBox="120 60 1110 840"
      role="img"
      aria-labelledby="plan-titre plan-desc"
    >
      <title id="plan-titre">Plan d’implantation type</title>
      <desc id="plan-desc">
        Une salle de réception vue de dessus : la scène, la piste, six tables
        rondes, le bar et la régie. Le son, la lumière, la scène et l’écran
        LED sont reliés à la régie, votre seul interlocuteur.
      </desc>

      {/* Les murs, et le renfoncement de la régie dans le mur du bas. */}
      <path className="plan__mur" d="M499 834H141V83H1204V834H845" />
      <path className="plan__trait" d="M499 834V757H845V834" />

      {/* La piste, dégagée devant la scène. */}
      <rect
        className="plan__piste"
        x="467"
        y="261"
        width="411"
        height="377"
      />

      <rect
        className="plan__scene"
        x="495"
        y="111"
        width="355"
        height="110"
      />

      {/* Les tables et leurs chaises. */}
      {TABLES.map((table) => (
        <g key={`${table.x}-${table.y}`}>
          <circle
            className="plan__trait"
            cx={table.x}
            cy={table.y}
            r="53"
          />
          {CHAISES.map(([dx, dy]) => (
            <circle
              key={`${dx}-${dy}`}
              className="plan__chaise"
              cx={table.x + dx}
              cy={table.y + dy}
              r="6.5"
            />
          ))}
        </g>
      ))}

      <rect className="plan__trait" x="172" y="757" width="203" height="46" />

      {/* Les faisceaux : chaque repère rejoint la régie. */}
      {REPERES.map((repere) =>
        'vers' in repere ? (
          <line
            key={repere.numero}
            className="plan__faisceau"
            x1={repere.x}
            y1={repere.y}
            x2={repere.vers.x}
            y2={repere.vers.y}
          />
        ) : null,
      )}

      {/* La régie, posée sur les faisceaux et le renfoncement. */}
      <rect
        className="plan__trait plan__regie"
        x="582"
        y="719"
        width="180"
        height="63"
      />

      {/* Les noms des espaces. */}
      <g className="plan__noms" fontSize="24">
        <text x="672" y="168">SCÈNE</text>
        <text x="672" y="448">PISTE</text>
        <text x="672" y="750">RÉGIE</text>
        <text x="273" y="780">BAR</text>
      </g>

      {REPERES.map((repere) => (
        <g key={repere.numero} className="plan__repere" fontSize="20">
          <circle cx={repere.x} cy={repere.y} r="30" />
          <text x={repere.x} y={repere.y}>
            {repere.numero}
          </text>
        </g>
      ))}

      {/* L'échelle graphique : cinq mètres. */}
      <g className="plan__echelle" fontSize="18">
        <path className="plan__echelle-trait" d="M153 870V884M153 877H338M338 870V884" />
        <text className="plan__echelle-texte" x="153" y="855">
          0
        </text>
        <text className="plan__echelle-texte" x="338" y="855">
          5 m
        </text>
      </g>
    </svg>
  )
}
