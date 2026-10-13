import { useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react'
import { createPortal } from 'react-dom'

import { BlocRendu, classesDuBloc, styleDuBloc } from '../popup/PopupCarte'
import {
  HAUTEUR_MIN,
  LARGEUR_MIN,
  ajouterBloc,
  ajusterHauteurs,
  borner,
  bornerCadre,
  centrerDansLaLargeur,
  changerDePlan,
  changerPlace,
  decalerBloc,
  hauteurMax,
  ordreDeLecture,
  placerBloc,
  pleineLargeur,
  remplacerBloc,
  supprimerBloc,
} from '../../lib/grille'
import type { Zone } from '../../lib/grille'
import { COLONNES, PAS_LIGNE, TYPES_DE_BLOC, cadreDe, estVide, nomDuType, placeParDefaut } from '../../lib/popups'
import type {
  AlignementH,
  AlignementV,
  Bloc,
  BlocPlace,
  Cadre,
  ContenuPopup,
  Format,
  Marges,
  TypeDeBloc,
} from '../../lib/popups'
import { getSupabase } from '../../lib/supabase'
import { ChoixDestination } from './ChoixDestination'
import { IconePoubelle } from './Icones'

/*
 * Le constructeur du contenu d'un popup, en trois parties que l'éditeur
 * répartit sur trois colonnes :
 *
 * - la palette des blocs (à gauche) : on glisse un bloc sur l'aperçu, ou
 *   on clique pour l'ajouter en bas ;
 * - la grille de l'aperçu (au centre), un papier millimétré : un bloc se
 *   déplace librement dans le cadre, puis se cale sur la grille quand on le
 *   lâche ; ses poignées (4 côtés, 4 coins) le redimensionnent, calé de
 *   même ; le cadre a ses propres poignées (côtés et bas) ;
 * - les réglages du bloc choisi (à droite) : son texte, sa position, son
 *   centrage, et « … » pour les marges et la superposition.
 *
 * Un bloc dont le contenu dépasse s'agrandit seul, jusqu'au bas du cadre ;
 * au-delà, il est signalé. Le placement lui-même est dans lib/grille.ts.
 */

type Changer = (contenu: ContenuPopup) => void

/* Au-delà de ce déplacement (en pixels), un appui devient un glisser. */
const SEUIL = 4

/*
 * Le téléphone : l'éditeur y garde la grille de l'ordinateur, réduite pour
 * tenir dans l'écran, et le toucher y a ses règles (ci-dessous). Au-delà,
 * rien ne change.
 */
export const TELEPHONE = '(max-width: 40rem)'

/** Vrai sur un écran de téléphone (suit les changements de taille). */
export function useTelephone() {
  return useSyncExternalStore(
    (ecouteur) => {
      const requete = window.matchMedia(TELEPHONE)
      requete.addEventListener('change', ecouteur)
      return () => requete.removeEventListener('change', ecouteur)
    },
    () => window.matchMedia(TELEPHONE).matches,
    () => false,
  )
}

/**
 * La grille en pixels, à l'écran : son cadre, la largeur d'une colonne, la
 * hauteur d'une ligne (réduites avec l'aperçu sur téléphone).
 */
function mesurer(grille: HTMLElement, lignes: number) {
  const cadre = grille.getBoundingClientRect()
  return { cadre, colonne: cadre.width / COLONNES, ligne: cadre.height / lignes }
}

/** Suit le pointeur jusqu'au lâcher, sur toute la page. */
function suivrePointeur(
  bouger: (e: globalThis.PointerEvent) => void,
  finir: (lache: boolean) => void,
  classe: string,
) {
  const classes = classe.split(' ')
  document.documentElement.classList.add(...classes)
  const lacher = () => fin(true)
  const annuler = () => fin(false)
  function fin(lache: boolean) {
    document.documentElement.classList.remove(...classes)
    window.removeEventListener('pointermove', bouger)
    window.removeEventListener('pointerup', lacher)
    window.removeEventListener('pointercancel', annuler)
    finir(lache)
  }
  window.addEventListener('pointermove', bouger)
  window.addEventListener('pointerup', lacher)
  window.addEventListener('pointercancel', annuler)
}

/* ---- Le glisser depuis la palette ----
 * La palette (à gauche) et la grille (au centre) sont deux composants :
 * ce petit magasin leur fait partager le bloc en cours de glisser. */

type Glisse = { type: TypeDeBloc; nom: string; x: number; y: number }

const glisser = {
  courant: null as Glisse | null,
  ecouteurs: new Set<() => void>(),
  /** Le dépôt, confié par la grille (rien ne se pose si le pointeur est loin de l'aperçu). */
  deposer: null as ((type: TypeDeBloc, x: number, y: number) => void) | null,
  /** Le clic qui suit un glisser n'est pas un clic. */
  vientDeFinir: false,
  poser(valeur: Glisse | null) {
    glisser.courant = valeur
    glisser.ecouteurs.forEach((ecouteur) => ecouteur())
  },
  finir() {
    glisser.vientDeFinir = true
    window.setTimeout(() => {
      glisser.vientDeFinir = false
    }, 0)
  },
}

function abonner(ecouteur: () => void) {
  glisser.ecouteurs.add(ecouteur)
  return () => {
    glisser.ecouteurs.delete(ecouteur)
  }
}

function useGlisse() {
  return useSyncExternalStore(
    abonner,
    () => glisser.courant,
    () => null,
  )
}

/* ---- La palette (à gauche) ---- */

export function PaletteBlocs({
  contenu,
  onChange,
  onSelection,
}: {
  contenu: ContenuPopup
  onChange: Changer
  onSelection: (id: string) => void
}) {
  const telephone = useTelephone()

  function saisir(e: PointerEvent, type: TypeDeBloc, nom: string) {
    /* Sur téléphone, un bloc s'ajoute en le touchant : la palette défile au doigt. */
    if (e.button !== 0 || (telephone && e.pointerType === 'touch')) return
    e.preventDefault()
    const depart = { x: e.clientX, y: e.clientY }
    let actif = false
    suivrePointeur(
      (evenement) => {
        if (!actif && Math.hypot(evenement.clientX - depart.x, evenement.clientY - depart.y) < SEUIL) return
        actif = true
        glisser.poser({ type, nom, x: evenement.clientX, y: evenement.clientY })
      },
      (lache) => {
        const dernier = glisser.courant
        glisser.poser(null)
        if (!actif) return
        glisser.finir()
        if (lache && dernier) glisser.deposer?.(type, dernier.x, dernier.y)
      },
      'glisser-en-cours',
    )
  }

  return (
    <div className="palette">
      <p className="cms-aide">
        {telephone
          ? 'Touchez un bloc pour l’ajouter en bas du popup, puis placez-le dans l’aperçu.'
          : 'Glissez un bloc sur l’aperçu, à l’endroit voulu, ou cliquez pour l’ajouter en bas.'}
      </p>
      <div className="palette__blocs">
        {TYPES_DE_BLOC.map((t) => (
          <button
            key={t.type}
            type="button"
            className="palette__bloc"
            onPointerDown={(e) => saisir(e, t.type, t.nom)}
            onClick={() => {
              if (glisser.vientDeFinir) return
              const { contenu: suivant, id } = ajouterBloc(contenu, t.type)
              onChange(suivant)
              onSelection(id)
            }}
          >
            <span className="palette__nom">{t.nom}</span>
            <span className="palette__description">{t.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---- La grille de l'aperçu (au centre) ---- */

/* Les poignées d'un bloc : un côté (n, s, e, o) ou un coin. */
const POIGNEES = ['n', 's', 'e', 'o', 'ne', 'no', 'se', 'so'] as const
type Poignee = (typeof POIGNEES)[number]

/* Les poignées du cadre : ses deux côtés et son bas. */
const POIGNEES_CADRE = ['o', 'e', 's'] as const
type PoigneeCadre = (typeof POIGNEES_CADRE)[number]

type Geste =
  /** Le bloc suit le pointeur (dx, dy en pixels) ; zone : où il se calera. */
  | { type: 'deplacer'; id: string; dx: number; dy: number; zone: Zone }
  /** La taille du bloc suit le pointeur, calée sur la grille. */
  | { type: 'etirer'; id: string; zone: Zone }
  /** La taille du cadre suit le pointeur. */
  | { type: 'cadre'; cadre: Cadre }

export function GrilleEdition({
  format,
  contenu,
  selection,
  onChange,
  onCadre,
  onSelection,
  onAvance,
}: {
  format: Format
  contenu: ContenuPopup
  selection: string | null
  onChange: Changer
  /** Le cadre redimensionné par ses poignées. */
  onCadre: (cadre: Cadre) => void
  onSelection: (id: string | null) => void
  onAvance: () => void
}) {
  const glisse = useGlisse()
  const grille = useRef<HTMLDivElement>(null)
  const [geste, setGeste] = useState<Geste | null>(null)
  /* Les blocs dont le contenu dépasse du bas du cadre. */
  const [debordent, setDebordent] = useState('')
  /* Le contenu à jour, pour les gestes commencés avant un rendu. */
  const actuel = useRef(contenu)
  actuel.current = contenu
  const telephone = useTelephone()
  /* Sur téléphone : l'aperçu réduit pour tenir dans la largeur de l'écran. */
  const boite = useRef<HTMLDivElement>(null)
  const [reduction, setReduction] = useState({ echelle: 1, largeur: 0, hauteur: 0 })
  const echelle = telephone ? reduction.echelle : 1

  const blocs = ordreDeLecture(contenu.blocs)
  /* Le cadre : réglé par ses poignées, jamais par les blocs. */
  const cadre = geste?.type === 'cadre' ? geste.cadre : cadreDe(contenu, format)
  const lignes = cadre.lignes

  /* Le dépôt d'un bloc de la palette : son coin haut gauche sous le pointeur. */
  function positionSous(x: number, y: number) {
    const element = grille.current
    if (!element) return null
    const m = mesurer(element, lignes)
    const marge = 24
    if (x < m.cadre.left - marge || x > m.cadre.right + marge || y < m.cadre.top - marge || y > m.cadre.bottom + marge) {
      return null
    }
    return { colonne: (x - m.cadre.left) / m.colonne + 1, ligne: (y - m.cadre.top) / m.ligne + 1 }
  }
  glisser.deposer = (type, x, y) => {
    const position = positionSous(x, y)
    if (!position) return
    const { contenu: suivant, id } = ajouterBloc(actuel.current, type, position)
    onChange(suivant)
    onSelection(id)
  }
  const arrivee = (() => {
    if (!glisse) return null
    const position = positionSous(glisse.x, glisse.y)
    if (!position) return null
    const defaut = placeParDefaut(glisse.type)
    return borner(
      {
        ...position,
        largeur: Math.min(defaut.largeur, COLONNES - Math.round(position.colonne) + 1),
        hauteur: defaut.hauteur,
      },
      lignes,
    )
  })()

  /*
   * Un bloc dont le contenu dépasse s'agrandit, une fois le geste fini,
   * jusqu'au bas du cadre au plus ; au-delà, il est signalé.
   */
  useLayoutEffect(() => {
    const element = grille.current
    if (!element || geste || glisse) return
    /* Le contenu se mesure sans la réduction du téléphone. */
    const ligne = PAS_LIGNE * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16)
    const besoins: Record<string, number> = {}
    const trop: string[] = []
    element.querySelectorAll<HTMLElement>('[data-bloc]').forEach((boite) => {
      const bloc = actuel.current.blocs.find((b) => b.id === boite.dataset.bloc)
      const interieur = boite.querySelector<HTMLElement>('.popup__contenu')
      if (!bloc || !interieur || bloc.type === 'image') return
      const style = getComputedStyle(boite)
      const hauteur = interieur.scrollHeight + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
      const besoin = Math.ceil(hauteur / ligne - 0.05)
      if (besoin > bloc.place.hauteur) besoins[bloc.id] = besoin
      if (besoin > hauteurMax(actuel.current, bloc)) trop.push(bloc.id)
    })
    const signales = trop.sort().join(' ')
    if (signales !== debordent) setDebordent(signales)
    const ajuste = ajusterHauteurs(actuel.current, besoins)
    if (ajuste.blocs.some((b, i) => b !== actuel.current.blocs[i])) onChange(ajuste)
  })

  /* La réduction de l'aperçu, recalculée quand l'écran ou le cadre change. */
  useLayoutEffect(() => {
    const popup = boite.current
    const parent = popup?.parentElement
    if (!telephone || !popup || !parent) return
    function calculer() {
      if (!popup || !parent) return
      const style = getComputedStyle(parent)
      const dispo = parent.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
      const suivante = {
        echelle: Math.min(1, dispo / popup.offsetWidth),
        largeur: popup.offsetWidth,
        hauteur: popup.offsetHeight,
      }
      setReduction((avant) =>
        avant.echelle === suivante.echelle && avant.largeur === suivante.largeur && avant.hauteur === suivante.hauteur
          ? avant
          : suivante,
      )
    }
    calculer()
    const observateur = new ResizeObserver(calculer)
    observateur.observe(parent)
    observateur.observe(popup)
    return () => observateur.disconnect()
  }, [telephone])

  /* Saisir un bloc : il suit le pointeur librement, et se cale sur la grille au lâcher. */
  function saisir(e: PointerEvent, bloc: BlocPlace) {
    if (e.button !== 0 || !grille.current) return
    /* Sur téléphone, toucher un bloc pas encore choisi le choisit seulement : la page défile toujours. */
    if (telephone && e.pointerType === 'touch' && bloc.id !== selection) {
      onSelection(bloc.id)
      return
    }
    e.preventDefault()
    onSelection(bloc.id)
    const m = mesurer(grille.current, lignes)
    const depart = { x: e.clientX, y: e.clientY }
    const p = bloc.place
    /* Le bloc suit le pointeur sans jamais sortir du cadre. */
    const gauche = (p.colonne - 1) * m.colonne
    const haut = (p.ligne - 1) * m.ligne
    const dxMax = m.cadre.width - gauche - p.largeur * m.colonne
    const dyMax = lignes * m.ligne - haut - p.hauteur * m.ligne
    let actif = false
    let zone: Zone = p

    suivrePointeur(
      (evenement) => {
        const libreX = evenement.clientX - depart.x
        const libreY = evenement.clientY - depart.y
        if (!actif && Math.hypot(libreX, libreY) < SEUIL) return
        const dx = Math.min(Math.max(libreX, -gauche), Math.max(0, dxMax))
        const dy = Math.min(Math.max(libreY, -haut), Math.max(0, dyMax))
        actif = true
        zone = borner({ ...p, colonne: p.colonne + dx / m.colonne, ligne: p.ligne + dy / m.ligne }, lignes)
        setGeste({ type: 'deplacer', id: bloc.id, dx, dy, zone })
      },
      (lache) => {
        setGeste(null)
        if (!actif) return
        glisser.finir()
        if (lache) onChange(placerBloc(actuel.current, bloc.id, zone))
      },
      'glisser-en-cours',
    )
  }

  /* Une poignée : le côté (ou le coin) suit le pointeur ; le côté opposé ne bouge pas. */
  function etirer(e: PointerEvent, bloc: BlocPlace, poignee: Poignee) {
    if (e.button !== 0 || !grille.current) return
    e.preventDefault()
    e.stopPropagation()
    const m = mesurer(grille.current, lignes)
    const depart = { x: e.clientX, y: e.clientY }
    const p = bloc.place
    let zone: Zone = p

    suivrePointeur(
      (evenement) => {
        const dc = (evenement.clientX - depart.x) / m.colonne
        const dl = (evenement.clientY - depart.y) / m.ligne
        let { colonne, largeur, ligne, hauteur } = p
        if (poignee.includes('e')) {
          largeur = Math.min(COLONNES - p.colonne + 1, Math.max(LARGEUR_MIN, Math.round(p.largeur + dc)))
        }
        if (poignee.includes('o')) {
          const fin = p.colonne + p.largeur
          colonne = Math.min(fin - LARGEUR_MIN, Math.max(1, Math.round(p.colonne + dc)))
          largeur = fin - colonne
        }
        if (poignee.includes('s')) {
          hauteur = Math.min(lignes - p.ligne + 1, Math.max(HAUTEUR_MIN, Math.round(p.hauteur + dl)))
        }
        if (poignee.includes('n')) {
          const fin = p.ligne + p.hauteur
          ligne = Math.min(fin - HAUTEUR_MIN, Math.max(1, Math.round(p.ligne + dl)))
          hauteur = fin - ligne
        }
        zone = { colonne, largeur, ligne, hauteur }
        setGeste({ type: 'etirer', id: bloc.id, zone })
      },
      (lache) => {
        setGeste(null)
        glisser.finir()
        if (lache) onChange(placerBloc(actuel.current, bloc.id, zone))
      },
      `etirer-en-cours etirer-${poignee}`,
    )
  }

  /*
   * Les poignées du cadre. Sur un côté, le cadre s'élargit des deux côtés à
   * la fois (il reste centré, comme sur le site) ; en bas, il gagne des lignes.
   */
  function etirerCadre(e: PointerEvent, poignee: PoigneeCadre) {
    if (e.button !== 0 || !grille.current) return
    e.preventDefault()
    e.stopPropagation()
    const m = mesurer(grille.current, lignes)
    const rem = m.ligne / PAS_LIGNE
    const depart = { x: e.clientX, y: e.clientY }
    const initial = cadreDe(actuel.current, format)
    let suivant = initial

    suivrePointeur(
      (evenement) => {
        const dx = (evenement.clientX - depart.x) / rem
        const dl = (evenement.clientY - depart.y) / m.ligne
        suivant = bornerCadre({
          largeur: poignee === 'e' ? initial.largeur + dx * 2 : poignee === 'o' ? initial.largeur - dx * 2 : initial.largeur,
          lignes: poignee === 's' ? initial.lignes + dl : initial.lignes,
        })
        setGeste({ type: 'cadre', cadre: suivant })
      },
      (lache) => {
        setGeste(null)
        glisser.finir()
        if (lache) onCadre(suivant)
      },
      `etirer-en-cours etirer-${poignee}`,
    )
  }

  function clavier(e: KeyboardEvent, bloc: BlocPlace) {
    if (e.target !== e.currentTarget) return
    const pas = e.shiftKey ? 4 : 1
    const fleches: Record<string, [number, number]> = {
      ArrowLeft: [-pas, 0],
      ArrowRight: [pas, 0],
      ArrowUp: [0, -pas],
      ArrowDown: [0, pas],
    }
    const fleche = fleches[e.key]
    if (fleche) {
      e.preventDefault()
      onChange(decalerBloc(contenu, bloc.id, fleche[0], fleche[1]))
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault()
      onChange(supprimerBloc(contenu, bloc.id))
      onSelection(null)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelection(bloc.id)
    }
  }

  return (
    <div
      ref={boite}
      className={`popup popup--${format} popup--edition`}
      style={
        {
          maxWidth: `${cadre.largeur}rem`,
          '--cadre-largeur': `${cadre.largeur}rem`,
          '--echelle': echelle,
          ...(echelle < 1
            ? {
                transform: `scale(${echelle})`,
                transformOrigin: 'top left',
                marginRight: (echelle - 1) * reduction.largeur,
                marginBottom: (echelle - 1) * reduction.hauteur,
              }
            : null),
        } as CSSProperties
      }
    >
      {/* Les poignées du cadre : ses deux côtés et son bas. */}
      {POIGNEES_CADRE.map((poignee) => (
        <span
          key={poignee}
          className={`cadre-poignee cadre-poignee--${poignee}`}
          title={poignee === 's' ? 'Changer la hauteur du popup' : 'Changer la largeur du popup'}
          aria-hidden="true"
          onPointerDown={(e) => etirerCadre(e, poignee)}
        />
      ))}
      {geste?.type === 'cadre' ? (
        <span className="cadre-mesure" aria-hidden="true">
          {String(cadre.largeur).replace('.', ',')} rem × {String(cadre.lignes * PAS_LIGNE).replace('.', ',')} rem
        </span>
      ) : null}

      <div
        ref={grille}
        className={`popup__grille grille-edition${glisse || geste ? ' grille-edition--geste' : ''}`}
        style={{ gridTemplateRows: `repeat(${lignes}, var(--pas-ligne))`, height: `calc(${lignes} * var(--pas-ligne))` }}
        onClick={(e) => {
          if (glisser.vientDeFinir) return
          if (e.target === e.currentTarget) onSelection(null)
        }}
      >
        {blocs.length === 0 && !glisse ? (
          <p className="grille-edition__vide">
            Glissez ici un bloc de la palette, ou appliquez une mise en page.
          </p>
        ) : null}

        {blocs.map((bloc) => {
          const choisi = bloc.id === selection
          const enGeste = geste && geste.type !== 'cadre' && geste.id === bloc.id ? geste : null
          const affiche: BlocPlace =
            enGeste?.type === 'etirer' ? { ...bloc, place: { ...bloc.place, ...enGeste.zone } } : bloc
          const style = styleDuBloc(affiche)
          if (enGeste?.type === 'deplacer') {
            /* Le déplacement à l'écran, ramené à l'échelle de l'aperçu. */
            style.transform = `translate(${enGeste.dx / echelle}px, ${enGeste.dy / echelle}px)`
            style.zIndex = 60
          }
          return (
            <div
              key={bloc.id}
              className={`${classesDuBloc(bloc)} grille-edition__bloc${choisi ? ' grille-edition__bloc--choisi' : ''}${
                enGeste?.type === 'deplacer' ? ' grille-edition__bloc--deplace' : ''
              }${debordent.split(' ').includes(bloc.id) ? ' grille-edition__bloc--deborde' : ''}`}
              style={style}
              data-bloc={bloc.id}
              tabIndex={0}
              role="button"
              aria-pressed={choisi}
              aria-label={`Bloc ${nomDuType(bloc.type)}`}
              onPointerDown={(e) => saisir(e, bloc)}
              onClick={() => {
                if (!glisser.vientDeFinir) onSelection(bloc.id)
              }}
              onKeyDown={(e) => clavier(e, bloc)}
            >
              <div className="popup__contenu">
                {estVide(bloc) ? (
                  <p className="grille-edition__a-remplir">{nomDuType(bloc.type)} à remplir</p>
                ) : (
                  <BlocRendu bloc={bloc} apercu />
                )}
              </div>

              {choisi && !enGeste ? (
                <span className="grille-edition__outils" onPointerDown={(e) => e.stopPropagation()}>
                  <span className="grille-edition__type">{nomDuType(bloc.type)}</span>
                  <button
                    type="button"
                    className="grille-edition__outil"
                    aria-label="Centrer le bloc sur la ligne"
                    aria-pressed={!!bloc.place.centre}
                    title="Centrer sur la ligne"
                    onClick={(e) => {
                      e.stopPropagation()
                      onChange(centrerDansLaLargeur(contenu, bloc.id))
                    }}
                  >
                    <svg className="icone" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 3v18M4 9h5M4 15h5M20 9h-5M20 15h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="grille-edition__outil"
                    aria-label="Réglages avancés du bloc"
                    title="Réglages avancés"
                    onClick={(e) => {
                      e.stopPropagation()
                      onAvance()
                    }}
                  >
                    …
                  </button>
                  <button
                    type="button"
                    className="grille-edition__outil"
                    aria-label={`Supprimer le bloc ${nomDuType(bloc.type)}`}
                    title="Supprimer"
                    onClick={(e) => {
                      e.stopPropagation()
                      onChange(supprimerBloc(contenu, bloc.id))
                      onSelection(null)
                    }}
                  >
                    <IconePoubelle />
                  </button>
                </span>
              ) : null}

              {choisi && enGeste?.type !== 'deplacer'
                ? POIGNEES.map((poignee) => (
                    <span
                      key={poignee}
                      className={`grille-edition__poignee grille-edition__poignee--${poignee}`}
                      aria-hidden="true"
                      onPointerDown={(e) => etirer(e, bloc, poignee)}
                    />
                  ))
                : null}
            </div>
          )
        })}

        {/* Où le bloc se calera au lâcher. */}
        {geste?.type === 'deplacer' || arrivee ? (
          <div
            className="grille-edition__depot"
            style={(() => {
              const z = geste?.type === 'deplacer' ? geste.zone : (arrivee as Zone)
              return {
                gridColumn: `${z.colonne} / span ${z.largeur}`,
                gridRow: `${z.ligne} / span ${z.hauteur}`,
              }
            })()}
            aria-hidden="true"
          />
        ) : null}
      </div>

      {/* Le bloc de la palette suit le pointeur. */}
      {glisse
        ? createPortal(
            <div className="fantome" style={{ left: glisse.x, top: glisse.y }} aria-hidden="true">
              {glisse.nom}
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}

/* ---- Les réglages du bloc choisi (à droite) ---- */

const MARGES = [0, 0.25, 0.5, 0.75, 1, 1.5, 2, 3]
const COTES: { cle: keyof Marges; nom: string }[] = [
  { cle: 'haut', nom: 'En haut' },
  { cle: 'bas', nom: 'En bas' },
  { cle: 'gauche', nom: 'À gauche' },
  { cle: 'droite', nom: 'À droite' },
]
const ALIGNEMENTS_H: { valeur: AlignementH; nom: string }[] = [
  { valeur: 'gauche', nom: 'Gauche' },
  { valeur: 'centre', nom: 'Centre' },
  { valeur: 'droite', nom: 'Droite' },
]
const ALIGNEMENTS_V: { valeur: AlignementV; nom: string }[] = [
  { valeur: 'haut', nom: 'Haut' },
  { valeur: 'centre', nom: 'Centre' },
  { valeur: 'bas', nom: 'Bas' },
]
const FLECHES: { sens: string; fleche: string; nom: string; dc: number; dl: number }[] = [
  { sens: 'haut', fleche: '↑', nom: 'vers le haut', dc: 0, dl: -1 },
  { sens: 'gauche', fleche: '←', nom: 'vers la gauche', dc: -1, dl: 0 },
  { sens: 'droite', fleche: '→', nom: 'vers la droite', dc: 1, dl: 0 },
  { sens: 'bas', fleche: '↓', nom: 'vers le bas', dc: 0, dl: 1 },
]

const marge = (rem: number) => (rem === 0 ? 'Aucune' : `${String(rem).replace('.', ',')} rem`)

/* Sur téléphone : la taille du bloc aux boutons, deux carreaux par appui. */
const TAILLES_BLOC = [
  { cle: 'largeur', nom: 'Largeur', pas: [-2, 2] },
  { cle: 'hauteur', nom: 'Hauteur', pas: [-2, 2] },
] as const

export function Inspecteur({
  contenu,
  selection,
  avance,
  onChange,
  onSelection,
  onAvance,
}: {
  contenu: ContenuPopup
  selection: string | null
  avance: boolean
  onChange: Changer
  onSelection: (id: string | null) => void
  onAvance: (ouvert: boolean) => void
}) {
  const bloc = contenu.blocs.find((b) => b.id === selection)
  const telephone = useTelephone()

  if (!bloc) {
    return (
      <div className="inspecteur inspecteur--vide">
        <p className="inspecteur__titre">Réglages du bloc</p>
        <p className="cms-aide">
          {telephone ? 'Touchez' : 'Cliquez sur'} un bloc de l’aperçu pour modifier son texte, sa place et son centrage.
        </p>
      </div>
    )
  }

  const { place } = bloc

  return (
    <div className="inspecteur">
      <div className="inspecteur__tete">
        <p className="inspecteur__titre">{nomDuType(bloc.type)}</p>
        <button
          type="button"
          className={`inspecteur__outil${avance ? ' inspecteur__outil--actif' : ''}`}
          aria-expanded={avance}
          aria-controls="reglages-avances"
          title="Réglages avancés"
          onClick={() => onAvance(!avance)}
        >
          <span aria-hidden="true">…</span>
          <span className="sr-only">Réglages avancés</span>
        </button>
        <button
          type="button"
          className="inspecteur__outil"
          title="Supprimer ce bloc"
          onClick={() => {
            onChange(supprimerBloc(contenu, bloc.id))
            onSelection(null)
          }}
        >
          <IconePoubelle />
          <span className="sr-only">Supprimer ce bloc</span>
        </button>
      </div>

      <section className="inspecteur__section" aria-label="Contenu du bloc">
        <ChampsDuBloc
          bloc={bloc}
          onChange={(modifie) => onChange(remplacerBloc(contenu, { ...modifie, place } as BlocPlace))}
        />
      </section>

      <section className="inspecteur__section" aria-label="Position">
        <p className="inspecteur__sous-titre">Position</p>
        <div className="inspecteur__boutons">
          <button
            type="button"
            className="inspecteur__bouton"
            aria-pressed={!!place.centre}
            onClick={() => onChange(centrerDansLaLargeur(contenu, bloc.id))}
          >
            {place.centre ? 'Centré sur la ligne' : 'Centrer sur la ligne'}
          </button>
          <button
            type="button"
            className="inspecteur__bouton"
            disabled={place.colonne === 1 && place.largeur === COLONNES}
            onClick={() => onChange(pleineLargeur(contenu, bloc.id))}
          >
            Pleine largeur
          </button>
        </div>
        <div className="croix">
          {FLECHES.map((f) => (
            <button
              key={f.sens}
              type="button"
              className={`croix__bouton croix__bouton--${f.sens}`}
              aria-label={`Décaler d’un cran ${f.nom}`}
              title={`Décaler d’un cran ${f.nom}`}
              onClick={() => onChange(decalerBloc(contenu, bloc.id, f.dc, f.dl))}
            >
              {f.fleche}
            </button>
          ))}
        </div>
        {telephone ? (
          <div className="taille-bloc">
            {TAILLES_BLOC.map((t) => (
              <div className="taille-bloc__ligne" key={t.cle}>
                <span className="taille-bloc__nom">{t.nom}</span>
                {t.pas.map((pas) => (
                  <button
                    key={pas}
                    type="button"
                    className="croix__bouton"
                    aria-label={`${t.nom} : ${pas > 0 ? 'agrandir' : 'réduire'}`}
                    onClick={() =>
                      onChange(placerBloc(contenu, bloc.id, { ...place, [t.cle]: place[t.cle] + pas }))
                    }
                  >
                    {pas > 0 ? '+' : '−'}
                  </button>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p className="cms-aide">
            Ou au clavier, sur le bloc choisi : les flèches décalent d’un cran, Maj + flèche de
            quatre.
          </p>
        )}
      </section>

      <section className="inspecteur__section" aria-label="Centrage">
        <p className="inspecteur__sous-titre">Centrage dans son cadre</p>
        <Segments
          libelle="Horizontal"
          options={ALIGNEMENTS_H}
          valeur={place.alignH}
          onChange={(alignH) => onChange(changerPlace(contenu, bloc.id, { alignH }))}
        />
        <Segments
          libelle="Vertical"
          options={ALIGNEMENTS_V}
          valeur={place.alignV}
          onChange={(alignV) => onChange(changerPlace(contenu, bloc.id, { alignV }))}
        />
      </section>

      {avance ? (
        <section className="inspecteur__section" id="reglages-avances" aria-label="Réglages avancés">
          <p className="inspecteur__sous-titre">Marges intérieures</p>
          <div className="inspecteur__marges">
            {COTES.map((cote) => (
              <ChoixMarge
                key={cote.cle}
                libelle={cote.nom}
                valeur={place.marges[cote.cle]}
                onChange={(valeur) =>
                  onChange(
                    changerPlace(contenu, bloc.id, { marges: { ...place.marges, [cote.cle]: valeur } }),
                  )
                }
              />
            ))}
          </div>
          <p className="inspecteur__sous-titre">Superposition</p>
          <div className="inspecteur__boutons">
            <button
              type="button"
              className="inspecteur__bouton"
              onClick={() => onChange(changerDePlan(contenu, bloc.id, 'devant'))}
            >
              Passer devant
            </button>
            <button
              type="button"
              className="inspecteur__bouton"
              onClick={() => onChange(changerDePlan(contenu, bloc.id, 'derriere'))}
            >
              Passer derrière
            </button>
          </div>
          <p className="cms-aide">Pour un bloc posé sur un autre, une photo sous un texte par exemple.</p>
        </section>
      ) : null}
    </div>
  )
}

function Segments<T extends string>({
  libelle,
  options,
  valeur,
  onChange,
}: {
  libelle: string
  options: { valeur: T; nom: string }[]
  valeur: T
  onChange: (valeur: T) => void
}) {
  return (
    <div className="segments" role="radiogroup" aria-label={libelle}>
      <span className="segments__libelle" aria-hidden="true">
        {libelle}
      </span>
      <div className="segments__choix">
        {options.map((o) => (
          <button
            key={o.valeur}
            type="button"
            role="radio"
            aria-checked={valeur === o.valeur}
            className={`segments__option${valeur === o.valeur ? ' segments__option--choisie' : ''}`}
            onClick={() => onChange(o.valeur)}
          >
            {o.nom}
          </button>
        ))}
      </div>
    </div>
  )
}

function ChoixMarge({
  libelle,
  valeur,
  onChange,
}: {
  libelle: string
  valeur: number
  onChange: (valeur: number) => void
}) {
  const id = useId()
  return (
    <div className="cms-champ">
      <label className="cms-champ__label" htmlFor={id}>
        {libelle}
      </label>
      <select
        className="cms-champ__input"
        id={id}
        value={valeur}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {MARGES.map((m) => (
          <option key={m} value={m}>
            {marge(m)}
          </option>
        ))}
      </select>
    </div>
  )
}

/* ---- Les champs de chaque type de bloc ---- */

function ChampsDuBloc({ bloc, onChange }: { bloc: Bloc; onChange: (bloc: Bloc) => void }) {
  switch (bloc.type) {
    case 'surtitre':
    case 'titre':
    case 'sous_titre':
    case 'date':
      return (
        <Champ
          libelle="Texte"
          valeur={bloc.texte}
          onChange={(texte) => onChange({ ...bloc, texte })}
          exemple={bloc.type === 'date' ? 'Ex. : Jusqu’au 30 juin' : undefined}
        />
      )
    case 'texte':
      return (
        <Champ
          libelle="Texte"
          valeur={bloc.texte}
          onChange={(texte) => onChange({ ...bloc, texte })}
          multiligne
        />
      )
    case 'offre':
      return (
        <>
          <Champ
            libelle="Offre mise en avant"
            valeur={bloc.texte}
            onChange={(texte) => onChange({ ...bloc, texte })}
            exemple="Ex. : -15 %"
          />
          <Champ
            libelle="Précision"
            valeur={bloc.detail}
            onChange={(detail) => onChange({ ...bloc, detail })}
            exemple="Ex. : sur votre prestation"
          />
        </>
      )
    case 'image':
      return <ChampsImage bloc={bloc} onChange={onChange} />
    case 'bouton':
      return (
        <>
          <Champ
            libelle="Texte du bouton"
            valeur={bloc.libelle}
            onChange={(libelle) => onChange({ ...bloc, libelle })}
          />
          <ChoixDestination valeur={bloc.href} onChange={(href) => onChange({ ...bloc, href })} />
          <div className="cms-champ">
            <span className="cms-champ__label">Style</span>
            <div className="cms-choix-ligne">
              {(['plein', 'contour'] as const).map((style) => (
                <label className="cms-radio" key={style}>
                  <input
                    type="radio"
                    checked={bloc.style === style}
                    onChange={() => onChange({ ...bloc, style })}
                  />
                  {style === 'plein' ? 'Plein' : 'Contour'}
                </label>
              ))}
            </div>
          </div>
        </>
      )
    case 'liens':
      return (
        <div className="bloc-edition__liens">
          {bloc.liens.map((lien, rang) => (
            <div className="bloc-edition__lien" key={rang}>
              <Champ
                libelle={`Lien ${rang + 1} : texte`}
                valeur={lien.libelle}
                onChange={(libelle) =>
                  onChange({
                    ...bloc,
                    liens: bloc.liens.map((l, i) => (i === rang ? { ...l, libelle } : l)),
                  })
                }
                exemple="Ex. : Offre spéciale mariage"
              />
              <ChoixDestination
                libelle={`Lien ${rang + 1} : destination`}
                valeur={lien.href}
                onChange={(href) =>
                  onChange({
                    ...bloc,
                    liens: bloc.liens.map((l, i) => (i === rang ? { ...l, href } : l)),
                  })
                }
              />
              <button
                type="button"
                className="cms-bouton cms-bouton--discret"
                onClick={() => onChange({ ...bloc, liens: bloc.liens.filter((_, i) => i !== rang) })}
              >
                Retirer ce lien
              </button>
            </div>
          ))}
          <button
            type="button"
            className="cms-bouton"
            onClick={() => onChange({ ...bloc, liens: [...bloc.liens, { libelle: '', href: '/' }] })}
          >
            Ajouter un lien
          </button>
        </div>
      )
    case 'separateur':
      return <p className="cms-aide">Un filet horizontal, sans réglage.</p>
  }
}

function Champ({
  libelle,
  valeur,
  onChange,
  exemple,
  multiligne,
}: {
  libelle: string
  valeur: string
  onChange: (valeur: string) => void
  exemple?: string
  multiligne?: boolean
}) {
  const id = useId()
  return (
    <div className="cms-champ">
      <label className="cms-champ__label" htmlFor={id}>
        {libelle}
      </label>
      {multiligne ? (
        <textarea
          className="cms-champ__input"
          id={id}
          rows={4}
          value={valeur}
          placeholder={exemple}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="cms-champ__input"
          id={id}
          type="text"
          value={valeur}
          placeholder={exemple}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  )
}

/** Le dépôt d'une image dans le stockage Supabase (espace « popups »). */
function ChampsImage({
  bloc,
  onChange,
}: {
  bloc: Extract<Bloc, { type: 'image' }>
  onChange: (bloc: Bloc) => void
}) {
  const id = useId()
  const [envoi, setEnvoi] = useState<'repos' | 'en-cours' | 'erreur'>('repos')

  async function deposer(fichier: File) {
    setEnvoi('en-cours')
    const extension = fichier.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const chemin = `${crypto.randomUUID()}.${extension}`
    const stockage = getSupabase().storage.from('popups')
    const { error } = await stockage.upload(chemin, fichier, { contentType: fichier.type })
    if (error) {
      setEnvoi('erreur')
      return
    }
    setEnvoi('repos')
    onChange({ ...bloc, url: stockage.getPublicUrl(chemin).data.publicUrl })
  }

  return (
    <>
      <div className="cms-champ">
        <label className="cms-champ__label" htmlFor={id}>
          {bloc.url ? 'Remplacer l’image' : 'Image'}
        </label>
        <input
          className="cms-champ__fichier"
          id={id}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            const fichier = e.target.files?.[0]
            if (fichier) void deposer(fichier)
          }}
        />
        <p className="cms-aide">
          {envoi === 'en-cours'
            ? 'Envoi en cours…'
            : envoi === 'erreur'
              ? 'L’envoi a échoué : JPEG, PNG ou WebP, 5 Mo au plus.'
              : 'JPEG, PNG ou WebP, 5 Mo au plus.'}
        </p>
      </div>
      <Champ
        libelle="Description de l’image (pour les malvoyants)"
        valeur={bloc.alt}
        onChange={(alt) => onChange({ ...bloc, alt })}
      />
    </>
  )
}
