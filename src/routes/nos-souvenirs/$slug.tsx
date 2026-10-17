import { createFileRoute, notFound } from '@tanstack/react-router'

import { FicheAttente, HubHero } from '../../components/hub/Hub'
import { SOUVENIRS } from '../../components/souvenirs/content'
import { canonical } from '../../lib/canonical'

/*
 * Chemin depuis la racine du projet, et non relatif : sur une route imbriquée,
 * le découpage de TanStack Start réécrit le module et le chemin relatif n'est
 * plus résolvable côté serveur (« Denied ID »).
 */
import hubCss from '/src/styles/hub.css?url'

export const Route = createFileRoute('/nos-souvenirs/$slug')({
  loader: ({ params }) => {
    const souvenir = SOUVENIRS.find((item) => item.slug === params.slug)
    if (!souvenir) throw notFound()
    return souvenir
  },
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.titre} | Oysen` },
          { name: 'description', content: loaderData.resume },
        ]
      : [],
    links: [
      ...(loaderData ? [canonical(`/nos-souvenirs/${params.slug}`)] : []),
      { rel: 'stylesheet', href: hubCss },
    ],
  }),
  component: Fiche,
})

/**
 * La fiche d'une réalisation. Pour l'instant, sa tête et son résumé : le
 * récit (la demande, ce que nous avons mis en place, le jour J) viendra
 * avec les vraies réalisations.
 */
function Fiche() {
  const souvenir = Route.useLoaderData()
  return (
    <main className="page-hub">
      <HubHero
        id="souvenir-title"
        surtitre={`Nos souvenirs · ${souvenir.type}`}
        titre={souvenir.titre}
      >
        <p className="hub-hero__reperes">
          <span>{souvenir.lieu}</span>
          <span>{souvenir.public}</span>
          <span>{souvenir.date}</span>
        </p>
      </HubHero>

      <FicheAttente
        photo={souvenir.photo}
        focus={souvenir.focus}
        resume={souvenir.resume}
        attente="Le récit complet de cet événement arrive bientôt : la demande, ce que nous avons mis en place, et le déroulé du jour J."
        retour="Toutes nos réalisations"
        retourHref="/nos-souvenirs"
      />
    </main>
  )
}
