import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'

import { getSupabase } from '../../lib/supabase'

/* Même raison que sur la page Contact : chemin depuis la racine. */
import adminCss from '/src/styles/admin.css?url'

/*
 * La page de connexion à l'administration. Son seul accès, à terme, sera
 * cette adresse : aucun lien du site n'y mènera (le lien « Admin » du pied
 * de page est provisoire).
 *
 * Rendue dans le navigateur seulement (ssr: false) : la session vit dans
 * le stockage du navigateur, le serveur ne la connaît pas.
 */
export const Route = createFileRoute('/admin-prive/')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'Connexion, Oysen' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
    links: [{ rel: 'stylesheet', href: adminCss }],
  }),
  /* Déjà connecté : droit au CMS. */
  beforeLoad: async () => {
    /* Importé à la demande : cette vérification fait partie de l'arbre des
       routes, téléchargé par tout le site, qui n'a pas à embarquer Supabase. */
    const { sessionOuverte } = await import('../../lib/supabase')
    if (await sessionOuverte()) throw redirect({ to: '/admin-prive/cms' })
  },
  component: Connexion,
})

/** Où mène le lien reçu par e-mail. L'adresse doit être autorisée dans Supabase. */
function adresseNouveauMotDePasse() {
  return `${window.location.origin}/admin-prive/nouveau-mot-de-passe`
}

type Message = { ton: 'erreur' | 'info'; texte: string } | null

function messageConnexion(code: string | undefined) {
  if (code === 'invalid_credentials') return 'Identifiant ou mot de passe incorrect.'
  if (code === 'email_not_confirmed') return 'Ce compte n’est pas encore validé.'
  return 'La connexion a échoué. Réessayez dans un instant.'
}

function Connexion() {
  const navigate = useNavigate()
  const [identifiant, setIdentifiant] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [enCours, setEnCours] = useState(false)
  const [message, setMessage] = useState<Message>(null)

  async function connecter(evenement: FormEvent<HTMLFormElement>) {
    evenement.preventDefault()
    setEnCours(true)
    setMessage(null)

    const { error } = await getSupabase().auth.signInWithPassword({
      email: identifiant.trim(),
      password: motDePasse,
    })

    setEnCours(false)
    if (error) {
      setMessage({ ton: 'erreur', texte: messageConnexion(error.code) })
      return
    }
    void navigate({ to: '/admin-prive/cms' })
  }

  /*
   * La réinitialisation passe par l'adresse e-mail : Supabase y envoie un
   * lien, et c'est ce clic qui prouve que la demande vient bien du
   * titulaire. Le lien mène à la page du nouveau mot de passe.
   *
   * Le message ne dit jamais si l'adresse a un compte : il serait sinon
   * possible de deviner l'identifiant.
   */
  async function reinitialiser() {
    const email = identifiant.trim()
    if (!email) {
      setMessage({
        ton: 'erreur',
        texte: 'Saisissez d’abord votre identifiant : le lien y sera envoyé.',
      })
      return
    }

    setEnCours(true)
    setMessage(null)
    const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
      redirectTo: adresseNouveauMotDePasse(),
    })
    setEnCours(false)

    if (error) {
      setMessage({
        ton: 'erreur',
        texte:
          error.status === 429
            ? 'Trop de demandes rapprochées. Réessayez dans quelques minutes.'
            : 'L’envoi a échoué. Réessayez dans un instant.',
      })
      return
    }
    setMessage({
      ton: 'info',
      texte:
        'Si un compte correspond à cette adresse, un e-mail vient d’y être envoyé. Ouvrez le lien qu’il contient pour choisir un nouveau mot de passe.',
    })
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
        <h1 className="admin__titre">Connexion</h1>

        <form className="admin__formulaire" onSubmit={connecter}>
          <div className="admin__champ">
            <label className="admin__label" htmlFor="admin-identifiant">
              Identifiant
            </label>
            <input
              className="admin__input"
              id="admin-identifiant"
              type="email"
              autoComplete="username"
              required
              value={identifiant}
              onChange={(e) => setIdentifiant(e.target.value)}
            />
          </div>

          <div className="admin__champ">
            <label className="admin__label" htmlFor="admin-mot-de-passe">
              Mot de passe
            </label>
            <input
              className="admin__input"
              id="admin-mot-de-passe"
              type="password"
              autoComplete="current-password"
              required
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
            />
          </div>

          <p className="admin__message" role="status" aria-live="polite">
            {message ? (
              <span className={`admin__note admin__note--${message.ton}`}>
                {message.texte}
              </span>
            ) : null}
          </p>

          <button className="btn btn--solid admin__bouton" type="submit" disabled={enCours}>
            Se connecter
          </button>

          <button
            className="admin__lien"
            type="button"
            onClick={reinitialiser}
            disabled={enCours}
          >
            Réinitialiser mon mot de passe
          </button>
        </form>
      </div>
    </main>
  )
}
