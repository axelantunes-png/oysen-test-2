import { useEffect, useRef, useState } from 'react'

import { NB_EVENEMENTS, NOTE_GOOGLE } from './content'

/** Durée de la montée, en millisecondes. */
const DUREE_COMPTEUR = 1800

/* Rapide au départ, lent à l'arrivée : le chiffre se pose. */
function freiner(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Un chiffre qui monte de 0 à sa valeur quand il entre dans l'écran.
 *
 * Le HTML servi porte la valeur finale : sans JavaScript, ou pour qui
 * demande moins d'animations, elle s'affiche telle quelle. Les lecteurs
 * d'écran lisent toujours la valeur finale, jamais le défilement.
 *
 * La valeur finale, invisible, réserve la place : le chiffre qui monte
 * se pose par-dessus, et rien ne bouge autour pendant le comptage.
 */
function Compteur({ valeur }: { valeur: string }) {
  const cible = Number(valeur)
  const ref = useRef<HTMLSpanElement>(null)
  const [affiche, setAffiche] = useState(valeur)

  useEffect(() => {
    const element = ref.current
    if (
      !element ||
      !Number.isFinite(cible) ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    setAffiche('0')
    let image = 0

    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (!entree?.isIntersecting) return
        observateur.disconnect()

        const debut = performance.now()
        const avancer = (maintenant: number) => {
          const t = Math.min(1, (maintenant - debut) / DUREE_COMPTEUR)
          setAffiche(String(Math.round(cible * freiner(t))))
          if (t < 1) image = requestAnimationFrame(avancer)
        }
        image = requestAnimationFrame(avancer)
      },
      { threshold: 0.6 },
    )

    observateur.observe(element)
    return () => {
      observateur.disconnect()
      cancelAnimationFrame(image)
    }
  }, [cible])

  return (
    <span className="compteur" ref={ref}>
      <span className="sr-only">{valeur}</span>
      <span className="compteur__place" aria-hidden="true">
        {valeur}
      </span>
      <span className="compteur__valeur" aria-hidden="true">
        {affiche}
      </span>
    </span>
  )
}

/**
 * S5. La bande de réassurance : trois faits courts sur une ligne, juste
 * après la présentation d'Oysen, avant la méthode.
 *
 * Le chiffre porte le poids, le libellé le complète. Les espaces entre les
 * deux ne se voient pas (mise en flex) mais évitent qu'un lecteur d'écran
 * les lise collés. Chaque chiffre monte de 0 à sa valeur à l'arrivée.
 */
export function Reassurance() {
  return (
    <aside className="reassurance" aria-label="Oysen en quelques chiffres">
      <ul className="reassurance__liste">
        <li className="reassurance__point">
          <strong className="reassurance__chiffre">
            <Compteur valeur={NB_EVENEMENTS} />+
          </strong>{' '}
          <span className="reassurance__label">événements réalisés</span>
        </li>
        <li className="reassurance__point">
          <strong className="reassurance__chiffre">
            <Compteur valeur={NOTE_GOOGLE} />
            <span className="reassurance__etoile" aria-hidden="true">
              ★
            </span>
            <span className="sr-only"> sur 5</span>
          </strong>{' '}
          <span className="reassurance__label">sur Google</span>
        </li>
        <li className="reassurance__point">
          <strong className="reassurance__chiffre">
            <Compteur valeur="100" />
            &nbsp;%
          </strong>{' '}
          <span className="reassurance__label">de souvenirs inoubliables</span>
        </li>
      </ul>
    </aside>
  )
}
