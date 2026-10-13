import type { CSSProperties, MouseEvent } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { TRI, ZONE } from '../../components/home/content'
import { Tri } from '../../components/home/Tri'
import { Lien } from '../../components/Lien'

/*
 * Chemin depuis la racine du projet, et non relatif : sur une route imbriquée,
 * le découpage de TanStack Start réécrit le module et le chemin relatif n'est
 * plus résolvable côté serveur (« Denied ID »).
 */
import servicesCss from '/src/styles/services.css?url'

export const Route = createFileRoute('/nos-services/')({
  head: () => ({
    meta: [
      { title: 'Nos services, Oysen' },
      {
        name: 'description',
        content: `Événements d’entreprise, mariages, collectivités, prestation technique, festivals : les services d’Oysen, agence événementielle à ${ZONE}.`,
      },
    ],
    links: [{ rel: 'stylesheet', href: servicesCss }],
  }),
  component: Services,
})

/*
 * « Choisir mon événement » descend en douceur jusqu'aux affiches.
 *
 * Le défilement est mené ici, image par image, plutôt que confié au
 * navigateur (scrollIntoView en « smooth ») : celui-ci l'ignore selon ses
 * réglages et saute d'un coup. Le lien garde son ancre : sans JavaScript,
 * il y saute directement. Pour qui demande moins d'animations, le saut
 * reste immédiat. L'arrêt sous la barre de navigation vient de
 * scroll-margin-top (services.css).
 */
const DUREE_DEFILEMENT = 900

/* Lent au départ, lent à l'arrivée. */
function adoucir(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function versLesAffiches(event: MouseEvent<HTMLAnchorElement>) {
  const cible = document.getElementById('tri-title')
  if (!cible) return

  event.preventDefault()
  history.replaceState(null, '', '#tri-title')

  const marge = parseFloat(getComputedStyle(cible).scrollMarginTop) || 0
  const depart = window.scrollY
  const arrivee = cible.getBoundingClientRect().top + depart - marge

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo(0, arrivee)
    return
  }

  const debut = performance.now()

  const image = (maintenant: number) => {
    const t = Math.min(1, (maintenant - debut) / DUREE_DEFILEMENT)
    window.scrollTo(0, depart + (arrivee - depart) * adoucir(t))
    if (t < 1) requestAnimationFrame(image)
  }

  requestAnimationFrame(image)
}

/**
 * La page « Nos services », la porte d'entrée vers chaque service.
 *
 * Le hero montre ce que la page propose avant de le dire : cinq plateaux
 * côte à côte, un par service, chacun sous son projecteur, qui s'allument
 * l'un après l'autre. Le texte se tient au centre, devant eux.
 *
 * Puis la barre de tri de l'accueil (S2), reprise telle quelle : les mêmes
 * affiches mènent aux mêmes pages.
 */
function Services() {
  return (
    <main>
      <section className="services-hero" aria-labelledby="services-title">
        {/*
          Les cinq plateaux : les photos des services, traitées pour la
          salle sombre. Purement décoratifs, les affiches du dessous disent
          la même chose aux lecteurs d'écran.
        */}
        <div className="services-hero__plateaux" aria-hidden="true">
          {TRI.map((entry, rang) => (
            <div
              className="plateau"
              key={entry.href}
              style={
                {
                  '--rang': rang,
                  '--focus': entry.photo?.focus ?? '50% 50%',
                } as CSSProperties
              }
            >
              {entry.photo ? (
                <img
                  className="plateau__photo"
                  src={`/images/services/${entry.photo.name}-800.jpg`}
                  srcSet={`/images/services/${entry.photo.name}-800.jpg 800w, /images/services/${entry.photo.name}-1200.jpg 1200w`}
                  sizes="(min-width: 761px) 20vw, 100vw"
                  width={800}
                  height={1000}
                  alt=""
                  decoding="async"
                />
              ) : null}
              <span className="plateau__faisceau" />
              <span className="plateau__nom">{entry.title}</span>
            </div>
          ))}
        </div>

        {/* Le titre en deux temps : la promesse, puis le métier, éclairé en
            lavande. */}
        <div className="services-hero__inner">
          <div className="services-hero__plaque">
            <p className="services-hero__surtitre">
              Agence événementielle à {ZONE}
            </p>
            <h1 className="services-hero__titre" id="services-title">
              Découvrez nos services
              <span className="services-hero__titre-suite">
                d’organisation événementielle
              </span>
            </h1>
            <p className="services-hero__lede">
              Nous cherchons le lieu, sélectionnons les prestataires,
              coordonnons la technique et pilotons le jour J. Choisissez votre
              type d’événement.
            </p>

            <div className="services-hero__actions">
              <a
                className="btn btn--solid"
                href="#tri-title"
                onClick={versLesAffiches}
              >
                Choisir mon événement
              </a>
              <Lien className="btn btn--ghost" href="/contact">
                Imaginer mon événement
              </Lien>
            </div>
          </div>
        </div>
      </section>

      <Tri />
    </main>
  )
}
