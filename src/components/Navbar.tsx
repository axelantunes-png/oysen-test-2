import { useEffect, useId, useRef, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'

type SubItem = { label: string; href: string }
type NavItem = { label: string; href: string; children?: SubItem[] }

/**
 * Les routes n'existent pas encore : les `href` décrivent l'arborescence
 * visée. Quand les pages seront créées, il suffira de remplacer les balises
 * <a> par des <Link to> de TanStack Router — la structure ci-dessous ne
 * bouge pas.
 */
export const NAV: NavItem[] = [
  { label: 'Accueil', href: '/' },
  {
    label: 'Nos services',
    href: '/nos-services',
    children: [
      {
        label: 'Mariages & événements privés',
        href: '/nos-services/mariages-evenements-prives',
      },
      {
        label: 'Événements d’entreprise',
        href: '/nos-services/evenements-entreprise',
      },
      {
        label: 'Festivals & événements culturels',
        href: '/nos-services/festivals-evenements-culturels',
      },
      {
        label: 'Collectivités & institutionnels',
        href: '/nos-services/collectivites-institutionnels',
      },
      {
        label: 'Prestation technique',
        href: '/nos-services/prestation-technique',
      },
      {
        label: 'Location de matériel',
        href: '/nos-services/location-de-materiel',
      },
    ],
  },
  {
    label: 'Qui sommes-nous',
    href: '/qui-sommes-nous',
    children: [
      { label: 'L’agence', href: '/qui-sommes-nous/l-agence' },
      { label: 'Le fondateur', href: '/qui-sommes-nous/le-fondateur' },
    ],
  },
  { label: 'Nos souvenirs', href: '/nos-souvenirs' },
  { label: 'Contact', href: '/contact' },
  { label: 'Blog', href: '/blog' },
]

/** L'adresse, sans barre finale : « /contact/ » vaut « /contact ». */
function normaliser(chemin: string) {
  return chemin.length > 1 ? chemin.replace(/\/+$/, '') : chemin
}

/** Le lien mène-t-il à la page affichée, ou à une page placée sous lui ? */
function mene(href: string, chemin: string) {
  if (href === '/') return chemin === '/'
  return chemin === href || chemin.startsWith(`${href}/`)
}

/*
 * L'entrée active : celle de la page, ou, pour un menu, celle dont une
 * sous-page est affichée. Le trait se pose alors sur le menu lui-même.
 */
function estActif(item: NavItem, chemin: string) {
  return (
    mene(item.href, chemin) ||
    (item.children?.some((child) => mene(child.href, chemin)) ?? false)
  )
}

/** En dessous, la barre passe au menu plein écran. */
const DESKTOP = '(min-width: 1024px)'

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 8"
      width="10"
      height="7"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M1 1.5 6 6.5 11 1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Navbar() {
  /* Desktop : un seul déroulant ouvert à la fois, repéré par son libellé. */
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>(null)
  /* La barre s'efface quand on descend, revient dès qu'on remonte. */
  const [hidden, setHidden] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const uid = useId()
  /* Lu dans le routeur : juste dès le rendu serveur, sans attendre le client. */
  const chemin = normaliser(
    useRouterState({ select: (state) => state.location.pathname }),
  )

  /*
   * Un menu ouvert verrouille la barre en place : l'escamoter emporterait
   * avec elle le panneau déroulant, ou le bouton « Fermer » du menu plein
   * écran. La référence est relue à chaque défilement, sans réabonnement.
   */
  const lockedRef = useRef(false)
  lockedRef.current = drawerOpen || openMenu !== null

  const closeIfOpen = (label: string) =>
    setOpenMenu((current) => (current === label ? null : current))

  useEffect(() => {
    /* Près du haut, la barre reste toujours visible. */
    const SEUIL = 140
    /* En deçà, c'est du tremblement : élan résiduel, rebond de fin de page. */
    const DELTA = 6

    let precedent = window.scrollY
    let frame = 0

    function onScroll() {
      /* Une mesure par image : le défilement en déclenche bien davantage. */
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const y = Math.max(0, window.scrollY)
        const ecart = y - precedent
        if (Math.abs(ecart) < DELTA) return
        precedent = y
        setHidden(!lockedRef.current && y > SEUIL && ecart > 0)
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  /* Échap referme ce qui est ouvert, déroulant comme menu plein écran. */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      setOpenMenu(null)
      setDrawerOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  /* Un clic hors de la barre referme le déroulant ouvert à la souris. */
  useEffect(() => {
    if (!openMenu) return
    function onPointerDown(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) setOpenMenu(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [openMenu])

  /* Le menu plein écran couvre la page : le fond ne doit pas défiler dessous. */
  useEffect(() => {
    if (!drawerOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [drawerOpen])

  /*
   * Passer d'une largeur à l'autre ne doit jamais laisser un panneau ouvert
   * dans l'autre mode — sinon le menu plein écran reste collé sur desktop.
   */
  useEffect(() => {
    const query = window.matchMedia(DESKTOP)
    function sync() {
      if (query.matches) {
        setDrawerOpen(false)
        setOpenSection(null)
      } else {
        setOpenMenu(null)
      }
    }
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  return (
    <>
      <header
        className={`nav${hidden && !lockedRef.current ? ' nav--hidden' : ''}`}
        ref={navRef}
      >
        <div className="nav__inner">
          <a className="nav__brand" href="/">
            {/*
              Le logo définitif, recadré sur le mot et son Y : la mention
              « Créateur d'événements » serait illisible à cette hauteur.
              Deux densités, en WebP (voir A-FAIRE.md § 8).
            */}
            <img
              className="nav__logo"
              src="/images/logo-oysen-barre-220.webp"
              srcSet="/images/logo-oysen-barre-220.webp 1x, /images/logo-oysen-barre-440.webp 2x"
              width={220}
              height={80}
              alt="Oysen, accueil"
            />
          </a>

          <nav className="nav__nav" aria-label="Navigation principale">
            <ul className="nav__list">
              {NAV.map((item, index) => {
                if (!item.children) {
                  return (
                    <li className="nav__item" key={item.label}>
                      <a
                        className={`nav__link${estActif(item, chemin) ? ' nav__link--actif' : ''}`}
                        href={item.href}
                        aria-current={mene(item.href, chemin) ? 'page' : undefined}
                      >
                        {item.label}
                      </a>
                    </li>
                  )
                }

                const open = openMenu === item.label
                const panelId = `${uid}-menu-${index}`

                return (
                  <li
                    className={`nav__item${open ? ' nav__item--open' : ''}`}
                    key={item.label}
                    onPointerEnter={() => setOpenMenu(item.label)}
                    onPointerLeave={() => closeIfOpen(item.label)}
                    /* Le déroulant suit le focus clavier et se ferme en le quittant. */
                    onFocus={() => setOpenMenu(item.label)}
                    onBlur={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) {
                        closeIfOpen(item.label)
                      }
                    }}
                  >
                    <button
                      type="button"
                      className={`nav__link${estActif(item, chemin) ? ' nav__link--actif' : ''}`}
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenMenu(open ? null : item.label)}
                    >
                      {item.label}
                      <Chevron className="nav__caret" />
                    </button>

                    <ul
                      className={`nav__panel${open ? ' is-open' : ''}`}
                      id={panelId}
                    >
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <a
                            className="nav__sublink"
                            href={child.href}
                            aria-current={
                              mene(child.href, chemin) ? 'page' : undefined
                            }
                          >
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                )
              })}
            </ul>

            <button
              type="button"
              className="nav__toggle"
              aria-expanded={drawerOpen}
              aria-controls={`${uid}-drawer`}
              onClick={() => setDrawerOpen((open) => !open)}
            >
              {drawerOpen ? 'Fermer' : 'Menu'}
            </button>
          </nav>
        </div>
      </header>

      {/*
        Le menu plein écran, volontairement hors de la barre.

        À l'intérieur, il n'aurait pas fonctionné : la barre porte un
        backdrop-filter, et un élément filtré devient le référentiel de ses
        descendants en position: fixed. Le panneau se serait calé sur la
        barre — 62px de haut — au lieu de l'écran, et sa hauteur serait
        tombée à zéro. Le même piège vaut pour le transform qui escamote la
        barre au défilement.

        Les entrées sont en blanc sur la nuit du site, sous-menus en
        accordéon, un seul ouvert à la fois.
      */}
      <div
        className={`nav__drawer${drawerOpen ? ' is-open' : ''}`}
        id={`${uid}-drawer`}
      >
        <div className="nav__drawer-inner">
          <ul className="nav__mobile-list">
            {NAV.map((item, index) => {
              if (!item.children) {
                return (
                  <li className="nav__mobile-item" key={item.label}>
                    <a
                      className={`nav__mobile-link${estActif(item, chemin) ? ' nav__mobile-link--actif' : ''}`}
                      href={item.href}
                      aria-current={mene(item.href, chemin) ? 'page' : undefined}
                      onClick={() => setDrawerOpen(false)}
                    >
                      {item.label}
                    </a>
                  </li>
                )
              }

              const open = openSection === item.label
              const sectionId = `${uid}-section-${index}`

              return (
                <li className="nav__mobile-item" key={item.label}>
                  <button
                    type="button"
                    className={`nav__mobile-link${estActif(item, chemin) ? ' nav__mobile-link--actif' : ''}`}
                    aria-expanded={open}
                    aria-controls={sectionId}
                    onClick={() => setOpenSection(open ? null : item.label)}
                  >
                    {item.label}
                    <Chevron className="nav__caret" />
                  </button>

                  <div
                    className={`nav__mobile-panel${open ? ' is-open' : ''}`}
                    id={sectionId}
                  >
                    <ul>
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <a
                            className="nav__mobile-sublink"
                            href={child.href}
                            aria-current={
                              mene(child.href, chemin) ? 'page' : undefined
                            }
                            onClick={() => setDrawerOpen(false)}
                          >
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </>
  )
}
