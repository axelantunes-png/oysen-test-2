import { createFileRoute } from '@tanstack/react-router'

import { CarteHub, HubHero } from '../../components/hub/Hub'
import { SOUVENIRS } from '../../components/souvenirs/content'
import { canonical } from '../../lib/canonical'

/*
 * Chemin depuis la racine du projet, et non relatif : sur une route imbriquée,
 * le découpage de TanStack Start réécrit le module et le chemin relatif n'est
 * plus résolvable côté serveur (« Denied ID »).
 */
import hubCss from '/src/styles/hub.css?url'

const TITRE = 'Nos souvenirs : les événements organisés par Oysen | Oysen'
const DESCRIPTION =
  'Séminaires, mariages, festivals, cérémonies publiques : les événements qu’Oysen a organisés et équipés à Toulouse et en Occitanie.'

export const Route = createFileRoute('/nos-souvenirs/')({
  head: () => ({
    meta: [
      { title: TITRE },
      { name: 'description', content: DESCRIPTION },
    ],
    links: [
      canonical('/nos-souvenirs'),
      { rel: 'stylesheet', href: hubCss },
    ],
  }),
  component: Souvenirs,
})

/**
 * La page « Nos souvenirs », le catalogue des réalisations : un hero court,
 * puis une carte par événement, qui mène à sa fiche.
 * Le contenu est un exemple (voir souvenirs/content.ts).
 */
function Souvenirs() {
  return (
    <main className="page-hub">
      <HubHero
        id="souvenirs-title"
        surtitre="Nos souvenirs · Événements organisés à Toulouse et en Occitanie"
        titre="Les événements que nous avons fait vivre"
        texte="Séminaires, mariages, festivals, cérémonies publiques : chaque fiche raconte ce qui était demandé, ce que nous avons mis en place, et comment s’est passé le jour J."
      />

      <section
        className="section section--hub"
        aria-label="Nos réalisations"
      >
        <div className="section__inner">
          <ul className="hub-cartes">
            {SOUVENIRS.map((souvenir) => (
              <CarteHub
                key={souvenir.slug}
                href={`/nos-souvenirs/${souvenir.slug}`}
                photo={souvenir.photo}
                focus={souvenir.focus}
                etiquette={souvenir.type}
                titre={souvenir.titre}
                reperes={[souvenir.lieu, souvenir.public, souvenir.date]}
                resume={souvenir.resume}
                appel="Voir la réalisation"
              />
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
