import type { CSSProperties, ReactNode } from 'react'

import { Arrow } from '../home/icons'
import { Lien } from '../Lien'

/*
 * Les briques communes aux pages-catalogues (« Nos souvenirs », « Blog ») et
 * à leurs fiches : un hero court sous les faisceaux de l'accueil, et des
 * cartes en design cards 01 qui mènent chacune à sa page. Styles dans
 * hub.css.
 */

/* Le hero : surtitre (le h1, porteur de la requête), grande phrase, texte. */
export function HubHero({
  id,
  surtitre,
  titre,
  texte,
  children,
}: {
  id: string
  surtitre: ReactNode
  titre: ReactNode
  texte?: ReactNode
  children?: ReactNode
}) {
  return (
    <section className="hub-hero" aria-labelledby={id}>
      {/* La lueur et les trois faisceaux de l'accueil. Décor. */}
      <div className="hub-hero__salle" aria-hidden="true">
        <span className="hub-hero__faisceaux">
          <i />
          <i />
          <i />
        </span>
      </div>

      <div className="hub-hero__texte">
        <h1 className="section__eyebrow" id={id}>
          {surtitre}
        </h1>
        <p className="hub-hero__titre">{titre}</p>
        {texte ? <p className="hub-hero__lede">{texte}</p> : null}
        {children}
      </div>
    </section>
  )
}

/* Une carte : la photo, une étiquette, le titre, ses repères, un résumé,
   et l'appel. Toute la carte mène à la page (le lien du titre la couvre). */
export function CarteHub({
  href,
  photo,
  focus,
  etiquette,
  titre,
  reperes,
  resume,
  appel,
}: {
  href: string
  photo: string
  focus?: string
  etiquette: string
  titre: string
  reperes: string[]
  resume: string
  appel: string
}) {
  return (
    <li className="hub-carte dc01">
      <span className="dc01__repere" aria-hidden="true" />
      <span className="dc01__survol" aria-hidden="true" />
      <span className="dc01__zone" aria-hidden="true" />

      <div className="hub-carte__photo">
        <img
          src={`/images/services/${photo}-800.webp`}
          srcSet={`/images/services/${photo}-480.webp 480w, /images/services/${photo}-800.webp 800w`}
          sizes="(min-width: 1024px) 24rem, (min-width: 761px) 45vw, 100vw"
          width={800}
          height={1000}
          alt=""
          loading="lazy"
          decoding="async"
          style={focus ? ({ objectPosition: focus } as CSSProperties) : undefined}
        />
      </div>

      <div className="hub-carte__corps">
        <p className="hub-carte__etiquette">{etiquette}</p>
        <h2 className="hub-carte__titre">
          <Lien className="hub-carte__lien" href={href}>
            {titre}
          </Lien>
        </h2>
        <p className="hub-carte__reperes">
          {reperes.map((repere) => (
            <span key={repere}>{repere}</span>
          ))}
        </p>
        <p className="hub-carte__resume">{resume}</p>
        <span className="hub-carte__appel" aria-hidden="true">
          {appel}
          <Arrow className="hub-carte__fleche" />
        </span>
      </div>
    </li>
  )
}

/* Le corps d'une fiche en attente de son contenu : la photo, le résumé,
   une phrase d'attente, le retour au catalogue et le contact. */
export function FicheAttente({
  photo,
  focus,
  resume,
  attente,
  retour,
  retourHref,
}: {
  photo: string
  focus?: string
  resume: string
  attente: string
  retour: string
  retourHref: string
}) {
  return (
    <section className="section section--hub section--fiche" aria-label="Contenu">
      <div className="section__inner fiche">
        <div className="fiche__photo">
          <img
            src={`/images/services/${photo}-1200.webp`}
            srcSet={`/images/services/${photo}-800.webp 800w, /images/services/${photo}-1200.webp 1200w`}
            sizes="(min-width: 1024px) 56rem, 100vw"
            width={1200}
            height={1500}
            alt=""
            decoding="async"
            style={focus ? ({ objectPosition: focus } as CSSProperties) : undefined}
          />
        </div>
        <p className="fiche__resume">{resume}</p>
        <p className="fiche__attente">{attente}</p>
        <div className="fiche__actions">
          <Lien className="hub-lien" href={retourHref}>
            {retour}
            <Arrow className="hub-lien__fleche" />
          </Lien>
          <Lien className="btn btn--solid" href="/contact">
            Imaginer mon événement
          </Lien>
        </div>
      </div>
    </section>
  )
}
