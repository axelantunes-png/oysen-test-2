import type { ReactNode } from 'react'

/* Les petites icônes du CMS, au trait, à la couleur du texte qu'elles accompagnent. */

function Icone({ children }: { children: ReactNode }) {
  return (
    <svg
      className="icone"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

export function IconeCalendrier() {
  return (
    <Icone>
      <rect x="3" y="4.5" width="18" height="16.5" rx="2" />
      <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
    </Icone>
  )
}

export function IconePage() {
  return (
    <Icone>
      <path d="M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8z" />
      <path d="M14 2.5V8h5.5" />
    </Icone>
  )
}

export function IconeRepetition() {
  return (
    <Icone>
      <path d="M17 2.5l3.5 3.5L17 9.5" />
      <path d="M3.5 11.5V10a4 4 0 0 1 4-4h13" />
      <path d="M7 21.5L3.5 18 7 14.5" />
      <path d="M20.5 12.5V14a4 4 0 0 1-4 4h-13" />
    </Icone>
  )
}

export function IconePoubelle() {
  return (
    <Icone>
      <path d="M3.5 6h17M8.5 6V4a1.5 1.5 0 0 1 1.5-1.5h4A1.5 1.5 0 0 1 15.5 4v2" />
      <path d="M18.5 6l-.9 13.1a2 2 0 0 1-2 1.9H8.4a2 2 0 0 1-2-1.9L5.5 6" />
      <path d="M10 10.5v6M14 10.5v6" />
    </Icone>
  )
}

export function IconeAttention() {
  return (
    <Icone>
      <path d="M10.3 3.9L2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9.5v4M12 17h.01" />
    </Icone>
  )
}

export function IconePlus() {
  return (
    <Icone>
      <path d="M12 5v14M5 12h14" />
    </Icone>
  )
}
