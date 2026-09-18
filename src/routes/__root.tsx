import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { useApparition } from '../components/apparition'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'

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
      // Montserrat Light : la géométrique la plus proche du lettrage du logo.
      // Sert la nouvelle baseline « ARCHITECTE D’ÉVÉNEMENTS ».
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: ReactNode }) {
  /* Les blocs montent d'un souffle en entrant dans l'écran, sur tout le site. */
  useApparition()

  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
        <Scripts />
      </body>
    </html>
  )
}
