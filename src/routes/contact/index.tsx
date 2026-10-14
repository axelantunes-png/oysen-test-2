import { createFileRoute } from '@tanstack/react-router'

import { DELAI_REPONSE_H, EMAIL } from '../../components/contact/content'
import { Formulaire } from '../../components/contact/Formulaire'
import {
  DEPARTEMENTS,
  PHONE_DISPLAY,
  PHONE_TEL,
  ZONE,
} from '../../components/home/content'
import { classeTheme, couleurTheme, lireTheme } from '../../lib/theme'

/*
 * Chemin depuis la racine du projet, et non relatif : sur une route imbriquée,
 * le découpage de TanStack Start réécrit le module et le chemin relatif n'est
 * plus résolvable côté serveur (« Denied ID »).
 */
import contactCss from '/src/styles/contact.css?url'

export const Route = createFileRoute('/contact/')({
  validateSearch: lireTheme,
  head: ({ match }) => ({
    meta: [
      { name: 'theme-color', content: couleurTheme(match.search.theme) },
      { title: 'Contact, Oysen' },
      {
        name: 'description',
        content: `Décrivez votre événement en quelques minutes : Oysen vous répond sous ${DELAI_REPONSE_H} h ouvrées, avec un premier ordre de grandeur budgétaire.`,
      },
    ],
    links: [{ rel: 'stylesheet', href: contactCss }],
  }),
  component: Contact,
})

/**
 * La page Contact.
 *
 * Tout converge vers le formulaire : un hero court pour qu'il soit amorcé
 * dès le premier défilement, trois réassurances juste avant lui, puis ce
 * qui se passe après l'envoi. À côté, les autres moyens de nous joindre,
 * pour les acheteurs publics et les confrères, qui ne remplissent presque
 * jamais de formulaire.
 */
function Contact() {
  const { theme } = Route.useSearch()

  return (
    <main className={classeTheme(theme) || undefined}>
      <section className="contact-hero" aria-labelledby="contact-title">
        <div className="contact-hero__inner">
          <p className="section__eyebrow">Contact</p>
          <h1 className="contact-hero__titre" id="contact-title">
            Parlons de votre événement
          </h1>
          <p className="contact-hero__lede">
            Décrivez votre projet en quelques minutes. Oysen vous répond sous{' '}
            {DELAI_REPONSE_H}&nbsp;h ouvrées, avec un premier ordre de grandeur
            budgétaire.
          </p>
        </div>
      </section>

      <section className="contact" aria-label="Formulaire de contact">
        <div className="contact__inner">
          <Assurances />

          <div className="contact__grille">
            <div className="contact__formulaire">
              <Formulaire />
            </div>

            <Apres />
            <Joindre />
          </div>
        </div>
      </section>
    </main>
  )
}

/* ---- S2 · Les réducteurs de friction ---- */

const ASSURANCES = [
  {
    icone: 'M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17zM12 7.5V12l3 2',
    titre: `Réponse sous ${DELAI_REPONSE_H} h ouvrées`,
    texte: 'Un échange, pas un devis automatique.',
  },
  {
    icone: 'M7.5 11V7.5a4.5 4.5 0 0 1 8.7-1.6M5.5 11h13v9.5h-13zM12 14.5v2.5',
    titre: 'Sans engagement',
    texte: 'L’étude de votre demande est gratuite.',
  },
  {
    icone:
      'M15.5 7.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0zM5 20.5c.8-3.8 3.6-6 7-6s6.2 2.2 7 6',
    titre: 'Un seul interlocuteur',
    texte: 'Celui qui vous répond est celui qui pilotera votre événement.',
  },
]

function Assurances() {
  return (
    <ul className="assurances">
      {ASSURANCES.map((item) => (
        <li className="assurance" key={item.titre}>
          <svg
            className="assurance__icone"
            viewBox="0 0 24 24"
            width="28"
            height="28"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d={item.icone}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="assurance__titre">{item.titre}</p>
          <p className="assurance__texte">{item.texte}</p>
        </li>
      ))}
    </ul>
  )
}

/* ---- S4 · Ce qui se passe après ----
   Numérotée : c'est une vraie séquence, dans l'ordre où elle arrive. */

const APRES = [
  'Vous recevez un accusé de réception immédiat, avec le récapitulatif de votre demande.',
  `Nous vous rappelons sous ${DELAI_REPONSE_H} h ouvrées pour préciser ce qui manque et vous donner un ordre de grandeur.`,
  'Vous recevez une proposition détaillée, une fois le besoin cadré.',
]

function Apres() {
  return (
    <section className="apres" aria-labelledby="apres-title">
      <h2 className="apres__titre" id="apres-title">
        Ce qui se passe après
      </h2>

      <ol className="apres__etapes">
        {APRES.map((texte, index) => (
          <li className="apres__etape" key={texte}>
            <span className="apres__num" aria-hidden="true">
              {index + 1}
            </span>
            <p className="apres__texte">{texte}</p>
          </li>
        ))}
      </ol>

      <p className="apres__franchise">
        Si votre projet ne correspond pas à ce que nous savons faire, nous vous
        le disons dès le premier échange et nous vous orientons.
      </p>
    </section>
  )
}

/* ---- S5 · Les autres moyens de nous joindre ---- */

function Joindre() {
  const departements = DEPARTEMENTS.map((d) => d.replace(/\s*\(\d+\)$/, ''))

  return (
    <aside className="joindre" aria-labelledby="joindre-title">
      <h2 className="joindre__titre" id="joindre-title">
        Autres moyens de nous joindre
      </h2>

      <dl className="joindre__liste">
        <div className="joindre__item">
          <dt className="joindre__label">Par téléphone</dt>
          <dd className="joindre__valeur">
            <a className="joindre__lien" href={`tel:${PHONE_TEL}`}>
              {PHONE_DISPLAY}
            </a>
            <span className="joindre__detail">Du lundi au vendredi</span>
          </dd>
        </div>

        <div className="joindre__item">
          <dt className="joindre__label">Par e-mail</dt>
          <dd className="joindre__valeur">
            <a className="joindre__lien" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
          </dd>
        </div>

        <div className="joindre__item">
          <dt className="joindre__label">Zone d’intervention</dt>
          <dd className="joindre__valeur joindre__valeur--texte">
            {ZONE} et sept départements&nbsp;: {departements.join(', ')}.
          </dd>
        </div>
      </dl>
    </aside>
  )
}
