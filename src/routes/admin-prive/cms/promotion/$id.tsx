import { createFileRoute } from '@tanstack/react-router'

import { EditeurPopup } from '../../../../components/cms/EditeurPopup'
import { ChargementCms, ErreurCms } from '../../../../components/cms/EtatsCms'

/*
 * Créer (/promotion/nouveau) ou modifier un popup : l'éditeur est dans
 * components/cms/EditeurPopup.tsx.
 */
export const Route = createFileRoute('/admin-prive/cms/promotion/$id')({
  ssr: false,
  head: () => ({ meta: [{ title: 'Popup, CMS Oysen' }] }),
  /*
   * Importé à la demande : le chargeur fait partie de l'arbre des routes,
   * téléchargé par tout le site, et le cache ne doit pas l'alourdir.
   */
  loader: async () => {
    const cache = await import('../../../../lib/cms-cache')
    return cache.cacheCms.ensureQueryData(cache.requetePopups)
  },
  pendingComponent: ChargementCms,
  errorComponent: ErreurCms,
  component: EditeurDuPopup,
})

/* Un éditeur neuf par popup : ses réglages repartent de la version enregistrée. */
function EditeurDuPopup() {
  const { id } = Route.useParams()
  return <EditeurPopup key={id} id={id} />
}

