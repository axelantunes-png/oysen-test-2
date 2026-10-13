import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

/*
 * Le projet Supabase d'Oysen. La clé « publishable » est faite pour être
 * livrée au navigateur : elle ne donne que ce que les règles d'accès (RLS)
 * de la base autorisent. Ne jamais mettre ici la clé « secret ».
 */
const SUPABASE_URL = 'https://nbsqmiuxylpvuzncnyab.supabase.co'
const SUPABASE_CLE_PUBLIQUE = 'sb_publishable_D_NvOhblddQuiphkuOtk2A_q_rWqiBM'

let client: SupabaseClient | null = null

/**
 * Le client Supabase, créé au premier appel, côté navigateur seulement :
 * la session de l'administrateur vit dans le stockage du navigateur.
 *
 * Flux « implicit » : le lien de réinitialisation reçu par e-mail porte
 * lui-même la session. Il marche donc même ouvert sur un autre appareil
 * que celui où la demande a été faite (le flux PKCE, lui, l'exige).
 */
export function getSupabase() {
  client ??= createClient(SUPABASE_URL, SUPABASE_CLE_PUBLIQUE, {
    auth: {
      flowType: 'implicit',
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
  return client
}

let clientPublic: SupabaseClient | null = null

/**
 * Le client du site public : toujours anonyme, même quand l'administrateur
 * est connecté au CMS dans le même navigateur. Sans cela, le site lirait
 * avec ses droits à lui, et lui montrerait aussi les popups inactifs.
 *
 * Aucune session n'est lue, gardée ni rafraîchie ; sa clé de stockage est
 * distincte de celle du CMS pour que les deux clients ne se gênent pas.
 */
export function getSupabasePublic() {
  clientPublic ??= createClient(SUPABASE_URL, SUPABASE_CLE_PUBLIQUE, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: 'oysen-site-public',
    },
  })
  return clientPublic
}

/** La session ouverte, ou null. Attend la lecture d'un éventuel lien reçu. */
export async function sessionOuverte() {
  const { data } = await getSupabase().auth.getSession()
  return data.session
}
