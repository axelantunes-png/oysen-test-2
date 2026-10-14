import { useEffect, useRef, useState } from 'react'

import {
  EVENEMENT_GESTION,
  chargerAnalytics,
  couperAnalytics,
  enregistrerChoix,
  lireChoix,
} from '../lib/consentement'
import type { Choix } from '../lib/consentement'
import { leveeDuRideau } from './apparition'
import { Lien } from './Lien'

/**
 * Le bandeau « Gestion des cookies ».
 *
 * Il attend la fin du rideau, puis se pose en bas de l'écran sans voiler la
 * page : on peut lire le site avant de répondre. Refuser est aussi simple
 * qu'accepter, deux boutons de même taille, côte à côte. Le lien « Gérer
 * mes cookies » du pied de page le rouvre, le choix en cours rappelé.
 */
export function Cookies() {
  const [ouvert, setOuvert] = useState(false)
  const [actuel, setActuel] = useState<Choix | null>(null)
  const titreRef = useRef<HTMLHeadingElement>(null)
  const rouvert = useRef(false)

  useEffect(() => {
    const choix = lireChoix()
    setActuel(choix)

    let actif = true
    if (choix === 'accepte') chargerAnalytics()
    else if (choix === null) {
      void leveeDuRideau().then(() => {
        if (actif) setOuvert(true)
      })
    }

    const rouvrir = () => {
      rouvert.current = true
      setActuel(lireChoix())
      setOuvert(true)
    }
    window.addEventListener(EVENEMENT_GESTION, rouvrir)

    return () => {
      actif = false
      window.removeEventListener(EVENEMENT_GESTION, rouvrir)
    }
  }, [])

  /* Rouvert à la demande : le clavier et le lecteur d'écran y sont conduits. */
  useEffect(() => {
    if (ouvert && rouvert.current) {
      rouvert.current = false
      titreRef.current?.focus()
    }
  }, [ouvert])

  function choisir(choix: Choix) {
    enregistrerChoix(choix)
    if (choix === 'accepte') chargerAnalytics()
    else couperAnalytics()
    setActuel(choix)
    setOuvert(false)
  }

  if (!ouvert) return null

  return (
    <section className="cookies" aria-labelledby="cookies-titre">
      <h2 className="cookies__titre" id="cookies-titre" tabIndex={-1} ref={titreRef}>
        Gestion des cookies
      </h2>
      <p className="cookies__texte">
        Avec votre accord, nous mesurons l’audience du site avec Google
        Analytics, pour savoir quelles pages vous sont utiles. Refuser ne
        change rien à votre visite.{' '}
        <Lien className="cookies__lien" href="/politique-de-confidentialite">
          En savoir plus
        </Lien>
      </p>
      {actuel && (
        <p className="cookies__etat">
          Votre choix actuel&nbsp;:{' '}
          {actuel === 'accepte' ? 'mesure d’audience acceptée' : 'mesure d’audience refusée'}.
        </p>
      )}
      <div className="cookies__actions">
        <button
          type="button"
          className="btn btn--ghost cookies__bouton"
          onClick={() => choisir('refuse')}
        >
          Tout refuser
        </button>
        <button
          type="button"
          className="btn btn--solid cookies__bouton"
          onClick={() => choisir('accepte')}
        >
          Tout accepter
        </button>
      </div>
    </section>
  )
}
