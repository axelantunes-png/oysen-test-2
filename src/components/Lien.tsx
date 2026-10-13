import { Link } from '@tanstack/react-router'
import type { AnchorHTMLAttributes } from 'react'

/*
 * Link pose par défaut la classe « active » sur le lien de la page
 * affichée : le site marque lui-même son entrée active (Navbar.tsx).
 */
const SANS_ETAT = {}

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string
}

/**
 * Un lien vers une page du site : le <Link> de TanStack Router, qui change
 * de page sans recharger le document et précharge la page visée au survol.
 *
 * Il prend l'adresse complète, paramètres compris (« /contact?profil=… »),
 * comme un <a>. Les ancres de la page (« #… »), le téléphone, le courriel et
 * les sites externes restent de simples <a>.
 */
export function Lien({ href, ...props }: Props) {
  /* Le typage exige `to`, mais c'est `href` qui fixe la destination. */
  return <Link {...props} to="." href={href} activeProps={SANS_ETAT} />
}
