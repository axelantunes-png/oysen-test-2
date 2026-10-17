import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { DELAI_REPONSE_H } from '../../components/home/content'
import { Arrow } from '../../components/home/icons'
import { Lien } from '../../components/Lien'
import { canonical } from '../../lib/canonical'

/*
 * Chemin depuis la racine du projet, et non relatif : sur une route imbriquée,
 * le découpage de TanStack Start réécrit le module et le chemin relatif n'est
 * plus résolvable côté serveur (« Denied ID »).
 */
import mariageCss from '/src/styles/mariage.css?url'

/*
 * Les valeurs entre crochets sont des affirmations à faire valider par le
 * client (un délai, une durée, un montant). Comme sur l'accueil, elles
 * restent visibles à l'écran tant qu'elles ne sont pas fournies : une
 * valeur plausible passerait inaperçue en relecture.
 */

/* Le formulaire de contact, ouvert sur les questions « Mariage et
   événement privé » (voir Formulaire.tsx). */
/* theme=mariage : la page contact s'ouvre dans les couleurs de la page. */
const CONTACT_MARIAGE = '/contact?profil=particulier&besoin=organisation&theme=mariage'

const TITRE = 'Organisation de mariage à Toulouse et en Occitanie | Oysen'
const DESCRIPTION =
  'Organisation complète, partielle ou coordination du jour J : un seul interlocuteur pour votre mariage à Toulouse et en Occitanie, son et lumière compris.'

export const Route = createFileRoute('/nos-services/mariages-evenements-prives')({
  head: () => ({
    meta: [
      { title: TITRE },
      { name: 'description', content: DESCRIPTION },
      // La barre du navigateur, sur téléphone : le papier de la page.
      { name: 'theme-color', content: '#f6f3ef' },
    ],
    links: [
      canonical('/nos-services/mariages-evenements-prives'),
      { rel: 'stylesheet', href: mariageCss },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(DONNEES_STRUCTUREES),
      },
    ],
  }),
  component: Mariage,
})

/**
 * La page « Mariage et événement privé ».
 *
 * La seule page claire du site : elle reprend les couleurs de la toute
 * première version (le papier, l'encre, le violet d'Oysen). Un mariage se
 * prépare sur papier, et la page en a la matière : le faire-part.
 *
 * Son signe est le cadre de faire-part, un double filet violet aux coins
 * marqués d'un losange. Il encadre la photo du hero, la formule la plus
 * complète et l'invitation finale, et nulle part ailleurs.
 */
function Mariage() {
  /* La formule suivie par le déroulé (S4) : choisie là, ou depuis une
     carte d'offre (S3, « Voir le déroulé »). */
  const [depuis, setDepuis] = useState(1)

  return (
    <main className="page-mariage theme-mariage">
      <Hero />
      <Bab />
      <Formules onVoirDeroule={setDepuis} />
      <Deroule depuis={depuis} onChoisir={setDepuis} />
      <Galerie />
      <Temoignages />
      <Budget />
      <Questions />
      <Invitation />
    </main>
  )
}

/* Le cadre de faire-part : les quatre losanges des coins. */
function Coins() {
  return (
    <span className="faire-part__coins" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  )
}

/* La tête d'une section : surtitre et titre, centrés. */
function Tete({
  surtitre,
  titre,
  id,
  texte,
}: {
  surtitre: string
  titre: string
  id: string
  texte?: string
}) {
  return (
    <div className="mariage-tete">
      <p className="section__eyebrow">{surtitre}</p>
      <h2 className="section__title" id={id}>
        {titre}
      </h2>
      {texte ? <p className="mariage-tete__texte">{texte}</p> : null}
    </div>
  )
}

/* ---- S1 · Le hero ----
   Le texte à gauche, sur le papier ; la photo à droite, dans son cadre de
   faire-part. L'appel est doux : parler de son mariage, pas signer. Sous
   les deux colonnes, trois preuves sur toute la largeur. */

const PREUVES = [
  'Toulouse, Haute-Garonne et Occitanie',
  'Votre wedding planner, du premier rendez-vous au démontage',
  '10+ ans d’expérience',
]

function Hero() {
  return (
    <section className="mariage-hero" aria-labelledby="mariage-title">
      <div className="mariage-hero__inner">
        <div className="mariage-hero__texte">
          {/* Le h1 est le surtitre, porteur de la requête (wedding planner,
              Toulouse, Occitanie) ; la grande phrase en dessous reste
              l'accroche, en simple paragraphe. */}
          <h1 className="section__eyebrow" id="mariage-title">
            Wedding planner à Toulouse et Occitanie
          </h1>
          <p className="mariage-hero__titre">
            Un mariage parfait, pour que le plus beau jour de votre vie{' '}
            <em>vous ressemble</em>.
          </p>
          <p className="mariage-hero__lede">
            De la recherche du lieu à la dernière danse, un seul interlocuteur
            coordonne vos prestataires, installe le son et la lumière, et règle
            les imprévus avant qu’ils ne vous atteignent.
          </p>
          <p className="mariage-hero__promesse">
            Le jour J, tout se passe comme prévu&nbsp;!
          </p>

          <div className="mariage-hero__actions">
            <div className="mariage-hero__appel">
              <Lien className="btn btn--solid" href={CONTACT_MARIAGE}>
                Organisons votre mariage
              </Lien>
              <p className="mariage-hero__rassurance">
                Premier échange sans engagement · réponse sous{' '}
                {DELAI_REPONSE_H}&nbsp;h
              </p>
            </div>
          </div>
        </div>

        {/*
          À REMPLACER par une vraie photo d'un mariage Oysen : le dîner ou
          la piste sous la lumière installée, invités de dos ou flous, sans
          pose.
        */}
        <figure className="mariage-hero__photo faire-part">
          <Coins />
          <img
            src="/images/services/mariage-evenement-prive-1200.jpg"
            srcSet="/images/services/mariage-evenement-prive-800.jpg 800w, /images/services/mariage-evenement-prive-1200.jpg 1200w"
            sizes="(min-width: 1024px) 40vw, 90vw"
            width={1200}
            height={1500}
            alt="Salle de réception sous charpente bois, tables rondes dressées en blanc et chemins de table verts."
            decoding="async"
          />
        </figure>
      </div>

      <ul className="mariage-preuves">
        {PREUVES.map((preuve) => (
          <li key={preuve}>{preuve}</li>
        ))}
      </ul>
    </section>
  )
}

/* ---- S2 · Avant, après, et le pont ----
   À gauche la charge mentale : les tâches qui arrivent chez vous, une liste
   qui ne finit pas, et le dit. À droite le jour J avec Oysen :
   une phrase, de l'air, la lumière de la salle. Entre les deux, le losange
   d'Oysen. Dessous, la phrase qui fait le pont. */

const TACHES = [
  'Relancer le traiteur, le soir',
  'Comparer trois devis de DJ',
  'Répondre au photographe',
  'Refaire le planning, encore',
  'Rappeler le fleuriste',
  'Caler l’heure de livraison des tables',
  'Vérifier l’électricité du lieu',
  'Prévoir un repli s’il pleut',
  'Envoyer les horaires à chacun',
  'Trouver une rallonge pendant les discours',
]

function Bab() {
  return (
    <section className="section section--mariage" aria-labelledby="bab-title">
      <div className="section__inner">
        <Tete
          surtitre="La charge mentale"
          titre="La journée que vous imaginez, et le travail que ça implique"
          id="bab-title"
        />

        <div className="bab">
          <article className="bab__avant">
            <p className="bab__label">Avant, sans coordination</p>
            <h3 className="bab__titre">Un second métier, pendant des mois</h3>
            <p className="bab__intro">
              Chaque prestataire a ses horaires, ses devis, ses questions. Et
              tout arrive chez vous.
            </p>
            <ul className="taches">
              {TACHES.map((tache) => (
                <li className="tache" key={tache}>
                  {tache}
                </li>
              ))}
            </ul>
            {/* La liste ne finit pas : on le dit, plutôt que de la laisser
                s'effacer (on cherchait à la faire défiler). */}
            <p className="taches__suite">Et la liste s’allonge, chaque semaine…</p>
          </article>

          <span className="bab__pont" aria-hidden="true" />

          <article className="bab__apres">
            <p className="bab__label bab__label--oysen">Avec Oysen</p>
            <p className="bab__reve">
              <span className="bab__reve-mission">
                Votre seule mission le jour&nbsp;J&nbsp;:
              </span>
              <span className="bab__reve-accent">savourer chaque instant.</span>
            </p>
            <ul className="bab__points">
              <li>Le lieu est prêt.</li>
              <li>Tout le matériel est testé avant le premier invité.</li>
              <li>Chaque prestataire connaît son horaire.</li>
              <li>Si quelque chose accroche, c’est nous que l’on prévient.</li>
            </ul>
          </article>
        </div>

        <p className="bab__passerelle">
          Notre travail, c’est tout ce que vos invités ne verront pas.{' '}
          <strong>Un seul interlocuteur</strong> tient l’ensemble, du premier
          rendez-vous au démontage.
        </p>
        <p className="bab__suite">
          <a className="lien-doux" href="#formules">
            Choisir jusqu’où nous confier votre mariage
            <Arrow className="lien-doux__fleche" />
          </a>
        </p>
      </div>
    </section>
  )
}

/* ---- S3 · Les trois formules ----
   Le jour J, la complète au milieu, dans le cadre de faire-part, puis
   la partielle. Les trois partagent la même liste de prestations, dans
   le même ordre ; ce qui n'est pas compris reste visible, pâli et
   barré, pour que la comparaison se fasse d'un coup d'œil. */

type Etat = 'oui' | 'option' | 'avalider' | 'non'

const PRESTATIONS = [
  'La coordination complète le jour J',
  'Le déroulé minute par minute, partagé avec chaque prestataire',
  'Le son et la lumière, avec notre matériel',
  'La recherche et la comparaison des prestataires',
  'Le budget suivi poste par poste',
  'La recherche et la visite des lieux, avec un repérage technique',
]

const FORMULES: {
  nom: string
  vedette?: boolean
  mention?: string
  accroche: string
  pour: string
  etats: Etat[]
  /* L'étape du déroulé (S4) où la formule commence. */
  depuis: number
}[] = [
  {
    nom: 'Coordination du jour J',
    accroche: 'Vous avez tout préparé. Vivez-le.',
    pour: 'Tout est organisé, et vous ne voulez pas passer votre mariage à le gérer.',
    etats: ['oui', 'oui', 'option', 'non', 'non', 'non'],
    depuis: 5,
  },
  {
    nom: 'Organisation complète',
    vedette: true,
    mention: 'La plus populaire',
    accroche: 'Vous décidez, nous faisons le reste.',
    pour: 'Vous avez une date, des envies, et pas le temps de tout mener de front.',
    etats: ['oui', 'oui', 'oui', 'oui', 'oui', 'oui'],
    depuis: 1,
  },
  {
    nom: 'Organisation partielle',
    accroche: 'Vous avez commencé, nous prenons le relais.',
    pour: 'Le lieu ou quelques prestataires sont réservés, et vous voulez être déchargés de la suite.',
    etats: ['oui', 'oui', 'option', 'oui', 'non', 'non'],
    depuis: 3,
  },
]

/* Ce que dit la pastille à côté d'une prestation qui n'est pas simplement
   comprise, à l'écran et pour les lecteurs d'écran. */
const PASTILLES: Partial<Record<Etat, string>> = {
  option: 'En option',
  avalider: 'À valider',
}

function Formules({ onVoirDeroule }: { onVoirDeroule: (depuis: number) => void }) {
  return (
    <section
      className="section section--mariage section--mariage-formules"
      aria-labelledby="formules-title"
      id="formules"
    >
      <div className="section__inner">
        <Tete
          surtitre="Accompagnement"
          titre="Trois niveaux d’accompagnement"
          id="formules-title"
          texte="Trois façons de vous accompagner, un même point d’arrivée : un jour J que vous vivez sans avoir à le gérer."
        />

        <ul className="formules">
          {FORMULES.map((formule) => (
            <li
              className={`formule${formule.vedette ? ' formule--vedette faire-part' : ''}`}
              key={formule.nom}
            >
              {formule.vedette ? <Coins /> : null}
              {formule.mention ? (
                <p className="formule__mention">{formule.mention}</p>
              ) : null}
              <h3 className="formule__nom">{formule.nom}</h3>
              <p className="formule__accroche">{formule.accroche}</p>
              <p className="formule__pour">{formule.pour}</p>

              <ul className="formule__prestations">
                {PRESTATIONS.map((prestation, index) => {
                  const etat: Etat = formule.etats[index] ?? 'non'
                  const pastille = PASTILLES[etat]
                  return (
                    <li className={`prestation prestation--${etat}`} key={prestation}>
                      <span className="prestation__texte">
                        {prestation}
                        {etat === 'non' ? (
                          <span className="sr-only"> (non comprise)</span>
                        ) : null}
                      </span>
                      {pastille ? (
                        <span className="prestation__pastille">{pastille}</span>
                      ) : null}
                    </li>
                  )
                })}
              </ul>

              {/* Descend au déroulé, la formule déjà choisie. L'ancre reste :
                  sans JavaScript, le lien y saute quand même. */}
              <a
                className="btn btn--ghost formule__deroule"
                href="#deroule"
                onClick={() => onVoirDeroule(formule.depuis)}
              >
                Voir le déroulé
              </a>
            </li>
          ))}
        </ul>

        <p className="formules__appel">
          <Lien className="btn btn--solid" href={CONTACT_MARIAGE}>
            Organisons votre mariage
          </Lien>
        </p>

        <p className="formules__prive">
          Un anniversaire marquant, une fête de famille&nbsp;? Les mêmes
          formules s’appliquent à vos événements privés.
        </p>
      </div>
    </section>
  )
}

/* ---- S4 · Comment ça se passe ----
   Un vrai déroulé : huit étapes numérotées, parce que les formules s'y
   réfèrent (la partielle commence souvent à la 3, le jour J à la 5).
   En tête, trois cartes, une par formule : on en choisit une, et les
   étapes qu'elle couvre s'allument. Sur ordinateur et tablette, les
   autres restent affichées, en retrait ; sur téléphone, seules les
   étapes de la formule choisie s'affichent. (Versions précédentes :
   archives/mariage-s4-deroule-*.) */

const ETAPES = [
  {
    quand: '12 à 24 mois avant',
    titre: 'Le premier échange',
    nous: 'Écouter votre date, vos invités, votre budget. Vous remettre une proposition poste par poste.',
    vous: 'Nous racontez le mariage qui vous ressemble.',
  },
  {
    quand: '12 à 18 mois avant',
    titre: 'Le lieu',
    nous: 'Présélectionner et visiter les lieux : accès, électricité, acoustique, repli en cas de pluie.',
    vous: 'Visitez les deux ou trois qui le méritent, et choisissez.',
  },
  {
    quand: '12 à 15 mois avant',
    titre: 'Les prestataires',
    nous: 'Sélectionner traiteur, photographe, fleuriste ou DJ. Comparer leurs devis ligne par ligne.',
    vous: 'Rencontrez ceux que vous souhaitez, et tranchez.',
  },
  {
    quand: '6 à 12 mois avant',
    titre: 'L’ambiance',
    nous: 'Concevoir la lumière et le son, de la cérémonie au vin d’honneur, des discours à la soirée dansante. Suivre la décoration.',
    vous: 'Validez les choix, sans entrer dans la technique.',
  },
  {
    quand: '1 à 3 mois avant',
    titre: 'Le déroulé',
    nous: 'Écrire le déroulé minute par minute, le partager, faire la visite technique.',
    vous: 'Relisez un seul document, posez vos questions.',
  },
  {
    quand: 'La veille et le matin',
    titre: 'L’installation',
    nous: 'Accueillir les prestataires, installer le son et la lumière, tout tester avant le premier invité.',
    vous: 'Prenez le temps de vous préparer.',
  },
  {
    quand: 'Le jour J',
    titre: 'La coordination',
    nous: 'Tenir les horaires de la cérémonie à la dernière danse. Prendre chaque imprévu.',
    vous: 'Savourez chaque instant !',
  },
  {
    quand: 'Le soir ou le lendemain',
    titre: 'Le démontage et le bilan',
    nous: 'Démonter, récupérer notre matériel, revenir vers vous.',
    vous: 'Parlez-nous de vos souvenirs !',
  },
]

/* Les trois formules : chacune couvre les étapes à partir de `depuis`. */
const VOIES = [
  { formule: 'Complète', depuis: 1, texte: 'les huit étapes' },
  { formule: 'Partielle', depuis: 3, texte: 'là où vous en êtes, souvent dès l’étape 3' },
  { formule: 'Jour J', depuis: 5, texte: 'les étapes 5 à 8, trois mois avant la date' },
]

const numero = (rang: number) => String(rang).padStart(2, '0')

function Deroule({
  depuis,
  onChoisir,
}: {
  depuis: number
  onChoisir: (depuis: number) => void
}) {
  return (
    <section
      className="section section--mariage section--mariage-deroule"
      aria-labelledby="deroule-title"
      id="deroule"
    >
      <div className="section__inner">
        <Tete
          surtitre="Comment ça se passe"
          titre="Comment se déroule l’organisation de votre mariage, mois par mois ?"
          id="deroule-title"
          texte="Pour une organisation complète, idéalement 12 à 24 mois avant. Plus tard, le calendrier se resserre, la méthode reste la même."
        />

        <div className="deroule">
          <ul className="deroule__choix" aria-label="Choisir une formule">
            {VOIES.map((voie) => (
              <li key={voie.formule}>
                <button
                  type="button"
                  className="deroule__carte"
                  aria-pressed={depuis === voie.depuis}
                  aria-controls="deroule-etapes"
                  onClick={() => onChoisir(voie.depuis)}
                >
                  <span className="deroule__formule">{voie.formule}</span>
                  <span className="deroule__couvre">{voie.texte}</span>
                </button>
              </li>
            ))}
          </ul>

          <ol className="deroule__etapes" id="deroule-etapes">
            {ETAPES.map((etape, index) => {
              const couverte = index + 1 >= depuis
              return (
                <li
                  className={`deroule__etape${couverte ? ' deroule__etape--couverte' : ''}`}
                  key={etape.titre}
                >
                  <p className="deroule__numero">{numero(index + 1)}</p>
                  <div className="deroule__tete">
                    <p className="deroule__quand">{etape.quand}</p>
                    <h3 className="deroule__titre">{etape.titre}</h3>
                  </div>
                  <p className="deroule__nous">
                    <span className="deroule__qui">Nous</span>
                    {etape.nous}
                  </p>
                  <p className="deroule__vous">
                    <span className="deroule__qui">Vous</span>
                    {etape.vous}
                  </p>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ---- S5 · La galerie ----
   Une mosaïque d'album, dans l'ordre d'une journée. Chaque photo est
   légendée avec ce qui a été préparé : le moment, le lieu, la solution.
   Une seule photo pour l'instant ; les autres emplacements attendent les
   leurs (8 à 12 au total, avec l'accord écrit des mariés). */

const GALERIE: { forme: string; legende?: string; photo?: boolean }[] = [
  {
    forme: 'grande',
    photo: true,
    legende: 'Moment · type de lieu, commune · ce qui a été installé ou résolu',
  },
  { forme: 'haute' },
  { forme: 'carree' },
  { forme: 'carree' },
  { forme: 'large' },
  { forme: 'carree' },
  { forme: 'carree' },
  { forme: 'large' },
]

function Galerie() {
  return (
    <section
      className="section section--mariage"
      aria-labelledby="galerie-title"
      id="galerie"
    >
      <div className="section__inner">
        <Tete
          surtitre="Galerie"
          titre="Ce que vos invités verront"
          id="galerie-title"
          texte="Chaque photo est légendée avec ce que nous avons préparé : le lieu, la contrainte, la solution."
        />

        <ul className="galerie">
          {GALERIE.map((tuile, index) => (
            <li className={`galerie__tuile galerie__tuile--${tuile.forme}`} key={index}>
              {tuile.photo ? (
                <figure className="galerie__figure">
                  <img
                    src="/images/services/mariage-evenement-prive-1200.jpg"
                    srcSet="/images/services/mariage-evenement-prive-800.jpg 800w, /images/services/mariage-evenement-prive-1200.jpg 1200w"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    width={1200}
                    height={1500}
                    alt="Salle de réception d’un mariage près de Toulouse, tables rondes dressées en blanc sous une charpente bois"
                    loading="lazy"
                    decoding="async"
                  />
                  {tuile.legende ? (
                    <figcaption className="galerie__legende">{tuile.legende}</figcaption>
                  ) : null}
                </figure>
              ) : (
                <span className="galerie__attente">Photo à fournir</span>
              )}
            </li>
          ))}
        </ul>

        <p className="galerie__suite">
          <Lien className="lien-doux" href="/nos-souvenirs">
            Voir toutes nos réalisations
            <Arrow className="lien-doux__fleche" />
          </Lien>
        </p>
      </div>
    </section>
  )
}

/* ---- S6 · Les témoignages des couples ----
   Masquée tant qu'il n'y a pas deux témoignages validés : un seul, ou des
   gabarits, feraient plus de tort que de bien. Pour l'afficher, remplir
   les entrées et passer `valide` à true (trois au plus). */

const TEMOIGNAGES = [
  {
    texte:
      'Ce qui les faisait hésiter … ce qui les a décidés … le moment qui les a marqués le jour J',
    couple: 'Prénom et Prénom',
    detail: 'Mariés en mois année · lieu · formule',
    valide: false,
  },
  {
    texte:
      'Ce qui les faisait hésiter … ce qui les a décidés … le moment qui les a marqués le jour J',
    couple: 'Prénom et Prénom',
    detail: 'Mariés en mois année · lieu · formule',
    valide: false,
  },
]

function Temoignages() {
  const valides = TEMOIGNAGES.filter((temoignage) => temoignage.valide).slice(0, 3)
  if (valides.length < 2) return null

  return (
    <section
      className="section section--mariage section--mariage-temoignages"
      aria-labelledby="temoignages-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Témoignages"
          titre="Ils nous ont confié leur mariage"
          id="temoignages-title"
        />

        <ul className="couples">
          {valides.map((temoignage, index) => (
            <li className="couple" key={index}>
              <blockquote className="couple__citation">
                <p>{temoignage.texte}</p>
              </blockquote>
              <p className="couple__nom">{temoignage.couple}</p>
              <p className="couple__detail">{temoignage.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---- S7 · Le budget indicatif ----
   Les trois formules dans le même ordre qu'au-dessus, puis, côte à côte,
   ce qui fait varier le budget et ce que contient le devis. */

const BUDGETS = [
  {
    nom: 'Organisation complète',
    montant: '5 500 €',
    couvre: 'Du premier échange au rangement, son et lumière compris',
  },
  {
    nom: 'Organisation partielle',
    montant: '3 200 €',
    couvre: 'Votre projet repris là où il en est, jusqu’au rangement',
  },
  {
    nom: 'Coordination du jour J',
    montant: '2 200 €',
    couvre: 'Les trois derniers mois de préparation et notre présence le jour J',
  },
]

const VARIABLES = [
  'Le nombre d’invités et notre temps de présence le jour J',
  'Le lieu : distance, accès, électricité, intérieur ou extérieur',
  'La technique : le son seul, ou la mise en lumière complète',
  'Le nombre de prestataires à coordonner',
]

const DEVIS = [
  'Nos honoraires et notre matériel, ligne par ligne',
  'Vos prestataires chiffrés à part à valider : facturés par chacun ou par Oysen',
  'Aucun poste « divers » : chaque ligne se comprend',
]

function Budget() {
  return (
    <section
      className="section section--mariage"
      aria-labelledby="budget-title"
      id="budget"
    >
      <div className="section__inner">
        <Tete
          surtitre="Budget indicatif"
          titre="Combien coûte l’organisation d’un mariage avec Oysen ?"
          id="budget-title"
          texte="Le montant exact dépend de vos invités, du lieu et de la technique. Il est fixé dans un devis détaillé, poste par poste."
        />

        <ul className="budgets">
          {BUDGETS.map((budget, index) => (
            <li
              className={`budget${index === 0 ? ' budget--vedette' : ''}`}
              key={budget.nom}
            >
              <p className="budget__nom">{budget.nom}</p>
              <p className="budget__montant">
                <span className="budget__a-partir">À partir de</span>
                {budget.montant} <span className="budget__ttc">TTC</span>
              </p>
              <p className="budget__base">{budget.couvre}</p>
            </li>
          ))}
        </ul>

        <div className="variables">
          <div className="variables__colonne">
            <h3 className="variables__titre">Ce qui fait varier votre budget</h3>
            <ul className="variables__liste">
              {VARIABLES.map((variable) => (
                <li className="variable" key={variable}>
                  {variable}
                </li>
              ))}
            </ul>
          </div>
          <div className="variables__colonne">
            <h3 className="variables__titre">Ce que votre devis contient</h3>
            <ul className="variables__liste">
              {DEVIS.map((ligne) => (
                <li className="variable" key={ligne}>
                  {ligne}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="budget__action">
          <Lien className="btn btn--solid" href={CONTACT_MARIAGE}>
            Recevoir une proposition détaillée
          </Lien>
        </p>
      </div>
    </section>
  )
}

/* ---- S8 · Les questions ----
   La tête à gauche, les six questions à droite, en dépliants : les
   mêmes que la FAQ de l'accueil (classes .faq, home.css), repeintes par
   les couleurs de la page. Les réponses nourrissent aussi les données
   structurées (FAQPage), en texte seul : `lien` fait seulement du mot
   qu'il désigne un lien, à l'écran. */

const QUESTIONS: { q: string; a: string; lien?: { mot: string; href: string } }[] = [
  {
    q: 'Combien de temps à l’avance faut-il contacter Oysen ?',
    a: 'Pour une organisation complète, idéalement 12 à 24 mois avant la date. Pour une coordination du jour J, trois mois suffisent. Les mariages se concentrent de mai à septembre : si votre date tombe dans cette période, écrivez-nous dès qu’elle est fixée.',
  },
  {
    q: 'Pouvez-vous travailler avec des prestataires que nous avons déjà réservés ?',
    a: 'Oui. Nous les contactons, intégrons leurs horaires au déroulé et les accueillons le jour J. C’est le principe de l’organisation partielle et de la coordination du jour J. Vous avez déjà une wedding planner ? Nous pouvons n’intervenir que sur la technique.',
    lien: { mot: 'technique', href: '/nos-services/prestation-technique' },
  },
  {
    q: 'Agence ou wedding planner indépendante : quelle différence ?',
    a: 'Une wedding planner indépendante, ou organisatrice de mariage, trouve et coordonne vos prestataires. Oysen fait la même chose, en agence événementielle, et installe aussi le son et la lumière avec son propre matériel et ses propres DJ. Selon la taille du mariage, des techniciens de notre réseau nous épaulent. Pour vous, c’est un prestataire de moins à trouver, et un seul contact pour tout.',
  },
  {
    q: 'Nous n’avons pas encore de lieu : pouvez-vous nous aider à le trouver ?',
    a: 'Oui, c’est souvent par là que tout commence. Oysen ne possède aucun lieu : nous présélectionnons domaines, châteaux ou salles selon votre date, vos invités et votre budget, puis vérifions sur place l’accès, l’électricité et le repli en cas de pluie, avant votre visite.',
  },
  {
    q: 'Qui sera présent le jour de notre mariage ?',
    a: 'Votre interlocuteur Oysen, celui qui a préparé votre mariage avec vous, de l’installation à la fin de la soirée. Selon le nombre d’invités, des techniciens de notre réseau l’épaulent. Vos prestataires ont un seul contact.',
  },
  {
    q: 'Et si quelque chose ne se passe pas comme prévu le jour J ?',
    a: 'Nous le préparons avant qu’il n’arrive : un lieu repéré avec une solution de repli, le son et la lumière testés avant les invités, du matériel de secours pour l’essentiel. En cas de retard ou d’imprévu, les prestataires nous appellent, nous.',
  },
]

/* La réponse, avec son mot-lien s'il en a un (sa dernière occurrence). */
function Reponse({ texte, lien }: { texte: string; lien?: { mot: string; href: string } }) {
  const position = lien ? texte.lastIndexOf(lien.mot) : -1
  if (!lien || position < 0) return <>{texte}</>
  return (
    <>
      {texte.slice(0, position)}
      <Lien className="faq__lien" href={lien.href}>
        {lien.mot}
      </Lien>
      {texte.slice(position + lien.mot.length)}
    </>
  )
}

function Questions() {
  return (
    <section
      className="section section--mariage section--mariage-questions"
      aria-labelledby="questions-title"
    >
      <div className="section__inner questions-mariage">
        <div className="questions-mariage__tete">
          <p className="section__eyebrow">Questions fréquentes</p>
          <h2 className="section__title" id="questions-title">
            Questions fréquentes sur l’organisation de votre mariage
          </h2>
          <p className="mariage-tete__texte">
            Une autre question&nbsp;? Posez-la-nous directement.
          </p>
          <Lien className="lien-doux" href={CONTACT_MARIAGE}>
            Nous écrire
            <Arrow className="lien-doux__fleche" />
          </Lien>
        </div>

        <div className="faq">
          {QUESTIONS.map((item) => (
            <details className="faq__item" key={item.q}>
              <summary className="faq__q">
                <span className="faq__q-texte">{item.q}</span>
                <span className="faq__signe" aria-hidden="true" />
              </summary>
              <p className="faq__a">
                <Reponse texte={item.a} lien={item.lien} />
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---- S9 · L'invitation ----
   L'appel final, doux : une invitation dans son cadre de faire-part, sur
   la lueur violette de la page. Ce qui se passe ensuite tient en trois
   temps, numérotés parce qu'ils se suivent. */

const ENSUITE = [
  'Vous décrivez votre mariage en quelques questions.',
  `Nous vous répondons sous ${DELAI_REPONSE_H} h pour convenir d’un rendez-vous.`,
  'Vous recevez une proposition détaillée, poste par poste.',
]

function Invitation() {
  return (
    <section
      className="section section--mariage section--mariage-invitation"
      aria-labelledby="invitation-title"
    >
      <div className="section__inner">
        <div className="invitation faire-part">
          <Coins />
          <p className="section__eyebrow">Parlons-en</p>
          <h2 className="invitation__titre" id="invitation-title">
            Racontez-nous <em>votre mariage</em>
          </h2>
          <p className="invitation__texte">
            Une date, même approximative, un lieu ou une ville, un nombre
            d’invités : c’est tout ce qu’il nous faut pour un premier échange,
            sans engagement.
          </p>

          <ol className="ensuite">
            {ENSUITE.map((temps) => (
              <li className="ensuite__temps" key={temps}>
                {temps}
              </li>
            ))}
          </ol>

          <div className="invitation__actions">
            <Lien className="btn btn--solid" href={CONTACT_MARIAGE}>
              Organisons votre mariage
            </Lien>
            <Lien className="lien-doux" href="/qui-sommes-nous/le-fondateur">
              Découvrir qui prépare votre mariage
              <Arrow className="lien-doux__fleche" />
            </Lien>
          </div>

          <p className="invitation__note">
            Mariages à Toulouse, en Haute-Garonne et en Occitanie
          </p>
        </div>
      </div>
    </section>
  )
}

/* ---- Données structurées : le service, sa FAQ, le fil d'Ariane ---- */

const ADRESSE = '/nos-services/mariages-evenements-prives'

const DONNEES_STRUCTUREES = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Organisation de mariage',
      serviceType: 'Organisation de mariage et d’événements privés',
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
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: '/' },
        { '@type': 'ListItem', position: 2, name: 'Nos services', item: '/nos-services' },
        { '@type': 'ListItem', position: 3, name: 'Mariage et événement privé', item: ADRESSE },
      ],
    },
  ],
}
