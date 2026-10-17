import { createFileRoute } from '@tanstack/react-router'

import {
  EN_BREF,
  FONDATEUR_ANNEES,
  HISTOIRE,
  LEGENDE,
  LEGENDE_REGIE,
  REFLEXES,
  VALEURS,
} from '../../components/agence/content'
import { Plan } from '../../components/agence/Plan'
import { Trajet } from '../../components/agence/Trajet'
import { Arrow } from '../../components/home/icons'
import { Lien } from '../../components/Lien'
import { canonical } from '../../lib/canonical'

/*
 * Chemin depuis la racine du projet, et non relatif : sur une route imbriquée,
 * le découpage de TanStack Start réécrit le module et le chemin relatif n'est
 * plus résolvable côté serveur (« Denied ID »).
 */
import agenceCss from '/src/styles/agence.css?url'

export const Route = createFileRoute('/qui-sommes-nous/l-agence')({
  head: () => ({
    meta: [
      { title: 'L’agence, Oysen' },
      {
        name: 'description',
        content:
          'Qui est Oysen : un interlocuteur unique, un parc technique en propre, un réseau de prestataires engagés en Haute-Garonne et en Occitanie.',
      },
    ],
    /* La feuille n'est chargée que sur cette page, pas sur tout le site. */
    links: [
      canonical('/qui-sommes-nous/l-agence'),
      { rel: 'stylesheet', href: agenceCss },
    ],
  }),
  component: Agence,
})

/**
 * La page « L'agence ».
 *
 * Elle ne s'ouvre ni sur une date de création ni sur une mission : elle
 * s'ouvre sur la question que se pose le visiteur en arrivant, qui est
 * toujours la même, à qui je confie mon événement. Tout ce qui suit y
 * répond dans l'ordre où elle se pose.
 *
 * Six temps : l'ouverture (une planche d'architecte), l'histoire (le rail
 * de la scène et du chantier), les valeurs (une scène sous trois
 * projecteurs), l'approche (ce que le travail concilie), le fondateur (un
 * visage, et la porte vers sa page), puis la sortie, qui reprend la rampe
 * violette de l'accueil.
 *
 * Trois pièges du brief, écartés d'emblée : pas de frise historique sur une
 * structure qui vient de naître, pas de trombinoscope d'une équipe qui
 * n'existe pas, pas une seule valeur sans sa preuve.
 */
function Agence() {
  return (
    <main className="page-agence">
      <Ouverture />
      <Implantation />
      <Histoire />
      <Valeurs />
      <Approche />
      <Fondateur />
      <Sortie />
    </main>
  )
}

/*
 * S1. L'ouverture.
 *
 * Oysen se dit architecte d'événements et entreprise générale, deux mots du
 * bâtiment. Le discours, sous les faisceaux de l'accueil, sur une photo de
 * salle très atténuée. Le plan d'implantation a sa propre section, juste
 * sous la bande « En bref ».
 */
function Ouverture() {
  return (
    <section className="ouverture" aria-labelledby="ouverture-title">
      <div className="ouverture__feuille">
        {/* La photo de fond, une salle de mariage éclairée en violet.
            Décorative : la page se lit sans elle. */}
        <img
          className="ouverture__photo"
          src="/images/agence-fond-1179.webp"
          srcSet="/images/agence-fond-800.webp 800w, /images/agence-fond-1179.webp 1179w"
          sizes="100vw"
          width={1179}
          height={852}
          alt=""
          decoding="async"
        />

        {/* Les faisceaux de l'accueil, tirés de l'angle haut gauche. */}
        <span className="ouverture__faisceaux" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>

        <div className="ouverture__corps">
          <div className="ouverture__texte">
            <p className="ouverture__surtitre">Architectes d’événements</p>

            <h1 className="ouverture__titre" id="ouverture-title">
              <span className="ouverture__titre-nom">Oysen,</span> agence
              événementielle{' '}
              <span className="ouverture__titre-lieu">en Haute-Garonne</span>
            </h1>

            <p className="ouverture__lede">
              Une entreprise générale de l’événementiel&nbsp;: nous concevons,
              coordonnons et réalisons des événements en réunissant les
              compétences nécessaires autour d’un même projet.
            </p>

            <div className="ouverture__actions">
              <Lien className="btn btn--solid" href="/nos-services">
                Voir nos services
              </Lien>

              <a className="agence__more" href="#notre-histoire">
                Découvrir notre histoire
                <Arrow className="agence__arrow" />
              </a>
            </div>
          </div>
        </div>

        {/* La bande « En bref », posée au pied du hero sur ordinateur,
            sous lui sur tablette et téléphone (agence.css). */}
        <EnBref />
      </div>
    </section>
  )
}

/** Les pictogrammes de la bande, au trait, dans l'ordre de EN_BREF. */
function PictoBref({ rang }: { rang: number }) {
  return (
    <svg
      className="bref__picto"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {rang === 0 && (
        /* Une boussole : la zone desservie. */
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M15.5 8.5l-2 5-5 2 2-5z" />
        </>
      )}
      {rang === 1 && (
        /* Une onde sonore : le parc matériel. */
        <path d="M4 10.5v3M7.5 8v8M11 5.5v13M14.5 8v8M18 10v4M21 11.2v1.6" />
      )}
      {rang === 2 && (
        /* Un écusson coché : l'assurance. */
        <>
          <path d="M12 3l7 2.8v5.4c0 4.5-3 8-7 9.8-4-1.8-7-5.3-7-9.8V5.8z" />
          <path d="M9 12l2.2 2.2L15.3 10" />
        </>
      )}
    </svg>
  )
}

/*
 * La bande « En bref », dans le hero, sur toute la largeur : qui
 * signe, puis les trois faits, chacun avec son pictogramme. Chaque case se
 * lit seule.
 */
function EnBref() {
  return (
    <div className="bref" role="region" aria-label="Oysen en bref">
      <dl className="bref__grille">
        <div className="bref__case bref__case--signature">
          <dt className="bref__label">Maître d’œuvre</dt>
          <dd className="bref__signature">Oysen</dd>
        </div>

        {EN_BREF.map((fait, rang) => (
          <div className="bref__case" key={fait.nom}>
            <dt className="bref__nom">
              <PictoBref rang={rang} />
              {fait.nom}
            </dt>
            <dd className="bref__texte">{fait.texte}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/** La boussole sous le plan, qui l'oriente. */
function Boussole() {
  return (
    <svg
      className="implantation__boussole"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </svg>
  )
}

/*
 * S3. Le plan d'implantation type : une salle dont chaque poste rejoint la
 * régie. Le plan à gauche, sa légende à droite, poste par poste, et la
 * régie qui la ferme.
 */
function Implantation() {
  return (
    <section className="implantation" aria-label="Plan d’implantation type">
      <div className="implantation__inner">
        <figure className="implantation__plan">
          <Plan />

          <figcaption className="implantation__intitule">
            Plan d’implantation type
            <Boussole />
          </figcaption>
        </figure>

        <dl className="implantation__legende">
          {[...LEGENDE, LEGENDE_REGIE].map((poste) => (
            <div
              className={
                poste === LEGENDE_REGIE
                  ? 'implantation__poste implantation__poste--regie'
                  : 'implantation__poste'
              }
              key={poste.repere}
            >
              <dt className="implantation__repere">
                {poste === LEGENDE_REGIE ? (
                  <>
                    <span className="implantation__losange" aria-hidden="true" />
                    <span className="sr-only">Point central</span>
                  </>
                ) : (
                  poste.repere
                )}
              </dt>
              <dd className="implantation__texte">
                <span className="implantation__nom">{poste.nom}</span>
                <span className="implantation__source">{poste.source}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}


/*
 * S2. Notre histoire. Quatre étapes dans l'ordre du temps, la seule
 * numérotation de la page qui en soit vraiment une.
 *
 * Une étape par bloc, séparés d'un filet et de beaucoup d'air : le titre à
 * gauche, le récit à droite, jamais deux récits côte à côte. Le long des
 * blocs descend le rail : la scène et le chantier en parallèle, la
 * trajectoire du fondateur qui passe de l'une à l'autre, puis les réunit
 * dans le losange d'Oysen. Le rail ne porte aucun texte, sa légende est
 * sous le titre.
 */
function Histoire() {
  return (
    <section
      id="notre-histoire"
      className="section section--agence section--agence-histoire"
      aria-labelledby="histoire-title"
    >
      <div className="section__inner">
        <p className="section__eyebrow">Notre histoire</p>

        <h2 className="section__title" id="histoire-title">
          La rigueur de l’ingénierie, la passion du spectacle.
        </h2>

        {/* La légende du rail : décor, il ne dit rien que le récit ne dise. */}
        <ul className="histoire__legende" aria-hidden="true">
          <li className="histoire__voie histoire__voie--scene">Scène</li>
          <li className="histoire__voie histoire__voie--chantier">Chantier</li>
          <li className="histoire__voie histoire__voie--parcours">
            Le parcours de notre fondateur
          </li>
        </ul>

        <ol className="histoire">
          {HISTOIRE.map((etape, i) => (
            <li className="etape" key={etape.titre}>
              <Trajet etape={i} />

              <div className="etape__corps">
                <div className="etape__tete">
                  <p className="etape__numero">
                    {String(i + 1).padStart(2, '0')}
                  </p>

                  <h3 className="etape__titre">{etape.titre}</h3>
                </div>

                <div className="etape__recit">
                  {etape.accroche && (
                    <p className="etape__accroche">{etape.accroche}</p>
                  )}

                  <p className="etape__texte">{etape.texte}</p>

                  {etape.conviction && (
                    <p className="etape__conviction">{etape.conviction}</p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/*
 * S5. Les valeurs, sur une scène. La salle est éteinte, un pont lumière
 * court en haut, et chaque valeur a son projecteur : le mot, en blanc, se
 * tient dans la flaque de lumière ; dessous, une plaque dont
 * l'arête prend la lumière porte ses trois points. À l'entrée dans l'écran,
 * les projecteurs s'allument l'un après l'autre, le mot s'éclaire, puis les
 * points s'allument un à un.
 */
function Valeurs() {
  return (
    <section
      className="section section--agence section--agence-valeurs"
      aria-labelledby="valeurs-title"
    >
      <div className="section__inner">
        <p className="section__eyebrow">Nos valeurs</p>

        <h2 className="section__title" id="valeurs-title">
          Nos engagements en tant qu’agence événementielle.
        </h2>

        <ul className="valeurs">
          {VALEURS.map((valeur, rang) => (
            <li className="valeur" key={valeur.nom}>
              {/* La lampe accrochée au pont, et son faisceau : décor. */}
              <span className="valeur__lampe" aria-hidden="true" />
              <span className="valeur__faisceau" aria-hidden="true" />

              <h3 className="valeur__nom">{valeur.nom}</h3>

              {/* La plaque posée sous le projecteur, en design cards 01
                  (app.css) : le trait du haut, la bordure du survol et la
                  zone de survol prolongée. Le sens de l'éclairage alterne
                  d'une plaque à l'autre. */}
              <div
                className={`valeur__points dc01 ${rang % 2 ? 'dc01--paire' : 'dc01--impaire'}`}
              >
                <span className="dc01__repere" aria-hidden="true" />
                <span className="dc01__survol" aria-hidden="true" />
                <span className="dc01__zone" aria-hidden="true" />

                <ul className="valeur__liste">
                  {valeur.points.map((point) => (
                    <li className="valeur__point" key={point}>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Les pictogrammes au trait de « Notre approche ». */
function PictoApproche({ nom }: { nom: 'boussole' | 'onde' | 'eclat' }) {
  return (
    <svg
      className="approche__picto"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {nom === 'boussole' && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M15.5 8.5l-2 5-5 2 2-5z" />
        </>
      )}
      {nom === 'onde' && (
        <path d="M4 10.5v3M7.5 8v8M11 5.5v13M14.5 8v8M18 10v4M21 11.2v1.6" />
      )}
      {nom === 'eclat' && (
        /* Deux étincelles : l'une grande, l'autre petite. */
        <path d="M10 3.5l1.6 4.4 4.4 1.6-4.4 1.6L10 15.5l-1.6-4.4L4 9.5l4.4-1.6zM17.5 13.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />
      )}
    </svg>
  )
}

/** Les trois choses que le travail concilie. */
const CONCILIER = [
  { picto: 'boussole', label: 'Vos attentes', texte: 'ce dont vous avez besoin ;' },
  {
    picto: 'onde',
    label: 'La technique',
    texte: 'ce que la technique permet ;',
  },
  {
    picto: 'eclat',
    label: 'L’émotion',
    texte: 'l’émotion que la journée doit produire.',
  },
] as const

/*
 * S6. Notre approche. Trois temps.
 *
 * D'abord ce que le travail concilie : trois colonnes, vos attentes, la
 * technique, l'émotion. Puis d'où
 * vient la méthode : les cinq réflexes du chantier. Enfin ce qu'elle
 * produit : la maxime, et la signature des deux métiers.
 */
function Approche() {
  return (
    <section
      className="section section--agence section--agence-approche"
      aria-labelledby="approche-title"
    >
      <div className="section__inner">
        <p className="section__eyebrow">Notre approche</p>

        <h2 className="section__title approche__titre" id="approche-title">
          L’organisation d’événement,{' '}
          <span className="approche__titre-chute">un projet entier.</span>
        </h2>

        <p className="approche__intro-phrase">
          Notre travail, c’est de concilier&nbsp;:
        </p>

        <ul className="concilier">
          {CONCILIER.map((pole) => (
            <li className="concilier__pole" key={pole.label}>
              <PictoApproche nom={pole.picto} />
              <span className="concilier__label">{pole.label}</span>
              <span className="concilier__texte">{pole.texte}</span>
            </li>
          ))}
        </ul>

        <div className="approche__methode">
          <div className="approche__methode-texte">
            <h3 className="approche__sous-titre">Une méthode transposée</h3>

            <p className="approche__texte">
              Notre fondateur est ingénieur. Sur un chantier, on apprend cinq
              réflexes&nbsp;:
            </p>

            <p className="approche__applique">
              Nous les appliquons à vos événements.
            </p>
          </div>

          <ul className="reflexes">
            {REFLEXES.map((reflexe) => (
              <li className="reflexe" key={reflexe.verbe}>
                <svg
                  className="reflexe__fleche"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
                <span className="reflexe__verbe">{reflexe.verbe}</span>{' '}
                <span className="reflexe__suite">{reflexe.suite}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="approche__conclusion">
          <div className="approche__maxime-bloc">
            <PictoApproche nom="eclat" />

            <p className="approche__maxime">
              La rigueur n’est pas l’inverse de l’émotion.{' '}
              <span className="approche__maxime-chute">
                Elle en est la condition.
              </span>
            </p>

            <p className="approche__marque">
              Un événement qui marque, c’est un événement où tout se passe
              comme prévu.
            </p>
          </div>

          <p className="approche__signature">
            <span className="approche__metier">Conception,</span>{' '}
            <span className="approche__metier approche__metier--chute">
              Réalisation.
            </span>{' '}
            <span className="approche__devise">
              Deux métiers, une expertise.
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}

/*
 * S7. Le fondateur. Photo à gauche, texte à droite, trois lignes et pas
 * plus : l'histoire a déjà été racontée plus haut, ce bloc donne un visage
 * et ouvre la porte vers la page « Le fondateur ».
 *
 * Le chantier et la scène sont soulignés aux couleurs des deux voies du
 * rail de l'histoire : gris pour l'un, lavande pour l'autre.
 */
function Fondateur() {
  return (
    <section
      className="section section--agence section--agence-fondateur"
      aria-labelledby="fondateur-title"
    >
      <div className="section__inner fondateur">
        {/* La tête du texte, à part : sur téléphone, elle passe avant la photo. */}
        <div className="fondateur__tete">
          <p className="section__eyebrow">Le fondateur</p>

          <h2 className="fondateur__nom" id="fondateur-title">
            Mathis Amato
          </h2>
        </div>

        {/*
          La photo complète, fond compris, recadrée en 4/5 comme son cadre,
          en trois largeurs : 400 pour le téléphone, 640 pour la tablette
          et l'ordinateur, 1053 pour les écrans denses. Traitée pour la
          salle sombre (voir .fondateur__photo). Sous la ligne de
          flottaison : chargée à l'approche.
        */}
        <figure className="fondateur__portrait">
          <img
            className="fondateur__photo"
            src="/images/fondateur/fondateur-mathis-640.webp"
            srcSet="/images/fondateur/fondateur-mathis-400.webp 400w, /images/fondateur/fondateur-mathis-640.webp 640w, /images/fondateur/fondateur-mathis-1053.webp 1053w"
            sizes="(max-width: 760px) 18rem, 24rem"
            width={1053}
            height={1316}
            alt="Mathis Amato, fondateur d’Oysen"
            loading="lazy"
            decoding="async"
          />
        </figure>

        <div className="fondateur__texte">
          <p className="fondateur__role">
            Ingénieur de formation, il conçoit et coordonne des événements
            depuis {FONDATEUR_ANNEES}&nbsp;ans.
          </p>

          <p className="fondateur__parcours">
            C’est son parcours entre{' '}
            <span className="fondateur__voie fondateur__voie--chantier">
              le chantier
            </span>{' '}
            et{' '}
            <span className="fondateur__voie fondateur__voie--scene">
              la scène
            </span>{' '}
            qui a donné à Oysen sa méthode.
          </p>

          <Lien
            className="btn btn--ghost fondateur__lien"
            href="/qui-sommes-nous/le-fondateur"
          >
            En savoir plus sur notre fondateur
          </Lien>
        </div>
      </div>
    </section>
  )
}

/*
 * S9. La sortie. La rampe violette de l'appel final : la page se referme
 * comme l'accueil, par le bas. Une question, deux portes, aucune pression.
 */
function Sortie() {
  return (
    <section
      className="section section--agence section--agence-sortie"
      aria-labelledby="sortie-title"
    >
      <div className="section__inner">
        <h2 className="section__title agence__sortie-titre" id="sortie-title">
          Vous souhaitez organiser un événement&nbsp;?
        </h2>

        <p className="agence__lede">
          Découvrez l’ensemble de nos services en matière d’organisation
          événementielle.
        </p>

        <div className="agence__actions">
          <Lien className="btn btn--solid" href="/nos-services">
            Voir nos services
          </Lien>
        </div>

        <div className="agence__direct">
          <p className="agence__direct-texte">Ou contactez-nous directement</p>

          <Lien className="btn btn--ghost" href="/contact">
            Imaginer mon événement
          </Lien>
        </div>
      </div>
    </section>
  )
}
