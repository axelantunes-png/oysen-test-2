import type { CSSProperties } from 'react'

import { TRI } from './content'
import { Arrow } from './icons'

/**
 * S2 — La barre de tri, cœur de la page.
 *
 * Cinq affiches : la photo occupe toute la carte, le titre et la ligne de
 * qualification sont posés par-dessus, en bas, sur un voile qui porte le
 * contraste. Les titres restent alignés en pied de carte : la rangée se
 * balaye d'un coup d'œil.
 *
 * La carte entière est le lien : pas de « Découvrir » redondant, une simple
 * flèche dans la ligne de titre.
 *
 * Tant qu'une entrée n'a pas de photo (voir TRI dans content.ts), la carte
 * affiche son emplacement réservé.
 */
export function Tri() {
  return (
    <section className="section section--tri" aria-labelledby="tri-title">
      <div className="section__inner">
        <p className="section__eyebrow">Nos services</p>
        <h2 className="section__title" id="tri-title">
          Les événements que nous organisons pour vous
        </h2>

        <ul className="tri">
          {TRI.map((entry) => (
            <li key={entry.href}>
              <a className="tri__link" href={entry.href}>
                {entry.photo ? (
                  <span
                    className="tri__media"
                    style={
                      entry.photo.focus
                        ? ({ '--tri-focus': entry.photo.focus } as CSSProperties)
                        : undefined
                    }
                  >
                    {/*
                      Sous la ligne de flottaison : chargée à l'approche.
                      sizes suit la grille — trois colonnes, deux, puis une.
                    */}
                    <img
                      className="tri__img"
                      src={`/images/services/${entry.photo.name}-1200.jpg`}
                      srcSet={`/images/services/${entry.photo.name}-800.jpg 800w, /images/services/${entry.photo.name}-1200.jpg 1200w`}
                      sizes="(min-width: 1025px) 31vw, (min-width: 761px) 45vw, 90vw"
                      width={1200}
                      height={1500}
                      alt={entry.photo.alt}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                ) : (
                  <span className="tri__media">
                    <span className="tri__slot">Photo à fournir</span>
                  </span>
                )}

                <span className="tri__body">
                  <span className="tri__name">{entry.title}</span>
                  <span className="tri__qualif">{entry.qualif}</span>
                  <span className="tri__more">
                    Découvrir
                    <Arrow className="tri__arrow" />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
