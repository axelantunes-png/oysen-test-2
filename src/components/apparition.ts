import { useEffect } from 'react'

/** Ce qui apparaît au défilement : les sections, la bande, le pied de page. */
const CIBLES = '.section, .reassurance, .footer'

/**
 * Le bloc est considéré comme vu quand il est entré de deux sixièmes dans
 * l'écran : plus tôt, le fondu se jouait hors du champ et on ne le voyait
 * pas.
 *
 * Sur portable, un sixième suffit : les blocs y sont bien plus hauts que
 * l'écran, et attendre le tiers reviendrait à ne les allumer qu'une fois
 * dépassés.
 *
 * La marge basse déclenche un peu avant que le bloc n'atteigne son seuil,
 * pour que le mouvement accompagne la descente.
 */
const SEUIL = 2 / 6
const SEUIL_MOBILE = 1 / 6
const MOBILE = '(max-width: 760px)'
const MARGE = '0px 0px -6% 0px'

/**
 * Chaque bloc monte d'un souffle en apparaissant, une seule fois.
 *
 * L'état de départ (invisible, décalé vers le bas) n'est posé qu'ici, par
 * l'attribut `data-apparition` sur `<html>` : sans JavaScript, ou si
 * l'observateur n'existe pas, la page s'affiche telle quelle plutôt que de
 * rester blanche. Les visiteurs qui demandent moins d'animations ne voient
 * rien bouger, la règle CSS ne s'applique pas à eux.
 */
export function useApparition() {
  useEffect(() => {
    const doux = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (doux || !('IntersectionObserver' in window)) return

    const racine = document.documentElement
    racine.dataset.apparition = 'on'

    const observateur = new IntersectionObserver(
      (entrees) => {
        /* Relu à chaque passage : une rotation d'écran change le seuil. */
        const seuil = window.matchMedia(MOBILE).matches ? SEUIL_MOBILE : SEUIL

        for (const entree of entrees) {
          /*
           * Un bloc plus haut que trois écrans n'atteindra jamais le tiers :
           * une demi-hauteur d'écran visible vaut alors déclenchement.
           */
          const assezVisible =
            entree.intersectionRatio >= seuil ||
            entree.intersectionRect.height >= window.innerHeight / 2

          if (!entree.isIntersecting || !assezVisible) continue

          entree.target.classList.add('est-vu')
          observateur.unobserve(entree.target)
        }
      },
      { threshold: [SEUIL_MOBILE, SEUIL], rootMargin: MARGE },
    )

    for (const bloc of document.querySelectorAll(CIBLES)) {
      observateur.observe(bloc)
    }

    return () => {
      observateur.disconnect()
      delete racine.dataset.apparition
    }
  }, [])
}
