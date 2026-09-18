import { FAQ } from './content'

/**
 * S9. FAQ d'accueil, balisée FAQPage.
 *
 * Affichée en clair et non en accordéon : ces réponses sont écrites pour
 * être lues par quelqu'un qui hésite juste avant de cliquer, et extraites
 * par les moteurs de réponse. Un contenu replié est un contenu à moitié lu.
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

        <dl className="faq">
          {FAQ.map((item) => (
            <div className="faq__item" key={item.q}>
              <dt className="faq__q">{item.q}</dt>
              <dd className="faq__a">{item.a}</dd>
            </div>
          ))}
        </dl>
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
