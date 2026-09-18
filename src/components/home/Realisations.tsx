import { REALISATIONS } from './content'
import { Arrow } from './icons'

/**
 * S8. Trois réalisations, format « résultat d'abord ».
 *
 * La contrainte levée passe avant le nom de l'événement : c'est elle qui
 * dit ce que nous savons faire. Le type, la jauge et le lieu se lisent
 * au-dessus, en légende.
 *
 * Chaque photo porte sa légende. Une image d'événement sans légende laisse
 * croire que le lieu est à nous — c'est l'erreur la plus fréquente sur ce
 * type de page.
 */
export function Realisations() {
  return (
    <section
      className="section section--realisations"
      aria-labelledby="realisations-title"
    >
      <div className="section__inner">
        <p className="section__eyebrow">Réalisations</p>
        <h2 className="section__title" id="realisations-title">
          Trois cas, et la contrainte qu’il a fallu lever.
        </h2>

        <ul className="cas">
          {REALISATIONS.map((item) => (
            <li className="cas__item" key={item.type}>
              <a className="cas__link" href={item.href}>
                <span className="cas__frame">
                  <span className="cas__slot">Photo à fournir</span>
                </span>

                <span className="cas__meta">
                  {item.type}
                  <span aria-hidden="true">·</span>
                  {item.jauge}
                  <span aria-hidden="true">·</span>
                  {item.lieu}
                </span>

                <span className="cas__contrainte">{item.contrainte}</span>

                <span className="cas__more">
                  Voir la fiche
                  <Arrow className="cas__arrow" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
