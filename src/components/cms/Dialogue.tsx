import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'

export type ActionDialogue = {
  libelle: string
  onClick: () => void
  style?: 'plein' | 'contour'
}

/**
 * Une question posée au client avant d'agir : activer un popup qui n'a pas
 * commencé, prolonger un popup terminé, supprimer… Échap ou un clic à côté
 * annulent.
 */
export function Dialogue({
  titre,
  children,
  actions,
  onAnnuler,
  sansAnnuler,
}: {
  titre: string
  children: ReactNode
  actions: ActionDialogue[]
  onAnnuler: () => void
  /** Une simple information : pas de bouton « Annuler » (Échap et le clic à côté ferment toujours). */
  sansAnnuler?: boolean
}) {
  const titreId = useId()
  const boite = useRef<HTMLDivElement>(null)
  /* La dernière version reçue : la prise au clavier n'est posée qu'une fois. */
  const annuler = useRef(onAnnuler)
  annuler.current = onAnnuler

  useEffect(() => {
    boite.current?.querySelector<HTMLElement>('button')?.focus()
    const touche = (evenement: KeyboardEvent) => {
      if (evenement.key === 'Escape') annuler.current()
    }
    document.addEventListener('keydown', touche)
    return () => document.removeEventListener('keydown', touche)
  }, [])

  return (
    <div
      className="dialogue"
      onClick={(evenement) => {
        if (evenement.target === evenement.currentTarget) onAnnuler()
      }}
    >
      <div
        className="dialogue__boite"
        ref={boite}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titreId}
      >
        <h2 className="dialogue__titre" id={titreId}>
          {titre}
        </h2>
        <div className="dialogue__texte">{children}</div>
        <div className="dialogue__actions">
          {actions.map((action) => (
            <button
              key={action.libelle}
              type="button"
              className={`btn ${action.style === 'plein' ? 'btn--solid' : 'btn--ghost'} dialogue__bouton`}
              onClick={action.onClick}
            >
              {action.libelle}
            </button>
          ))}
          {!sansAnnuler ? (
            <button type="button" className="dialogue__annuler" onClick={onAnnuler}>
              Annuler
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
