import { useId, useRef, useState } from 'react'
import type { DragEvent } from 'react'

import {
  ERREURS,
  FORMATS_ACCEPTES,
  NB_FICHIERS_MAX,
  TAILLE_MAX_MO,
} from './content'

const EXTENSIONS = ['pdf', 'docx', 'xlsx', 'png', 'jpg', 'jpeg']

function extension(nom: string) {
  return nom.split('.').pop()?.toLowerCase() ?? ''
}

/** « 2,4 Mo », « 380 Ko » : la taille lue comme on la dit. */
function taille(octets: number) {
  if (octets >= 1024 * 1024) {
    return `${(octets / (1024 * 1024)).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} Mo`
  }
  return `${Math.max(1, Math.round(octets / 1024))} Ko`
}

/**
 * La zone de dépôt des blocs A4, C5, D4, E3 et F4. Glisser-déposer, ou le
 * sélecteur classique au clic et au clavier : le <input type="file"> reste
 * dans la page, habillé par son <label>.
 *
 * Un fichier refusé ne bloque pas les autres : chacun est vérifié seul, et
 * le premier refus est dit sous la zone.
 */
export function Depot({
  fichiers,
  onChange,
}: {
  fichiers: File[]
  onChange: (fichiers: File[]) => void
}) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [survol, setSurvol] = useState(false)
  const [erreur, setErreur] = useState('')

  const ajouter = (liste: FileList | null) => {
    if (!liste) return
    const retenus = [...fichiers]
    let refus = ''

    for (const fichier of Array.from(liste)) {
      if (!EXTENSIONS.includes(extension(fichier.name))) {
        refus ||= ERREURS.fichierFormat
      } else if (fichier.size > TAILLE_MAX_MO * 1024 * 1024) {
        refus ||= ERREURS.fichierLourd
      } else if (retenus.length >= NB_FICHIERS_MAX) {
        refus ||= ERREURS.fichiersTrop
      } else if (
        !retenus.some((f) => f.name === fichier.name && f.size === fichier.size)
      ) {
        retenus.push(fichier)
      }
    }

    setErreur(refus)
    onChange(retenus)
    /* Vide le sélecteur : reprendre le même fichier après suppression marche. */
    if (inputRef.current) inputRef.current.value = ''
  }

  const retirer = (index: number) => {
    setErreur('')
    onChange(fichiers.filter((_, i) => i !== index))
  }

  const deposer = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setSurvol(false)
    ajouter(event.dataTransfer.files)
  }

  const plein = fichiers.length >= NB_FICHIERS_MAX

  return (
    <div className="depot">
      <label
        className={`depot__zone${survol ? ' is-survol' : ''}${plein ? ' is-plein' : ''}`}
        htmlFor={`${id}-input`}
        onDragOver={(event) => {
          event.preventDefault()
          setSurvol(true)
        }}
        onDragLeave={() => setSurvol(false)}
        onDrop={deposer}
      >
        <input
          ref={inputRef}
          className="depot__input"
          id={`${id}-input`}
          type="file"
          multiple
          accept={FORMATS_ACCEPTES}
          disabled={plein}
          aria-describedby={`${id}-aide ${id}-erreur`}
          onChange={(event) => ajouter(event.target.files)}
        />
        <svg
          className="depot__icone"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M12 15.5V4.5M7.5 9 12 4.5 16.5 9M4.5 15v4.5h15V15"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="depot__texte">
          {plein ? (
            `${NB_FICHIERS_MAX} fichiers déposés, c’est le maximum.`
          ) : (
            <>
              Glissez vos fichiers ici, ou{' '}
              <span className="depot__parcourir">parcourez votre ordinateur</span>
            </>
          )}
        </span>
      </label>

      <p className="champ__aide" id={`${id}-aide`}>
        PDF, Word, Excel ou image. {TAILLE_MAX_MO}&nbsp;Mo maximum par fichier,{' '}
        {NB_FICHIERS_MAX}&nbsp;fichiers au plus.
      </p>

      <div className="champ__erreur-zone" id={`${id}-erreur`} aria-live="polite">
        {erreur && <p className="champ__erreur">{erreur}</p>}
      </div>

      {fichiers.length > 0 && (
        <ul className="depot__liste">
          {fichiers.map((fichier, index) => (
            <li className="depot__fichier" key={`${fichier.name}-${fichier.size}`}>
              <span className="depot__nom">{fichier.name}</span>
              <span className="depot__taille">{taille(fichier.size)}</span>
              <button
                type="button"
                className="depot__retirer"
                onClick={() => retirer(index)}
                aria-label={`Retirer ${fichier.name}`}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
                  <path
                    d="M6 6l12 12M18 6 6 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
