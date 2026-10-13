import { imagesDuContenu } from '../../lib/popups'
import type { ContenuPopup } from '../../lib/popups'
import { getSupabase } from '../../lib/supabase'

/**
 * Supprime définitivement un popup et tout ce qui lui est rattaché : sa
 * ligne dans la base, puis ses images dans le stockage. La ligne part en
 * premier : si les images ne partaient pas, le site ne serait pas touché,
 * seuls des fichiers inutilisés resteraient.
 *
 * Renvoie false si la suppression a échoué (rien n'a alors été effacé).
 */
export async function supprimerPopup(id: string, contenu: ContenuPopup) {
  const supabase = getSupabase()
  const { error } = await supabase.from('popups').delete().eq('id', id)
  if (error) return false

  const images = imagesDuContenu(contenu)
  if (images.length) await supabase.storage.from('popups').remove(images)
  return true
}

/**
 * Après un enregistrement : les images retirées du contenu (bloc supprimé,
 * image remplacée) sont effacées du stockage, pour n'y garder que celles
 * qui servent.
 */
export async function nettoyerImages(avant: ContenuPopup, apres: ContenuPopup) {
  const gardees = imagesDuContenu(apres)
  const retirees = imagesDuContenu(avant).filter((image) => !gardees.includes(image))
  if (retirees.length) await getSupabase().storage.from('popups').remove(retirees)
}
