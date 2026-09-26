import { FAQ } from './content'

/**
 * S9. FAQ d'accueil, balisée FAQPage.
 *
 * En dépliants : un <details> par question. Replié, le texte reste dans la
 * page, lisible par les moteurs de réponse, et le navigateur l'ouvre seul
 * quand on y cherche un mot. Aucun script : le clavier et les lecteurs
 * d'écran sont servis par l'élément natif.
 *
 * Le balisage ne produira d'effet qu'une fois le « noindex » retiré de
 * __root.tsx et de public/robots.txt, au lancement.
 */
const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

export function Faq() {
  return (
    <section className="section section--faq" aria-labelledby="faq-title">
      <div className="section__inner">
        <p className="section__eyebrow">Questions fréquentes</p>
        <h2 className="section__title" id="faq-title">
          Ce qu’on nous demande avant de nous écrire.
        </h2>

        <div className="faq">
          {FAQ.map((item) => (
            <details className="faq__item" key={item.q}>
              <summary className="faq__q">
                <span className="faq__q-texte">{item.q}</span>
                <span className="faq__signe" aria-hidden="true" />
              </summary>
              <p className="faq__a">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        /* Contenu statique, écrit par nous ; le remplacement de « < » ferme
           la porte à une fin de balise accidentelle dans une réponse. */
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(SCHEMA).replace(/</g, '\\u003c'),
        }}
      />
    </section>
  )
}
