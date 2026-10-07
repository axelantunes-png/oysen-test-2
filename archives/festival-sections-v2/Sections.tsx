/* ---- S2 · Ce que vous voulez ----
   Le but du client, en quatre phrases courtes, posées l'une sous
   l'autre comme les exigences d'une fiche : puis notre réponse. */

const EXIGENCES = [
  'Le public vient pour les artistes.',
  'Le son doit être bon.',
  'La lumière doit marcher.',
  'Tout doit être prêt à l’heure.',
]

function Attente() {
  return (
    <section
      className="section section--festival section--festival-attente"
      aria-labelledby="attente-title"
    >
      <div className="section__inner">
        <div className="attente">
          <h2 className="section__title" id="attente-title">
            Vous voulez un spectacle qui se passe bien
          </h2>
          <ul className="attente__exigences">
            {EXIGENCES.map((exigence) => (
              <li key={exigence}>{exigence}</li>
            ))}
          </ul>
          <p className="attente__texte">
            <strong>C’est notre travail.</strong> Nous le faisons à Toulouse et
            dans toute l’Occitanie, pour un festival, un concert ou un spectacle.
          </p>
          <p className="attente__choix">
            Vous pouvez nous confier toute la technique, ou une seule partie.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ---- S3 · Ce que nous apportons ----
   Cinq apports, en cartes éclairées comme celles du reste du site :
   chacune sous son projecteur. Dessous, qui fournit quoi, et la
   limite de notre son. */

const APPORTS = [
  { nom: 'Le son', texte: 'Enceintes, micros, console. On entend bien partout.' },
  { nom: 'La lumière', texte: 'La scène est éclairée, le site aussi.' },
  { nom: 'La scène et l’écran', texte: 'Montés par nos partenaires.' },
  {
    nom: 'L’électricité',
    texte: 'Assez de courant pour tout brancher, posé par un électricien.',
  },
  {
    nom: 'Les techniciens',
    texte: 'Ils installent, règlent et restent pendant le spectacle.',
  },
]

function Apports() {
  return (
    <section
      className="section section--festival section--festival-apports"
      aria-labelledby="apports-title"
    >
      <div className="section__inner">
        <Tete titre="Ce que nous apportons" id="apports-title" centree />

        <ul className="apports">
          {APPORTS.map((apport) => (
            <li className="apport" key={apport.nom}>
              <h3 className="apport__nom">{apport.nom}</h3>
              <p className="apport__texte">{apport.texte}</p>
            </li>
          ))}
        </ul>

        <div className="apports__notes">
          <p>
            Le son et la lumière sont à nous. Le reste vient de partenaires que
            nous choisissons. Vous gardez un seul contact : nous.
          </p>
          <p>
            Notre son couvre jusqu’à [300 à 400] personnes dehors. Pour plus
            grand, nous ajoutons du matériel.
          </p>
          <a className="fest-lien" href="/nos-services/location-de-materiel">
            Voir tout notre matériel
            <Arrow className="fest-lien__fleche" />
          </a>
        </div>
      </div>
    </section>
  )
}

/* ---- S4 · Trois étapes ----
   Une vraie séquence : numérotée, reliée par un fil, comme la frise du
   hero. La première phrase de chaque étape en est le titre. */

const ETAPES_F = [
  {
    titre: 'Vous nous dites ce qu’il vous faut.',
    texte: 'Envoyez votre fiche technique si vous en avez une.',
  },
  {
    titre: 'Nous venons voir le lieu.',
    texte: 'Vous recevez un devis clair, ligne par ligne.',
  },
  {
    titre: 'Nous installons et nous restons.',
    texte: 'Tout est testé avant l’arrivée du public. Après le spectacle, nous démontons.',
  },
]

function Etapes() {
  return (
    <section
      className="section section--festival section--festival-etapes"
      aria-labelledby="etapes-title"
    >
      <div className="section__inner">
        <Tete titre="Trois étapes" id="etapes-title" centree />

        <ol className="etapes-f">
          {ETAPES_F.map((etape, index) => (
            <li className="etape-f" key={etape.titre}>
              <span className="etape-f__numero" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="etape-f__titre">{etape.titre}</h3>
              <p className="etape-f__texte">{etape.texte}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---- S5 · Et si quelque chose tombe en panne ? ----
   Le noir complet, celui des problèmes sur le reste du site. Quatre
   précautions, cochées comme la frise du hero. */

const PRECAUTIONS = [
  'Le matériel est vérifié avant de partir.',
  'Tout est testé sur place avant l’ouverture.',
  'Nous apportons du matériel de secours. [à confirmer]',
  'Un technicien reste aux commandes pendant tout le spectacle.',
]

function Panne() {
  return (
    <section
      className="section section--festival section--festival-panne"
      aria-labelledby="panne-title"
    >
      <div className="section__inner">
        <Tete
          titre="Et si quelque chose tombe en panne ?"
          id="panne-title"
          texte="Une panne en plein concert, personne n’en veut. Alors nous préparons."
          centree
        />

        <ul className="precautions">
          {PRECAUTIONS.map((precaution) => (
            <li className="precaution" key={precaution}>
              {precaution}
            </li>
          ))}
        </ul>

        <p className="precautions__assurance">Nous sommes assurés. [à confirmer]</p>
      </div>
    </section>
  )
}

/* ---- S6 · Qui s'occupe de votre festival ? ----
   Une seule personne, présentée sur une carte éclairée : son nom, son
   métier, et ce qu'elle fait pour vous. Pas encore de portrait : un
   monogramme lumineux en tient la place. */

function Qui() {
  return (
    <section
      className="section section--festival section--festival-qui"
      aria-labelledby="qui-title"
    >
      <div className="section__inner">
        <Tete titre="Qui s’occupe de votre festival ?" id="qui-title" centree />

        <article className="qui">
          <div className="qui__identite">
            <span className="qui__monogramme" aria-hidden="true">
              MA
            </span>
            <p className="qui__nom">Mathis Amato</p>
            <p className="qui__role">Fondateur d’Oysen · ingénieur</p>
          </div>

          <div className="qui__texte">
            <p>
              Mathis Amato, le fondateur d’Oysen. Il est ingénieur. Il fait du son
              et de la lumière sur des événements depuis [2014].
            </p>
            <p className="qui__appui">
              C’est lui qui vous répond. C’est lui qui est là le jour J. [à
              valider]
            </p>
            <p>
              Oysen est une jeune entreprise. Alors nous préférons vous montrer :
              venez voir notre matériel, ou envoyez votre fiche technique. Nous
              vous répondons point par point.
            </p>
            <div className="qui__liens">
              <a className="fest-lien" href="/qui-sommes-nous/le-fondateur">
                Le parcours de Mathis
                <Arrow className="fest-lien__fleche" />
              </a>
              <a className="fest-lien" href="/nos-souvenirs">
                Nos événements
                <Arrow className="fest-lien__fleche" />
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

/* ---- S7 · Vos questions ----
   Six questions, en dépliants comme la FAQ de l'accueil. */

const QUESTIONS = [
  {
    q: 'Pouvez-vous faire seulement le son, ou seulement la lumière ?',
    a: 'Oui. Vous choisissez.',
  },
  {
    q: 'Travaillez-vous avec nos techniciens et nos bénévoles ?',
    a: 'Oui. Nous écrivons avec vous qui fait quoi.',
  },
  {
    q: 'Et si notre festival est trop grand ?',
    a: 'Nous louons le matériel qui manque. Si c’est trop grand pour nous, nous vous le disons.',
  },
  {
    q: 'Venez-vous plusieurs jours ?',
    a: 'Oui, montage et démontage compris.',
  },
  {
    q: 'Combien ça coûte ?',
    a: 'Ça dépend du lieu, du nombre de personnes, de scènes et de jours. Chaque devis est fait pour votre événement.',
  },
  {
    q: 'Quand faut-il vous contacter ?',
    a: 'Le plus tôt possible, surtout pour l’été.',
  },
]

function Questions() {
  return (
    <section
      className="section section--festival section--festival-questions"
      aria-labelledby="fest-questions-title"
    >
      <div className="section__inner">
        <Tete titre="Vos questions" id="fest-questions-title" centree />

        <div className="faq">
          {QUESTIONS.map((item) => (
            <details className="faq__item" key={item.q}>
              <summary className="faq__q">
                <span className="faq__q-texte">{item.q}</span>
                <span className="faq__signe" aria-hidden="true" />
              </summary>
              <p className="faq__a">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---- S8 · Le devis ----
   La rampe violette de l'accueil, par le bas. */

function Appel() {
  return (
    <section
      className="section section--appel section--festival-appel"
      aria-labelledby="festival-appel-title"
    >
      <div className="section__inner">
        <h2 className="section__title appel__title" id="festival-appel-title">
          Demandez votre devis
        </h2>
        <p className="appel__lede">
          Une date, un lieu, un nombre de personnes : ça suffit pour commencer.
          Nous vous répondons sous {DELAI_REPONSE_H}&nbsp;h.
        </p>
        <p className="appel__but">
          Notre but : un public content, des artistes contents, et aucune panne à
          gérer pour vous.
        </p>
        <div className="appel__actions appel__actions--colonne">
          <a className="btn btn--solid" href={CONTACT_FESTIVAL}>
            Recevoir un devis détaillé
          </a>
          <p className="appel__sous-bouton">Sans engagement</p>
        </div>
        <p className="appel__mairie">
          Vous êtes une mairie ?{' '}
          <a href="/nos-services/collectivites-institutionnels">
            Voir la page Collectivités
          </a>
        </p>
      </div>
    </section>
  )
}

