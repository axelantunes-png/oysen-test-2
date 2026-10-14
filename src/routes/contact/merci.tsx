import { createFileRoute } from '@tanstack/react-router'

import { DELAI_REPONSE_H } from '../../components/contact/content'
import { Lien } from '../../components/Lien'
import { classeTheme, couleurTheme, lireTheme } from '../../lib/theme'

/* Même raison que sur la page Contact : chemin depuis la racine. */
import contactCss from '/src/styles/contact.css?url'

/*
 * La page de remerciement : une route à part entière, et non une bascule
 * d'état du formulaire, pour que l'arrivée ici se compte comme une
 * conversion. Elle n'a rien à indexer.
 */
export const Route = createFileRoute('/contact/merci')({
  validateSearch: lireTheme,
  head: ({ match }) => ({
    meta: [
      { name: 'theme-color', content: couleurTheme(match.search.theme) },
      { title: 'Merci pour votre demande, Oysen' },
      { name: 'robots', content: 'noindex' },
    ],
    links: [{ rel: 'stylesheet', href: contactCss }],
  }),
  component: Merci,
})

function Merci() {
  const { theme } = Route.useSearch()

  return (
    <main className={`merci ${classeTheme(theme)}`.trim()}>
      <div className="merci__inner">
        {/* Le losange d'Oysen, allumé : la demande est arrivée à la régie. */}
        <span className="merci__losange" aria-hidden="true" />

        <h1 className="merci__titre">Merci pour votre demande.</h1>

        <p className="merci__texte">
          Elle est bien arrivée. Nous vous rappelons sous{' '}
          {DELAI_REPONSE_H}&nbsp;h ouvrées pour parler de votre projet.
        </p>

        <p className="merci__entre-temps">En attendant notre appel, vous pouvez&nbsp;:</p>

        <ul className="merci__liens">
          <li>
            <Lien className="btn btn--solid" href="/nos-souvenirs">
              Voir nos souvenirs
            </Lien>
          </li>
          <li>
            <Lien className="btn btn--ghost" href="/qui-sommes-nous/l-agence">
              Découvrir Oysen
            </Lien>
          </li>
        </ul>
      </div>
    </main>
  )
}
