import { useSuspenseQuery } from '@tanstack/react-query'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { KeyboardEvent, ReactNode } from 'react'

import { Lien } from '../Lien'
import { PopupCarte } from '../popup/PopupCarte'
import { Fenetre } from '../popup/Popups'
import { GrilleEdition, Inspecteur, PaletteBlocs, pincement, useTelephone } from './Constructeur'
import { Dialogue } from './Dialogue'
import { IconeInfo } from './Icones'
import { Interrupteur } from './Interrupteur'
import { nettoyerImages, supprimerPopup } from './suppression'
import { useActivation } from './useActivation'
import {
  majPopupEnCache,
  requetePopups,
  retirerPopupDuCache,
} from '../../lib/cms-cache'
import { changerCadre } from '../../lib/grille'
import { PAGES_DU_SITE } from '../../lib/pages-du-site'
import {
  CIBLAGES,
  DUREES,
  FORMATS,
  FREQUENCES,
  MODELES,
  ajouterJours,
  LARGEURS_FORMAT,
  brouillonNeuf,
  cadreDe,
  formatProche,
  chevauchements,
  dateLisible,
  debutVersJour,
  dernierJourVersFin,
  ecartEnJours,
  finVersDernierJour,
  jourVersDebut,
  modeleReconnu,
  statut,
} from '../../lib/popups'
import type { Brouillon, ContenuPopup, Popup } from '../../lib/popups'
import { getSupabase } from '../../lib/supabase'

/*
 * Créer (/promotion/nouveau) ou modifier un popup. Tout se règle à
 * gauche, l'aperçu se tient à droite ; rien n'est enregistré avant
 * « Enregistrer ».
 *
 * Le popup et les autres (pour signaler ceux qui s'afficheraient avec lui)
 * viennent du cache du CMS, partagé avec la liste : venant de la liste,
 * l'éditeur s'ouvre aussitôt.
 *
 * Tant que la création n'est pas terminée, le popup est un brouillon :
 * chaque changement s'enregistre seul, une seconde après le dernier, sans
 * jamais l'activer. « Enregistrer » termine la création.
 */

type Enregistrement = 'repos' | 'en-cours' | 'fait'
type SauvegardeAuto = 'repos' | 'en-cours' | 'fait' | 'erreur'

/* Le délai après le dernier changement avant d'enregistrer le brouillon. */
const DELAI_BROUILLON = 1000

/* Les deux temps de l'éditeur : ce que voit le visiteur, puis où et quand il le voit. */
const ONGLETS = [
  { id: 'contenu', nom: 'Contenu', description: 'Ce que voient vos visiteurs' },
  { id: 'diffusion', nom: 'Diffusion', description: 'Où, quand, combien de fois' },
] as const

type Onglet = (typeof ONGLETS)[number]['id']

/* Le dernier popup créé : son éditeur s'ouvre en annonçant « Enregistré ». */
let toutJusteCree: string | null = null

/**
 * Le popup sans ses dates de création et de modification, gérées par la
 * base ; un contenu sans cadre en reçoit un (lib/popups.ts, cadreDe).
 */
function versBrouillon({ cree_le: _c, modifie_le: _m, ...brouillon }: Popup): Brouillon {
  if (brouillon.contenu.cadre) return brouillon
  return { ...brouillon, contenu: { ...brouillon.contenu, cadre: cadreDe(brouillon.contenu, brouillon.format) } }
}

function dureeLibre(popup: Pick<Popup, 'date_debut' | 'date_fin'>) {
  const duree = ecartEnJours(debutVersJour(popup.date_debut), finVersDernierJour(popup.date_fin)) + 1
  return !DUREES.includes(duree)
}

export function EditeurPopup({ id }: { id: string }) {
  const nouveau = id === 'nouveau'
  const navigate = useNavigate()
  const { data: tous } = useSuspenseQuery(requetePopups)
  const enregistre = tous.find((p) => p.id === id)
  /* L'identifiant en base : celui du popup, ou de son brouillon dès sa première sauvegarde. */
  const idEnBase = useRef<string | null>(nouveau ? null : id)
  const autres = tous.filter((p) => p.id !== id && p.id !== idEnBase.current)

  const [popup, setPopup] = useState<Brouillon | null>(() =>
    nouveau ? brouillonNeuf() : enregistre ? versBrouillon(enregistre) : null,
  )
  const [enregistrement, setEnregistrement] = useState<Enregistrement>(() =>
    toutJusteCree === id ? 'fait' : 'repos',
  )
  const [modifie, setModifie] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)
  const [dureePerso, setDureePerso] = useState(() => (enregistre ? dureeLibre(enregistre) : false))
  const [modeleDemande, setModeleDemande] = useState<(typeof MODELES)[number] | null>(null)
  const [suppression, setSuppression] = useState(false)
  /* Le bloc choisi dans l'aperçu, et ses réglages avancés (« … ») ouverts ou non. */
  const [selection, setSelection] = useState<string | null>(null)
  const [avance, setAvance] = useState(false)
  const [viderDemande, setViderDemande] = useState(false)
  /* Sur téléphone : la barre d'actions en bas de l'écran, et la feuille pour ajouter un bloc. */
  const telephone = useTelephone()
  const [feuille, setFeuille] = useState(false)
  /* Sur téléphone : le popup ouvert comme sur le site, par « Aperçu » de la barre du bas. */
  const [apercuSite, setApercuSite] = useState(false)
  /* Sur téléphone : l'aide du nom, masquée, s'ouvre dans une fenêtre par l'icône info. */
  const [aideNom, setAideNom] = useState(false)
  /* Sur ordinateur : l'aperçu tel que le verra le visiteur, sans la grille ni les outils. */
  const [rendu, setRendu] = useState(false)
  /* L'aperçu tel qu'on le verra sur ordinateur ou sur téléphone, quel que soit l'écran du moment. */
  const [vue, setVue] = useState<'ordinateur' | 'telephone'>('ordinateur')
  const zoneApercu = useRef<HTMLElement>(null)
  const zoneInspecteur = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!feuille) return
    const fermer = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setFeuille(false)
    }
    window.addEventListener('keydown', fermer)
    return () => window.removeEventListener('keydown', fermer)
  }, [feuille])
  /* Venant de la liste pour changer une date de fin (#diffusion), l'éditeur s'ouvre sur la diffusion. */
  const ancre = useLocation({ select: (lieu) => lieu.hash })
  const [onglet, setOnglet] = useState<Onglet>(() => (ancre === 'diffusion' ? 'diffusion' : 'contenu'))
  const champFin = useRef<HTMLInputElement>(null)
  const boutonsOnglets = useRef<(HTMLButtonElement | null)[]>([])
  /* Le contenu tel qu'enregistré : ses images retirées seront effacées du stockage. */
  const contenuEnregistre = useRef<ContenuPopup | null>(enregistre?.contenu ?? null)
  const [sauvegardeAuto, setSauvegardeAuto] = useState<SauvegardeAuto>('repos')
  const dernierEtat = useRef(popup)
  dernierEtat.current = popup
  const minuteur = useRef<number | undefined>(undefined)
  const enAttente = useRef(false)
  /* Les sauvegardes du brouillon, l'une après l'autre : la première crée la ligne. */
  const file = useRef<Promise<void>>(Promise.resolve())

  /** Enregistre le brouillon tel qu'il est maintenant, sans l'activer. N'utilise que des références. */
  function sauverBrouillon() {
    enAttente.current = false
    file.current = file.current.then(async () => {
      const courant = dernierEtat.current
      if (!courant?.brouillon) return
      setSauvegardeAuto('en-cours')
      const { id: _id, ...champs } = courant
      const ligneBrouillon = { ...champs, actif: false, brouillon: true }
      const base = getSupabase().from('popups')
      const { data, error } = idEnBase.current
        ? await base.update(ligneBrouillon).eq('id', idEnBase.current).select('*').single()
        : await base.insert(ligneBrouillon).select('*').single()
      if (error || !data) {
        setSauvegardeAuto('erreur')
        return
      }
      const ligne = data as Popup
      idEnBase.current = ligne.id
      if (contenuEnregistre.current) void nettoyerImages(contenuEnregistre.current, courant.contenu)
      contenuEnregistre.current = courant.contenu
      majPopupEnCache(ligne)
      setSauvegardeAuto('fait')
    })
    return file.current
  }

  /* Un brouillon modifié s'enregistre seul, une seconde après le dernier changement. */
  useEffect(() => {
    if (!popup?.brouillon || !modifie) return
    window.clearTimeout(minuteur.current)
    enAttente.current = true
    minuteur.current = window.setTimeout(() => void sauverBrouillon(), DELAI_BROUILLON)
  }, [popup, modifie])

  /* En quittant l'éditeur, le dernier changement du brouillon n'attend pas. */
  useEffect(
    () => () => {
      if (!enAttente.current) return
      window.clearTimeout(minuteur.current)
      void sauverBrouillon()
    },
    [],
  )

  /** Arrête la sauvegarde programmée du brouillon et attend celle en cours. */
  async function finirSauvegardes() {
    window.clearTimeout(minuteur.current)
    enAttente.current = false
    await file.current
  }

  function changer(champs: Partial<Brouillon>) {
    setPopup((courant) => (courant ? { ...courant, ...champs } : courant))
    setModifie(true)
    setEnregistrement('repos')
  }

  const { activer, dialogue } = useActivation<Brouillon>(
    (_popup, changement) => changer(changement),
    () => {
      setDureePerso(true)
      setOnglet('diffusion')
      window.setTimeout(() => champFin.current?.focus(), 0)
    },
  )

  if (!popup) {
    return (
      <div className="cms-page">
        <p className="cms-texte">Ce popup n’existe plus.</p>
        <Lien className="cms-bouton" href="/admin-prive/cms/promotion">
          Retour à la liste
        </Lien>
      </div>
    )
  }

  const etat = statut(popup)
  const cadre = cadreDe(popup.contenu, popup.format)
  const debut = debutVersJour(popup.date_debut)
  const dernierJour = finVersDernierJour(popup.date_fin)
  const duree = ecartEnJours(debut, dernierJour) + 1
  const conflits = autres.flatMap((autre) =>
    chevauchements([{ ...popup, nom: popup.nom || 'Ce popup' }, autre]),
  )

  async function enregistrer() {
    if (!popup) return
    setErreur(null)
    if (!popup.nom.trim()) {
      setErreur('Donnez un nom à ce popup (il n’apparaît pas sur le site).')
      return
    }
    if (popup.ciblage === 'certaines' && popup.pages.length === 0) {
      setErreur('Choisissez au moins une page, ou « Toutes les pages ».')
      setOnglet('diffusion')
      return
    }
    if (popup.ciblage === 'sauf' && popup.pages_exclues.length === 0) {
      setErreur('Cochez au moins une page à exclure, ou choisissez « Toutes les pages ».')
      setOnglet('diffusion')
      return
    }

    setEnregistrement('en-cours')
    await finirSauvegardes()
    const { id: _id, ...champs } = popup
    const ligneFinale = { ...champs, brouillon: false }
    const base = getSupabase().from('popups')
    const { data, error } = idEnBase.current
      ? await base.update(ligneFinale).eq('id', idEnBase.current).select('*').single()
      : await base.insert(ligneFinale).select('*').single()

    if (error || !data) {
      setEnregistrement('repos')
      setErreur('L’enregistrement a échoué. Vérifiez votre connexion et réessayez.')
      return
    }
    if (contenuEnregistre.current) void nettoyerImages(contenuEnregistre.current, popup.contenu)
    contenuEnregistre.current = popup.contenu
    const ligne = data as Popup
    idEnBase.current = ligne.id
    majPopupEnCache(ligne)
    setPopup((courant) => (courant ? { ...courant, brouillon: false } : courant))
    setModifie(false)
    setEnregistrement('fait')
    if (nouveau) {
      toutJusteCree = ligne.id
      void navigate({
        to: '/admin-prive/cms/promotion/$id',
        params: { id: ligne.id },
        replace: true,
      })
    }
  }

  async function supprimer() {
    if (!popup) return
    setSuppression(false)
    await finirSauvegardes()
    const idSupprime = idEnBase.current
    if (!idSupprime) {
      void navigate({ to: '/admin-prive/cms/promotion' })
      return
    }
    if (!(await supprimerPopup(idSupprime, popup.contenu))) {
      setErreur('La suppression a échoué. Réessayez.')
      return
    }
    /* Les images de la version enregistrée, retirées depuis sans enregistrer. */
    if (contenuEnregistre.current) await nettoyerImages(contenuEnregistre.current, popup.contenu)
    retirerPopupDuCache(idSupprime)
    void navigate({ to: '/admin-prive/cms/promotion' })
  }

  function appliquerModele(modele: (typeof MODELES)[number]) {
    changer({ contenu: modele.contenu(), format: modele.format })
    setModeleDemande(null)
    setSelection(null)
  }

  /* Flèches gauche et droite d'un onglet à l'autre, comme le veut le motif des onglets. */
  function clavierOnglets(e: KeyboardEvent, rang: number) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const suivant = (rang + (e.key === 'ArrowRight' ? 1 : -1) + ONGLETS.length) % ONGLETS.length
    const cible = ONGLETS[suivant]
    if (!cible) return
    setOnglet(cible.id)
    boutonsOnglets.current[suivant]?.focus()
  }

  return (
    <div className="cms-page cms-page--large">
      <div className="cms-page__tete">
        <div>
          <Lien className="cms-retour" href="/admin-prive/cms/promotion">
            ← Tous les popups
          </Lien>
          <h1 className="cms-page__titre">
            {nouveau ? 'Nouveau popup' : popup.nom || 'Popup sans nom'}
          </h1>
        </div>
        <div className="cms-page__actions">
          <span className="cms-etat" role="status">
            {enregistrement === 'en-cours'
              ? 'Enregistrement…'
              : popup.brouillon
                ? {
                    repos: '',
                    'en-cours': 'Enregistrement du brouillon…',
                    fait: 'Brouillon enregistré',
                    erreur: 'Brouillon non enregistré : vérifiez votre connexion',
                  }[sauvegardeAuto]
                : modifie
                ? 'Modifications non enregistrées'
                : enregistrement === 'fait'
                  ? 'Enregistré'
                  : ''}
          </span>
          <button
            className="btn btn--solid editeur__enregistrer"
            type="button"
            onClick={() => void enregistrer()}
            disabled={enregistrement === 'en-cours'}
          >
            Enregistrer
          </button>
        </div>
      </div>

      {erreur ? <p className="cms-alerte">{erreur}</p> : null}

      {conflits.length ? (
        <div className="cms-alerte cms-alerte--info">
          <p className="cms-alerte__titre">
            Ce popup s’affichera en même temps qu’un autre, l’un sous l’autre :
          </p>
          <ul>
            {conflits.map((conflit, rang) => (
              <li key={rang}>
                avec « {conflit.noms[1]} », sur : {conflit.pages}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className={`editeur editeur--${onglet}`}>
        <div className="editeur__reglages">
          {/* ---- Général ---- */}
          <Panneau
            titre="Général"
            id="panneau-general"
            arrondi
            action={
              <Interrupteur
                actif={etat.actif}
                onChange={(valeur) => (valeur ? activer(popup) : changer({ actif: false }))}
              />
            }
          >
            <div className="cms-champ">
              <div className="cms-champ__tete">
                <label className="cms-champ__label" htmlFor="popup-nom">
                  Nom du popup
                </label>
                <button
                  className="cms-info"
                  type="button"
                  aria-label="À quoi sert le nom"
                  aria-haspopup="dialog"
                  onClick={() => setAideNom(true)}
                >
                  <IconeInfo />
                </button>
              </div>
              <input
                className="cms-champ__input"
                id="popup-nom"
                type="text"
                value={popup.nom}
                placeholder="Ex. : Offre mariage printemps"
                onChange={(e) => changer({ nom: e.target.value })}
              />
              <p className="cms-aide editeur__aide-nom">
                Pour vous retrouver dans la liste : il n’apparaît pas sur le site.
              </p>
            </div>

            <div className="cms-champ editeur__statut">
              <span className="cms-champ__label">Statut</span>
              <div className="cms-choix-ligne">
                <Interrupteur
                  actif={etat.actif}
                  onChange={(valeur) => (valeur ? activer(popup) : changer({ actif: false }))}
                />
                <span className="cms-aide">{etat.detail}</span>
              </div>
            </div>
          </Panneau>

          {/* ---- Les deux onglets ---- */}
          <div className="editeur__onglets" role="tablist" aria-label="Réglages du popup">
            {ONGLETS.map((o, rang) => (
              <button
                key={o.id}
                ref={(bouton) => {
                  boutonsOnglets.current[rang] = bouton
                }}
                className={`editeur__onglet${onglet === o.id ? ' editeur__onglet--actif' : ''}`}
                type="button"
                role="tab"
                id={`onglet-${o.id}`}
                aria-selected={onglet === o.id}
                aria-controls={`volet-${o.id}`}
                tabIndex={onglet === o.id ? 0 : -1}
                onClick={() => setOnglet(o.id)}
                onKeyDown={(e) => clavierOnglets(e, rang)}
              >
                <span className="editeur__onglet-numero" aria-hidden="true">
                  {rang + 1}
                </span>
                <span className="editeur__onglet-nom">{o.nom}</span>
                <span className="editeur__onglet-description">{o.description}</span>
              </button>
            ))}
          </div>

          <div
            className="editeur__volet"
            role="tabpanel"
            id="volet-contenu"
            aria-labelledby="onglet-contenu"
            hidden={onglet !== 'contenu'}
          >
            {/* ---- Mise en page : le modèle, puis la taille de l'encart ---- */}
            <Panneau titre="Mise en page" arrondi>
              <div className="mise-en-page">
                {MODELES.map((modele) => {
                  const choisi = modeleReconnu(popup.contenu) === modele.id
                  return (
                    <button
                      key={modele.id}
                      type="button"
                      className={`mise-en-page__carte${choisi ? ' mise-en-page__carte--choisie' : ''}`}
                      aria-pressed={choisi}
                      onClick={() =>
                        popup.contenu.blocs.length ? setModeleDemande(modele) : appliquerModele(modele)
                      }
                    >
                      <span className={`miniature miniature--${modele.id}`} aria-hidden="true">
                        <span className="miniature__cote" />
                        <span className="miniature__texte">
                          <span className="miniature__trait miniature__trait--accent" />
                          <span className="miniature__trait" />
                          <span className="miniature__trait miniature__trait--court" />
                          <span className="miniature__bouton" />
                        </span>
                      </span>
                      <span className="mise-en-page__nom">{modele.nom}</span>
                      <span className="mise-en-page__description">{modele.description}</span>
                    </button>
                  )
                })}
              </div>

              <div className="taille" role="radiogroup" aria-labelledby="popup-taille">
                <span className="taille__label" id="popup-taille">
                  Taille
                </span>
                <div className="taille__choix">
                  {FORMATS.map((format) => {
                    /* Une taille prédéfinie donne sa largeur au cadre ; sa hauteur ne change pas. */
                    const choisie = cadre.largeur === LARGEURS_FORMAT[format.valeur]
                    return (
                      <label
                        key={format.valeur}
                        className={`taille__option${choisie ? ' taille__option--choisie' : ''}`}
                      >
                        <input
                          className="taille__radio"
                          type="radio"
                          name="format"
                          checked={choisie}
                          onChange={() =>
                            changer({
                              format: format.valeur,
                              contenu: changerCadre(popup.contenu, {
                                ...cadre,
                                largeur: LARGEURS_FORMAT[format.valeur],
                              }),
                            })
                          }
                        />
                        {format.nom}
                      </label>
                    )
                  })}
                </div>
              </div>
              <p className="cms-aide">
                {FORMATS.some((f) => LARGEURS_FORMAT[f.valeur] === cadre.largeur)
                  ? 'Ou tirez les poignées du cadre, dans l’aperçu, pour une taille sur mesure.'
                  : `Taille sur mesure : ${String(cadre.largeur).replace('.', ',')} rem de large. Les poignées du cadre, dans l’aperçu, la règlent.`}
              </p>
            </Panneau>

            {/* ---- Les blocs, à glisser sur l'aperçu ---- */}
            <Panneau titre="Blocs" id="panneau-blocs" arrondi>
              <PaletteBlocs
                contenu={popup.contenu}
                onChange={(contenu) => changer({ contenu })}
                onSelection={setSelection}
              />
            </Panneau>

          </div>

          <div
            className="editeur__volet"
            role="tabpanel"
            id="volet-diffusion"
            aria-labelledby="onglet-diffusion"
            hidden={onglet !== 'diffusion'}
          >
            {/* ---- Diffusion ---- */}
            <Panneau titre="Diffusion" id="diffusion" arrondi>
              <div className="cms-grille-2">
                <div className="cms-champ">
                  <label className="cms-champ__label" htmlFor="popup-debut">
                    Date de début
                  </label>
                  <input
                    className="cms-champ__input"
                    id="popup-debut"
                    type="date"
                    value={debut}
                    onChange={(e) => {
                      const jour = e.target.value
                      if (!jour) return
                      /* La durée choisie suit le début ; une date de fin fixée reste. */
                      const fin = dureePerso
                        ? dernierJour < jour
                          ? jour
                          : dernierJour
                        : ajouterJours(jour, duree - 1)
                      changer({ date_debut: jourVersDebut(jour), date_fin: dernierJourVersFin(fin) })
                    }}
                  />
                </div>

                <div className="cms-champ">
                  <label className="cms-champ__label" htmlFor="popup-duree">
                    Durée
                  </label>
                  <select
                    className="cms-champ__input"
                    id="popup-duree"
                    value={dureePerso ? 'perso' : String(duree)}
                    onChange={(e) => {
                      if (e.target.value === 'perso') {
                        setDureePerso(true)
                        return
                      }
                      setDureePerso(false)
                      changer({
                        date_fin: dernierJourVersFin(ajouterJours(debut, Number(e.target.value) - 1)),
                      })
                    }}
                  >
                    {DUREES.map((jours) => (
                      <option key={jours} value={jours}>
                        {jours} jours
                      </option>
                    ))}
                    <option value="perso">Jusqu’à une date précise…</option>
                  </select>
                </div>
              </div>

              {dureePerso ? (
                <div className="cms-champ">
                  <label className="cms-champ__label" htmlFor="popup-fin">
                    Dernier jour d’affichage (inclus)
                  </label>
                  <input
                    className="cms-champ__input"
                    id="popup-fin"
                    ref={champFin}
                    type="date"
                    min={debut}
                    value={dernierJour}
                    onChange={(e) => {
                      const jour = e.target.value
                      if (jour && jour >= debut) changer({ date_fin: dernierJourVersFin(jour) })
                    }}
                  />
                </div>
              ) : null}

              <p className="cms-aide">
                Affiché du {dateLisible(debut)} au {dateLisible(dernierJour)} inclus, soit {duree}{' '}
                jour{duree > 1 ? 's' : ''}.
              </p>

              <fieldset className="cms-groupe">
                <legend className="cms-champ__label">Pages</legend>
                {CIBLAGES.map((ciblage) => (
                  <label className="cms-radio" key={ciblage.valeur}>
                    <input
                      type="radio"
                      name="ciblage"
                      checked={popup.ciblage === ciblage.valeur}
                      onChange={() => changer({ ciblage: ciblage.valeur })}
                    />
                    {ciblage.nom}
                  </label>
                ))}
                {popup.ciblage !== 'toutes' ? (
                  <>
                    <p className="cms-aide cms-cases__consigne">
                      {popup.ciblage === 'sauf'
                        ? 'Cochez les pages où le popup ne doit pas s’afficher :'
                        : 'Cochez les pages où le popup s’affiche :'}
                    </p>
                    <div className="cms-cases">
                      {PAGES_DU_SITE.map((page) => {
                        const champ = popup.ciblage === 'sauf' ? 'pages_exclues' : 'pages'
                        const liste = popup[champ]
                        return (
                          <label className="cms-case" key={page.chemin}>
                            <input
                              type="checkbox"
                              checked={liste.includes(page.chemin)}
                              onChange={(e) =>
                                changer({
                                  [champ]: e.target.checked
                                    ? [...liste, page.chemin]
                                    : liste.filter((p) => p !== page.chemin),
                                })
                              }
                            />
                            {page.nom}
                          </label>
                        )
                      })}
                    </div>
                  </>
                ) : null}
              </fieldset>

              <fieldset className="cms-groupe">
                <legend className="cms-champ__label">Fréquence</legend>
                {FREQUENCES.map((frequence) => (
                  <label className="cms-radio" key={frequence.valeur}>
                    <input
                      type="radio"
                      name="frequence"
                      checked={popup.frequence === frequence.valeur}
                      onChange={() => changer({ frequence: frequence.valeur })}
                    />
                    {frequence.nom}
                  </label>
                ))}
                {popup.frequence === 'jours' ? (
                  <div className="cms-champ cms-champ--etroit">
                    <label className="cms-champ__label" htmlFor="popup-jours">
                      Tous les combien de jours
                    </label>
                    <input
                      className="cms-champ__input"
                      id="popup-jours"
                      type="number"
                      min={1}
                      max={365}
                      value={popup.frequence_jours}
                      onChange={(e) =>
                        changer({
                          frequence_jours: Math.min(365, Math.max(1, Number(e.target.value) || 1)),
                        })
                      }
                    />
                  </div>
                ) : null}
              </fieldset>
            </Panneau>

          </div>

          {idEnBase.current ? (
            <div className="editeur__danger">
              <button className="cms-bouton cms-bouton--discret" type="button" onClick={() => setSuppression(true)}>
                Supprimer ce popup
              </button>
            </div>
          ) : null}
        </div>

        {/* ---- Aperçu, avec la grille où se placent les blocs ---- */}
        <section className="editeur__apercu" aria-label="Aperçu" ref={zoneApercu}>
          <div className="editeur__apercu-tete">
            <p className="editeur__apercu-titre">Aperçu</p>
            {!telephone ? (
              <p className="cms-aide">Glissez les blocs pour les placer, cliquez sur un bloc pour le régler.</p>
            ) : null}
            <div className="editeur__apercu-outils">
              <div className="vue-switch" role="group" aria-label="Voir l’aperçu sur">
                {(
                  [
                    { valeur: 'ordinateur', nom: 'Ordinateur' },
                    { valeur: 'telephone', nom: 'Téléphone' },
                  ] as const
                ).map((v) => (
                  <button
                    key={v.valeur}
                    type="button"
                    className={`vue-switch__bouton${vue === v.valeur ? ' vue-switch__bouton--actif' : ''}`}
                    aria-pressed={vue === v.valeur}
                    onClick={() => setVue(v.valeur)}
                  >
                    {v.nom}
                  </button>
                ))}
              </div>
              {!telephone && vue === 'ordinateur' ? (
                <button
                  className="editeur__vider"
                  type="button"
                  aria-pressed={rendu}
                  onClick={() => {
                    setRendu(!rendu)
                    setSelection(null)
                  }}
                >
                  {rendu ? 'Revenir à la grille' : 'Rendu sans la grille'}
                </button>
              ) : null}
              {popup.contenu.blocs.length && !(rendu && !telephone) && vue === 'ordinateur' ? (
                <button className="editeur__vider" type="button" onClick={() => setViderDemande(true)}>
                  Tout vider
                </button>
              ) : null}
            </div>
          </div>
          <div
            className="apercu apercu--edition"
            onClick={(e) => {
              /* Sur téléphone : toucher l'aperçu hors d'un bloc (le fond gris, le bord noir du popup) libère le bloc choisi. */
              if (pincement()) return
              if (telephone && !(e.target as Element).closest('[data-bloc], .cadre-poignee, button, a')) setSelection(null)
            }}
          >
            {vue === 'telephone' ? (
              /* Un écran de téléphone : le popup tel que le voit un visiteur sur mobile. */
              <div className="ecran-telephone">
                <PopupCarte format={popup.format} contenu={popup.contenu} apercu telephone />
              </div>
            ) : rendu && !telephone ? (
              <PopupCarte format={popup.format} contenu={popup.contenu} apercu />
            ) : (
            <GrilleEdition
              format={popup.format}
              contenu={popup.contenu}
              selection={selection}
              onChange={(contenu) => changer({ contenu })}
              onCadre={(nouveau) =>
                changer({ contenu: changerCadre(popup.contenu, nouveau), format: formatProche(nouveau.largeur) })
              }
              onSelection={setSelection}
              onAvance={() => setAvance(true)}
            />
            )}
          </div>
        </section>

        {/* ---- Réglages du bloc choisi ---- */}
        <aside className="editeur__inspecteur" aria-label="Réglages du bloc" ref={zoneInspecteur}>
          <Inspecteur
            contenu={popup.contenu}
            selection={selection}
            avance={avance}
            onChange={(contenu) => changer({ contenu })}
            onSelection={setSelection}
            onAvance={setAvance}
          />
        </aside>
      </div>

      {telephone ? (
        <nav className="barre-mobile" aria-label="Actions de l’éditeur">
          <button className="barre-mobile__bouton" type="button" onClick={() => setFeuille(true)}>
            <span aria-hidden="true">+</span> Bloc
          </button>
          <button
            className="barre-mobile__bouton"
            type="button"
            disabled={!selection}
            onClick={() => {
              setOnglet('contenu')
              window.setTimeout(
                () => zoneInspecteur.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
                0,
              )
            }}
          >
            Régler
          </button>
          <button
            className="barre-mobile__bouton"
            type="button"
            aria-haspopup="dialog"
            onClick={() => setApercuSite(true)}
          >
            Aperçu
          </button>
          <button
            className="barre-mobile__bouton barre-mobile__bouton--plein"
            type="button"
            onClick={() => void enregistrer()}
            disabled={enregistrement === 'en-cours'}
          >
            Enregistrer
          </button>
        </nav>
      ) : null}

      {telephone && apercuSite
        ? createPortal(
            <Fenetre
              popups={[{ id: 'apercu', format: popup.format, contenu: popup.contenu }]}
              onFermer={() => setApercuSite(false)}
              onToutFermer={() => setApercuSite(false)}
              apercu
            />,
            document.body,
          )
        : null}

      {telephone && feuille ? (
        <div className="feuille" role="dialog" aria-modal="true" aria-labelledby="feuille-titre">
          <button className="feuille__voile" type="button" aria-label="Fermer" onClick={() => setFeuille(false)} />
          <div className="feuille__corps">
            <div className="feuille__tete">
              <p className="feuille__titre" id="feuille-titre">
                Ajouter un bloc
              </p>
              <button className="croix__bouton" type="button" aria-label="Fermer" onClick={() => setFeuille(false)}>
                ×
              </button>
            </div>
            <PaletteBlocs
              contenu={popup.contenu}
              onChange={(contenu) => changer({ contenu })}
              onSelection={(id) => {
                setSelection(id)
                setFeuille(false)
                setOnglet('contenu')
                window.setTimeout(
                  () => zoneApercu.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
                  0,
                )
              }}
            />
          </div>
        </div>
      ) : null}

      {dialogue}

      {aideNom ? (
        <Dialogue
          titre="Nom du popup"
          onAnnuler={() => setAideNom(false)}
          sansAnnuler
          actions={[{ libelle: 'Compris', style: 'plein', onClick: () => setAideNom(false) }]}
        >
          <p>Pour vous retrouver dans la liste : il n’apparaît pas sur le site.</p>
        </Dialogue>
      ) : null}

      {viderDemande ? (
        <Dialogue
          titre="Vider le popup ?"
          onAnnuler={() => setViderDemande(false)}
          actions={[
            {
              libelle: 'Retirer tous les blocs',
              style: 'plein',
              onClick: () => {
                changer({ contenu: { version: 3, blocs: [], cadre } })
                setSelection(null)
                setViderDemande(false)
              },
            },
          ]}
        >
          <p>
            Tous les blocs du popup seront retirés. La taille de l’encart reste celle
            choisie : vous repartez d’une grille vide.
          </p>
        </Dialogue>
      ) : null}

      {modeleDemande ? (
        <Dialogue
          titre={`Appliquer le modèle « ${modeleDemande.nom} » ?`}
          onAnnuler={() => setModeleDemande(null)}
          actions={[
            {
              libelle: 'Remplacer le contenu',
              style: 'plein',
              onClick: () => appliquerModele(modeleDemande),
            },
          ]}
        >
          <p>Le contenu actuel du popup sera remplacé par celui du modèle.</p>
        </Dialogue>
      ) : null}

      {suppression ? (
        <Dialogue
          titre="Supprimer ce popup ?"
          onAnnuler={() => setSuppression(false)}
          actions={[{ libelle: 'Supprimer définitivement', style: 'plein', onClick: () => void supprimer() }]}
        >
          <p className="dialogue__attention">Attention, cette action est irréversible.</p>
          <p>
            Le popup et ses images seront effacés de la base de données.
            <br />
            Si vous souhaitez le conserver, vous pouvez simplement le désactiver via
            votre tableau de bord.
          </p>
        </Dialogue>
      ) : null}
    </div>
  )
}

function Panneau({
  titre,
  id,
  arrondi,
  action,
  children,
}: {
  titre: string
  id?: string
  arrondi?: boolean
  /** Sur téléphone seulement : une commande à droite du titre (cms.css). */
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className={`panneau${arrondi ? ' panneau--arrondi' : ''}`} id={id} aria-label={titre}>
      {action ? (
        <div className="panneau__tete">
          <h2 className="panneau__titre">{titre}</h2>
          <div className="panneau__action">{action}</div>
        </div>
      ) : (
        <h2 className="panneau__titre">{titre}</h2>
      )}
      <div className="panneau__corps">{children}</div>
    </section>
  )
}
