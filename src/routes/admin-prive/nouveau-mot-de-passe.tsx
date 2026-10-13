import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import { Lien } from '../../components/Lien'
import { getSupabase, sessionOuverte } from '../../lib/supabase'

/* Même raison que sur la page Contact : chemin depuis la racine. */
import adminCss from '/src/styles/admin.css?url'

/*
 * La page où mène le lien de réinitialisation reçu par e-mail. Le lien
 * porte une session temporaire (dans l'adresse, après le #) : le client
 * Supabase la lit à l'ouverture, et elle seule autorise le changement.
 */
export const Route = createFileRoute('/admin-prive/nouveau-mot-de-passe')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'Nouveau mot de passe, Oysen' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
    links: [{ rel: 'stylesheet', href: adminCss }],
  }),
  component: NouveauMotDePasse,
})

/** La longueur minimale, celle que Supabase impose par défaut ou plus. */
const LONGUEUR_MIN = 8

type Etat = 'lecture' | 'pret' | 'invalide'

function messageMiseAJour(code: string | undefined) {
  if (code === 'same_password')
    return 'Choisissez un mot de passe différent de l’ancien.'
  if (code === 'weak_password')
    return 'Ce mot de passe est trop faible : allongez-le ou variez les caractères.'
  return 'Le changement a échoué. Réessayez dans un instant.'
}

function NouveauMotDePasse() {
  const navigate = useNavigate()
  const [etat, setEtat] = useState<Etat>('lecture')
  const [motDePasse, setMotDePasse] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [enCours, setEnCours] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)

  /* Le lien est-il valide ? Un lien expiré ou déjà servi n'ouvre aucune session. */
  useEffect(() => {
    let actif = true
    void sessionOuverte().then((session) => {
      if (actif) setEtat(session ? 'pret' : 'invalide')
    })
    return () => {
      actif = false
    }
  }, [])

  async function enregistrer(evenement: FormEvent<HTMLFormElement>) {
    evenement.preventDefault()
    setErreur(null)

    if (motDePasse.length < LONGUEUR_MIN) {
      setErreur(`Le mot de passe doit compter au moins ${LONGUEUR_MIN} caractères.`)
      return
    }
    if (motDePasse !== confirmation) {
      setErreur('Les deux mots de passe ne sont pas identiques.')
      return
    }

    setEnCours(true)
    const { error } = await getSupabase().auth.updateUser({ password: motDePasse })
    setEnCours(false)

    if (error) {
      setErreur(messageMiseAJour(error.code))
      return
    }
    void navigate({ to: '/admin-prive/cms' })
  }

  return (
    <main className="admin">
      <div className="admin__carte">
        <img
          className="admin__logo"
          src="/images/logo-oysen.png"
          alt="Oysen"
          width={3000}
          height={2000}
        />
        <h1 className="admin__titre">Nouveau mot de passe</h1>

        {etat === 'lecture' ? (
          <p className="admin__texte">Vérification du lien…</p>
        ) : null}

        {etat === 'invalide' ? (
          <>
            <p className="admin__texte">
              Ce lien n’est plus valide : il a expiré ou a déjà servi.
              Demandez-en un nouveau depuis la page de connexion.
            </p>
            <Lien className="btn btn--ghost admin__bouton" href="/admin-prive">
              Retour à la connexion
            </Lien>
          </>
        ) : null}

        {etat === 'pret' ? (
          <form className="admin__formulaire" onSubmit={enregistrer}>
            <div className="admin__champ">
              <label className="admin__label" htmlFor="admin-nouveau">
                Nouveau mot de passe
              </label>
              <input
                className="admin__input"
                id="admin-nouveau"
                type="password"
                autoComplete="new-password"
                required
                minLength={LONGUEUR_MIN}
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
              />
              <p className="admin__aide">Au moins {LONGUEUR_MIN} caractères.</p>
            </div>

            <div className="admin__champ">
              <label className="admin__label" htmlFor="admin-confirmation">
                Confirmez le mot de passe
              </label>
              <input
                className="admin__input"
                id="admin-confirmation"
                type="password"
                autoComplete="new-password"
                required
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
              />
            </div>

            <p className="admin__message" role="status" aria-live="polite">
              {erreur ? (
                <span className="admin__note admin__note--erreur">{erreur}</span>
              ) : null}
            </p>

            <button className="btn btn--solid admin__bouton" type="submit" disabled={enCours}>
              Enregistrer le mot de passe
            </button>
          </form>
        ) : null}
      </div>
    </main>
  )
}
