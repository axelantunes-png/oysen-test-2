/*
 * Des pictogrammes pris dans le métier, pas dans une banque d'icônes : une
 * épingle, trois interlocuteurs, une courbe de budget, un écusson. Tous au
 * même trait que les chevrons de la barre de navigation.
 */

export type BaliseIconName = 'lieu' | 'prestataires' | 'budget' | 'reglementation'

const BALISE_PATHS: Record<BaliseIconName, string> = {
  /* Une épingle sur la carte : le lieu qu'il faut d'abord trouver. */
  lieu: 'M12 21s-6.5-5.8-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 15.2 12 21 12 21zM14.25 9.75a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0z',
  /* Trois interlocuteurs, et des liaisons coupées : ils ne se parlent pas. */
  prestataires:
    'M14 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM9.3 17h1.6M13.1 17h1.6M7.1 15.2l.9-1.6M9.6 10.4l.9-1.6M16.9 15.2l-.9-1.6M14.4 10.4l-.9-1.6',
  /* Une courbe qui ne tient pas en place : le budget au fil des devis. */
  budget: 'M3 17.5l4-4.5 3.5 3 4.5-8 3 4.5 3-3.5M3 21h18',
  /* Un écusson et sa coche : ce qui engage, et ce qu'il faut valider. */
  reglementation:
    'M12 3.5l7 2.8v5.4c0 4.4-2.9 7.6-7 8.8-4.1-1.2-7-4.4-7-8.8V6.3zM9 12l2.1 2.1 4.1-4.2',
}

export function BaliseIcon({
  name,
  className,
}: {
  name: BaliseIconName
  className?: string
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="28"
      height="28"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={BALISE_PATHS[name]}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 12h15M13.5 6.5 20 12l-6.5 5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
