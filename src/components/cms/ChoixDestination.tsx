import { useId, useState } from 'react'

import { PAGES_DU_SITE } from '../../lib/pages-du-site'

const AUTRE = '__autre__'

/**
 * Où mène un lien ou un bouton : une page du site, choisie dans la liste
 * (aucune adresse à taper), ou une autre adresse au besoin (page avec
 * paramètres, site externe).
 */
export function ChoixDestination({
  valeur,
  onChange,
  libelle = 'Destination',
}: {
  valeur: string
  onChange: (href: string) => void
  libelle?: string
}) {
  const id = useId()
  const connue = PAGES_DU_SITE.some((page) => page.chemin === valeur)
  const [autre, setAutre] = useState(!connue && valeur !== '')

  return (
    <div className="cms-champ">
      <label className="cms-champ__label" htmlFor={id}>
        {libelle}
      </label>
      <select
        className="cms-champ__input"
        id={id}
        value={autre ? AUTRE : valeur}
        onChange={(evenement) => {
          if (evenement.target.value === AUTRE) {
            setAutre(true)
            return
          }
          setAutre(false)
          onChange(evenement.target.value)
        }}
      >
        {PAGES_DU_SITE.map((page) => (
          <option key={page.chemin} value={page.chemin}>
            {page.nom}
          </option>
        ))}
        <option value={AUTRE}>Autre adresse…</option>
      </select>
      {autre ? (
        <input
          className="cms-champ__input"
          type="text"
          placeholder="https://… ou /contact?profil=…"
          aria-label={`${libelle} : autre adresse`}
          value={valeur}
          onChange={(evenement) => onChange(evenement.target.value)}
        />
      ) : null}
    </div>
  )
}
