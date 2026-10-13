/** Actif ou inactif, d'un clic. */
export function Interrupteur({
  actif,
  onChange,
}: {
  actif: boolean
  onChange: (actif: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={actif}
      className={`interrupteur${actif ? ' interrupteur--actif' : ''}`}
      onClick={() => onChange(!actif)}
    >
      <span className="interrupteur__piste" aria-hidden="true">
        <span className="interrupteur__curseur" />
      </span>
      <span className="interrupteur__libelle">{actif ? 'Actif' : 'Inactif'}</span>
    </button>
  )
}
