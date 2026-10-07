import type { CSSProperties, ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { DELAI_REPONSE_H, NB_EVENEMENTS, RC_PRO } from '../../components/home/content'
import { Arrow } from '../../components/home/icons'

/*
 * Chemin depuis la racine du projet, et non relatif : sur une route imbriquée,
 * le découpage de TanStack Start réécrit le module et le chemin relatif n'est
 * plus résolvable côté serveur (« Denied ID »).
 */
import collectiviteCss from '/src/styles/collectivite.css?url'

/*
 * Les valeurs entre crochets sont des affirmations à faire valider par le
 * client (un assureur, une immatriculation, une jauge). Comme sur
 * l'accueil, elles restent visibles à l'écran tant qu'elles ne sont pas
 * fournies : une valeur plausible passerait inaperçue en relecture.
 *
 * Les règles et seuils cités en S3 et dans la FAQ sont à jour au
 * 4 octobre 2026, d'après les références indiquées à côté de chacun.
 */

/* Le formulaire de contact, ouvert sur les questions « Collectivité et
   institution » (bloc C, voir Formulaire.tsx). */
const CONTACT_COLLECTIVITE = '/contact?profil=collectivite&besoin=organisation'

/* Le dossier de références n'existe pas encore en PDF : le bouton ouvre le
   formulaire avec la demande déjà écrite dans le message. */
const DOSSIER = `${CONTACT_COLLECTIVITE}&message=${encodeURIComponent(
  'Merci de m’envoyer votre dossier de références par courriel.',
)}`

/* Le formulaire, avec le type de manifestation présélectionné : la valeur
   doit être une option de la question C1 (contact/content.ts). */
const contactPour = (type: string) =>
  `${CONTACT_COLLECTIVITE}&type=${encodeURIComponent(type)}`

const PRESTATION_TECHNIQUE = '/nos-services/prestation-technique'

const TITRE = 'Événements des collectivités à Toulouse et en Occitanie | Oysen'
const DESCRIPTION =
  'Fête de ville, inauguration, cérémonie, commémoration : Oysen organise les manifestations publiques des collectivités à Toulouse et en Occitanie, pièces du dossier comprises.'

export const Route = createFileRoute('/nos-services/collectivites-institutionnels')({
  head: () => ({
    meta: [
      { title: TITRE },
      { name: 'description', content: DESCRIPTION },
    ],
    links: [
      { rel: 'stylesheet', href: collectiviteCss },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(DONNEES_STRUCTUREES),
      },
    ],
  }),
  component: Collectivites,
})

/**
 * La page « Collectivités et institutions ».
 *
 * Elle parle à un chargé de mission, à une direction générale des
 * services, à un service de la commande publique, à un élu. Leur question
 * n'est pas « est-ce que ce sera beau » mais « est-ce que ce sera
 * conforme, et est-ce que j'aurai mes pièces ».
 *
 * Dans la salle sombre du site, avec une tenue plus institutionnelle : un
 * hero centré, symétrique comme un fronton. Son signe est le bordereau des
 * pièces, la liste qui accompagne un dossier administratif : dans le hero,
 * chaque pièce reçoit son tampon « Jointe » l'une après l'autre. Le reste
 * de la page en garde le vocabulaire : chaque engagement est une pièce
 * numérotée (S2), chaque étape remet la sienne (S5).
 */
function Collectivites() {
  return (
    <main className="page-collectivite">
      <Hero />
      <Pieces />
      <Exigences />
      <Interventions />
      <Methode />
      <References />
      <Questions />
      <Appel />
    </main>
  )
}

/* La tête d'une section : surtitre, titre et, au besoin, une phrase. */
function Tete({
  surtitre,
  titre,
  id,
  texte,
  centree = false,
}: {
  surtitre: string
  titre: string
  id: string
  texte?: string
  centree?: boolean
}) {
  return (
    <div className={`coll-tete${centree ? ' coll-tete--centree' : ''}`}>
      <p className="section__eyebrow">{surtitre}</p>
      <h2 className="section__title" id={id}>
        {titre}
      </h2>
      {texte ? <p className="coll-tete__texte">{texte}</p> : null}
    </div>
  )
}

/* Le bouton qui clôt une section : toujours le dossier de références. */
function Action({
  href = DOSSIER,
  children = 'Recevoir notre dossier de références',
}: {
  href?: string
  children?: ReactNode
}) {
  return (
    <p className="coll-action">
      <a className="btn btn--solid" href={href}>
        {children}
      </a>
    </p>
  )
}

/* ---- S1 · Le hero ----
   Centré, comme un fronton. Dessous, la photo en bandeau large, et posé
   sur elle, le bordereau des pièces. Puis cinq preuves. */

const PREUVES = [
  'Toulouse, Haute-Garonne et Occitanie',
  'Un seul interlocuteur pour vos élus et vos services',
  'Sonorisation et éclairage avec notre propre matériel',
  'Tout est testé avant l’arrivée du public',
  'Factures déposées sur Chorus Pro [après immatriculation]',
]

/* Les pièces de la ligne d'autorité, dans son ordre. */
const BORDEREAU = [
  'Attestation d’assurance',
  'Plan d’implantation coté',
  'Rétroplanning',
  'Pièces de candidature',
]

function Hero() {
  return (
    <section className="coll-hero" aria-labelledby="collectivite-title">
      <div className="coll-hero__lueur" aria-hidden="true" />

      <div className="coll-hero__texte">
        <p className="section__eyebrow">
          Collectivités et institutions · Toulouse, Haute-Garonne, Occitanie
        </p>
        <h1 className="coll-hero__titre" id="collectivite-title">
          L’événement de votre collectivité : conforme, sécurisé, dans le budget
          voté
        </h1>
        <p className="coll-hero__lede">
          Fête de ville, inauguration, cérémonie officielle, commémoration : nous
          concevons, coordonnons et réalisons vos manifestations publiques. Un
          seul interlocuteur répond à vos élus et à vos services, du cahier des
          charges au démontage.
        </p>
        <p className="coll-hero__autorite">
          Chaque proposition vous est remise avec les pièces que votre dossier
          exige.
        </p>

        <div className="coll-hero__actions">
          <a className="btn btn--solid" href={DOSSIER}>
            Recevoir notre dossier de références
          </a>
          <a className="coll-lien" href={CONTACT_COLLECTIVITE}>
            Présenter votre manifestation
            <Arrow className="coll-lien__fleche" />
          </a>
        </div>
        <p className="coll-hero__rassurance">
          PDF envoyé par courriel · sans engagement · réponse sous{' '}
          {DELAI_REPONSE_H}&nbsp;h
        </p>
      </div>

      {/*
        À REMPLACER par une vraie photo d'une installation Oysen en
        extérieur, sur une place ou un parvis : pupitre et sonorisation
        prêts avant l'arrivée du public, ou régie pendant une prise de
        parole. Aucun élu reconnaissable sans son accord écrit.
      */}
      <figure className="coll-hero__scene">
        <div className="coll-hero__photo">
          <img
            src="/images/services/collectivites-institutions-1200.jpg"
            srcSet="/images/services/collectivites-institutions-800.jpg 800w, /images/services/collectivites-institutions-1200.jpg 1200w"
            sizes="(min-width: 1024px) 76rem, 100vw"
            width={1200}
            height={1500}
            alt="Salle de réception aux suspensions en osier, écran de projection allumé au fond, régie son au premier plan."
            decoding="async"
          />
        </div>

        {/* Le bordereau : chaque pièce reçoit son tampon. */}
        <figcaption className="bordereau">
          <p className="bordereau__tete">
            <span>Bordereau des pièces</span>
            <span>Remis avec la proposition</span>
          </p>
          <ol className="bordereau__liste">
            {BORDEREAU.map((piece, rang) => (
              <li
                className="bordereau__piece"
                key={piece}
                style={{ '--rang': rang } as CSSProperties}
              >
                <span className="bordereau__numero">Pièce {rang + 1}</span>
                <span className="bordereau__nom">{piece}</span>
                <span className="bordereau__tampon">Jointe</span>
              </li>
            ))}
          </ol>
        </figcaption>
      </figure>

      <ul className="coll-preuves">
        {PREUVES.map((preuve) => (
          <li key={preuve}>{preuve}</li>
        ))}
      </ul>
    </section>
  )
}

/* ---- S2 · Les pièces remises avant tout engagement ----
   Juste sous le hero, avant tout argument. Cinq pièces numérotées, comme
   au bordereau : ce que nous remettons, ce que cela change. Tout est
   affiché, sans survol ni dépliant.

   Pièce 5, version avec références, à substituer quand elles existeront :
   « [X] événements réalisés pour des collectivités, détaillés plus bas,
   avec le nom d'un interlocuteur que vous pouvez appeler. » */

const PIECES: { nom: string; remise: string[]; change: string }[] = [
  {
    nom: 'Responsabilité civile professionnelle',
    remise: [
      `L’attestation en cours de validité, plafond des garanties ${RC_PRO} [à confirmer : assureur]`,
      'Jointe à chaque proposition',
    ],
    change: 'Vous la versez au dossier sans avoir à la réclamer.',
  },
  {
    nom: 'Sécurité du public et des installations',
    remise: [
      'Repérage du site et plan d’implantation coté',
      'Matériel contrôlé avant chaque départ, essais finis avant l’arrivée du public',
      'Pour une structure louée : extrait du registre de sécurité et attestation de bon montage',
      'Niveaux sonores sous 102 dB(A) et 118 dB(C) sur 15 minutes, partout où le public accède [à confirmer : habilitation électrique, appareil de mesure]',
    ],
    change: 'Vous savez avant le jour J ce qui est installé, où, et qui en répond.',
  },
  {
    nom: 'Accessibilité',
    remise: [
      'Cheminement praticable en fauteuil, emplacements réservés et position de la régie, sur le plan dès sa première version',
    ],
    change: 'L’accessibilité se valide sur plan, avant le montage.',
  },
  {
    nom: 'Marchés publics',
    remise: [
      'Une réponse à votre demande de devis, à votre procédure adaptée ou à votre appel d’offres : seuls, en groupement ou en sous-traitance [à valider]',
      'Des pièces de candidature à jour, des factures sur Chorus Pro [à confirmer : immatriculation]',
    ],
    change: 'Votre service de la commande publique n’a aucune pièce à relancer.',
  },
  {
    nom: 'Références publiques',
    remise: [
      'Oysen est une entreprise récente : les documents de préparation d’événements déjà tenus',
      'La présentation de la personne qui pilotera le vôtre',
    ],
    change: 'Vous jugez sur pièces.',
  },
]

function Pieces() {
  return (
    <section
      className="section section--collectivite section--collectivite-pieces"
      aria-labelledby="pieces-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Avant tout engagement"
          titre="Les pièces que nous vous remettons avant tout engagement"
          id="pieces-title"
          texte="Cinq éléments, remis à toute collectivité qui nous consulte. Vous pouvez les verser à votre dossier avant même notre premier échange."
        />

        <ol className="pieces">
          {PIECES.map((piece, index) => (
            <li className="piece" key={piece.nom}>
              <div className="piece__tete">
                <span className="piece__numero">Pièce {index + 1}</span>
                <h3 className="piece__nom">{piece.nom}</h3>
              </div>
              <div className="piece__remise">
                <p className="piece__label">Ce que nous vous remettons</p>
                <ul className="coll-puces">
                  {piece.remise.map((ligne) => (
                    <li key={ligne}>{ligne}</li>
                  ))}
                </ul>
              </div>
              <div className="piece__change">
                <p className="piece__label">Ce que cela change</p>
                <p className="piece__change-texte">{piece.change}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="pieces__reunies">
          Ces cinq éléments sont réunis dans notre dossier de références.
        </p>
        <Action />
      </div>
    </section>
  )
}

/* ---- S3 · Ce qu'un événement public exige ----
   Cinq points, en dossier : à gauche le point et ce qu'il garantit, à
   droite comment nous le traitons. Les interlocuteurs sont posés en
   rangée, autour d'un seul document ; les délais, en tableau. */

const INTERLOCUTEURS = [
  { qui: 'L’élu', role: 'porte l’événement' },
  { qui: 'La direction générale des services', role: 'arbitre' },
  { qui: 'Le cabinet', role: 'règle le protocole et les prises de parole' },
  { qui: 'Les services techniques', role: 'ouvrent le site' },
  { qui: 'La police municipale', role: 'tient la circulation' },
  { qui: 'La communication', role: 'annonce' },
]

const DELAIS = [
  {
    demarche: 'Déclaration d’un événement sur l’espace public à Toulouse',
    delai: 'Au moins 3 mois avant ; 4 mois dans un bâtiment ou une enceinte close, ou au-delà de 5 000 personnes',
    reference: 'Mairie de Toulouse, Guichet unique événementiel',
  },
  {
    demarche: 'Dossier de sécurité à Toulouse, lorsqu’il est exigé',
    delai: 'Au plus tard 2 mois avant la date',
    reference: 'Mairie de Toulouse',
  },
  {
    demarche: 'Manifestation à but lucratif de plus de 1 500 personnes',
    delai: 'Déclaration au maire 1 mois au moins et 1 an au plus avant',
    reference: 'Code de la sécurité intérieure, art. R. 211-22',
  },
  {
    demarche: 'Chapiteau, tente ou structure de 50 personnes ou plus',
    delai: 'Commission de sécurité saisie 1 mois au moins avant l’ouverture ; extrait du registre remis au maire 8 jours avant',
    reference: 'Règlement de sécurité, établissements de type CTS',
  },
  {
    demarche: 'Communication en période préélectorale',
    delai: 'À compter du premier jour du sixième mois précédant le mois du scrutin',
    reference: 'Code électoral, art. L. 52-1',
  },
]

/* Un point exigé : à gauche, son nom et ce qu'il garantit ; à droite,
   comment nous le traitons. */
function Exigence({
  nom,
  garantie,
  children,
}: {
  nom: string
  garantie: string
  children: ReactNode
}) {
  return (
    <article className="exigence">
      <div className="exigence__tete">
        <h3 className="exigence__nom">{nom}</h3>
        <p className="exigence__garantie">{garantie}</p>
      </div>
      <div className="exigence__corps">{children}</div>
    </article>
  )
}

function Exigences() {
  return (
    <section
      className="section section--collectivite section--collectivite-exigences"
      aria-labelledby="exigences-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Ce que l’on sous-estime"
          titre="Ce qu’un événement public exige, et que l’on sous-estime souvent"
          id="exigences-title"
          texte="Cinq points distinguent un événement public d’un événement privé. Voici comment nous traitons chacun."
        />

        <div className="exigences">
          <Exigence
            nom="Les arrêtés de voirie et l’occupation du domaine public"
            garantie="Vos services techniques reçoivent un plan qu’ils peuvent instruire dès la première version."
          >
            <p className="exigence__texte">
              Fermer une rue, neutraliser du stationnement, poser une scène sur une
              place : chaque décision passe par un arrêté du maire et un titre
              d’occupation, signés par la collectivité. Nous fournissons de quoi les
              rédiger sans aller-retour :
            </p>
            <ul className="coll-puces">
              <li>Le plan d’implantation coté et les emprises au sol</li>
              <li>Les horaires de montage et de démontage</li>
              <li>Les accès des véhicules techniques et des secours</li>
            </ul>
          </Exigence>

          <Exigence
            nom="L’accessibilité aux personnes à mobilité réduite"
            garantie="Chaque personne atteint sa place, voit et entend, sans aide improvisée le jour J."
          >
            <p className="exigence__texte">
              L’accessibilité se décide sur le plan, dès sa première version : un
              cheminement praticable en fauteuil du stationnement réservé jusqu’au
              public et aux sanitaires, des emplacements avec une vue dégagée sur la
              scène ou le pupitre, une régie qui ne coupe aucun passage.
            </p>
            <dl className="mesures">
              <div className="mesure">
                <dt>Largeur du cheminement</dt>
                <dd>1,40 m</dd>
              </div>
              <div className="mesure">
                <dt>Pente</dt>
                <dd>&lt; 5 %</dd>
              </div>
            </dl>
            <p className="coll-source">
              Valeurs appliquées aux établissements recevant du public
            </p>
            <p className="exigence__texte">
              Sur demande, la sonorisation alimente une boucle magnétique pour les
              personnes appareillées. [à confirmer]
            </p>
          </Exigence>

          <Exigence
            nom="La pluralité des interlocuteurs"
            garantie="Vos services lisent tous la même version, et vous savez qui a validé quoi."
          >
            <ul className="interlocuteurs">
              {INTERLOCUTEURS.map((item) => (
                <li key={item.qui}>
                  <span className="interlocuteurs__qui">{item.qui}</span>
                  <span className="interlocuteurs__role">{item.role}</span>
                </li>
              ))}
            </ul>
            <p className="exigence__texte">
              Pour tous, un seul document de référence, daté et versionné : plan,
              déroulé minute par minute, contacts, points en attente. Chaque
              modification y est tracée, chaque validation est écrite.
            </p>
          </Exigence>

          <Exigence
            nom="L’obligation de neutralité"
            garantie="La technique et la mise en scène servent l’institution, sans autre message que le sien."
          >
            <ul className="coll-puces">
              <li>Nos techniciens interviennent sans marquage publicitaire sur le site [à valider]</li>
              <li>La musique d’ambiance et les visuels projetés vous sont soumis avant le jour J</li>
              <li>L’ordre des prises de parole suit le protocole arrêté par votre cabinet</li>
            </ul>
            <div className="exigence__encadre">
              <p className="exigence__texte">
                À l’approche d’un scrutin, toute campagne de promotion des
                réalisations ou de la gestion d’une collectivité est interdite à
                compter du premier jour du sixième mois précédant le mois de
                l’élection. Une inauguration ou une cérémonie reste possible si elle
                garde un contenu neutre, sa périodicité et sa forme habituelles.
                Nous vous signalons ce qui s’en écarterait ; l’appréciation juridique
                reste celle de vos services.
              </p>
              <p className="coll-source">Code électoral, art. L. 52-1</p>
            </div>
          </Exigence>

          <Exigence
            nom="Les délais administratifs incompressibles"
            garantie="Les autorisations sont demandées à temps parce qu’elles figurent au planning dès le premier jour."
          >
            <p className="exigence__texte">
              Un événement public se prépare à rebours de ces délais. Notre
              rétroplanning en part et indique, pour chaque pièce, qui la produit,
              qui la signe et à quelle date.
            </p>
            <div className="coll-tableau">
              <table className="delais">
                <caption>Les principaux délais, à jour au 4 octobre 2026</caption>
                <thead>
                  <tr>
                    <th scope="col">Démarche</th>
                    <th scope="col">Délai</th>
                    <th scope="col">Référence</th>
                  </tr>
                </thead>
                <tbody>
                  {DELAIS.map((ligne) => (
                    <tr key={ligne.demarche}>
                      <th scope="row">{ligne.demarche}</th>
                      <td data-label="Délai">{ligne.delai}</td>
                      <td className="delais__reference" data-label="Référence">
                        {ligne.reference}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="exigence__note">
              Hors de Toulouse, chaque commune fixe ses propres délais : nous les
              relevons auprès de vos services dès le cadrage.
            </p>
          </Exigence>
        </div>

        <Action />
      </div>
    </section>
  )
}

/* ---- S4 · Nos interventions ----
   Six types d'événements publics, en cartes éclairées. Toute la carte
   mène au formulaire, le type de manifestation déjà choisi. */

const INTERVENTIONS: {
  nom: string
  type: string
  occasions: string
  enjeu: string
  nous: string[]
  resultat: string
}[] = [
  {
    nom: 'Fête de ville',
    type: 'Manifestation publique',
    occasions: 'Fête locale, 14 Juillet, fête de la musique, forum des associations.',
    enjeu: 'L’événement où le plus d’intervenants se croisent : associations, forains, restaurateurs, artistes, services.',
    nous: [
      'Le plan d’ensemble et le planning de montage de chacun',
      'La sonorisation de la scène et des annonces',
      'La mise en lumière de la place',
    ],
    resultat: 'Tout le monde travaille sur le même plan, aux mêmes horaires.',
  },
  {
    nom: 'Inauguration',
    type: 'Inauguration',
    occasions: 'Un équipement, une place, un bâtiment rendu au public.',
    enjeu: 'Un site neuf n’a souvent ni électricité accessible ni circulation prévue pour le public.',
    nous: [
      'Le repérage du site',
      'Le pupitre et la sonorisation des discours',
      'Le cheminement des invités et l’espace du vin d’honneur',
    ],
    resultat: 'Chaque prise de parole s’entend jusqu’au dernier rang, et le ruban se coupe à l’heure.',
  },
  {
    nom: 'Cérémonie officielle',
    type: 'Cérémonie',
    occasions: 'Vœux, remise de médailles, accueil des nouveaux habitants, réception protocolaire.',
    enjeu: 'Elle tient à la minute et à l’ordre protocolaire arrêté par votre cabinet.',
    nous: [
      'Le déroulé, écrit avec votre cabinet',
      'Le son de la salle et du pupitre, la lumière, la projection',
      'Un essai de micro avec les intervenants avant l’ouverture',
    ],
    resultat: 'L’élu monte au pupitre avec un micro déjà réglé à sa voix.',
  },
  {
    nom: 'Marché de Noël',
    type: 'Marché ou événement local',
    occasions: 'Plusieurs jours, parfois plusieurs semaines, dehors et en hiver.',
    enjeu: 'L’électricité à répartir entre les chalets, une lumière qui tient sous la pluie, un son supportable pour les riverains.',
    nous: [
      'L’installation dimensionnée avec un électricien habilité de notre réseau',
      'La lumière et le son',
      'Une équipe joignable pendant toute l’exploitation [à valider]',
    ],
    resultat: 'Le marché ouvre chaque soir sans mobiliser vos agents sur la technique.',
  },
  {
    nom: 'Événement sportif',
    type: 'Manifestation publique',
    occasions: 'Course, tournoi, arrivée d’étape, fête du sport.',
    enjeu: 'L’organisation sportive reste celle du club ; le son sert d’abord à informer.',
    nous: [
      'L’accueil du public et la technique',
      'Les annonces sur toute la zone de départ et d’arrivée, le podium',
      'La liaison entre l’animateur et l’organisation',
    ],
    resultat: 'Le public entend consignes, résultats et remerciements, où qu’il soit.',
  },
  {
    nom: 'Commémoration',
    type: 'Cérémonie',
    occasions: '8 Mai, 11 Novembre, journées nationales, hommages.',
    enjeu: 'En extérieur, devant un monument, selon un cérémonial fixé : gerbes, sonnerie aux morts, minute de silence, hymne, messages.',
    nous: [
      'Une sonorisation discrète, autonome en énergie [à confirmer]',
      'Chaque séquence lancée au signal du maître de cérémonie',
      'Un micro de secours',
    ],
    resultat: 'Le silence est respecté, et l’hymne commence au moment prévu.',
  },
]

function Interventions() {
  return (
    <section
      className="section section--collectivite section--collectivite-interventions"
      aria-labelledby="interventions-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Nos interventions"
          titre="Fête de ville, inauguration, cérémonie : les événements publics que nous organisons"
          id="interventions-title"
          texte="Pour chacun : la conception, la coordination des prestataires, la technique et la présence le jour J. Si vos services organisent déjà la manifestation, nous intervenons sur la seule technique."
          centree
        />

        <ul className="interventions">
          {INTERVENTIONS.map((item) => (
            <li className="intervention" key={item.nom}>
              <h3 className="intervention__nom">
                {/* Le lien couvre toute la carte (voir ::after). */}
                <a className="intervention__lien" href={contactPour(item.type)}>
                  {item.nom}
                </a>
              </h3>
              <p className="intervention__occasions">{item.occasions}</p>
              <p className="intervention__enjeu">{item.enjeu}</p>
              <ul className="coll-puces">
                {item.nous.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <p className="intervention__resultat">{item.resultat}</p>
              <span className="intervention__appel" aria-hidden="true">
                Présenter cette manifestation
                <Arrow className="coll-lien__fleche" />
              </span>
            </li>
          ))}
        </ul>

        <p className="capacite">
          <span className="capacite__label">Notre capacité</span>
          Notre sonorisation couvre jusqu’à [300 à 400] personnes en extérieur.
          Au-delà, ou pour une scène, des structures ou un écran, nous mobilisons
          des partenaires de notre réseau sous une coordination unique. Si un
          projet dépasse ce que nous pouvons tenir correctement, nous vous le
          disons.
        </p>

        <ul className="coll-sorties">
          <li>
            Un salon, un forum, une réunion publique ? Le dispositif est le même :{' '}
            <a href={CONTACT_COLLECTIVITE}>décrivez-nous votre manifestation</a>.
          </li>
          <li>
            Un festival ou une saison culturelle portés par votre service culturel ?{' '}
            <a href="/nos-services/festivals-evenements-culturels">
              Voir la page Festivals et événements culturels
            </a>
            .
          </li>
          <li>
            Il vous manque seulement la sonorisation, l’éclairage ou une régie ?{' '}
            <a href={PRESTATION_TECHNIQUE}>Voir nos prestations techniques</a>.
          </li>
        </ul>
      </div>
    </section>
  )
}

/* ---- S5 · La méthode et les pièces fournies ----
   Six étapes, une vraie séquence : chaque étape produit ce dont la
   suivante a besoin. Pour chacune, ce que nous faisons, et la pièce que
   vous recevez, présentée comme un document qu'on verse au dossier. */

const ETAPES: { nom: string; faisons: string; piece: string }[] = [
  {
    nom: 'Le cadrage',
    faisons: 'Votre cahier des charges lu, ou le besoin formulé avec vous : objectif, public, site, budget voté, circuit de validation.',
    piece: 'Compte rendu de cadrage : besoin, contraintes, interlocuteurs, échéances',
  },
  {
    nom: 'Le repérage du site',
    faisons: 'Les accès, l’électricité, l’acoustique, la circulation du public, le voisinage.',
    piece: 'Relevé de repérage et première version du plan d’implantation',
  },
  {
    nom: 'La proposition',
    faisons: 'Le dispositif conçu, les prestataires présélectionnés, chaque poste chiffré.',
    piece: 'Devis poste par poste, ou offre et mémoire technique ; attestation d’assurance jointe',
  },
  {
    nom: 'La préparation',
    faisons: 'Le rétroplanning à rebours des délais, les prestataires coordonnés, les pièces techniques de vos arrêtés et de votre dossier de sécurité.',
    piece: 'Rétroplanning, plan coté, fiche technique des installations, contacts du jour J',
  },
  {
    nom: 'L’installation et les essais',
    faisons: 'L’accueil des prestataires, le montage, puis le son, la lumière et la vidéo testés avant l’arrivée du public.',
    piece: 'Déroulé minute par minute validé et fiche de contrôle avant ouverture [à valider : document réel]',
  },
  {
    nom: 'Le jour J, le démontage et le bilan',
    faisons: 'Les horaires tenus, intervenants et prestataires coordonnés, chaque imprévu traité, le site démonté et rendu.',
    piece: 'Bilan écrit : déroulé réel, écarts, dépense au regard du budget voté ; facture sur Chorus Pro',
  },
]

function Methode() {
  return (
    <section
      className="section section--collectivite section--collectivite-methode"
      aria-labelledby="methode-coll-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Méthode et pièces fournies"
          titre="Comment se déroule une mission, et quelles pièces recevez-vous à chaque étape ?"
          id="methode-coll-title"
          texte="Six étapes, du cahier des charges au bilan. À chacune, une pièce écrite que vous pouvez verser à votre dossier ou transmettre à vos élus."
        />

        <ol className="etapes-coll">
          {ETAPES.map((etape, index) => (
            <li className="etape-coll" key={etape.nom}>
              <span className="etape-coll__numero" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="etape-coll__faisons">
                <h3 className="etape-coll__nom">{etape.nom}</h3>
                <p>{etape.faisons}</p>
              </div>
              <p className="etape-coll__piece">
                <span className="etape-coll__piece-label">Pièce remise</span>
                {etape.piece}
              </p>
            </li>
          ))}
        </ol>

        <div className="methode-coll__notes">
          <div className="methode-coll__note">
            <h3 className="methode-coll__note-titre">Ce qui reste de votre côté</h3>
            <p>
              Les décisions (format, budget, protocole), la signature des arrêtés et
              des autorisations, la relation avec la préfecture. Nous préparons les
              pièces ; vos services gardent l’autorité.
            </p>
          </div>
          <div className="methode-coll__note">
            <h3 className="methode-coll__note-titre">Quand nous contacter ?</h3>
            <p>
              [Trois à quatre mois avant la date : le délai que la mairie de
              Toulouse demande pour instruire un événement sur l’espace public. À
              valider.] Votre date est plus proche ? Écrivez-nous : le calendrier se
              resserre, la méthode reste la même.
            </p>
          </div>
          <div className="methode-coll__note">
            <h3 className="methode-coll__note-titre">Votre projet est déjà engagé ?</h3>
            <p>
              Nous le reprenons à l’étape où il en est, avec le site, les
              prestataires et les marchés que vous avez déjà retenus.
            </p>
          </div>
        </div>

        <Action />
      </div>
    </section>
  )
}

/* ---- S6 · Les références publiques ----
   Aucun événement pour une collectivité n'est encore documenté : la
   version de lancement liste ce qui se vérifie, sans rien inventer. Les
   cas (format STAR, deux au plus) attendent dans CAS, vide ; la section
   passe au titre « Les événements publics que nous avons réalisés » dès
   qu'il y en a un.

   Règles de publication : accord écrit de la collectivité avant toute
   citation (nom, logo, photo, chiffre) ; aucun élu reconnaissable sans
   son accord, et prévoir qu'une collectivité refuse d'être citée en
   période préélectorale ; mention « Réalisé par notre fondateur avant la
   création d'Oysen. » si l'événement la précède ; un événement associatif
   ou scolaire se présente comme tel, jamais comme une référence publique.
   Le témoignage reste masqué tant qu'aucun n'est validé par écrit. */

const VERIFICATIONS: { titre: string; texte: string; lien?: { href: string; libelle: string } }[] = [
  {
    titre: 'La méthode, sur pièces',
    texte: 'Dès le premier échange, les documents de préparation d’un événement déjà tenu : rétroplanning, plan d’implantation, déroulé minute par minute. [À valider : documents réels, anonymisés]',
  },
  {
    titre: 'Les moyens',
    texte: 'Notre sonorisation et notre éclairage nous appartiennent. Vous pouvez les voir, et en recevoir la liste détaillée, avant de vous engager.',
    lien: { href: PRESTATION_TECHNIQUE, libelle: 'Voir nos prestations techniques' },
  },
  {
    titre: 'Les événements déjà tenus',
    texte: `${NB_EVENEMENTS} événements coordonnés, dont [X] en extérieur et [X] de plus de [X] personnes. [À préciser : ceux réalisés avant la création d’Oysen]`,
    lien: { href: '/nos-souvenirs', libelle: 'Voir nos événements' },
  },
  {
    titre: 'La personne qui pilote',
    texte: 'Mathis Amato, fondateur d’Oysen, ingénieur de formation en génie civil. Plans d’installation, autorisations de voirie, coordination de plusieurs intervenants sur un site ouvert au public : son métier d’ingénieur travaux, appliqué à l’événement. [À valider avec Mathis]',
    lien: { href: '/qui-sommes-nous/le-fondateur', libelle: 'Le parcours de Mathis Amato' },
  },
]

const CAS: {
  titre: string
  situation: string
  tache: string
  action: string
  resultat: string
  avantOysen?: boolean
}[] = []

function References() {
  const avecCas = CAS.length > 0
  return (
    <section
      className="section section--collectivite section--collectivite-references"
      aria-labelledby="references-title"
    >
      <div className="section__inner">
        <div className="coll-verifier">
          <Tete
            surtitre="Références publiques"
            titre={
              avecCas
                ? 'Les événements publics que nous avons réalisés'
                : 'Ce que vous pouvez vérifier avant de nous consulter'
            }
            id="references-title"
            texte="Oysen est une entreprise récente et ne présente ici que ce qu’elle peut prouver. Quatre éléments se vérifient avant toute commande."
          />

          <ul className="coll-verifier__liste">
            {VERIFICATIONS.map((item) => (
              <li className="coll-verifier__item" key={item.titre}>
                <h3 className="coll-verifier__titre">{item.titre}</h3>
                <p className="coll-verifier__texte">{item.texte}</p>
                {item.lien ? (
                  <a className="coll-lien" href={item.lien.href}>
                    {item.lien.libelle}
                    <Arrow className="coll-lien__fleche" />
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        {avecCas ? (
          <ul className="coll-cas">
            {CAS.map((cas) => (
              <li className="coll-cas__item" key={cas.titre}>
                <h3 className="coll-cas__titre">{cas.titre}</h3>
                <dl className="coll-cas__star">
                  <dt>La commande</dt>
                  <dd>{cas.situation}</dd>
                  <dt>Ce qui nous a été confié</dt>
                  <dd>{cas.tache}</dd>
                  <dt>Ce que nous avons mis en place</dt>
                  <dd>{cas.action}</dd>
                  <dt>Le jour J</dt>
                  <dd>{cas.resultat}</dd>
                </dl>
                {cas.avantOysen ? (
                  <p className="coll-cas__mention">
                    Réalisé par notre fondateur avant la création d’Oysen.
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}

        <Action />
      </div>
    </section>
  )
}

/* ---- S7 · FAQ marchés publics ----
   Huit questions, en dépliants comme la FAQ de l'accueil. La réponse sur
   les procédures porte son tableau des seuils ; les données structurées
   en reprennent le contenu en texte. */

const SEUILS = [
  {
    montant: 'Moins de 60 000 €',
    procedure: 'Commande possible sans publicité ni mise en concurrence préalables. L’acheteur choisit une offre pertinente et ne contracte pas systématiquement avec le même prestataire.',
  },
  {
    montant: 'De 60 000 € à moins de 216 000 €',
    procedure: 'Procédure adaptée. Avis de marché au BOAMP ou dans un journal d’annonces légales à partir de 90 000 €.',
  },
  {
    montant: '216 000 € et plus',
    procedure: 'Procédure formalisée. Exception : l’organisation d’événements relève des « services sociaux et autres services spécifiques », passables en procédure adaptée quel que soit leur montant.',
  },
]

const QUESTIONS: { q: string; a: string; seuils?: boolean; apres?: string }[] = [
  {
    q: 'Avez-vous déjà travaillé avec des collectivités ?',
    a: 'Oysen est une entreprise récente et ne compte pas encore de collectivité parmi ses clients. [À remplacer dès la première référence] Ce que nous apportons se vérifie avant toute commande : plan d’implantation, rétroplanning et déroulé écrits pour chaque événement, attestation d’assurance jointe à chaque proposition. Notre fondateur, ingénieur travaux dans le bâtiment, prépare un événement comme un chantier en site occupé : plans, autorisations, délais, coordination des intervenants. [À valider avec Mathis]',
  },
  {
    q: 'Oysen peut-elle répondre à un marché public ?',
    a: 'Oui : demande de devis, procédure adaptée ou appel d’offres, pour l’organisation complète d’un événement ou pour un lot technique (sonorisation, éclairage, régie). Selon l’ampleur, nous candidatons seuls, en groupement, ou comme sous-traitant déclaré d’un titulaire. [À confirmer : immatriculation, groupement]',
  },
  {
    q: 'Quelle procédure s’applique selon le montant de la prestation ?',
    a: 'Depuis le 1er avril 2026, en dessous de 60 000 € HT, une collectivité peut commander une prestation de services sans publicité ni mise en concurrence préalables (le seuil était de 40 000 € HT). Au-delà, la procédure dépend du montant et de la nature du service.',
    seuils: true,
    apres: 'Seuils en vigueur du 1er janvier 2026 au 31 décembre 2027. L’estimation du besoin et le choix de la procédure relèvent de vos services.',
  },
  {
    q: 'Quelles pièces fournissez-vous à l’appui d’une offre ?',
    a: 'Avec chaque offre : une déclaration sur l’honneur ou un DUME, nos moyens humains et matériels, notre méthode et notre attestation de responsabilité civile professionnelle. Si l’offre est retenue : nos attestations fiscale et sociale, dont l’attestation de vigilance de l’Urssaf de moins de six mois. Pour le reste, notre numéro SIREN suffit : l’extrait Kbis n’a plus à être fourni.',
  },
  {
    q: 'Une entreprise récente peut-elle être retenue ?',
    a: 'Oui. L’absence de références sur des marchés de même nature ne peut justifier, à elle seule, l’élimination d’un candidat (code de la commande publique, art. R. 2142-14). Une entreprise récente peut prouver sa capacité financière par tout moyen jugé approprié ; et un chiffre d’affaires minimal exigé est plafonné, depuis le 1er janvier 2026, à une fois et demie le montant estimé du marché.',
  },
  {
    q: 'Acceptez-vous le paiement à 30 jours et la facturation sur Chorus Pro ?',
    a: 'Oui. Une collectivité règle ses prestataires sous 30 jours au plus à compter de la demande de paiement : nos propositions sont établies sur cette base. [À valider : acompte] Nos factures sont déposées sur Chorus Pro, obligatoire pour toute entreprise qui facture l’État, une collectivité ou un établissement public.',
  },
  {
    q: 'Pouvez-vous travailler avec nos services techniques et nos prestataires déjà sous contrat ?',
    a: 'Oui. Régie, barrières, scène, marché en cours pour le traiteur ou la sécurité : nous intégrons ces moyens au plan et au rétroplanning, précisons par écrit qui fournit, qui installe et qui exploite, puis coordonnons l’ensemble le jour J. Vos agents et vos prestataires ont un seul contact technique.',
  },
  {
    q: 'Comment répondez-vous au critère environnemental d’une consultation ?',
    a: 'Depuis le 22 août 2026, toute consultation comporte au moins un critère environnemental, et le prix ne peut plus être le seul critère. Notre mémoire technique détaille l’éclairage à LED, la puissance électrique appelée, les prestataires locaux mobilisés, les trajets et le traitement des déchets de montage. [À confirmer : pratiques réellement en place]',
  },
]

/* Le texte complet d'une réponse, tableau compris, pour les données
   structurées. */
const texteComplet = (item: (typeof QUESTIONS)[number]) =>
  [
    item.a,
    ...(item.seuils ? SEUILS.map((s) => `${s.montant} HT : ${s.procedure}`) : []),
    item.apres ?? '',
  ]
    .filter(Boolean)
    .join(' ')

function Questions() {
  return (
    <section
      className="section section--collectivite section--collectivite-questions"
      aria-labelledby="coll-questions-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Questions fréquentes"
          titre="Marchés publics : vos questions avant de nous consulter"
          id="coll-questions-title"
          centree
        />

        <div className="faq">
          {QUESTIONS.map((item) => (
            <details className="faq__item" key={item.q}>
              <summary className="faq__q">
                <span className="faq__q-texte">{item.q}</span>
                <span className="faq__signe" aria-hidden="true" />
              </summary>
              <p className="faq__a">{item.a}</p>
              {item.seuils ? (
                <div className="coll-tableau seuils">
                  <table>
                    <caption className="sr-only">
                      Procédure selon le montant estimé du besoin, hors taxes
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Montant estimé (HT)</th>
                        <th scope="col">Procédure pour une collectivité</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SEUILS.map((seuil) => (
                        <tr key={seuil.montant}>
                          <th scope="row">{seuil.montant}</th>
                          <td>{seuil.procedure}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
              {item.apres ? <p className="faq__a seuils__apres">{item.apres}</p> : null}
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---- S8 · L'appel final ----
   La rampe violette de l'accueil, par le bas, et le même bouton que
   toute la page : le dossier de références. */

function Appel() {
  return (
    <section
      className="section section--appel section--collectivite-appel"
      aria-labelledby="collectivite-appel-title"
    >
      <div className="section__inner">
        <h2 className="section__title appel__title" id="collectivite-appel-title">
          Toutes les pièces de votre dossier,
          <br />
          avant même le premier échange.
        </h2>
        <p className="appel__lede">
          Notre dossier de références réunit l’attestation d’assurance, nos
          engagements de sécurité et d’accessibilité, nos pièces de candidature et
          nos références.
        </p>
        <div className="appel__actions">
          <a className="btn btn--solid" href={DOSSIER}>
            Recevoir notre dossier de références
          </a>
          <a className="btn btn--ghost" href={CONTACT_COLLECTIVITE}>
            Présenter votre manifestation
          </a>
        </div>
        <ul className="appel__garanties">
          <li className="appel__garantie">
            <span className="appel__check" aria-hidden="true">
              ✓
            </span>
            PDF envoyé par courriel
          </li>
          <li className="appel__garantie">
            <span className="appel__check" aria-hidden="true">
              ✓
            </span>
            Réponse sous {DELAI_REPONSE_H}h
          </li>
          <li className="appel__garantie">
            <span className="appel__check" aria-hidden="true">
              ✓
            </span>
            Sans engagement
          </li>
        </ul>
      </div>
    </section>
  )
}

/* ---- Données structurées : le service, la FAQ, le fil d'Ariane ---- */

const ADRESSE = '/nos-services/collectivites-institutionnels'

const DONNEES_STRUCTUREES = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Organisation d’événements pour les collectivités',
      serviceType: 'Organisation de manifestations publiques, inaugurations, cérémonies et commémorations',
      description: DESCRIPTION,
      provider: { '@type': 'Organization', name: 'Oysen' },
      areaServed: ['Toulouse', 'Haute-Garonne', 'Occitanie'],
      url: ADRESSE,
    },
    {
      '@type': 'FAQPage',
      mainEntity: QUESTIONS.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: texteComplet(item) },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: '/' },
        { '@type': 'ListItem', position: 2, name: 'Nos services', item: '/nos-services' },
        { '@type': 'ListItem', position: 3, name: 'Collectivités et institutions', item: ADRESSE },
      ],
    },
  ],
}
