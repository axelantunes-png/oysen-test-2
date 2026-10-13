import { QueryClient, queryOptions } from '@tanstack/react-query'

import { normaliserContenu } from './popups'
import type { Popup } from './popups'
import { getSupabase } from './supabase'

/*
 * Le cache des données du CMS (TanStack Query), en mémoire de l'onglet
 * seulement : rien n'est écrit sur le disque, et tout est vidé à la
 * déconnexion (voir le cadre du CMS, cms/route.tsx).
 *
 * Importé par les seules pages du CMS : le site public ne le télécharge pas.
 */
export const cacheCms = new QueryClient({
  defaultOptions: {
    queries: {
      /*
       * Pendant 30 s, une donnée en cache est servie telle quelle. Au-delà,
       * elle s'affiche quand même aussitôt, puis est revérifiée en
       * arrière-plan (un changement fait depuis un autre appareil, par
       * exemple).
       */
      staleTime: 30_000,
      retry: 1,
    },
  },
})

/** Tous les popups, du plus récent au plus ancien. Partagée par la liste et l'éditeur. */
export const requetePopups = queryOptions({
  queryKey: ['popups'],
  queryFn: async () => {
    const { data, error } = await getSupabase()
      .from('popups')
      .select('*')
      .order('cree_le', { ascending: false })
    if (error) throw error
    return (data as Popup[]).map(versLaGrille)
  },
})

/** Un popup de l'ancien constructeur passe au format de la grille dès sa lecture. */
function versLaGrille(popup: Popup): Popup {
  return { ...popup, contenu: normaliserContenu(popup.contenu) }
}

/** Remplace (ou ajoute en tête) un popup dans le cache, sans recharger. */
export function majPopupEnCache(brut: Popup) {
  const popup = versLaGrille(brut)
  cacheCms.setQueryData(requetePopups.queryKey, (liste = []) =>
    liste.some((p) => p.id === popup.id)
      ? liste.map((p) => (p.id === popup.id ? popup : p))
      : [popup, ...liste],
  )
}

/** Retire un popup du cache. */
export function retirerPopupDuCache(id: string) {
  cacheCms.setQueryData(requetePopups.queryKey, (liste = []) => liste.filter((p) => p.id !== id))
}
