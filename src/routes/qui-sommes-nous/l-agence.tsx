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
import { Triangle } from '../../components/agence/Triangle'
import { Arrow } from '../../components/home/icons'

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
 * projecteurs), l'approche (un triangle de structure), le fondateur (un
 * visage, et la porte vers sa page), puis la sortie, qui reprend la rampe
 * violette de l'accueil.
 *
 * Trois pièges du brief, écartés d'emblée : pas de frise historique sur une
 * structure qui vient de naître, pas de trombinoscope d'une équipe qui
 * n'existe pas, pas une seule valeur sans sa preuve.
 */
function Agence() {
  return (
    <main>
      <Ouverture />
      <Histoire />
      <Valeurs />
      <Approche />
      <Fondateur />
      <Sortie />
    </main>
  )
}

/*
 * S1. L'ouverture : une planche d'architecte.
 *
 * Oysen se dit architecte d'événements et entreprise générale, deux mots du
 * bâtiment : le hero les prend au pied de la lettre. À gauche le discours, à
 * droite le plan d'implantation d'une salle dont chaque poste rejoint la
 * régie, et en pied de feuille le cartouche, qui signe la planche et porte
 * les trois faits de l'encart « En bref ».
 *
 * Aucune photo : le dessin est le sujet. La page se dessine au chargement,
 * trait par trait, et se referme sur le losange de la régie.
 */
function Ouverture() {
  return (
    <section className="ouverture" aria-labelledby="ouverture-title">
      <div className="ouverture__feuille">
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
              <a className="btn btn--solid" href="/nos-services">
                Voir nos services
              </a>

              <a className="agence__more" href="#notre-histoire">
                Découvrir notre histoire
                <Arrow className="agence__arrow" />
              </a>
            </div>
          </div>

          <figure className="plan">
            <Plan />

            <figcaption className="plan__legende">
              <p className="plan__intitule">Plan d’implantation type</p>

              <dl className="legende">
                {[...LEGENDE, LEGENDE_REGIE].map((poste) => (
                  <div
                    className={
                      poste === LEGENDE_REGIE
                        ? 'legende__item legende__item--regie'
                        : 'legende__item'
                    }
                    key={poste.repere}
                  >
                    <dt className="legende__repere">{poste.repere}</dt>
                    <dd className="legende__poste">
                      <span className="legende__nom">{poste.nom}</span>
                      <span className="legende__source">{poste.source}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </figcaption>
          </figure>
        </div>

        {/*
          Le cartouche : qui signe la planche, puis les trois faits. Chaque
          case se lit seule, comme sur un plan.
        */}
        <dl className="cartouche" aria-label="Oysen en bref">
          <div className="cartouche__case cartouche__case--signature">
            <dt className="cartouche__label">Maître d’œuvre</dt>
            <dd className="cartouche__signature">Oysen</dd>
          </div>

          {EN_BREF.map((fait) => (
            <div className="cartouche__case" key={fait.nom}>
              <dt className="cartouche__label">{fait.nom}</dt>
              <dd className="cartouche__valeur">{fait.texte}</dd>
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
          {VALEURS.map((valeur) => (
            <li className="valeur" key={valeur.nom}>
              {/* La lampe accrochée au pont, et son faisceau : décor. */}
              <span className="valeur__lampe" aria-hidden="true" />
              <span className="valeur__faisceau" aria-hidden="true" />

              <h3 className="valeur__nom">{valeur.nom}</h3>

              {/* La plaque posée sous le projecteur : son arête prend la
                  lumière qui tombe sur le mot. */}
              <ul className="valeur__points">
                {valeur.points.map((point) => (
                  <li className="valeur__point" key={point}>
                    {point}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/*
 * S6. Notre approche. Trois temps, du schéma à la phrase.
 *
 * D'abord ce que le travail tient ensemble : le triangle de structure, la
 * seule forme qui ne se déforme pas. Puis d'où vient la méthode : les cinq
 * réflexes du chantier, posés sur une chaîne de cotes comme sur un plan.
 * Enfin ce qu'elle produit : la maxime, et la signature, les deux métiers
 * reliés par le losange.
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

        <div className="approche__tenir">
          <figure className="approche__schema">
            <Triangle />
          </figure>

          <div className="approche__intro">
            <p className="approche__intro-phrase">
              Notre travail, c’est de concilier&nbsp;:
            </p>

            <ul className="approche__puces">
              <li className="approche__puce">ce que vous attendez&nbsp;;</li>
              <li className="approche__puce">ce que la technique permet&nbsp;;</li>
              <li className="approche__puce">
                l’émotion que la journée doit produire.
              </li>
            </ul>
          </div>
        </div>

        <div className="approche__methode">
          <h3 className="approche__sous-titre">
            Une méthode transposée
          </h3>

          <p className="approche__texte">
            Notre fondateur est ingénieur. Sur un chantier, on apprend cinq
            réflexes&nbsp;:
          </p>

          {/* La chaîne de cotes : une mesure, cinq segments. */}
          <ul className="reflexes">
            {REFLEXES.map((reflexe) => (
              <li className="reflexe" key={reflexe.verbe}>
                <span className="reflexe__verbe">{reflexe.verbe}</span>{' '}
                <span className="reflexe__suite">{reflexe.suite}</span>
              </li>
            ))}
          </ul>

          <p className="approche__texte">
            Nous les appliquons à vos événements.
          </p>
        </div>

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

        {/*
          La signature : les deux métiers, reliés par un trait et le losange
          plutôt que par un tiret. Les lecteurs d'écran lisent la phrase.
        */}
        <p className="approche__signature">
          <span className="approche__metiers">
            <span className="approche__metier">Conception</span>
            <span className="sr-only">, </span>
            <span className="approche__lien" aria-hidden="true" />
            <span className="approche__metier">Réalisation</span>
            <span className="sr-only">. </span>
          </span>
          <span className="approche__devise">
            Deux métiers, une expertise.
          </span>
        </p>
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
          EN ATTENTE du portrait : un cadre de visée tient la place. Pour
          poser la photo, remplacer le cadre par
          <img className="fondateur__photo" src="…" alt="Mathis Amato" …/>,
          traitée pour la salle sombre (voir .fondateur__photo).
        */}
        <figure className="fondateur__portrait">
          <div className="fondateur__cadre" aria-hidden="true">
            <span className="fondateur__visee">Portrait à fournir</span>
          </div>
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

          <a
            className="btn btn--ghost fondateur__lien"
            href="/qui-sommes-nous/le-fondateur"
          >
            En savoir plus sur notre fondateur
          </a>
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
          <a className="btn btn--solid" href="/nos-services">
            Voir nos services
          </a>
        </div>

        <div className="agence__direct">
          <p className="agence__direct-texte">Ou contactez-nous directement</p>

          <a className="btn btn--ghost" href="/contact">
            Imaginer mon événement
          </a>
        </div>
      </div>
    </section>
  )
}
