import { MOUVEMENTS } from './content'

/**
 * S4. Le guide. Oysen apparaît ici, et pas avant : après la douleur,
 * jamais en ouverture.
 *
 * Le nom, le rôle, puis trois cartes dans l'ordre où les choses se sont
 * produites : le constat, la décision, la méthode. En bas, une dernière
 * carte : les faits de part et d'autre d'un filet, puis la phrase qui ferme
 * la section.
 */
export function Guide() {
  return (
    <section className="section section--guide" aria-labelledby="guide-title">
      {/*
        Décor : sans son, en boucle, et sans commande. Le lecteur reste en
        ligne dans la page sur iOS grâce à playsInline, sinon il passerait en
        plein écran tout seul.
      */}
      <video
        className="guide__video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/videos/bg-s5.mp4" type="video/mp4" />
      </video>

      <div className="section__inner">
        <h2 className="section__title guide__title" id="guide-title">
          <span className="guide__marque">Oysen</span>
          <span className="sr-only">&nbsp;: </span>
          <span className="guide__role">L’architecte de vos souvenirs</span>
        </h2>

        <ol className="guide__mouvements">
          {MOUVEMENTS.map((mouvement) => (
            <li className="guide__carte" key={mouvement.label}>
              <h3 className="guide__label">{mouvement.label}</h3>

              {mouvement.phrase && (
                <p className="guide__phrase">{mouvement.phrase}</p>
              )}

              <ul className="guide__liste">
                {mouvement.puces.map((puce) => (
                  <li className="guide__puce" key={puce}>
                    {puce}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div className="guide__socle">
          <div className="guide__faits">
            <p className="guide__fait">
              Oysen, agence événementielle en Haute-Garonne et sur toute
              l’Occitanie. Recherche du lieu, sélection des prestataires,
              technique, régie le jour J. Un seul interlocuteur.
            </p>

            <p className="guide__fait">
              Sonorisation jusqu’à 1500 personnes, éclairage, structure, écran
              LED.
            </p>
          </div>

          <p className="guide__signature">
            <span className="guide__duo">Conception - Réalisation</span>
            <span className="guide__claim">Deux métiers, un expert.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
