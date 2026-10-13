import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

import { Lien } from '../../../../components/Lien'
import { Dialogue } from '../../../../components/cms/Dialogue'
import { ChargementCms, ErreurCms } from '../../../../components/cms/EtatsCms'
import {
  IconeAttention,
  IconeCalendrier,
  IconePage,
  IconePlus,
  IconePoubelle,
  IconeRepetition,
} from '../../../../components/cms/Icones'
import { Interrupteur } from '../../../../components/cms/Interrupteur'
import { supprimerPopup } from '../../../../components/cms/suppression'
import { useActivation } from '../../../../components/cms/useActivation'
import type { Changement } from '../../../../components/cms/useActivation'
import {
  CATEGORIES,
  categorie,
  chevauchements,
  debutVersJour,
  finVersDernierJour,
  pagesLisibles,
  periodeLisible,
  statut,
} from '../../../../lib/popups'
import {
  cacheCms,
  majPopupEnCache,
  requetePopups,
  retirerPopupDuCache,
} from '../../../../lib/cms-cache'
import type { Categorie, Chevauchement, Popup } from '../../../../lib/popups'
import { getSupabase } from '../../../../lib/supabase'

/*
 * La liste des popups : actifs comme inactifs (terminés compris, ils ne
 * disparaissent jamais du CMS), triables en un clic : en ligne,
 * programmés, brouillons, terminés. Activer ou désactiver se fait d'ici,
 * d'un clic, et s'enregistre aussitôt. Supprimer efface le popup pour de
 * bon, images comprises.
 *
 * Deux popups qui s'afficheront ensemble sont signalés par un bandeau sous
 * celui qui commence le plus tard, avec un raccourci vers ses dates.
 *
 * Les popups viennent du cache du CMS (lib/cms-cache.ts) : préchargés au
 * survol du lien, affichés aussitôt au retour, revérifiés en arrière-plan.
 * Les actions changent l'écran tout de suite ; si la base refuse, il
 * revient à l'état d'avant.
 */
export const Route = createFileRoute('/admin-prive/cms/promotion/')({
  ssr: false,
  head: () => ({ meta: [{ title: 'Promotion, CMS Oysen' }] }),
  /*
   * Importé à la demande : le chargeur fait partie de l'arbre des routes,
   * téléchargé par tout le site, et le cache ne doit pas l'alourdir.
   */
  loader: async () => {
    const cache = await import('../../../../lib/cms-cache')
    return cache.cacheCms.ensureQueryData(cache.requetePopups)
  },
  pendingComponent: ChargementCms,
  errorComponent: ErreurCms,
  component: Promotion,
})

type Filtre = 'tous' | Categorie

function frequenceCourte(popup: Popup) {
  switch (popup.frequence) {
    case 'chaque_page':
      return 'À chaque page vue'
    case 'visite':
      return 'Une fois par visite'
    case 'une_fois':
      return 'Une seule fois'
    default:
      return `Tous les ${popup.frequence_jours} jours`
  }
}

function pagesCourtes(popup: Popup) {
  return popup.ciblage === 'toutes' ? 'Tout le site' : pagesLisibles(popup)
}

/** « Du 20 au 26 octobre, la page Location de matériel aura deux popups : celui-ci et « … ». » */
function phraseDuChevauchement(conflit: Chevauchement, autre: string) {
  const periode = periodeLisible(conflit.premierJour, conflit.dernierJour)
  const pages =
    conflit.pages === 'toutes les pages'
      ? 'toutes les pages auront'
      : conflit.nombreDePages > 1
        ? `les pages ${conflit.pages} auront`
        : `la page ${conflit.pages} aura`
  return `${periode}, ${pages} deux popups : celui-ci et « ${autre} ».`
}

function nomAffiche(popup: Popup) {
  return popup.nom.trim() || 'Popup sans nom'
}

function Promotion() {
  const navigate = useNavigate()
  const { data: popups } = useSuspenseQuery(requetePopups)
  const [erreur, setErreur] = useState<string | null>(null)
  const [aSupprimer, setASupprimer] = useState<Popup | null>(null)
  const [filtre, setFiltre] = useState<Filtre>('tous')
  const barreFiltres = useDefilementLateral()

  /* Annule une action refusée par la base : le cache reprend son état d'avant. */
  function revenir(avant: Popup[] | undefined, message: string) {
    cacheCms.setQueryData(requetePopups.queryKey, avant)
    setErreur(message)
  }

  async function appliquer(popup: Popup, changement: Changement) {
    setErreur(null)
    const avant = cacheCms.getQueryData(requetePopups.queryKey)
    majPopupEnCache({ ...popup, ...changement })

    const { data, error } = await getSupabase()
      .from('popups')
      .update(changement)
      .eq('id', popup.id)
      .select('*')
      .single()
    if (error || !data) {
      revenir(avant, 'Le changement n’a pas été enregistré. Réessayez.')
      return
    }
    majPopupEnCache(data as Popup)
  }

  async function supprimer(popup: Popup) {
    setASupprimer(null)
    setErreur(null)
    const avant = cacheCms.getQueryData(requetePopups.queryKey)
    retirerPopupDuCache(popup.id)

    if (!(await supprimerPopup(popup.id, popup.contenu))) {
      revenir(avant, 'La suppression a échoué. Réessayez.')
    }
  }

  /* L'éditeur, ouvert sur l'onglet Diffusion. */
  function versLesDates(popup: Popup) {
    void navigate({
      to: '/admin-prive/cms/promotion/$id',
      params: { id: popup.id },
      hash: 'diffusion',
    })
  }

  const { activer, dialogue } = useActivation<Popup>(
    (popup, changement) => void appliquer(popup, changement),
    versLesDates,
  )

  /* Rangés par catégorie (en ligne d'abord), du plus récent au plus ancien dans chacune. */
  const maintenant = Date.now()
  const rang = (valeur: Categorie) => CATEGORIES.findIndex((c) => c.valeur === valeur)
  const rangees = popups
    .map((popup) => ({ popup, categorie: categorie(popup, maintenant) }))
    .sort((a, b) => rang(a.categorie) - rang(b.categorie))
  const visibles = filtre === 'tous' ? rangees : rangees.filter((r) => r.categorie === filtre)
  const nombre = (valeur: Filtre) =>
    valeur === 'tous' ? rangees.length : rangees.filter((r) => r.categorie === valeur).length

  const filtres: { valeur: Filtre; nom: string }[] = [
    { valeur: 'tous', nom: 'Tous' },
    ...CATEGORIES.map((c) => ({ valeur: c.valeur, nom: c.pluriel })),
  ]

  /* Chaque chevauchement, sous le popup qui commence le plus tard. */
  const bandeaux = new Map<string, { conflit: Chevauchement; autre: string }[]>()
  for (const conflit of chevauchements(popups)) {
    const a = popups.find((p) => p.id === conflit.ids[0])
    const b = popups.find((p) => p.id === conflit.ids[1])
    if (!a || !b) continue
    const [sous, autre] = new Date(b.date_debut) >= new Date(a.date_debut) ? [b, a] : [a, b]
    bandeaux.set(sous.id, [...(bandeaux.get(sous.id) ?? []), { conflit, autre: nomAffiche(autre) }])
  }

  return (
    <div className="cms-page">
      <div className="cms-page__tete">
        <div>
          <h1 className="cms-page__titre">Popups</h1>
          <p className="cms-page__intro">
            Les fenêtres qui s’ouvrent sur votre site pour mettre une offre en avant.
          </p>
        </div>
        <Lien className="btn btn--solid liste-nouveau" href="/admin-prive/cms/promotion/nouveau">
          <IconePlus />
          Nouveau popup
        </Lien>
      </div>

      {erreur ? <p className="cms-alerte">{erreur}</p> : null}

      {popups.length ? (
        <div className="filtres" role="group" aria-label="Afficher les popups" ref={barreFiltres}>
          {filtres.map((f) => (
            <button
              key={f.valeur}
              type="button"
              className={`filtres__bouton${filtre === f.valeur ? ' filtres__bouton--actif' : ''}`}
              aria-pressed={filtre === f.valeur}
              onClick={() => setFiltre(f.valeur)}
            >
              {f.nom}
              <span className="filtres__nombre">{nombre(f.valeur)}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="cms-texte">
          Aucun popup pour l’instant. Créez le premier avec « Nouveau popup ».
        </p>
      )}

      {popups.length && !visibles.length ? (
        <p className="cms-texte">Aucun popup dans cette catégorie.</p>
      ) : null}

      {visibles.length ? (
        <ul className="fiches">
          {visibles.map(({ popup, categorie: cat }) => {
            const lien = `/admin-prive/cms/promotion/${popup.id}`
            const nom = nomAffiche(popup)
            return (
              <li className={`fiche fiche--${cat}`} key={popup.id}>
                <div className="fiche__ligne">
                  <div className="fiche__principal">
                    <Lien className="fiche__nom" href={lien}>
                      {nom}
                    </Lien>
                    <ul className="fiche__infos">
                      <li>
                        <IconeCalendrier />
                        {periodeLisible(
                          debutVersJour(popup.date_debut),
                          finVersDernierJour(popup.date_fin),
                        )}
                      </li>
                      <li>
                        <IconePage />
                        {pagesCourtes(popup)}
                      </li>
                      <li>
                        <IconeRepetition />
                        {frequenceCourte(popup)}
                      </li>
                    </ul>
                  </div>

                  <div className="fiche__actions">
                    <span className={`puce puce--${cat}`}>
                      {CATEGORIES.find((c) => c.valeur === cat)?.nom}
                    </span>

                    {cat === 'en-ligne' || cat === 'programme' ? (
                      <Interrupteur
                        actif={statut(popup).actif}
                        onChange={(valeur) =>
                          valeur ? activer(popup) : void appliquer(popup, { actif: false })
                        }
                      />
                    ) : null}

                    {cat === 'brouillon' ? (
                      <Lien className="fiche__bouton" href={lien}>
                        Continuer
                      </Lien>
                    ) : cat === 'termine' ? (
                      <button className="fiche__bouton" type="button" onClick={() => activer(popup)}>
                        Relancer avec de nouvelles dates
                      </button>
                    ) : (
                      <Lien className="fiche__bouton" href={lien}>
                        Modifier
                      </Lien>
                    )}

                    <button
                      className="fiche__bouton fiche__bouton--icone"
                      type="button"
                      aria-label={`Supprimer « ${nom} »`}
                      title="Supprimer"
                      onClick={() => setASupprimer(popup)}
                    >
                      <IconePoubelle />
                    </button>
                  </div>
                </div>

                {bandeaux.get(popup.id)?.map(({ conflit, autre }, position) => (
                  <div className="bandeau" key={position}>
                    <IconeAttention />
                    <p className="bandeau__texte">{phraseDuChevauchement(conflit, autre)}</p>
                    <button className="bandeau__lien" type="button" onClick={() => versLesDates(popup)}>
                      Ajuster les dates
                    </button>
                  </div>
                ))}
              </li>
            )
          })}
        </ul>
      ) : null}

      {dialogue}

      {aSupprimer ? (
        <Dialogue
          titre={`Supprimer « ${nomAffiche(aSupprimer)} » ?`}
          onAnnuler={() => setASupprimer(null)}
          actions={[
            {
              libelle: 'Supprimer définitivement',
              style: 'plein',
              onClick: () => void supprimer(aSupprimer),
            },
          ]}
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

/**
 * La barre des filtres sur téléphone tient sur une ligne qui défile sur le
 * côté (cms.css). Au doigt, le navigateur s'en charge ; à la souris, la
 * molette et le glisser la font défiler aussi.
 */
function useDefilementLateral() {
  const barre = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = barre.current
    if (!element) return
    const deborde = () => element.scrollWidth > element.clientWidth + 1

    function molette(e: WheelEvent) {
      if (!deborde() || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
      e.preventDefault()
      element!.scrollLeft += e.deltaY
    }

    let depart: { x: number; gauche: number } | null = null
    let glisse = false
    function appui(e: PointerEvent) {
      if (e.pointerType !== 'mouse' || e.button !== 0 || !deborde()) return
      depart = { x: e.clientX, gauche: element!.scrollLeft }
      glisse = false
    }
    function mouvement(e: PointerEvent) {
      if (!depart) return
      const dx = e.clientX - depart.x
      if (!glisse && Math.abs(dx) < 5) return
      glisse = true
      element!.scrollLeft = depart.gauche - dx
    }
    function relache() {
      depart = null
    }
    /* Un glisser n'est pas un clic sur un filtre. */
    function clic(e: MouseEvent) {
      if (!glisse) return
      e.preventDefault()
      e.stopPropagation()
      glisse = false
    }

    element.addEventListener('wheel', molette, { passive: false })
    element.addEventListener('pointerdown', appui)
    window.addEventListener('pointermove', mouvement)
    window.addEventListener('pointerup', relache)
    element.addEventListener('click', clic, true)
    return () => {
      element.removeEventListener('wheel', molette)
      element.removeEventListener('pointerdown', appui)
      window.removeEventListener('pointermove', mouvement)
      window.removeEventListener('pointerup', relache)
      element.removeEventListener('click', clic, true)
    }
  }, [])
  return barre
}
