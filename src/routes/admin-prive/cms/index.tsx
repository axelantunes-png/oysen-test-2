import { createFileRoute } from '@tanstack/react-router'

/* L'accueil du CMS. Pas encore de contenu. */
export const Route = createFileRoute('/admin-prive/cms/')({
  ssr: false,
  component: AccueilCms,
})

function AccueilCms() {
  return (
    <div className="cms-accueil">
      <h1 className="admin__bienvenue">
        Bienvenue sur ton <em>CMS</em>
      </h1>
    </div>
  )
}
