import { MOUVEMENTS, type Mouvement } from './content'

/**
 * S4. Le guide. Oysen apparaît ici, et pas avant : après la douleur,
 * jamais en ouverture.
 *
 * Deux colonnes : à gauche le nom, le rôle, puis les trois mouvements dans
 * l'ordre où les choses se sont produites (le constat, la décision, la
 * méthode), les faits et la phrase qui ferme la section. À droite, la
 * photo, et sous elle un verbatim entre guillemets.
 *
 * Chaque mouvement a sa propre mise en forme : le constat en deux lignes
 * simples, la décision et ses trois métiers dans une bande entre deux
 * filets, la méthode et ses garanties cochées.
 */
const [CONSTAT, DECISION, METHODE] = MOUVEMENTS as readonly [
  Mouvement,
  Mouvement,
  Mouvement,
]

function Coche() {
  return (
    <svg
      className="guide__coche"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3 8.5l3.2 3.2L13 4.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Guide() {
  return (
    <section className="section section--guide" aria-labelledby="guide-title">
      <div className="section__inner guide__grille">
        <div className="guide__texte">
          <h2 className="section__title guide__title" id="guide-title">
            <span className="guide__marque">Oysen</span>
            <span className="sr-only">&nbsp;: </span>
            <span className="guide__role">L’architecte de vos souvenirs</span>
          </h2>

          <div className="guide__mouvement">
            <h3 className="guide__label">{CONSTAT.label}</h3>
            <ul className="guide__constat">
              {CONSTAT.puces.map((puce) => (
                <li key={puce}>{puce}</li>
              ))}
            </ul>
          </div>

          <div className="guide__mouvement">
            <h3 className="guide__label">{DECISION.label}</h3>
            <p className="guide__decision">{DECISION.phrase}</p>
            <ul className="guide__metiers">
              {DECISION.puces.map((puce) => (
                <li key={puce}>{puce}</li>
              ))}
            </ul>
          </div>

          <div className="guide__mouvement">
            <h3 className="guide__label">{METHODE.label}</h3>
            <p className="guide__phrase">{METHODE.phrase}</p>
            <ul className="guide__garanties">
              {METHODE.puces.map((puce) => (
                <li key={puce}>
                  <Coche />
                  {puce}
                </li>
              ))}
            </ul>
          </div>

          <p className="guide__fait">
            Oysen, agence événementielle en Haute-Garonne et sur toute
            l’Occitanie. Recherche du lieu, sélection des prestataires,
            technique, régie le jour J. Un seul interlocuteur.
          </p>

          <p className="guide__fait">
            Sonorisation jusqu’à 1500 personnes, éclairage, structure, écran
            LED.
          </p>

          <p className="guide__signature">
            <span className="guide__duo">Conception - Réalisation</span>
            <span className="guide__claim">Deux métiers, un expert.</span>
          </p>
        </div>

        {/*
          Le portrait de Mathis, la même photo que sur « L'agence » :
          recadrée en 4/5, en trois largeurs. sizes suit la grille : la
          moitié de la colonne de texte à 88 % sur ordinateur, 30rem au plus
          sur tablette et mobile. Sous la ligne de flottaison : chargée à
          l'approche.
        */}
        <div className="guide__visuel">
          <div className="guide__photo">
            <img
              className="guide__img"
              src="/images/fondateur/fondateur-mathis-640.webp"
              srcSet="/images/fondateur/fondateur-mathis-400.webp 400w, /images/fondateur/fondateur-mathis-640.webp 640w, /images/fondateur/fondateur-mathis-1053.webp 1053w"
              sizes="(max-width: 900px) min(calc(100vw - 3rem), 30rem), min(36vw, 32rem)"
              width={1053}
              height={1316}
              alt="Mathis Amato, fondateur d’Oysen"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Le verbatim, sous la photo : ce qui fait avancer Oysen. Ses
              guillemets reprennent les deux coins des équerres de la photo,
              l'ouvrant en haut à gauche, le fermant en bas à droite. */}
          <blockquote className="guide__verbatim">
            <span className="guide__guillemet guide__guillemet--ouvrant" aria-hidden="true">
              «
            </span>
            <p>
              Oysen attache une importance particulière à vos retours. Ce qui
              nous motive, c’est de vous aider à créer des souvenirs
              inoubliables.
            </p>
            <span className="guide__guillemet guide__guillemet--fermant" aria-hidden="true">
              »
            </span>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
