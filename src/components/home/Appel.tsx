import { useState } from 'react'

import { DELAI_REPONSE_H, PHONE_DISPLAY, PHONE_TEL } from './content'

/**
 * S10. L'appel final.
 *
 * Un seul bouton, comme dans le hero et avec le même libellé : une action
 * garde son nom d'un bout à l'autre du parcours. Le téléphone reste une
 * sortie secondaire, pour ceux qui n'écrivent pas.
 *
 * La microcopie dit ce qui se passe après l'envoi — c'est ce qui lève la
 * dernière hésitation, bien plus qu'une promesse de qualité.
 */
export function Appel() {
  const [phoneShown, setPhoneShown] = useState(false)

  return (
    <section className="section section--appel" aria-labelledby="appel-title">
      <div className="section__inner">
        <h2 className="section__title appel__title" id="appel-title">
          Dites-nous ce que vous préparez.
        </h2>

        <p className="appel__lede">
          Quelques lignes suffisent : la date, le nombre de personnes, ce que
          vous avez déjà en tête.
        </p>

        <div className="appel__actions">
          <a className="btn btn--solid" href="/contact">
            Imaginer mon événement
          </a>

          {/* aria-live : le lecteur d'écran annonce le numéro qui se substitue au bouton. */}
          <span aria-live="polite">
            {phoneShown ? (
              <a className="btn btn--ghost appel__phone" href={`tel:${PHONE_TEL}`}>
                {PHONE_DISPLAY}
              </a>
            ) : (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setPhoneShown(true)}
              >
                Ou afficher le numéro
              </button>
            )}
          </span>
        </div>

        <p className="appel__microcopy">
          Sans engagement. Nous lisons votre message, nous vous appelons si
          quelque chose manque, et vous recevez sous {DELAI_REPONSE_H}h un
          premier avis avec un ordre de grandeur budgétaire, y compris si votre
          projet n’est pas pour nous.
        </p>
      </div>
    </section>
  )
}
