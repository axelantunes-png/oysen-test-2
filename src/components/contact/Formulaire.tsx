import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'

import {
  BLOCS,
  DELAI_REPONSE_H,
  DUREES,
  ERREURS,
  LIBELLE_STRUCTURE,
  PERSONNES,
  PROFILS,
  besoinsPour,
  resoudreBloc,
} from './content'
import type { Besoin, Profil, Question } from './content'
import { Depot } from './Depot'

/*
 * Le formulaire de contact, en trois étapes.
 *
 * Les coordonnées sont demandées à l'étape 2, avant le détail de l'étape 3 :
 * qui abandonne en route laisse une demande exploitable, et le lien « ou
 * envoyer ma demande maintenant » lui donne une sortie honorable.
 *
 * Toutes les réponses vivent dans un seul état, en haut : les allers-retours
 * entre étapes ne perdent rien. Les réponses de l'étape 3 sont rangées par
 * question ; seules celles du bloc affiché partent à l'envoi.
 *
 * Validation au moment où l'on quitte un champ, jamais à chaque frappe. Un
 * champ déjà en erreur se revalide à la saisie, pour que le message
 * disparaisse dès que la valeur est bonne.
 */

type Donnees = {
  profil: Profil | ''
  besoin: Besoin | ''
  date: string
  dateAdefinir: boolean
  periode: string
  lieu: string
  personnes: string
  duree: string
  prenom: string
  nom: string
  email: string
  telephone: string
  structure: string
  message: string
  consentement: boolean
  reponses: Record<string, string | string[]>
  autres: Record<string, string>
  fichiers: Record<string, File[]>
}

const VIDE: Donnees = {
  profil: '',
  besoin: '',
  date: '',
  dateAdefinir: false,
  periode: '',
  lieu: '',
  personnes: '',
  duree: '',
  prenom: '',
  nom: '',
  email: '',
  telephone: '',
  structure: '',
  message: '',
  consentement: false,
  reponses: {},
  autres: {},
  fichiers: {},
}

type Cle =
  | 'profil'
  | 'besoin'
  | 'date'
  | 'personnes'
  | 'duree'
  | 'prenom'
  | 'email'
  | 'telephone'
  | 'consentement'

type Erreurs = Partial<Record<Cle, string>>

/** Les champs contrôlés à chaque étape, dans l'ordre de la page. */
const CHAMPS_ETAPE: Record<1 | 2, Cle[]> = {
  1: ['profil', 'besoin', 'date', 'personnes', 'duree'],
  2: ['prenom', 'email', 'telephone', 'consentement'],
}

const ETAPES = ['Votre projet', 'Vous joindre', 'Préciser'] as const

/** La date du jour, au format du sélecteur, dans le fuseau du visiteur. */
function aujourdhui() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

function valider(cle: Cle, d: Donnees): string {
  switch (cle) {
    case 'profil':
      return d.profil ? '' : ERREURS.profil
    case 'besoin':
      return d.besoin ? '' : ERREURS.besoin
    case 'date':
      if (d.dateAdefinir) return ''
      if (!d.date) return ERREURS.date
      return d.date < aujourdhui() ? ERREURS.datePassee : ''
    case 'personnes':
      return d.personnes ? '' : ERREURS.personnes
    case 'duree':
      return d.duree ? '' : ERREURS.duree
    case 'prenom':
      return d.prenom.trim() ? '' : ERREURS.prenom
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())
        ? ''
        : ERREURS.email
    case 'telephone': {
      /* Facultatif : vide, il passe ; rempli, il doit être complet. */
      const chiffres = d.telephone.replace(/\D/g, '')
      if (!chiffres) return ''
      return chiffres.length >= 10 ? '' : ERREURS.telephone
    }
    case 'consentement':
      return d.consentement ? '' : ERREURS.consentement
  }
}

/**
 * La demande telle qu'elle partira vers l'API (Resend, à brancher) : les
 * étapes 1 et 2, puis les réponses du seul bloc affiché, et ses fichiers.
 */
function construireDemande(d: Donnees) {
  const corps = new FormData()
  const bloc = resoudreBloc(d.profil, d.besoin)

  corps.append('profil', d.profil)
  corps.append('besoin', d.besoin)
  corps.append('date', d.dateAdefinir ? `À définir : ${d.periode}` : d.date)
  corps.append('lieu', d.lieu)
  corps.append('personnes', d.personnes)
  corps.append('duree', d.duree)
  corps.append('prenom', d.prenom.trim())
  corps.append('nom', d.nom.trim())
  corps.append('email', d.email.trim())
  corps.append('telephone', d.telephone.trim())
  if (d.profil !== 'particulier') corps.append('structure', d.structure.trim())
  corps.append('message', d.message.trim())

  if (bloc) {
    corps.append('bloc', bloc)
    for (const question of BLOCS[bloc].questions) {
      const reponse = d.reponses[question.id]
      if (reponse) {
        corps.append(
          question.id,
          Array.isArray(reponse) ? reponse.join(', ') : reponse,
        )
      }
      const autre = d.autres[question.id]
      if (autre) corps.append(`${question.id}-autre`, autre)
      for (const fichier of d.fichiers[question.id] ?? []) {
        corps.append('fichiers', fichier)
      }
    }
  }

  return corps
}

/*
 * EN ATTENTE de l'API : l'envoi est simulé pour tester le parcours. Il
 * suffira de remplacer le corps par un fetch('/api/contact', { method:
 * 'POST', body: demande }) qui lève une erreur si la réponse n'est pas ok.
 */
async function envoyerDemande(demande: FormData) {
  void demande
  await new Promise((resolve) => setTimeout(resolve, 1200))
}

export function Formulaire() {
  const navigate = useNavigate()
  const [etape, setEtape] = useState<1 | 2 | 3>(1)
  const [donnees, setDonnees] = useState<Donnees>(VIDE)
  const [erreurs, setErreurs] = useState<Erreurs>({})
  const [envoi, setEnvoi] = useState(false)
  const [erreurServeur, setErreurServeur] = useState(false)
  const [annonce, setAnnonce] = useState('')
  /* Posée après l'hydratation : le serveur n'a pas la date du visiteur. */
  const [dateMin, setDateMin] = useState<string>()

  const formRef = useRef<HTMLFormElement>(null)
  const titreRef = useRef<HTMLHeadingElement>(null)
  const etapePrecedente = useRef(etape)

  useEffect(() => setDateMin(aujourdhui()), [])

  /* Changement d'étape : on remonte en tête du formulaire, le titre prend
     le focus, et l'étape est annoncée aux lecteurs d'écran. Rien au
     chargement : l'étape n'a pas changé. */
  useEffect(() => {
    if (etapePrecedente.current === etape) return
    etapePrecedente.current = etape
    formRef.current?.scrollIntoView({ block: 'start' })
    titreRef.current?.focus({ preventScroll: true })
    setAnnonce(`Étape ${etape} sur 3 : ${ETAPES[etape - 1]}`)
  }, [etape])

  /** Met à jour les données ; un champ déjà en erreur se revalide. */
  const changer = (patch: Partial<Donnees>, cle?: Cle) => {
    const suivantes = { ...donnees, ...patch }
    setDonnees(suivantes)
    if (cle && erreurs[cle]) {
      setErreurs((e) => ({ ...e, [cle]: valider(cle, suivantes) }))
    }
  }

  /** Au départ du champ : le contrôle. */
  const quitter = (cle: Cle) =>
    setErreurs((e) => ({ ...e, [cle]: valider(cle, donnees) }))

  /** Un choix unique est complet dès qu'il est fait : l'erreur s'efface. */
  const choisir = (cle: 'personnes' | 'duree', valeur: string) => {
    setDonnees((d) => ({ ...d, [cle]: valeur }))
    setErreurs((e) => ({ ...e, [cle]: '' }))
  }

  /**
   * Contrôle les champs donnés. En cas d'erreur : les messages s'affichent,
   * la page défile jusqu'au premier champ fautif et y pose le focus.
   */
  const controler = (cles: Cle[]) => {
    const trouvees: Erreurs = {}
    for (const cle of cles) {
      const message = valider(cle, donnees)
      if (message) trouvees[cle] = message
    }
    setErreurs((e) => ({ ...e, ...Object.fromEntries(cles.map((c) => [c, trouvees[c] ?? ''])) }))

    const premiere = cles.find((cle) => trouvees[cle])
    if (!premiere) return true

    const cible = document.getElementById(`cf-${premiere}`)
    const focusable = cible?.matches('input, select, textarea')
      ? cible
      : cible?.querySelector<HTMLElement>('input, select, textarea')
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    cible?.scrollIntoView({ block: 'center', behavior: reduit ? 'auto' : 'smooth' })
    focusable?.focus({ preventScroll: true })
    return false
  }

  const continuer = () => {
    if (etape === 1 && controler(CHAMPS_ETAPE[1])) setEtape(2)
    else if (etape === 2 && controler(CHAMPS_ETAPE[2])) setEtape(3)
  }

  const envoyer = async () => {
    if (envoi) return
    if (!controler([...CHAMPS_ETAPE[1], ...CHAMPS_ETAPE[2]])) return

    setEnvoi(true)
    setErreurServeur(false)
    try {
      await envoyerDemande(construireDemande(donnees))
      await navigate({ to: '/contact/merci' })
    } catch {
      setErreurServeur(true)
      setEnvoi(false)
    }
  }

  const soumettre = (event: FormEvent) => {
    event.preventDefault()
    if (etape === 3) void envoyer()
    else continuer()
  }

  const bloc = resoudreBloc(donnees.profil, donnees.besoin)
  const besoins = besoinsPour(donnees.profil)
  const libelleStructure = donnees.profil
    ? LIBELLE_STRUCTURE[donnees.profil]
    : 'Votre structure'

  /** Les attributs d'accessibilité d'un champ contrôlé. */
  const lier = (cle: Cle, aide?: boolean) => ({
    id: `cf-${cle}`,
    'aria-invalid': erreurs[cle] ? true : undefined,
    'aria-describedby': [aide && `cf-${cle}-aide`, `cf-${cle}-erreur`]
      .filter(Boolean)
      .join(' '),
  })

  return (
    <form className="formulaire" ref={formRef} noValidate onSubmit={soumettre}>
      <Progression etape={etape} />

      <p className="sr-only" aria-live="polite">
        {annonce}
      </p>

      {etape === 1 && (
        <div className="formulaire__etape">
          <h2 className="formulaire__titre" ref={titreRef} tabIndex={-1}>
            Votre projet
          </h2>
          <NoteRequis />

          <div className="formulaire__duo">
            <Champ label="Vous êtes" pour="cf-profil" requis erreur={erreurs.profil} cle="profil">
              <select
                className="champ__select"
                {...lier('profil')}
                value={donnees.profil}
                onChange={(event) => {
                  /* Changer de profil remet « Vous cherchez » à zéro. */
                  const profil = event.target.value as Profil | ''
                  const suivantes = { ...donnees, profil, besoin: '' as const }
                  setDonnees(suivantes)
                  if (erreurs.profil) {
                    setErreurs((e) => ({ ...e, profil: valider('profil', suivantes) }))
                  }
                }}
                onBlur={() => quitter('profil')}
              >
                <option value="">Choisir…</option>
                {PROFILS.map((profil) => (
                  <option key={profil.valeur} value={profil.valeur}>
                    {profil.libelle}
                  </option>
                ))}
              </select>
            </Champ>

            <Champ
              label="Vous cherchez"
              pour="cf-besoin"
              requis
              erreur={erreurs.besoin}
              cle="besoin"
              aide={donnees.profil ? undefined : 'Indiquez d’abord qui vous êtes.'}
            >
              <select
                className="champ__select"
                {...lier('besoin', !donnees.profil)}
                value={donnees.besoin}
                disabled={!donnees.profil}
                onChange={(event) =>
                  changer({ besoin: event.target.value as Besoin | '' }, 'besoin')
                }
                onBlur={() => quitter('besoin')}
              >
                <option value="">Choisir…</option>
                {besoins.map((besoin) => (
                  <option key={besoin.valeur} value={besoin.valeur}>
                    {besoin.libelle}
                  </option>
                ))}
              </select>
            </Champ>
          </div>

          <Champ
            label="Quelle est la date de votre événement ?"
            pour="cf-date"
            requis
            erreur={erreurs.date}
            cle="date"
            aide="Si la date n’est pas encore fixée, indiquez une période approximative."
          >
            <input
              className="champ__input champ__input--date"
              type="date"
              {...lier('date', true)}
              min={dateMin}
              value={donnees.date}
              disabled={donnees.dateAdefinir}
              onChange={(event) => changer({ date: event.target.value }, 'date')}
              onBlur={() => quitter('date')}
            />

            <label className="case">
              <input
                className="case__input"
                type="checkbox"
                checked={donnees.dateAdefinir}
                onChange={(event) => {
                  setDonnees((d) => ({ ...d, dateAdefinir: event.target.checked }))
                  if (event.target.checked) setErreurs((e) => ({ ...e, date: '' }))
                }}
              />
              <span className="case__marque" aria-hidden="true" />
              <span className="case__texte">Date encore à définir</span>
            </label>

            {donnees.dateAdefinir && (
              <div className="champ champ--imbrique">
                <label className="champ__label" htmlFor="cf-periode">
                  Période envisagée
                </label>
                <input
                  className="champ__input"
                  id="cf-periode"
                  type="text"
                  placeholder="Ex : printemps 2027, ou juin-juillet"
                  value={donnees.periode}
                  onChange={(event) => changer({ periode: event.target.value })}
                />
              </div>
            )}
          </Champ>

          <Champ
            label="Où se déroule votre événement ?"
            pour="cf-lieu"
            facultatif
            aide="Le lieu n’est pas encore choisi ? La ville ou le département suffit."
            aideId="cf-lieu-aide"
          >
            <input
              className="champ__input"
              id="cf-lieu"
              type="text"
              autoComplete="address-level2"
              placeholder="Ex : Toulouse, ou simplement le département"
              aria-describedby="cf-lieu-aide"
              value={donnees.lieu}
              onChange={(event) => changer({ lieu: event.target.value })}
            />
          </Champ>

          <Choix
            id="cf-personnes"
            legende="Combien de personnes sont attendues ?"
            name="personnes"
            options={PERSONNES}
            requis
            valeur={donnees.personnes}
            erreur={erreurs.personnes}
            onChoisir={(valeur) => choisir('personnes', valeur)}
            onQuitter={() => quitter('personnes')}
          />

          <Choix
            id="cf-duree"
            legende="Quelle est la durée prévue ?"
            name="duree"
            options={DUREES}
            requis
            valeur={donnees.duree}
            erreur={erreurs.duree}
            onChoisir={(valeur) => choisir('duree', valeur)}
            onQuitter={() => quitter('duree')}
          />

          <div className="formulaire__actions">
            <button type="submit" className="btn btn--solid formulaire__suivant">
              Continuer
            </button>
          </div>
        </div>
      )}

      {etape === 2 && (
        <div className="formulaire__etape">
          <h2 className="formulaire__titre" ref={titreRef} tabIndex={-1}>
            Vous joindre
          </h2>
          <NoteRequis />

          <div className="formulaire__duo">
            <Champ label="Prénom" pour="cf-prenom" requis erreur={erreurs.prenom} cle="prenom">
              <input
                className="champ__input"
                type="text"
                autoComplete="given-name"
                {...lier('prenom')}
                value={donnees.prenom}
                onChange={(event) => changer({ prenom: event.target.value }, 'prenom')}
                onBlur={() => quitter('prenom')}
              />
            </Champ>

            <Champ label="Nom" pour="cf-nom" facultatif>
              <input
                className="champ__input"
                id="cf-nom"
                type="text"
                autoComplete="family-name"
                value={donnees.nom}
                onChange={(event) => changer({ nom: event.target.value })}
              />
            </Champ>
          </div>

          <div className="formulaire__duo">
            <Champ label="E-mail" pour="cf-email" requis erreur={erreurs.email} cle="email">
              <input
                className="champ__input"
                type="email"
                inputMode="email"
                autoComplete="email"
                {...lier('email')}
                value={donnees.email}
                onChange={(event) => changer({ email: event.target.value }, 'email')}
                onBlur={() => quitter('email')}
              />
            </Champ>

            <Champ
              label="Téléphone"
              precision="facultatif, pour aller plus vite"
              pour="cf-telephone"
              erreur={erreurs.telephone}
              cle="telephone"
            >
              <input
                className="champ__input"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="06 12 34 56 78"
                {...lier('telephone')}
                value={donnees.telephone}
                onChange={(event) =>
                  changer({ telephone: event.target.value }, 'telephone')
                }
                onBlur={() => quitter('telephone')}
              />
            </Champ>
          </div>

          {libelleStructure && (
            <Champ label={libelleStructure} pour="cf-structure" facultatif>
              <input
                className="champ__input"
                id="cf-structure"
                type="text"
                autoComplete="organization"
                value={donnees.structure}
                onChange={(event) => changer({ structure: event.target.value })}
              />
            </Champ>
          )}

          <Champ label="Votre message" pour="cf-message" facultatif>
            <textarea
              className="champ__input champ__zone"
              id="cf-message"
              rows={4}
              placeholder="Ce que vous avez déjà en tête, ou ce qui vous bloque."
              value={donnees.message}
              onChange={(event) => changer({ message: event.target.value })}
            />
          </Champ>

          <div className="champ">
            <label className="case case--consentement">
              <input
                className="case__input"
                type="checkbox"
                {...lier('consentement', true)}
                checked={donnees.consentement}
                onChange={(event) =>
                  changer({ consentement: event.target.checked }, 'consentement')
                }
                onBlur={() => quitter('consentement')}
              />
              <span className="case__marque" aria-hidden="true" />
              <span className="case__texte">
                J’accepte qu’Oysen utilise ces informations pour répondre à ma
                demande.
                <Requis />
              </span>
            </label>
            <p className="champ__aide champ__aide--case" id="cf-consentement-aide">
              Vos informations ne sont ni revendues ni utilisées pour de la
              prospection.{' '}
              <a className="formulaire__lien" href="/confidentialite">
                Politique de confidentialité
              </a>
            </p>
            <ZoneErreur cle="consentement" erreur={erreurs.consentement} />
          </div>

          <div className="formulaire__actions">
            <button
              type="button"
              className="btn btn--ghost formulaire__retour"
              onClick={() => setEtape(1)}
            >
              Retour
            </button>
            <button type="submit" className="btn btn--solid formulaire__suivant">
              Continuer et préciser mon projet
            </button>
          </div>

          <p className="formulaire__sortie">
            <button
              type="button"
              className="formulaire__maintenant"
              onClick={() => void envoyer()}
              disabled={envoi}
            >
              {envoi ? 'Envoi en cours…' : 'ou envoyer ma demande maintenant'}
            </button>
          </p>

          <ErreurServeur visible={erreurServeur} />
        </div>
      )}

      {etape === 3 && (
        <div className="formulaire__etape">
          <h2 className="formulaire__titre" ref={titreRef} tabIndex={-1}>
            Préciser votre besoin
          </h2>
          <p className="formulaire__chapeau">
            Tout est facultatif ici. Chaque réponse nous évite un aller-retour.
          </p>

          {bloc && (
            <>
              <p className="formulaire__bloc">{BLOCS[bloc].titre}</p>
              {BLOCS[bloc].questions.map((question) => (
                <QuestionBloc
                  key={question.id}
                  question={question}
                  donnees={donnees}
                  setDonnees={setDonnees}
                />
              ))}
            </>
          )}

          <div className="formulaire__actions">
            <button
              type="button"
              className="btn btn--ghost formulaire__retour"
              onClick={() => setEtape(2)}
              disabled={envoi}
            >
              Retour
            </button>
            <button
              type="submit"
              className="btn btn--solid formulaire__suivant"
              disabled={envoi}
              aria-busy={envoi || undefined}
            >
              {envoi ? 'Envoi en cours…' : 'Envoyer ma demande'}
            </button>
          </div>

          <p className="formulaire__micro">
            Réponse sous {DELAI_REPONSE_H}&nbsp;h ouvrées. Vos informations
            servent uniquement à répondre à votre demande.
          </p>

          <ErreurServeur visible={erreurServeur} />
        </div>
      )}
    </form>
  )
}

/* ---- La barre de progression ----
   Une chaîne de cotes, comme sur la page L'agence : trois segments, un
   trait oblique à chaque limite. Le segment en cours et ceux déjà faits
   passent en lavande. */

function Progression({ etape }: { etape: 1 | 2 | 3 }) {
  return (
    <ol className="progression" aria-label="Étapes du formulaire">
      {ETAPES.map((nom, index) => {
        const numero = index + 1
        const etat =
          numero < etape ? ' is-faite' : numero === etape ? ' is-active' : ''
        return (
          <li
            className={`progression__etape${etat}`}
            key={nom}
            aria-current={numero === etape ? 'step' : undefined}
          >
            <span className="progression__num">{numero}</span>
            <span className="progression__nom">{nom}</span>
            {numero < etape && <span className="sr-only"> (terminée)</span>}
          </li>
        )
      })}
    </ol>
  )
}

/* ---- Les briques ---- */

function Requis() {
  return (
    <>
      <span className="champ__requis" aria-hidden="true">
        {' '}*
      </span>
      <span className="sr-only"> (obligatoire)</span>
    </>
  )
}

function NoteRequis() {
  return (
    <p className="formulaire__note">
      Les champs marqués d’un <span className="champ__requis">*</span> sont
      obligatoires.
    </p>
  )
}

function ZoneErreur({ cle, erreur }: { cle: string; erreur?: string }) {
  return (
    <div className="champ__erreur-zone" id={`cf-${cle}-erreur`} aria-live="polite">
      {erreur && <p className="champ__erreur">{erreur}</p>}
    </div>
  )
}

function ErreurServeur({ visible }: { visible: boolean }) {
  return (
    <div className="formulaire__serveur" aria-live="polite">
      {visible && <p className="champ__erreur">{ERREURS.serveur}</p>}
    </div>
  )
}

/** Un champ : le label au-dessus, l'aide, puis l'erreur. */
function Champ({
  label,
  precision,
  pour,
  requis,
  facultatif,
  aide,
  aideId,
  erreur,
  cle,
  children,
}: {
  label: string
  precision?: string
  pour: string
  requis?: boolean
  facultatif?: boolean
  aide?: string
  aideId?: string
  erreur?: string
  cle?: Cle
  children: ReactNode
}) {
  const idAide = aideId ?? (cle ? `cf-${cle}-aide` : undefined)
  return (
    <div className={`champ${erreur ? ' is-erreur' : ''}`}>
      <label className="champ__label" htmlFor={pour}>
        {label}
        {requis && <Requis />}
        {(facultatif || precision) && (
          <span className="champ__precision"> ({precision ?? 'facultatif'})</span>
        )}
      </label>
      {children}
      {aide && (
        <p className="champ__aide" id={idAide}>
          {aide}
        </p>
      )}
      {cle && <ZoneErreur cle={cle} erreur={erreur} />}
    </div>
  )
}

/**
 * Un groupe de choix : un <fieldset> et sa <legend>, des boutons radio ou
 * des cases habillés en étiquettes. Le contrôle natif reste dans la page,
 * seulement rendu invisible : clavier et lecteurs d'écran le trouvent.
 */
function Choix({
  id,
  legende,
  name,
  options,
  multiple,
  requis,
  valeur,
  erreur,
  onChoisir,
  onQuitter,
}: {
  id?: string
  legende: string
  name: string
  options: readonly string[]
  multiple?: boolean
  requis?: boolean
  valeur: string | string[]
  erreur?: string
  onChoisir: (valeur: string) => void
  onQuitter?: () => void
}) {
  const cochee = (option: string) =>
    Array.isArray(valeur) ? valeur.includes(option) : valeur === option

  return (
    <fieldset
      className={`champ choix${erreur ? ' is-erreur' : ''}`}
      id={id}
      aria-describedby={id ? `${id}-erreur` : undefined}
      onBlur={(event) => {
        /* Contrôlé quand le focus quitte le groupe, pas entre ses options. */
        if (onQuitter && !event.currentTarget.contains(event.relatedTarget)) {
          onQuitter()
        }
      }}
    >
      <legend className="champ__label">
        {legende}
        {requis && <Requis />}
        {multiple && <span className="champ__precision"> (plusieurs choix possibles)</span>}
      </legend>

      <div className="choix__options">
        {options.map((option) => (
          <label className="choix__option" key={option}>
            <input
              className="choix__input"
              type={multiple ? 'checkbox' : 'radio'}
              name={name}
              value={option}
              checked={cochee(option)}
              onChange={() => onChoisir(option)}
            />
            <span className="choix__texte">{option}</span>
          </label>
        ))}
      </div>

      {id && (
        <div className="champ__erreur-zone" id={`${id}-erreur`} aria-live="polite">
          {erreur && <p className="champ__erreur">{erreur}</p>}
        </div>
      )}
    </fieldset>
  )
}

/** Une question de l'étape 3, selon son type. */
function QuestionBloc({
  question,
  donnees,
  setDonnees,
}: {
  question: Question
  donnees: Donnees
  setDonnees: (maj: (d: Donnees) => Donnees) => void
}) {
  const reponse = donnees.reponses[question.id]
  const repondre = (valeur: string | string[]) =>
    setDonnees((d) => ({ ...d, reponses: { ...d.reponses, [question.id]: valeur } }))
  const idChamp = `cf-${question.id}`

  if (question.type === 'texte' || question.type === 'zone') {
    const commun = {
      id: idChamp,
      placeholder: question.placeholder,
      value: typeof reponse === 'string' ? reponse : '',
      onChange: (event: { target: { value: string } }) => repondre(event.target.value),
    }
    return (
      <Champ label={question.label} pour={idChamp}>
        {question.type === 'texte' ? (
          <input className="champ__input" type="text" {...commun} />
        ) : (
          <textarea className="champ__input champ__zone" rows={4} {...commun} />
        )}
      </Champ>
    )
  }

  const multiple = question.type === 'multiple'
  const liste = Array.isArray(reponse) ? reponse : []
  const unique = typeof reponse === 'string' ? reponse : ''

  return (
    <div className="question">
      <Choix
        legende={question.label}
        name={question.id}
        options={question.options ?? []}
        multiple={multiple}
        valeur={multiple ? liste : unique}
        onChoisir={(option) =>
          repondre(
            multiple
              ? liste.includes(option)
                ? liste.filter((o) => o !== option)
                : [...liste, option]
              : option,
          )
        }
      />

      {question.autre && liste.includes(question.autre) && (
        <div className="champ champ--imbrique">
          <label className="champ__label" htmlFor={`${idChamp}-autre`}>
            Précisez
          </label>
          <input
            className="champ__input"
            id={`${idChamp}-autre`}
            type="text"
            value={donnees.autres[question.id] ?? ''}
            onChange={(event) =>
              setDonnees((d) => ({
                ...d,
                autres: { ...d.autres, [question.id]: event.target.value },
              }))
            }
          />
        </div>
      )}

      {question.depot && unique === question.depot && (
        <Depot
          fichiers={donnees.fichiers[question.id] ?? []}
          onChange={(fichiers) =>
            setDonnees((d) => ({
              ...d,
              fichiers: { ...d.fichiers, [question.id]: fichiers },
            }))
          }
        />
      )}
    </div>
  )
}
