import { QueryClientProvider } from '@tanstack/react-query'
import {
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import { useEffect } from 'react'

import { Lien } from '../../../components/Lien'
import { cacheCms } from '../../../lib/cms-cache'
import { getSupabase } from '../../../lib/supabase'

/* Même raison que sur la page Contact : chemin depuis la racine. */
import adminCss from '/src/styles/admin.css?url'
import cmsCss from '/src/styles/cms.css?url'

/*
 * Le cadre du CMS : la barre et sa navigation, autour de chaque page.
 * Réservé à l'administrateur connecté : sans session, on repart à la page
 * de connexion. Les droits d'écriture, eux, sont vérifiés par la base
 * (règles d'accès, supabase/sql1.sql).
 */
export const Route = createFileRoute('/admin-prive/cms')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'CMS, Oysen' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
    links: [
      { rel: 'stylesheet', href: adminCss },
      { rel: 'stylesheet', href: cmsCss },
    ],
  }),
  beforeLoad: async () => {
    /* Importé à la demande : cette vérification fait partie de l'arbre des
       routes, téléchargé par tout le site, qui n'a pas à embarquer Supabase. */
    const { sessionOuverte } = await import('../../../lib/supabase')
    if (!(await sessionOuverte())) throw redirect({ to: '/admin-prive' })
  },
  component: CadreCms,
})

const NAVIGATION = [
  { libelle: 'Accueil', href: '/admin-prive/cms' },
  { libelle: 'Promotion', href: '/admin-prive/cms/promotion' },
]

function CadreCms() {
  const navigate = useNavigate()
  const chemin = useRouterState({
    select: (state) => state.location.pathname.replace(/\/+$/, ''),
  })

  /*
   * Session terminée (déconnexion, ici ou dans un autre onglet, ou
   * expiration) : le cache est vidé, plus rien ne reste en mémoire.
   */
  useEffect(() => {
    const { data } = getSupabase().auth.onAuthStateChange((evenement) => {
      if (evenement === 'SIGNED_OUT') {
        cacheCms.clear()
        void navigate({ to: '/admin-prive' })
      }
    })
    return () => data.subscription.unsubscribe()
  }, [navigate])

  async function deconnecter() {
    await getSupabase().auth.signOut()
    cacheCms.clear()
    void navigate({ to: '/admin-prive' })
  }

  return (
    <QueryClientProvider client={cacheCms}>
      <div className="cms">
        <header className="cms__barre">
          <img
            className="cms__logo"
            src="/images/logo-oysen.png"
            alt="Oysen"
            width={3000}
            height={2000}
          />

          <nav className="cms__nav" aria-label="CMS">
            {NAVIGATION.map((entree) => {
              /* L'accueil n'est actif que chez lui ; une rubrique, aussi sur ses sous-pages. */
              const actif =
                entree.href === '/admin-prive/cms'
                  ? chemin === entree.href
                  : chemin === entree.href || chemin.startsWith(`${entree.href}/`)
              return (
                <Lien
                  key={entree.href}
                  className={`cms__lien${actif ? ' cms__lien--actif' : ''}`}
                  href={entree.href}
                  aria-current={actif ? 'page' : undefined}
                >
                  {entree.libelle}
                </Lien>
              )
            })}
          </nav>

          {/* Vers le site, sans se déconnecter : /admin-prive ramène ensuite droit au CMS. */}
          <Lien className="cms__sortie cms__site" href="/">
            Retour au site
          </Lien>

          <button className="cms__sortie" type="button" onClick={deconnecter}>
            Se déconnecter
          </button>
        </header>

        <main className="cms__contenu">
          <Outlet />
        </main>
      </div>
    </QueryClientProvider>
  )
}
