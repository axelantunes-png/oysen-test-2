import { createFileRoute } from '@tanstack/react-router'

import { ARTICLES } from '../../components/blog/content'
import { CarteHub, HubHero } from '../../components/hub/Hub'

/*
 * Chemin depuis la racine du projet, et non relatif : sur une route imbriquée,
 * le découpage de TanStack Start réécrit le module et le chemin relatif n'est
 * plus résolvable côté serveur (« Denied ID »).
 */
import hubCss from '/src/styles/hub.css?url'

const TITRE = 'Blog : conseils pour organiser votre événement | Oysen'
const DESCRIPTION =
  'Séminaire, mariage, festival, événement public, technique : les conseils d’Oysen pour préparer votre événement à Toulouse et en Occitanie.'

export const Route = createFileRoute('/blog/')({
  head: () => ({
    meta: [
      { title: TITRE },
      { name: 'description', content: DESCRIPTION },
    ],
    links: [{ rel: 'stylesheet', href: hubCss }],
  }),
  component: Blog,
})

/**
 * La page « Blog », le catalogue des articles : un hero court, puis une
 * carte par article, qui mène à sa page.
 * Le contenu est un exemple (voir blog/content.ts).
 */
function Blog() {
  return (
    <main className="page-hub">
      <HubHero
        id="blog-title"
        surtitre="Blog · Organisation d’événements à Toulouse et en Occitanie"
        titre="Nos conseils pour préparer votre événement"
        texte="Délais, démarches, technique, budget : ce que nous avons appris sur le terrain, pour que votre événement se prépare sans mauvaise surprise."
      />

      <section className="section section--hub" aria-label="Nos articles">
        <div className="section__inner">
          <ul className="hub-cartes">
            {ARTICLES.map((article) => (
              <CarteHub
                key={article.slug}
                href={`/blog/${article.slug}`}
                photo={article.photo}
                focus={article.focus}
                etiquette={article.rubrique}
                titre={article.titre}
                reperes={[article.date, `${article.lecture} de lecture`]}
                resume={article.resume}
                appel="Lire l’article"
              />
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
