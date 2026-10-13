import type { CSSProperties, ReactNode } from 'react'

import { ordreDeLecture } from '../../lib/grille'
import { cadreDe, normaliserContenu } from '../../lib/popups'
import type { Bloc, BlocPlace, ContenuPopup, Format } from '../../lib/popups'
import { Lien } from '../Lien'

type Props = {
  format: Format
  contenu: ContenuPopup
  /** Identifiant du titre, pour nommer la fenêtre (aria-labelledby). */
  titreId?: string
  /** Absent dans l'aperçu du CMS : pas de bouton de fermeture. */
  onFermer?: () => void
  /** Appelé quand un lien du popup est suivi : la fenêtre se referme. */
  onSuivre?: () => void
  /** Dans le CMS : les liens ne mènent nulle part. */
  apercu?: boolean
}

/**
 * Un popup tel qu'il s'affiche : l'encart à son format, puis sa grille
 * millimétrée (48 colonnes, lignes de 0,5 rem) où chaque bloc tient sa place. Le même rendu sert au site et
 * à l'aperçu du CMS (l'éditeur ajoute sa grille de travail par-dessus, avec
 * classesDuBloc et styleDuBloc). Styles dans popup.css.
 *
 * Les blocs suivent l'ordre de lecture : sur téléphone, ils s'empilent
 * dans cet ordre, chacun sur toute la largeur.
 */
export function PopupCarte({ format, contenu, titreId, onFermer, onSuivre, apercu }: Props) {
  /* Un popup de l'ancien constructeur est converti ici, sur le site comme dans le CMS. */
  const grille = normaliserContenu(contenu)
  const blocs = ordreDeLecture(grille.blocs)
  /* Le cadre réglé dans le CMS : sa largeur, et sa hauteur en lignes de la grille. */
  const cadre = cadreDe(grille, format)
  /* Le premier titre nomme la fenêtre. */
  const premierTitre = blocs.find((b) => b.type === 'titre')?.id

  return (
    <div className={`popup popup--${format}`} style={{ maxWidth: `${cadre.largeur}rem` }}>
      {onFermer ? (
        <button className="popup__fermer" type="button" onClick={onFermer} aria-label="Fermer">
          <span aria-hidden="true">×</span>
        </button>
      ) : null}

      <div className="popup__grille" style={{ gridTemplateRows: `repeat(${cadre.lignes}, var(--pas-ligne))` }}>
        {blocs.map((bloc) => (
          <div key={bloc.id} className={classesDuBloc(bloc)} style={styleDuBloc(bloc)}>
            <div className="popup__contenu">
              <BlocRendu
                bloc={bloc}
                titreId={titreId}
                premierTitre={premierTitre}
                onSuivre={onSuivre}
                apercu={apercu}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Les classes de la case d'un bloc : son type, son centrage horizontal et vertical. */
export function classesDuBloc(bloc: BlocPlace) {
  return `popup__bloc popup__bloc--${bloc.type} popup__bloc--h-${bloc.place.alignH} popup__bloc--v-${bloc.place.alignV}${bloc.place.centre ? ' popup__bloc--centre' : ''}`
}

/** La place du bloc (variables lues par popup.css), ses marges intérieures et son plan. */
export function styleDuBloc({ place }: BlocPlace): CSSProperties {
  const { haut, droite, bas, gauche } = place.marges
  return {
    '--colonne': place.colonne,
    '--largeur': place.largeur,
    '--ligne': place.ligne,
    '--hauteur': place.hauteur,
    padding: `${haut}rem ${droite}rem ${bas}rem ${gauche}rem`,
    zIndex: place.plan || undefined,
  } as CSSProperties
}

type Contexte = Pick<Props, 'titreId' | 'onSuivre' | 'apercu'> & { premierTitre?: string }

export function BlocRendu({ bloc, titreId, premierTitre, onSuivre, apercu }: { bloc: Bloc } & Contexte) {
  switch (bloc.type) {
    case 'surtitre':
      return bloc.texte ? <p className="popup__surtitre">{bloc.texte}</p> : null
    case 'titre':
      return bloc.texte ? (
        <h2 className="popup__titre" id={bloc.id === premierTitre ? titreId : undefined}>
          {bloc.texte}
        </h2>
      ) : null
    case 'sous_titre':
      return bloc.texte ? <p className="popup__sous-titre">{bloc.texte}</p> : null
    case 'texte':
      return bloc.texte ? <p className="popup__texte">{bloc.texte}</p> : null
    case 'offre':
      return bloc.texte || bloc.detail ? (
        <p className="popup__offre">
          {bloc.texte ? <span className="popup__offre-valeur">{bloc.texte}</span> : null}
          {bloc.detail ? <span className="popup__offre-detail">{bloc.detail}</span> : null}
        </p>
      ) : null
    case 'date':
      return bloc.texte ? <p className="popup__date">{bloc.texte}</p> : null
    case 'image':
      return bloc.url ? (
        <img className="popup__image" src={bloc.url} alt={bloc.alt} loading="lazy" />
      ) : apercu ? (
        <div className="popup__image popup__image--vide">Image à ajouter</div>
      ) : null
    case 'bouton':
      return bloc.libelle ? (
        <p className="popup__action">
          <Destination
            href={bloc.href}
            className={`btn ${bloc.style === 'plein' ? 'btn--solid' : 'btn--ghost'} popup__bouton`}
            onSuivre={onSuivre}
            apercu={apercu}
          >
            {bloc.libelle}
          </Destination>
        </p>
      ) : null
    case 'liens': {
      const liens = bloc.liens.filter((l) => l.libelle)
      return liens.length ? (
        <ul className="popup__liens">
          {liens.map((lien, rang) => (
            <li key={rang}>
              <Destination href={lien.href} className="popup__lien" onSuivre={onSuivre} apercu={apercu}>
                {lien.libelle}
              </Destination>
            </li>
          ))}
        </ul>
      ) : null
    }
    case 'separateur':
      return <hr className="popup__separateur" />
  }
}

/**
 * Une page du site passe par <Lien> (sans rechargement) ; une adresse
 * externe s'ouvre dans un nouvel onglet. Dans l'aperçu, rien n'est cliquable.
 */
function Destination({
  href,
  className,
  onSuivre,
  apercu,
  children,
}: {
  href: string
  className: string
  onSuivre?: () => void
  apercu?: boolean
  children: ReactNode
}) {
  if (apercu || !href) return <span className={className}>{children}</span>
  if (href.startsWith('/')) {
    return (
      <Lien className={className} href={href} onClick={onSuivre}>
        {children}
      </Lien>
    )
  }
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer" onClick={onSuivre}>
      {children}
    </a>
  )
}
