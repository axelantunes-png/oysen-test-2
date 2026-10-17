import { createFileRoute, notFound } from '@tanstack/react-router'

import { ARTICLES } from '../../components/blog/content'
import { FicheAttente, HubHero } from '../../components/hub/Hub'
import { canonical } from '../../lib/canonical'

/*
 * Chemin depuis la racine du projet, et non relatif : sur une route imbriquée,
 * le découpage de TanStack Start réécrit le module et le chemin relatif n'est
 * plus résolvable côté serveur (« Denied ID »).
 */
import hubCss from '/src/styles/hub.css?url'

export const Route = createFileRoute('/blog/$slug')({
  loader: ({ params }) => {
    const article = ARTICLES.find((item) => item.slug === params.slug)
    if (!article) throw notFound()
    return article
  },
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.titre} | Oysen` },
          { name: 'description', content: loaderData.resume },
        ]
      : [],
    links: [
      ...(loaderData ? [canonical(`/blog/${params.slug}`)] : []),
      { rel: 'stylesheet', href: hubCss },
    ],
  }),
  component: Article,
})

/**
 * La page d'un article. Pour l'instant, sa tête et son résumé : le texte
 * viendra avec les vrais articles.
 */
function Article() {
  const article = Route.useLoaderData()
  return (
    <main className="page-hub">
      <HubHero
        id="article-title"
        surtitre={`Blog · ${article.rubrique}`}
        titre={article.titre}
      >
        <p className="hub-hero__reperes">
          <span>{article.date}</span>
          <span>{article.lecture} de lecture</span>
        </p>
      </HubHero>

      <FicheAttente
        photo={article.photo}
        focus={article.focus}
        resume={article.resume}
        attente="L’article complet arrive bientôt."
        retour="Tous les articles"
        retourHref="/blog"
      />
    </main>
  )
}
