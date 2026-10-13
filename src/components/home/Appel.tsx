import { useState } from 'react'

import { DELAI_REPONSE_H, PHONE_DISPLAY, PHONE_TEL } from './content'
import { Lien } from '../Lien'

/**
 * S10. L'appel final.
 *
 * Un seul bouton, comme dans le hero et avec le même libellé : une action
 * garde son nom d'un bout à l'autre du parcours. Le téléphone reste une
 * sortie secondaire, pour ceux qui n'écrivent pas.
 *
 * Les trois garanties disent ce qui se passe après l'envoi : c'est ce qui
 * lève la dernière hésitation, bien plus qu'une promesse de qualité.
 */
export function Appel() {
  const [phoneShown, setPhoneShown] = useState(false)

  return (
    <section className="section section--appel" aria-labelledby="appel-title">
      <div className="section__inner">
        {/* La coupure est voulue : la promesse d'un côté, notre part de
            l'autre. Elle tient tant que la ligne ne déborde pas. */}
        <h2 className="section__title appel__title" id="appel-title">
          Vous imaginez,
          <br />
          on s’occupe du reste.
        </h2>

        <p className="appel__lede">
          Quelques lignes suffisent : la date, le nombre de personnes, ce que
          vous avez déjà en tête.
        </p>

        <div className="appel__actions">
          <Lien className="btn btn--solid" href="/contact">
            Imaginer mon événement
          </Lien>

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

        {/* Le ✓ est décoratif : il double une information déjà portée par la liste. */}
        <ul className="appel__garanties">
          <li className="appel__garantie">
            <span className="appel__check" aria-hidden="true">
              ✓
            </span>
            Sans engagement
          </li>
          <li className="appel__garantie">
            <span className="appel__check" aria-hidden="true">
              ✓
            </span>
            Réponse sous {DELAI_REPONSE_H}h
          </li>
          <li className="appel__garantie">
            <span className="appel__check" aria-hidden="true">
              ✓
            </span>
            Si votre projet n’est pas pour nous, on vous le dit
          </li>
        </ul>
      </div>
    </section>
  )
}
