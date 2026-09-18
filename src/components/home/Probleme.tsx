import { useEffect, useState } from 'react'

import type { Balise as BaliseType } from './content'
import { BALISES } from './content'
import { BaliseIcon } from './icons'

/** Même seuil que la mise en page mobile de la section. */
const MOBILE = '(max-width: 640px)'

/**
 * Vrai seulement sur un écran de portable. Faux au premier rendu, y compris
 * côté serveur : la page part donc de la version dépliée, puis se replie si
 * l'écran est étroit. Aucun écart entre le HTML servi et le premier rendu
 * du navigateur.
 */
function useMobile() {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const requete = window.matchMedia(MOBILE)
    const suivre = () => setMobile(requete.matches)

    suivre()
    requete.addEventListener('change', suivre)
    return () => requete.removeEventListener('change', suivre)
  }, [])

  return mobile
}

/**
 * Une balise. Sur ordinateur, tout est visible d'un coup. Sur portable, les
 * démarches se replient derrière un « + » : quatre listes de cinq lignes
 * font sinon un mur à faire défiler. La phrase de chute, elle, reste
 * toujours lisible, c'est ce que la carte vient dire.
 */
function Balise({ balise, mobile }: { balise: BaliseType; mobile: boolean }) {
  const [ouverte, setOuverte] = useState(false)
  const idListe = `balise-${balise.icon}`

  const liste = (
    <ol className="balise__puces">
      {balise.puces.map((puce) => (
        <li className="balise__puce" key={puce}>
          {puce}
        </li>
      ))}
    </ol>
  )

  return (
    <li className={`balise${mobile && ouverte ? ' balise--ouverte' : ''}`}>
      <span className="balise__icone">
        <BaliseIcon name={balise.icon} className="balise__svg" />
      </span>

      <h3 className="balise__titre">
        {mobile ? (
          <button
            type="button"
            className="balise__bascule"
            aria-expanded={ouverte}
            aria-controls={idListe}
            onClick={() => setOuverte((etat) => !etat)}
          >
            {balise.titre}
            <span className="balise__plus" aria-hidden="true" />
          </button>
        ) : (
          balise.titre
        )}
      </h3>

      {mobile ? (
        /* Deux boîtes : celle du haut anime sa hauteur, celle du bas coupe
           ce qui dépasse pendant le mouvement. */
        <div className="balise__repli" id={idListe}>
          <div className="balise__repli-fond">{liste}</div>
        </div>
      ) : (
        liste
      )}

      <p className="balise__chute">{balise.detail}</p>
    </li>
  )
}

/**
 * S3. Le problème commun aux cinq cibles, version courte.
 *
 * C'est le noir complet de la page : les projecteurs sont coupés, il ne
 * reste que la douleur. La lumière revient sur la phrase de bascule, et
 * Oysen entre juste après.
 *
 * Les quatre balises du jeu de piste tiennent dans un seul panneau, une
 * colonne chacune, dans l'ordre du parcours. Aucune numérotation : ces
 * colonnes décrivent le problème, pas les étapes d'une solution.
 */
export function Probleme() {
  const mobile = useMobile()

  return (
    <section
      className="section section--probleme"
      aria-labelledby="probleme-title"
    >
      <div className="section__inner">
        <h2 className="section__title probleme__title" id="probleme-title">
          L’organisation événementielle&nbsp;: un vrai jeu de piste&nbsp;!
        </h2>

        <p className="probleme__lede">Un événement, plusieurs contraintes.</p>

        <ol className="balises">
          {BALISES.map((balise) => (
            <Balise balise={balise} key={balise.titre} mobile={mobile} />
          ))}
        </ol>

        <p className="probleme__bascule">
          Tout ça vous prend du temps et de l’énergie.
          <strong className="probleme__bascule-question">
            Et si on pouvait faire mieux&nbsp;?
          </strong>
        </p>
      </div>
    </section>
  )
}
