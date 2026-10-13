import { METHODE } from './content'
import { Lien } from '../Lien'

/**
 * S6. La méthode en quatre étapes.
 *
 * C'est le bloc qui porte le plus de crédibilité : il prouve qu'il existe un
 * process, donc un professionnel. D'où « ce que vous recevez », qui
 * distingue une méthode d'une promesse.
 *
 * Quatre cartes en deux rangées. Chacune reprend les deux intitulés, si bien
 * qu'on peut la lire seule, sans revenir à un en-tête de colonne.
 *
 * La numérotation est ici légitime : les étapes sont une séquence, chacune
 * produit ce dont la suivante a besoin.
 */
export function Methode() {
  return (
    <section
      className="section section--methode"
      aria-labelledby="methode-title"
    >
      <div className="section__inner">
        <p className="section__eyebrow">La méthode</p>
        <h2 className="section__title" id="methode-title">
          Agence événementielle&nbsp;: comment ça se passe
        </h2>

        <ol className="methode">
          {METHODE.map((etape) => (
            <li className="methode__carte dc01" key={etape.nom}>
              {/* Design cards 01 (app.css) : le trait du haut, la bordure
                  du survol et la zone de survol prolongée. */}
              <span className="dc01__repere" aria-hidden="true" />
              <span className="dc01__survol" aria-hidden="true" />
              <span className="dc01__zone" aria-hidden="true" />

              <h3 className="methode__etape">
                <span className="methode__num">{etape.numero}</span>
                <span className="methode__nom">{etape.nom}</span>
              </h3>

              <dl className="methode__details">
                <dt>Ce qui se passe</dt>
                <dd className="methode__deroule">
                  <ul className="methode__puces">
                    {etape.deroule.map((demarche) => (
                      <li className="methode__puce" key={demarche}>
                        {demarche}
                      </li>
                    ))}
                  </ul>
                </dd>

                <dt>Ce que vous recevez</dt>
                <dd className="methode__livrable">{etape.livrable}</dd>
              </dl>
            </li>
          ))}
        </ol>

        <div className="methode__action">
          <Lien className="btn btn--solid" href="/contact">
            Imaginer mon événement
          </Lien>
        </div>
      </div>
    </section>
  )
}
