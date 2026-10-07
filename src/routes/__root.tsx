import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { useApparition } from '../components/apparition'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { IntroCurtain, RIDEAU_SCRIPT } from '../components/Rideau'

import appCss from '../styles/app.css?url'
import footerCss from '../styles/footer.css?url'
import homeCss from '../styles/home.css?url'
import navbarCss from '../styles/navbar.css?url'

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
  /* Les blocs montent d'un souffle en entrant dans l'écran, sur tout le site. */
  useApparition()

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
        <Navbar />
        {children}
        <Footer />
        {/* Sur toutes les pages, joué seulement à l'arrivée sur le site. */}
        <IntroCurtain />
        <Scripts />
      </body>
    </html>
  )
}
