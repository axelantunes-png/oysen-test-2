import { useState } from 'react'

import { NAV } from './Navbar'
import {
  DEPARTEMENTS,
  PHONE_DISPLAY,
  PHONE_TEL,
  ZONE,
} from './home/content'

/** Les six services, repris du menu : un seul vocabulaire sur tout le site. */
const SERVICES = NAV.find((item) => item.label === 'Nos services')?.children ?? []

/**
 * L'agence : ce qu'on est, ce qu'on a fait, ce qu'on écrit. Les deux entrées
 * de « Qui sommes-nous » viennent du menu, les deux autres sont des pages de
 * premier niveau.
 */
const AGENCE = [
  ...(NAV.find((item) => item.label === 'Qui sommes-nous')?.children ?? []),
  { label: 'Nos souvenirs', href: '/nos-souvenirs' },
  { label: 'Blog', href: '/blog' },
]

const LEGAL = [
  { label: 'Mentions légales', href: '/mentions-legales' },
  { label: 'Politique de confidentialité', href: '/confidentialite' },
]

const INSTAGRAM = 'https://www.instagram.com/oysen.events/'

/**
 * À RENSEIGNER : l'adresse de la page Facebook. Tant qu'elle est vide, le
 * logo est posé mais inerte, et il sort de l'arbre d'accessibilité : une
 * icône qui ne mène nulle part n'a rien à annoncer.
 */
const FACEBOOK = ''

/** Le glyphe Instagram, au même trait que les pictogrammes du site. */
function InstagramIcon() {
  return (
    <svg
      className="footer__reseau-icon"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="3.25"
        y="3.25"
        width="17.5"
        height="17.5"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="12"
        cy="12"
        r="4.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="17.1" cy="6.9" r="1.15" fill="currentColor" />
    </svg>
  )
}

/** Le glyphe Facebook, dans le même cadre et au même trait qu'Instagram. */
function FacebookIcon() {
  return (
    <svg
      className="footer__reseau-icon"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="3.25"
        y="3.25"
        width="17.5"
        height="17.5"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M14.9 7.7h-1a2 2 0 0 0-2 2v7.6M9.7 11.9h4.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Le pied de page : la salle après la représentation.
 *
 * C'est la bande la plus sombre du site, et la plus silencieuse. La page
 * vient de se terminer sur l'appel à l'action et sa rampe violette ; tout
 * ce qui suit est du service, pas du discours. Seule l'arête du haut reste
 * allumée, comme la veilleuse qu'on laisse en partant.
 */
export function Footer() {
  /*
   * Le numéro n'est pas dans le HTML servi : il n'apparaît qu'au clic. Les
   * aspirateurs d'adresses qui lisent la page sans exécuter le JS repartent
   * les mains vides.
   */
  const [phoneShown, setPhoneShown] = useState(false)

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          {/* Le logo définitif entier, mention comprise. */}
          <img
            className="footer__logo"
            src="/images/logo-oysen-pied-280.webp"
            srcSet="/images/logo-oysen-pied-280.webp 1x, /images/logo-oysen-pied-560.webp 2x"
            width={280}
            height={125}
            alt="Oysen, créateur d’événements"
            loading="lazy"
            decoding="async"
          />

          <p className="footer__brand-text">
            Agence événementielle installée à {ZONE}. Nous cherchons le lieu,
            sélectionnons les prestataires, coordonnons la technique et
            pilotons le jour J, avec notre propre parc son, lumière et
            structure.
          </p>
        </div>

        {/* Six services sur deux colonnes : en une seule, la liste faisait
            toute la hauteur du pied de page. */}
        <nav className="footer__col footer__col--services" aria-label="Nos services">
          <h2 className="footer__title">Nos services</h2>
          <ul className="footer__list footer__list--deux">
            {SERVICES.map((item) => (
              <li key={item.href}>
                <a className="footer__link" href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="footer__col" aria-label="L’agence">
          <h2 className="footer__title">L’agence</h2>
          <ul className="footer__list">
            {AGENCE.map((item) => (
              <li key={item.href}>
                <a className="footer__link" href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col footer__col--contact">
          <h2 className="footer__title">Contact</h2>
          <ul className="footer__list">
            <li>
              <a className="footer__link" href="/contact">
                Nous écrire
              </a>
            </li>
            <li>
              {/* aria-live : le lecteur d'écran annonce le numéro qui remplace le bouton. */}
              <span aria-live="polite">
                {phoneShown ? (
                  <a className="footer__link footer__phone" href={`tel:${PHONE_TEL}`}>
                    {PHONE_DISPLAY}
                  </a>
                ) : (
                  <button
                    type="button"
                    className="footer__link footer__reveal"
                    onClick={() => setPhoneShown(true)}
                  >
                    Afficher le numéro
                  </button>
                )}
              </span>
            </li>
          </ul>

          {/* Les boutons sont en relief doux : les seuls objets du pied de
              page qu'on peut presser. */}
          <div className="footer__reseaux">
            <h2 className="footer__title">Nos réseaux</h2>

            <div className="footer__reseaux-liste">
              <a
                className="footer__reseau"
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Oysen sur Instagram, nouvel onglet"
              >
                <InstagramIcon />
              </a>

              {FACEBOOK ? (
                <a
                  className="footer__reseau"
                  href={FACEBOOK}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Oysen sur Facebook, nouvel onglet"
                >
                  <FacebookIcon />
                </a>
              ) : (
                /* Sans adresse : le même bouton en tout point, il ne mène
                   simplement nulle part et ne s'annonce pas. */
                <a className="footer__reseau" aria-hidden="true">
                  <FacebookIcon />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* La zone desservie court sur toute la largeur : sept départements
            ne tiennent pas dans une colonne. */}
        <div className="footer__zones">
          <h2 className="footer__title">Zone desservie</h2>
          <ul className="footer__depts">
            {DEPARTEMENTS.map((departement) => (
              <li key={departement}>{departement}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__copy">
          © {new Date().getFullYear()} Oysen. Tous droits réservés.
        </p>

        <ul className="footer__legal">
          {LEGAL.map((item) => (
            <li key={item.href}>
              <a className="footer__link" href={item.href}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
