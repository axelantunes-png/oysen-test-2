import type { SyntheticEvent } from 'react'

import { TEMOIGNAGES } from './content'

/** Même seuil que la mise en page mobile de la section. */
const MOBILE = '(max-width: 760px)'

/**
 * iOS n'a pas l'API plein écran standard : Safari mobile n'expose que cette
 * méthode, propre à la balise vidéo.
 */
type VideoPleinEcran = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void
}

/**
 * Sur mobile, lancer la lecture ouvre le plein écran : dans une colonne de
 * quelques centimètres, un visage qui parle est illisible. Sur ordinateur,
 * rien ne change, la vidéo se lit dans la page.
 *
 * L'appel a lieu pendant le geste du visiteur, seul moment où le navigateur
 * accepte une demande de plein écran. S'il la refuse, la lecture continue
 * dans la page : jamais d'erreur à l'écran.
 */
function ouvrirEnGrandEcran(event: SyntheticEvent<HTMLVideoElement>) {
  if (!window.matchMedia(MOBILE).matches) return
  if (document.fullscreenElement) return

  const video = event.currentTarget as VideoPleinEcran

  if (video.requestFullscreen) {
    void video.requestFullscreen().catch(() => {})
  } else {
    video.webkitEnterFullscreen?.()
  }
}

/**
 * S7. Les témoignages.
 *
 * Trois témoignages filmés en format portrait, en attente des vidéos :
 * l'emplacement est réservé à l'écran, comme pour les photos de la barre de
 * tri, pour qu'on ne l'oublie pas en relecture.
 *
 * Au-dessus de chaque vidéo, qui parle et pour quel événement : sans ça, un
 * visage inconnu ne prouve rien.
 */
export function Preuves() {
  return (
    <section
      className="section section--preuves"
      aria-labelledby="preuves-title"
    >
      <div className="section__inner">
        <p className="section__eyebrow">Témoignages</p>
        <h2 className="section__title preuves__title" id="preuves-title">
          Ce qu’ils disent de nous.
        </h2>

        <ul className="temoignages">
          {TEMOIGNAGES.map((temoignage, index) => (
            <li className="temoignage" key={index}>
              <article className="temoignage__carte">
                <h3 className="temoignage__nom">{temoignage.nom}</h3>
                <p className="temoignage__type">{temoignage.evenement}</p>
              </article>

              {temoignage.video ? (
                /*
                  Aucune lecture automatique : trois vidéos qui démarrent
                  seules se parleraient dessus, et le visiteur veut le son.
                  Le navigateur affiche la première image en attendant.
                */
                <video
                  className="temoignage__video"
                  controls
                  playsInline
                  preload="metadata"
                  onPlay={ouvrirEnGrandEcran}
                >
                  <source
                    src={`/videos/temoignages/${temoignage.video}.mp4`}
                    type="video/mp4"
                  />
                </video>
              ) : (
                /* Emplacement réservé, le temps que la vidéo arrive. */
                <span className="temoignage__slot">
                  <span className="temoignage__play" aria-hidden="true" />
                  Vidéo à fournir
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
