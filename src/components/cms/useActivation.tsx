import { useCallback, useState } from 'react'

import {
  ajouterJours,
  aujourdhui,
  dateLisible,
  debutVersJour,
  dernierJourVersFin,
  finVersDernierJour,
  jourVersDebut,
} from '../../lib/popups'
import type { Popup } from '../../lib/popups'
import { Dialogue } from './Dialogue'

type Dates = Pick<Popup, 'actif' | 'date_debut' | 'date_fin'>
export type Changement = Partial<Dates>

type Demande<T> = { popup: T; cas: 'a-venir' | 'termine' }

/**
 * Activer un popup, quelles que soient ses dates, mais en prévenant :
 *
 * - pas encore commencé : on demande confirmation, ou de l'afficher dès
 *   aujourd'hui ;
 * - déjà terminé : il ne peut pas s'afficher, on propose de repousser la
 *   fin de 7 jours à partir d'aujourd'hui, ou d'en choisir une autre.
 *
 * `appliquer` reçoit les champs à changer ; `choisirDate` mène au choix
 * d'une date de fin.
 */
export function useActivation<T extends Dates>(
  appliquer: (popup: T, changement: Changement) => void,
  choisirDate: (popup: T) => void,
) {
  const [demande, setDemande] = useState<Demande<T> | null>(null)
  const annuler = useCallback(() => setDemande(null), [])

  function activer(popup: T) {
    const maintenant = Date.now()
    if (new Date(popup.date_fin).getTime() <= maintenant) {
      setDemande({ popup, cas: 'termine' })
    } else if (new Date(popup.date_debut).getTime() > maintenant) {
      setDemande({ popup, cas: 'a-venir' })
    } else {
      appliquer(popup, { actif: true })
    }
  }

  function conclure(changement: Changement | null) {
    if (demande && changement) appliquer(demande.popup, changement)
    setDemande(null)
  }

  let dialogue = null
  if (demande?.cas === 'a-venir') {
    const debut = dateLisible(debutVersJour(demande.popup.date_debut))
    dialogue = (
      <Dialogue
        titre="Ce popup n’a pas encore commencé"
        onAnnuler={annuler}
        actions={[
          {
            libelle: `L’activer, il démarrera le ${debut}`,
            style: 'plein',
            onClick: () => conclure({ actif: true }),
          },
          {
            libelle: 'L’afficher dès aujourd’hui',
            onClick: () => conclure({ actif: true, date_debut: jourVersDebut(aujourdhui()) }),
          },
        ]}
      >
        <p>
          Sa date de début est fixée au {debut}. Activé maintenant, il restera
          programmé et ne s’affichera sur le site qu’à partir de cette date.
        </p>
      </Dialogue>
    )
  }
  if (demande?.cas === 'termine') {
    const fin = dateLisible(finVersDernierJour(demande.popup.date_fin))
    const prolongation = ajouterJours(aujourdhui(), 7)
    dialogue = (
      <Dialogue
        titre="Ce popup est terminé"
        onAnnuler={annuler}
        actions={[
          {
            libelle: 'Ajouter 7 jours à partir d’aujourd’hui',
            style: 'plein',
            onClick: () =>
              conclure({ actif: true, date_fin: dernierJourVersFin(prolongation) }),
          },
          {
            libelle: 'Choisir une autre date de fin',
            onClick: () => {
              const popup = demande.popup
              setDemande(null)
              choisirDate(popup)
            },
          },
        ]}
      >
        <p>
          Sa date de fin était le {fin}. Pour qu’il s’affiche de nouveau,
          modifiez sa date de fin. Avec 7 jours de plus, il restera en ligne
          jusqu’au {dateLisible(prolongation)} inclus.
        </p>
      </Dialogue>
    )
  }

  return { activer, dialogue }
}
