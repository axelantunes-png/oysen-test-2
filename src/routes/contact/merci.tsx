import { createFileRoute } from '@tanstack/react-router'

import { DELAI_REPONSE_H } from '../../components/contact/content'
import { Arrow } from '../../components/home/icons'
import { Lien } from '../../components/Lien'

/* Même raison que sur la page Contact : chemin depuis la racine. */
import contactCss from '/src/styles/contact.css?url'

/*
 * La page de remerciement : une route à part entière, et non une bascule
 * d'état du formulaire, pour que l'arrivée ici se compte comme une
 * conversion. Elle n'a rien à indexer.
 */
export const Route = createFileRoute('/contact/merci')({
  head: () => ({
    meta: [
      { title: 'Demande reçue, Oysen' },
      { name: 'robots', content: 'noindex' },
    ],
    links: [{ rel: 'stylesheet', href: contactCss }],
  }),
  component: Merci,
})

function Merci() {
  return (
    <main className="merci">
      <div className="merci__inner">
        {/* Le losange d'Oysen, allumé : la demande est arrivée à la régie. */}
        <span className="merci__losange" aria-hidden="true" />

        <h1 className="merci__titre">Demande reçue.</h1>

        <p className="merci__texte">
          Vous recevez un récapitulatif par e-mail.
          <br />
          Nous revenons vers vous sous {DELAI_REPONSE_H}&nbsp;h ouvrées.
        </p>

        <ul className="merci__liens">
          <li>
            <Lien className="merci__lien" href="/nos-souvenirs">
              Voir nos événements
              <Arrow className="merci__fleche" />
            </Lien>
          </li>
          <li>
            <Lien className="merci__lien" href="/qui-sommes-nous/l-agence">
              Découvrir Oysen
              <Arrow className="merci__fleche" />
            </Lien>
          </li>
        </ul>
      </div>
    </main>
  )
}
