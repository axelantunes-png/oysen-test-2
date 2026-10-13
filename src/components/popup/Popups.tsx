import { useRouterState } from '@tanstack/react-router'
import { useCallback, useEffect, useId, useRef, useState } from 'react'

import { normaliserChemin } from '../../lib/pages-du-site'
import { cibleLaPage } from '../../lib/popups'
import type { Popup } from '../../lib/popups'
import { leveeDuRideau } from '../apparition'
import { PopupCarte } from './PopupCarte'

/*
 * Le délai avant l'ouverture, une fois la page découverte (après le rideau
 * à l'arrivée sur le site) : le visiteur voit d'abord la page. Google
 * pénalise, sur mobile, les fenêtres qui la masquent dès l'arrivée.
 */
const DELAI_MS = 2500

type PopupSite = Pick<Popup, 'id' | 'format' | 'contenu' | 'ciblage' | 'pages' | 'pages_exclues' | 'frequence' | 'frequence_jours'>

/* ---- La fréquence, retenue par le navigateur du visiteur ----
   Un popup compte comme vu dès qu'il s'affiche. */

const CLE = (id: string) => `oysen-popup-${id}`

function lire(stockage: () => Storage, cle: string) {
  try {
    return stockage().getItem(cle)
  } catch {
    return null
  }
}

function ecrire(stockage: () => Storage, cle: string, valeur: string) {
  try {
    stockage().setItem(cle, valeur)
  } catch {
    /* Navigation privée ou stockage bloqué : le popup reviendra, tant pis. */
  }
}

const session = () => window.sessionStorage
const local = () => window.localStorage

function aAfficher(popup: PopupSite) {
  const cle = CLE(popup.id)
  switch (popup.frequence) {
    case 'chaque_page':
      return true
    case 'visite':
      return lire(session, cle) === null
    case 'une_fois':
      return lire(local, cle) === null
    case 'jours': {
      const vu = Number(lire(local, cle))
      return !vu || Date.now() - vu >= popup.frequence_jours * 86_400_000
    }
  }
}

function marquerVu(popup: PopupSite) {
  const cle = CLE(popup.id)
  if (popup.frequence === 'visite') ecrire(session, cle, '1')
  if (popup.frequence === 'une_fois' || popup.frequence === 'jours') {
    ecrire(local, cle, String(Date.now()))
  }
}

/**
 * Les popups promotionnels du site, gérés dans le CMS (onglet Promotion).
 *
 * Relus à chaque page, après l'affichage : la base n'envoie que ceux en
 * ligne (activés, commencés, pas terminés), et un popup désactivé dans le
 * CMS disparaît dès la page suivante, même dans un onglet déjà ouvert. Ceux
 * qui visent la page et que leur fréquence autorise s'ouvrent ensemble,
 * empilés l'un sous l'autre.
 */
export function Popups() {
  const chemin = useRouterState({
    select: (state) =>
      state.resolvedLocation ? normaliserChemin(state.resolvedLocation.pathname) : null,
  })
  const [ouverts, setOuverts] = useState<PopupSite[]>([])

  /* À chaque page : ce qui était ouvert se ferme, puis ceux de la nouvelle page. */
  useEffect(() => {
    setOuverts([])
    if (!chemin) return

    let actif = true
    let minuterie = 0

    /*
     * Le client Supabase n'est téléchargé qu'ici, après l'affichage de la page.
     * Le client public lit en anonyme : un administrateur connecté voit le
     * site comme un visiteur, popups inactifs exclus.
     */
    void import('../../lib/supabase')
      .then(({ getSupabasePublic }) =>
        getSupabasePublic()
          .from('popups')
          .select('id, format, contenu, ciblage, pages, pages_exclues, frequence, frequence_jours'),
      )
      .then(async ({ data }) => {
        const elus = ((data as PopupSite[] | null) ?? []).filter(
          (p) => cibleLaPage(p, chemin) && aAfficher(p),
        )
        if (!actif || !elus.length) return

        await leveeDuRideau()
        if (!actif) return
        minuterie = window.setTimeout(() => {
          elus.forEach(marquerVu)
          setOuverts(elus)
        }, DELAI_MS)
      })
      .catch(() => {
        /* Hors ligne ou base injoignable : pas de popup, la page reste. */
      })

    return () => {
      actif = false
      window.clearTimeout(minuterie)
    }
  }, [chemin])

  /* Stables : la fenêtre ne reprend pas la main à chaque rendu. */
  const fermer = useCallback(
    (id: string) => setOuverts((liste) => liste.filter((p) => p.id !== id)),
    [],
  )
  const toutFermer = useCallback(() => setOuverts([]), [])

  if (!ouverts.length) return null

  return <Fenetre popups={ouverts} onFermer={fermer} onToutFermer={toutFermer} />
}

function Fenetre({
  popups,
  onFermer,
  onToutFermer,
}: {
  popups: PopupSite[]
  onFermer: (id: string) => void
  onToutFermer: () => void
}) {
  const base = useId()
  const fenetre = useRef<HTMLDivElement>(null)

  /* Échap ferme tout ; le fond ne défile plus ; la prise passe à la fenêtre. */
  useEffect(() => {
    const precedent = document.activeElement as HTMLElement | null
    fenetre.current?.querySelector<HTMLElement>('.popup__fermer')?.focus()

    const touche = (evenement: KeyboardEvent) => {
      if (evenement.key === 'Escape') onToutFermer()
    }
    const debordement = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', touche)
    return () => {
      document.body.style.overflow = debordement
      document.removeEventListener('keydown', touche)
      precedent?.focus?.()
    }
  }, [onToutFermer])

  return (
    <div
      className="popups"
      ref={fenetre}
      onClick={(evenement) => {
        /* Un clic à côté des encarts ferme tout. */
        if (evenement.target === evenement.currentTarget) onToutFermer()
      }}
    >
      {popups.map((popup) => (
        <div
          key={popup.id}
          className="popups__item"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${base}-${popup.id}`}
        >
          <PopupCarte
            format={popup.format}
            contenu={popup.contenu}
            titreId={`${base}-${popup.id}`}
            onFermer={() => onFermer(popup.id)}
            onSuivre={onToutFermer}
          />
        </div>
      ))}
    </div>
  )
}
