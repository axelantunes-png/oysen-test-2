import {
  HeadContent,
  Scripts,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { useApparition } from '../components/apparition'
import { Cookies } from '../components/Cookies'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { Popups } from '../components/popup/Popups'
import {
  IntroCurtain,
  RIDEAU_SCRIPT,
  useRideauApresNavigation,
} from '../components/Rideau'

import appCss from '../styles/app.css?url'
import cookiesCss from '../styles/cookies.css?url'
import footerCss from '../styles/footer.css?url'
import homeCss from '../styles/home.css?url'
import navbarCss from '../styles/navbar.css?url'
import popupCss from '../styles/popup.css?url'
import themeMariageCss from '../styles/theme-mariage.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Oysen, architecte d’événements' },
      { name: 'theme-color', content: '#141118' },
      // Site non lancé : on bloque l'indexation (voir aussi public/robots.txt).
      { name: 'robots', content: 'noindex, nofollow, noarchive, nosnippet' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'stylesheet', href: navbarCss },
      { rel: 'stylesheet', href: homeCss },
      { rel: 'stylesheet', href: footerCss },
      /* Les popups du CMS : sur toutes les pages, et dans l'aperçu du CMS. */
      { rel: 'stylesheet', href: popupCss },
      /* Le bandeau « Gestion des cookies », sur toutes les pages. */
      { rel: 'stylesheet', href: cookiesCss },
      /* La palette claire de la page mariage, reprise par la page contact
         quand on en vient (theme-mariage.css). */
      { rel: 'stylesheet', href: themeMariageCss },
      { rel: 'icon', href: '/logo-oysen-provisoire.jpeg' },
      // Montserrat, hébergée avec le site (déclarée dans app.css) : la
      // police de toutes les pages, préchargée pour arriver avec le HTML.
      // crossOrigin est obligatoire pour qu'un préchargement de police
      // serve vraiment.
      {
        rel: 'preload',
        href: '/fonts/montserrat-normal.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: ReactNode }) {
  /*
   * Les blocs montent d'un souffle en entrant dans l'écran, sur tout le site.
   * La page affichée, une fois chargée : l'apparition reprend à chacune.
   */
  useApparition(
    useRouterState({ select: (state) => state.resolvedLocation?.pathname }),
  )

  /* Le rideau ne se joue qu'à l'arrivée : les pages suivantes n'attendent rien. */
  useRideauApresNavigation()

  /* L'administration se tient hors du site : ni menu, ni pied de page, ni rideau. */
  const admin = useRouterState({
    select: (state) => state.location.pathname.startsWith('/admin-prive'),
  })

  return (
    /*
     * RIDEAU_SCRIPT peut poser `data-rideau` sur <html> avant l'hydratation :
     * l'écart est voulu, React n'a pas à le signaler.
     */
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* En tête de <head>, bloquant : la décision précède le premier
            affichage, le rideau ne peut donc pas apparaître puis disparaître. */}
        <script dangerouslySetInnerHTML={{ __html: RIDEAU_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        {admin ? null : <Navbar />}
        {children}
        {admin ? null : <Footer />}
        {/* Sur toutes les pages, joué seulement à l'arrivée sur le site. */}
        {admin ? null : <IntroCurtain />}
        {/* Les popups promotionnels, gérés dans le CMS. */}
        {admin ? null : <Popups />}
        {/* Le consentement aux cookies, et Google Analytics qui en dépend. */}
        {admin ? null : <Cookies />}
        <Scripts />
      </body>
    </html>
  )
}
