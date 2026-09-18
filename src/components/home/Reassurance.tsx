import { NB_EVENEMENTS, NOTE_GOOGLE } from './content'

/**
 * S5. La bande de réassurance : trois faits courts sur une ligne, juste
 * après la présentation d'Oysen, avant la méthode.
 *
 * Le chiffre porte le poids, le libellé le complète. Les espaces entre les
 * deux ne se voient pas (mise en flex) mais évitent qu'un lecteur d'écran
 * les lise collés.
 */
export function Reassurance() {
  return (
    <aside className="reassurance" aria-label="Oysen en quelques chiffres">
      <ul className="reassurance__liste">
        <li className="reassurance__point">
          <strong className="reassurance__chiffre">{NB_EVENEMENTS}</strong>{' '}
          <span className="reassurance__label">événements réalisés</span>
        </li>
        <li className="reassurance__point">
          <strong className="reassurance__chiffre">
            {NOTE_GOOGLE}
            <span className="reassurance__etoile" aria-hidden="true">
              ★
            </span>
            <span className="sr-only"> sur 5</span>
          </strong>{' '}
          <span className="reassurance__label">sur Google</span>
        </li>
        <li className="reassurance__point">
          <strong className="reassurance__chiffre">100&nbsp;%</strong>{' '}
          <span className="reassurance__label">de souvenirs inoubliables</span>
        </li>
      </ul>
    </aside>
  )
}
