import { useEffect } from 'react'

/**
 * Les sections qui apparaissent partie par partie. Leur surtitre et leur
 * titre entrent les premiers, puis leurs blocs, listés dans CASCADE.
 *
 * Une section absente de cette liste apparaît d'un seul tenant : c'est le
 * cas de S5, la bande de réassurance, trois chiffres sur une ligne qu'il
 * n'y a rien à détailler.
 */
const SECTIONS_CASCADE = [
  '.section--tri',
  '.section--probleme',
  '.section--guide',
  '.section--methode',
  '.section--preuves',
  '.section--realisations',
  '.section--faq',
  '.section--appel',
  /* Toute la page « L'agence » : ses sections portent la même classe. */
  '.section--agence',
  /* Le récit de la page « Le fondateur », sous son hero. */
  '.section--fondateur',
  /* Les sections de la page « Mariage et événement privé ». */
  '.section--mariage',
  /* Les sections de la page « Événements d'entreprise ». */
  '.section--entreprise',
  /* Les sections de la page « Festivals et événements culturels ». */
  '.section--festival',
  /* Les sections de la page « Collectivités et institutions ». */
  '.section--collectivite',
  /* Les sections de la page « Location de matériel ». */
  '.section--location',
  /* Les sections de la page « Prestation technique ». */
  '.section--technique',
]

/**
 * Ce qui apparaît d'un seul tenant. Jamais la section elle-même, toujours le
 * bloc de contenu qu'elle porte : le fond (couleur, vidéo, dégradés, filet
 * de lumière du pied de page) est posé sur la section, il doit rester en
 * place pendant que le contenu s'allume.
 */
const BLOCS = [
  `.section:not(${SECTIONS_CASCADE.join(', ')}) .section__inner`,
  '.reassurance__liste',
  /* Le pied de page a deux blocs frères, la barre du bas comprise. */
  '.footer__inner',
  '.footer__bottom',
].join(', ')

/**
 * Ce qui apparaît partie par partie, dans l'ordre de lecture : une section
 * haute de plusieurs écrans qui s'allume d'un coup ne se voit qu'à moitié, et
 * sur portable pas du tout, le bas étant déjà allumé quand on y arrive.
 *
 * Les blocs sont ceux que l'œil isole déjà : une carte, une colonne, une
 * question. Jamais le conteneur qui les tient, sinon son fond apparaîtrait
 * avant eux.
 */
const CASCADE = [
  /* L'en-tête de chaque section en cascade, quand elle en a un. */
  ...SECTIONS_CASCADE.flatMap((section) => [
    `${section} .section__eyebrow`,
    `${section} .section__title`,
  ]),
  /* S2, les affiches de services. */
  '.tri > li',
  /* S3, le sous-titre, les quatre balises, la phrase de bascule. */
  '.probleme__lede',
  '.balises > li',
  '.probleme__bascule',
  /* S4, les trois mouvements puis le socle. */
  '.guide__mouvements > li',
  '.guide__socle',
  /* S6, les étapes de la méthode. */
  '.methode > li',
  /* S7, les témoignages. */
  '.temoignages > li',
  /* S8, les cas. */
  '.cas > li',
  /* S9, les questions. */
  '.faq__item',
  /* S10, l'appel final. */
  '.appel__lede',
  '.appel__actions',
  '.appel__garanties',
  /*
   * « L'agence » : les blocs de chaque section. L'ouverture n'y est pas, elle
   * a sa propre entrée, le plan qui se dessine (agence.css).
   */
  '.agence__lede',
  /* Les étapes de l'histoire, que le tracé relie de l'une à l'autre. */
  '.histoire > li',
  '.valeurs > li',
  /* L'approche : le schéma se trace, puis la méthode, puis la phrase. */
  '.approche__schema',
  '.approche__intro',
  '.approche__methode',
  '.reflexes > li',
  '.approche__maxime',
  '.approche__marque',
  '.approche__signature',
  /* Le fondateur : son nom, le portrait, puis son texte. */
  '.fondateur__tete',
  '.fondateur__portrait',
  '.fondateur__texte',
  '.agence__actions',
  /*
   * « Le fondateur » : ce qui accompagne chaque tête de section, les deux
   * paragraphes de l'introduction et ses repères, chaque étape de la
   * frise, chaque savoir-faire, les trois temps de l'événement, les
   * articles, puis l'appel.
   */
  '.fondateur-tete__cote',
  '.intro-fondateur > p',
  '.reperes > li',
  '.jalon',
  '.savoir',
  '.temps__bloc',
  '.marquant__lien',
  '.articles > li',
  '.articles__tous',
  '.fondateur-sortie__lede',
  '.fondateur-sortie__actions',
  '.fondateur-sortie__direct',
  /*
   * « Mariage et événement privé » : le texte sous chaque tête, les deux
   * volets de l'avant-après et la phrase qui les relie, les formules, les
   * étapes du rétroplanning, les tuiles de la galerie, les couples, les
   * budgets et ce qui les fait varier, les questions, l'invitation.
   */
  '.mariage-tete__texte',
  '.bab__avant',
  '.bab__apres',
  '.bab__passerelle',
  '.bab__suite',
  '.formules > li',
  '.formules__prive',
  '.voies',
  '.planning__etape',
  '.galerie__tuile',
  '.couples > li',
  '.budgets > li',
  '.variables',
  '.budget__action',
  '.questions-mariage .faq__item',
  '.invitation',
  /*
   * « Événements d'entreprise » : le texte sous chaque tête, les formats,
   * les étapes et leurs notes, les bénéfices, ce qui se vérifie, les
   * questions, les boutons qui closent une section.
   */
  '.entreprise-tete__texte',
  '.formats > li',
  '.dispositif__carte',
  '.dispositif__notes',
  '.benefice',
  '.benefices__assurance',
  '.verifier__item',
  '.section--entreprise-questions .faq__item',
  '.entreprise-action',
  /*
   * « Festivals et événements culturels » : le texte sous chaque tête,
   * les trois critères, les familles et le matériel, les précautions
   * sous leurs lampes, notre approche, les cinq étapes, les questions.
   */
  '.fest-tete__texte',
  '.choix__criteres',
  '.famille',
  '.materiel__item',
  '.vigie',
  '.approche',
  '.etape-p',
  '.etapes-p__conclusion',
  '.section--festival-questions .faq__item',
  /*
   * « Collectivités et institutions » : le texte sous chaque tête, les
   * cinq pièces, chaque point exigé, les interventions, la capacité et
   * les sorties, les étapes et leurs notes, ce qui se vérifie, les
   * questions, les boutons.
   */
  '.coll-tete__texte',
  '.pieces > li',
  '.pieces__reunies',
  '.exigence',
  '.interventions > li',
  '.capacite',
  '.coll-sorties',
  '.etape-coll',
  '.methode-coll__notes',
  '.coll-verifier__item',
  '.section--collectivite-questions .faq__item',
  '.coll-action',
  /*
   * « Location de matériel » : le texte sous chaque tête, les cinq
   * corps du matériel, les cinq étapes, les engagements sous leurs lampes, la
   * plaque du technicien, les questions, le formulaire.
   */
  '.loc-tete__texte',
  '.corps',
  '.loc-etape',
  '.garde',
  '.plaque',
  '.section--location-questions .faq__item',
  '.dispo',
  /*
   * « Prestation technique » : le texte sous chaque tête, le tableau et
   * sa suite, les domaines, les agences et les autres publics, les
   * engagements et les marques, l'encart, les questions.
   */
  '.tech-tete__texte',
  '.comparaison',
  '.comparaison__suite',
  '.domaine',
  '.agences',
  '.public-tech',
  '.engagement',
  '.marques__item',
  '.plus-grand',
  '.section--technique-questions .faq__item',
].join(', ')

/** La classe que porte tout élément qui attend son entrée (voir app.css). */
const MARQUE = 'a-apparaitre'

/**
 * Le bloc est considéré comme vu quand il est entré de deux sixièmes dans
 * l'écran : plus tôt, le fondu se jouait hors du champ et on ne le voyait
 * pas.
 *
 * Sur portable, un dixième suffit : les blocs y sont bien plus hauts que
 * l'écran, et attendre davantage reviendrait à ne les allumer qu'une fois
 * dépassés.
 *
 * La zone observée est l'écran entier, sans marge rognée en bas. Une marge
 * négative retire une bande du bas de l'écran : un bloc qui tient tout entier
 * dans cette bande, comme la barre de bas de page une fois la page déroulée
 * à fond, n'entre alors jamais dans la zone et reste invisible pour toujours.
 */
const SEUIL = 2 / 6
const SEUIL_MOBILE = 1 / 10
const MOBILE = '(max-width: 760px)'

/** Décalage entre deux parties qui entrent dans le même mouvement. */
const PAS_CASCADE = 90

/*
 * La page est chargée à part de la racine : React la reprend après elle, et
 * un élément marqué avant d'avoir été repris ne ressemble plus au HTML du
 * serveur (écart d'hydratation). React laisse sur chaque nœud repris une
 * propriété `__reactFiber$…`, on attend donc qu'elle soit partout.
 *
 * Au-delà de MAX_ATTENTE images, on démarre quand même : mieux vaut un
 * avertissement en console qu'une page sans apparition.
 */
const MAX_ATTENTE = 120

/*
 * La fin de la levée du rideau (Rideau.tsx, .stage dans app.css). On attend
 * ses propres animations plutôt qu'une durée calculée : le rideau ne part
 * qu'une fois la feuille de style appliquée, parfois des secondes après le
 * début du chargement. Sans rideau (arrivée depuis une autre page du site),
 * il n'a pas d'animation : la promesse est tenue tout de suite.
 */
function leveeDuRideau() {
  const rideau = document.querySelector('.stage')
  const animations = rideau ? rideau.getAnimations() : []

  return Promise.all(
    animations.map((animation) => animation.finished.catch(() => undefined)),
  )
}

function estRepris(element: Element) {
  return Object.keys(element).some((cle) => cle.startsWith('__reactFiber$'))
}

/*
 * Un bloc plus haut que trois écrans n'atteindra jamais son seuil : une
 * demi-hauteur d'écran visible vaut alors déclenchement.
 */
function assezVisible(entree: IntersectionObserverEntry, seuil: number) {
  return (
    entree.intersectionRatio >= seuil ||
    entree.intersectionRect.height >= window.innerHeight / 2
  )
}

/**
 * Chaque élément monte d'un souffle en apparaissant, une seule fois. Ceux qui
 * entrent ensemble se suivent au lieu de s'allumer en même temps : le
 * décalage est posé à l'instant de l'apparition, donc celui qui arrive seul,
 * en défilement portable, part sans attendre.
 *
 * L'état de départ (invisible, décalé vers le bas) n'est posé qu'ici, par
 * l'attribut `data-apparition` sur `<html>` et la classe `a-apparaitre` sur
 * chaque élément suivi : sans JavaScript, ou si l'observateur n'existe pas,
 * la page s'affiche telle quelle plutôt que de rester blanche. Les visiteurs
 * qui demandent moins d'animations ne voient rien bouger, la règle CSS ne
 * s'applique pas à eux.
 */
export function useApparition() {
  useEffect(() => {
    const doux = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (doux || !('IntersectionObserver' in window)) return

    const racine = document.documentElement
    let suivis: NodeListOf<HTMLElement> | null = null
    let observateur: IntersectionObserver | null = null
    let attente = 0
    let image = 0

    const demarrer = () => {
      const trouves = document.querySelectorAll<HTMLElement>(
        `${BLOCS}, ${CASCADE}`,
      )

      if (
        attente < MAX_ATTENTE &&
        !Array.prototype.every.call(trouves, estRepris)
      ) {
        attente += 1
        image = requestAnimationFrame(demarrer)
        return
      }

      suivis = trouves
      observateur = observer(racine, suivis)
    }

    demarrer()

    return () => {
      cancelAnimationFrame(image)
      if (!observateur || !suivis) return

      observateur.disconnect()
      delete racine.dataset.apparition

      for (const element of suivis) {
        element.classList.remove(MARQUE)
        element.style.transitionDelay = ''
      }
    }
  }, [])
}

/** Pose l'état de départ et suit chaque élément jusqu'à son entrée. */
function observer(racine: HTMLElement, suivis: NodeListOf<HTMLElement>) {
  const observateur = new IntersectionObserver(
    (entrees) => {
      /* Relu à chaque passage : une rotation d'écran change le seuil. */
      const seuil = window.matchMedia(MOBILE).matches ? SEUIL_MOBILE : SEUIL

      /*
       * Remis dans l'ordre de lecture, de haut en bas puis de gauche à
       * droite : l'observateur, lui, rend ses entrées dans l'ordre où les
       * éléments ont été inscrits.
       */
      const vus = entrees
        .filter(
          (entree) => entree.isIntersecting && assezVisible(entree, seuil),
        )
        .sort(
          (a, b) =>
            a.boundingClientRect.top - b.boundingClientRect.top ||
            a.boundingClientRect.left - b.boundingClientRect.left,
        )

      vus.forEach((entree, rang) => {
        const element = entree.target as HTMLElement

        element.style.transitionDelay = `${rang * PAS_CASCADE}ms`
        element.classList.add('est-vu')
        observateur.unobserve(element)
      })
    },
    { threshold: [SEUIL_MOBILE, SEUIL] },
  )

  /*
   * L'attribut et les classes sont posés dans la même tâche : le navigateur
   * ne peint qu'une fois, la page ne clignote pas.
   */
  racine.dataset.apparition = 'on'

  for (const element of suivis) {
    element.classList.add(MARQUE)
  }

  /*
   * L'observation, elle, attend que le rideau soit levé. Ce qui est déjà à
   * l'écran au chargement (sous un hero moins haut que l'écran, sur « Le
   * fondateur ») entrerait sinon sous le rideau, sans qu'on le voie. Si la
   * page a été quittée entre-temps, le nettoyage a retiré l'attribut : on
   * n'observe plus rien.
   */
  void leveeDuRideau().then(() => {
    if (!racine.dataset.apparition) return

    for (const element of suivis) {
      observateur.observe(element)
    }
  })

  return observateur
}
