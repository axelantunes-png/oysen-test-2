/* ---- S2 · Pour qui ----
   Quatre organisateurs, quatre colonnes séparées d'un voile : la
   situation de départ, ce que vous gardez, ce que nous reprenons, et ce
   qui en résulte. Le besoin diffère, la méthode reste la même. */

const PUBLICS: {
  nom: string
  situation: string
  vous: { label: string; points: string[] }
  nous: string[]
  resultat: string
  contact: string
  lien?: { href: string; libelle: string }
}[] = [
  {
    nom: 'Associations organisatrices',
    situation: 'Un festival annuel, un concert, une fête portée par un bureau bénévole.',
    vous: {
      label: 'Vous gardez',
      points: ['La programmation et la billetterie', 'La buvette et vos bénévoles'],
    },
    nous: [
      'La régie et le plan du site',
      'L’exploitation du son et de la lumière',
      'Les pièces techniques que la mairie vous demande',
    ],
    resultat: 'Votre bureau s’occupe du festival ; le plateau a un responsable.',
    contact: CONTACT_FESTIVAL,
  },
  {
    nom: 'Services culturels des collectivités',
    situation: 'Saison culturelle, fête de la musique, festival municipal, programmation d’été.',
    vous: {
      label: 'Vous gardez',
      points: [
        'La programmation',
        'L’ouverture du site par vos services techniques',
        'L’achat, encadré par la commande publique',
      ],
    },
    nous: [
      'La réponse à votre demande de devis ou à votre consultation',
      'Vos moyens municipaux intégrés au plan',
      'La coordination de l’ensemble le jour J',
    ],
    resultat: 'Vos agents ont un seul contact technique.',
    contact: CONTACT_COLLECTIVITE,
    lien: {
      href: '/nos-services/collectivites-institutionnels',
      libelle: 'Marchés publics et délais : Collectivités et institutions',
    },
  },
  {
    nom: 'Producteurs et tourneurs',
    situation: 'Une date dans la région, une fiche technique à honorer, un prestataire local à trouver.',
    vous: {
      label: 'Vous transmettez',
      points: ['Le rider et le plan de scène'],
    },
    nous: [
      'Une réponse ligne par ligne : fourni à l’identique, équivalence proposée, vient avec la tournée',
      'Aucune substitution sans l’accord écrit de votre régisseur',
    ],
    resultat: 'Votre équipe arrive sur un plateau conforme à ce qui a été validé.',
    contact: CONTACT_TECHNIQUE,
  },
  {
    nom: 'Salles et lieux de diffusion',
    situation: 'Une date qui dépasse le parc de la salle, un régisseur absent, un événement hors les murs.',
    vous: {
      label: 'Vous gardez',
      points: ['Votre régisseur, votre installation, vos consignes de sécurité'],
    },
    nous: [
      'Un complément en sonorisation ou en éclairage',
      'Un technicien en renfort pour le montage et l’exploitation',
    ],
    resultat: 'Votre date se tient sans immobiliser un parc utilisé quelques soirs par an.',
    contact: CONTACT_TECHNIQUE,
  },
]

function Publics() {
  return (
    <section
      className="section section--festival section--festival-publics"
      aria-labelledby="publics-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Pour qui"
          titre="Association, service culturel, producteur, salle : à qui s’adresse notre régie ?"
          id="publics-title"
          texte="Quatre types d’organisateurs, à Toulouse, en Haute-Garonne et en Occitanie. Le besoin de départ diffère pour chacun ; la méthode reste la même."
        />

        <ul className="publics">
          {PUBLICS.map((profil) => (
            <li className="public" key={profil.nom}>
              <h3 className="public__nom">{profil.nom}</h3>
              <p className="public__situation">{profil.situation}</p>

              <dl className="public__partage">
                <dt>{profil.vous.label}</dt>
                <dd>
                  <ul className="fest-puces fest-puces--evidees">
                    {profil.vous.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </dd>
                <dt>Nous reprenons</dt>
                <dd>
                  <ul className="fest-puces">
                    {profil.nous.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </dd>
              </dl>

              <p className="public__resultat">{profil.resultat}</p>

              <div className="public__liens">
                <a className="fest-lien" href={profil.contact}>
                  Présenter votre événement
                  <Arrow className="fest-lien__fleche" />
                </a>
                {profil.lien ? (
                  <a className="public__lien-annexe" href={profil.lien.href}>
                    {profil.lien.libelle}
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>

        <ul className="fest-sorties">
          <li>
            Uniquement du son, de la lumière ou un technicien pour une date ?{' '}
            <a href={PRESTATION_TECHNIQUE}>Voir nos prestations techniques</a>.
          </li>
          <li>
            Du matériel sans technicien ?{' '}
            <a href="/nos-services/location-de-materiel">Voir la location de matériel</a>.
          </li>
          <li>
            Une soirée d’entreprise avec un concert ?{' '}
            <a href="/nos-services/evenements-entreprise">
              Voir la page Événements d’entreprise
            </a>
            .
          </li>
        </ul>
      </div>
    </section>
  )
}

/* ---- S3 · Ce que nous prenons en charge ----
   Six postes, en cartes éclairées comme la méthode de l'accueil : ce
   que nous faisons, puis, en pied, ce que vous recevez, ce que cela
   change et ce qui reste de votre côté. Les six ne forment pas une
   séquence : pas de numéros. */

const POSTES: {
  nom: string
  faire: string[]
  recevez: string
  change: string
  reste?: string
}[] = [
  {
    nom: 'La régie générale',
    faire: [
      'Le document de référence, daté et versionné : plan, planning de montage, ordre de passage, contacts, points en attente',
      'La coordination de vos prestataires, de vos bénévoles et de nos techniciens',
      'Une présence sur le site du montage au démontage [à valider : présence en semaine]',
    ],
    recevez: 'La feuille de route de l’événement et le planning de montage, jour par jour.',
    change: 'Chaque intervenant sait à quelle heure il arrive, où il se branche et qui appeler.',
  },
  {
    nom: 'Le plan de scène et le plan du site',
    faire: [
      'Le repérage : accès des véhicules, électricité, sol, acoustique, voisinage',
      'Un plan d’implantation coté : scène, régie façade, loges, buvette, entrées, sorties, accès des secours',
      'Le plan de scène et le patch de chaque artiste, d’après sa fiche technique',
    ],
    recevez: 'Le plan d’implantation coté, le plan de scène et le patch de chaque artiste.',
    change: 'Place, câblage et puissance se règlent sur plan, avant le premier camion.',
  },
  {
    nom: 'Le planning des artistes',
    faire: [
      'Chaque fiche technique lue, et une réponse écrite au régisseur de l’artiste',
      'Arrivées, installation, balances, repas, passages, changements de plateau',
      'Chaque changement de plateau chronométré à l’avance, avec qui déplace quoi',
    ],
    recevez: 'La réponse à chaque fiche technique, le planning des balances et la conduite minute par minute.',
    change: 'Les balances sont finies avant l’ouverture des portes, et le premier groupe joue à l’heure.',
    reste: 'La programmation, les contrats et la rémunération des artistes.',
  },
  {
    nom: 'La sécurité et les flux',
    faire: [
      'Les emprises et les circulations : files d’entrée, sorties, voies des secours, séparation public et zones techniques',
      'Les pièces techniques de votre dossier de sécurité',
      'Le jour J, la coordination de votre service de sécurité et de vos secouristes',
    ],
    recevez: 'Le plan des flux, les fiches des installations et l’attestation de bon montage des structures démontables.',
    change: 'La mairie instruit un dossier complet dès la première version.',
    reste: 'La signature des déclarations, les contrats de sécurité et de secours. Oysen ne fournit ni agents de sécurité ni secouristes.',
  },
  {
    nom: 'L’accueil du public',
    faire: [
      'L’éclairage des cheminements, la sonorisation des annonces, la signalétique',
      'Des emplacements pour les personnes à mobilité réduite, avec vue dégagée sur la scène',
      'Le niveau sonore mesuré en régie [à confirmer], l’information du public et les protections auditives',
    ],
    recevez: 'Le plan d’accueil, intégré au plan d’implantation.',
    change: 'Le public trouve l’entrée, le bar et la sortie sans guide, de jour comme de nuit.',
    reste: 'La billetterie, le contrôle des entrées et la buvette.',
  },
  {
    nom: 'La logistique',
    faire: [
      'Livraisons, stockage, montage, démontage et remise en état du site',
      'Une distribution électrique dimensionnée sur les puissances réelles de chaque poste',
      'Le raccordement par un électricien habilité [à valider]',
    ],
    recevez: 'Le planning des livraisons, le bilan de puissance et l’état des lieux de sortie.',
    change: 'Le site est rendu à la date prévue, dans l’état où vous l’avez reçu.',
  },
]

const FACONS = [
  {
    nom: 'La régie générale et la technique',
    texte: 'Nous tenons les six postes, sous votre direction.',
  },
  {
    nom: 'La technique complète',
    texte: 'Vous gardez la régie générale ; nous prenons le son, la lumière et le plateau.',
  },
  {
    nom: 'Un lot',
    texte: 'La sonorisation d’une scène, l’éclairage d’un site, un technicien en renfort.',
    lien: { href: PRESTATION_TECHNIQUE, libelle: 'Voir nos prestations techniques' },
  },
]

function Postes() {
  return (
    <section
      className="section section--festival section--festival-postes"
      aria-labelledby="postes-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Ce que nous prenons en charge"
          titre="Régie générale, plateau, public, logistique : ce que nous prenons en charge"
          id="postes-title"
          texte="Six postes sur un festival ou un événement culturel. Vous pouvez nous confier l’ensemble, la technique seule, ou un seul lot. [À valider bloc par bloc avec Mathis]"
          centree
        />

        <ul className="postes">
          {POSTES.map((poste) => (
            <li className="poste" key={poste.nom}>
              <h3 className="poste__nom">{poste.nom}</h3>
              <ul className="fest-puces">
                {poste.faire.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <dl className="poste__pied">
                <dt>Vous recevez</dt>
                <dd>{poste.recevez}</dd>
                <dt>Ce que cela change</dt>
                <dd className="poste__change">{poste.change}</dd>
                {poste.reste ? (
                  <>
                    <dt>Reste de votre côté</dt>
                    <dd className="poste__reste">{poste.reste}</dd>
                  </>
                ) : null}
              </dl>
            </li>
          ))}
        </ul>

        <div className="facons">
          <p className="facons__titre">Trois façons de travailler avec nous</p>
          <ol className="facons__liste">
            {FACONS.map((facon) => (
              <li className="facon" key={facon.nom}>
                <h3 className="facon__nom">{facon.nom}</h3>
                <p className="facon__texte">{facon.texte}</p>
                {facon.lien ? (
                  <a className="fest-lien" href={facon.lien.href}>
                    {facon.lien.libelle}
                    <Arrow className="fest-lien__fleche" />
                  </a>
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        <Action />
      </div>
    </section>
  )
}

/* ---- S4 · Les cinq contraintes ----
   La section la plus longue, et la plus utile à un organisateur. Sur
   ordinateur, un sommaire reste en vue à gauche ; à droite, les cinq
   contraintes, chacune refermée sur sa phrase à retenir. Les sources
   sont citées en mono, comme dans un dossier. Tout reste affiché. */

const DEMARCHES = [
  {
    demarche: 'Événement sur l’espace public à Toulouse',
    regle: 'Déclaration au moins 3 mois avant ; 4 mois dans un bâtiment ou une enceinte close, ou au-delà de 5 000 personnes. Dossier de sécurité, s’il est exigé, 2 mois avant au plus tard.',
    qui: 'L’organisateur',
    reference: 'Mairie de Toulouse, Guichet unique événementiel',
  },
  {
    demarche: 'Manifestation culturelle à but lucratif de plus de 1 500 personnes, public et personnel compris',
    regle: 'Déclaration au maire 1 mois au moins et 1 an au plus avant la date.',
    qui: 'L’organisateur',
    reference: 'Code de la sécurité intérieure, art. R. 211-22',
  },
  {
    demarche: 'Activité d’entrepreneur de spectacles',
    regle: 'Aucune formalité jusqu’à 6 représentations par an si le spectacle n’est pas l’activité principale ; chaque spectacle compte pour une. Au-delà, déclaration en ligne, récépissé valable 5 ans.',
    qui: 'L’organisateur',
    reference: 'Service-public, fiche vérifiée le 5 avril 2024',
  },
  {
    demarche: 'Emploi d’artistes ou de techniciens par un organisateur occasionnel',
    regle: 'Déclarations et cotisations par le Guso, gratuit et obligatoire.',
    qui: 'L’organisateur employeur',
    reference: 'Agence culturelle Grand Est, guide de la sécurité',
  },
  {
    demarche: 'Buvette temporaire d’une association',
    regle: 'Demande au maire au moins 15 jours avant ; 5 autorisations par an au plus ; boissons des groupes 1 et 3.',
    qui: 'L’association',
    reference: 'Service-public, fiche vérifiée le 16 mai 2024',
  },
  {
    demarche: 'Chapiteau, tente ou structure accueillant 50 personnes ou plus',
    regle: 'Extrait du registre de sécurité remis au maire 8 jours au moins avant l’ouverture.',
    qui: 'L’organisateur, avec le propriétaire de la structure',
    reference: 'Règlement de sécurité, établissements de type CTS',
  },
]

const SECURITE = [
  {
    objet: 'Les structures',
    texte: 'Scènes, tribunes, tours et supports d’équipements scéniques : notice technique du fabricant, attestation de bon montage de l’installateur, dossier de sécurité tenu par l’organisateur, inspection visuelle avant toute admission du public. Nous réunissons ces pièces et les versons à votre dossier.',
    source: 'Arrêté du 25 juillet 2022, en vigueur depuis le 1er octobre 2022',
  },
  {
    objet: 'Le niveau sonore',
    texte: 'Jamais plus de 102 dB(A) ni 118 dB(C) sur 15 minutes, en aucun endroit accessible au public. Information sur les risques auditifs, protections auditives gratuites, zones ou périodes de repos ; au-delà de 300 personnes, niveaux enregistrés et affichés en régie. Nous réglons le système pour tenir ces plafonds au point le plus exposé.',
    source: 'Code de la santé publique, art. R. 1336-1 ; guide Sons amplifiés',
  },
  {
    objet: 'Les secours',
    texte: 'Le dispositif prévisionnel de secours se dimensionne d’après la jauge, le comportement attendu du public, le site et le délai d’arrivée des secours publics. Seule une association agréée de sécurité civile peut l’assurer : nous lui réservons un emplacement et un accès sur le plan, et l’intégrons aux contacts du jour J.',
    source: 'Référentiel national du 7 novembre 2006 ; guide de la sécurité, DPS',
  },
]

const NIVEAUX_METEO = [
  { nom: 'Poursuite', texte: 'avec protections' },
  { nom: 'Interruption', texte: 'le public se replie' },
  { nom: 'Annulation', texte: 'annoncée au public' },
]

const PLAN_METEO = [
  'Qui surveille la météo',
  'Quel seuil déclenche quelle action',
  'Qui décide',
  'Qui l’annonce au public',
  'Où le public se replie',
]

const NIVEAUX_BUDGET = [
  {
    nom: 'Exigé',
    texte: 'Par la sécurité et les fiches techniques : distribution électrique, structures, secours des équipements critiques.',
    note: 'Ne se réduit pas',
  },
  {
    nom: 'Confort',
    texte: 'Ce qui améliore l’accueil du public et des artistes.',
    note: 'Vous arbitrez',
  },
  {
    nom: 'Option',
    texte: 'Ce qui relève du choix.',
    note: 'Vous arbitrez',
  },
]

const REPARTITION = [
  ['Accueil, information du public, signalétique', 'Accroche et levage'],
  ['Buvette et restauration des équipes', 'Raccordements électriques'],
  ['Manutention légère, installation du mobilier', 'Montage des structures'],
  ['Accompagnement des artistes entre loges et scène', 'Conduite d’engins'],
  ['Rangement et nettoyage du site', 'Exploitation du son et de la lumière'],
]

const SOMMAIRE = [
  { id: 'contrainte-autorisations', nom: 'Les autorisations' },
  { id: 'contrainte-securite', nom: 'La sécurité' },
  { id: 'contrainte-meteo', nom: 'Le plan B météo' },
  { id: 'contrainte-budget', nom: 'Le budget contraint' },
  { id: 'contrainte-benevoles', nom: 'Les équipes bénévoles' },
]

/* Une contrainte : son titre, son contenu, sa phrase à retenir. */
function Contrainte({
  id,
  nom,
  chute,
  children,
}: {
  id: string
  nom: string
  chute: string
  children: ReactNode
}) {
  return (
    <article className="contrainte" aria-labelledby={id}>
      <h3 className="contrainte__nom" id={id}>
        {nom}
      </h3>
      {children}
      <p className="contrainte__chute">{chute}</p>
    </article>
  )
}

function Contraintes() {
  return (
    <section
      className="section section--festival section--festival-contraintes"
      aria-labelledby="contraintes-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Contraintes maîtrisées"
          titre="Autorisations, sécurité, météo, budget, bénévoles : les cinq contraintes d’un festival"
          id="contraintes-title"
          texte="Pour chacune, comment nous la traitons, et ce qui reste de votre responsabilité d’organisateur."
        />

        <div className="contraintes">
          <nav className="contraintes__sommaire" aria-label="Les cinq contraintes">
            <ol>
              {SOMMAIRE.map((entree) => (
                <li key={entree.id}>
                  <a href={`#${entree.id}`}>{entree.nom}</a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="contraintes__corps">
            <Contrainte
              id="contrainte-autorisations"
              nom="Les autorisations"
              chute="Aucune autorisation ne se découvre à un mois de la date : elles figurent au rétroplanning dès le premier jour."
            >
              <p className="contrainte__texte">
                Les déclarations sont signées par l’organisateur. Notre part :
                vous dire lesquelles vous concernent, les inscrire au
                rétroplanning et fournir les pièces techniques qui les
                accompagnent (plan coté, emprises, horaires, fiches des
                installations).
              </p>

              <div className="fest-tableau">
                <table className="demarches">
                  <caption className="demarches__legende">
                    Les principales démarches, à jour au 4 octobre 2026
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Démarche</th>
                      <th scope="col">Règle</th>
                      <th scope="col">Qui la porte</th>
                      <th scope="col">Référence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMARCHES.map((ligne) => (
                      <tr key={ligne.demarche}>
                        <th scope="row">{ligne.demarche}</th>
                        <td data-label="Règle">{ligne.regle}</td>
                        <td className="demarches__qui" data-label="Qui la porte">
                          {ligne.qui}
                        </td>
                        <td className="demarches__reference" data-label="Référence">
                          {ligne.reference}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="fest-puces contrainte__notes">
                <li>
                  Hors de Toulouse, chaque commune fixe ses délais : nous les
                  relevons auprès de la mairie dès le cadrage.
                </li>
                <li>
                  La déclaration des œuvres diffusées à la Sacem revient elle aussi
                  à l’organisateur.
                </li>
              </ul>
            </Contrainte>

            <Contrainte
              id="contrainte-securite"
              nom="La sécurité"
              chute="Vous savez avant l’ouverture ce qui est installé, qui l’a monté et qui en répond."
            >
              <ul className="securite">
                {SECURITE.map((item) => (
                  <li className="securite__item" key={item.objet}>
                    <p className="securite__objet">{item.objet}</p>
                    <p className="securite__texte">{item.texte}</p>
                    <p className="fest-source">{item.source}</p>
                  </li>
                ))}
              </ul>
            </Contrainte>

            <Contrainte
              id="contrainte-meteo"
              nom="Le plan B météo"
              chute="La décision d’interrompre se prend en une minute, parce qu’elle a été écrite un mois plus tôt."
            >
              <p className="contrainte__texte">
                En plein air, les seuils de décision sont écrits à l’avance. Pour
                le vent, c’est celui de la notice de la scène ou de la structure :
                atteint, la structure est évacuée. Pour la pluie et l’orage, trois
                niveaux fixés avec vous :
              </p>
              <ol className="meteo">
                {NIVEAUX_METEO.map((niveau) => (
                  <li className="meteo__niveau" key={niveau.nom}>
                    <span className="meteo__nom">{niveau.nom}</span>
                    <span className="meteo__texte">{niveau.texte}</span>
                  </li>
                ))}
              </ol>
              <div className="meteo__plan">
                <p className="contrainte__label">Le plan météo tient en une page</p>
                <ul className="fest-puces">
                  {PLAN_METEO.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
              <p className="contrainte__texte">
                Régies, consoles et alimentations sont protégées de la pluie dès le
                montage, que le ciel soit dégagé ou non.
              </p>
            </Contrainte>

            <Contrainte
              id="contrainte-budget"
              nom="Le budget contraint"
              chute="Vous savez ce qui peut être retiré sans risque, et ce qui ne le peut pas."
            >
              <p className="contrainte__texte">
                Notre proposition sépare trois niveaux, poste par poste. Chaque
                ligne du devis dit ce qu’elle couvre.
              </p>
              <ol className="budget-niveaux">
                {NIVEAUX_BUDGET.map((niveau) => (
                  <li className="budget-niveau" key={niveau.nom}>
                    <span className="budget-niveau__nom">{niveau.nom}</span>
                    <span className="budget-niveau__texte">{niveau.texte}</span>
                    <span className="budget-niveau__note">{niveau.note}</span>
                  </li>
                ))}
              </ol>
              <p className="contrainte__texte">
                Du matériel prêté par la mairie ou une autre association ? Nous le
                vérifions et l’intégrons au plan lorsqu’il convient.
              </p>
            </Contrainte>

            <Contrainte
              id="contrainte-benevoles"
              nom="Les équipes bénévoles"
              chute="Vos bénévoles savent quoi faire, et savent ce qu’ils ne doivent pas toucher."
            >
              <p className="contrainte__texte">
                Un bénévole s’engage librement, sans rémunération ni lien de
                subordination, et ne peut pas se voir confier les travaux réservés
                à des personnes qualifiées ou habilitées.
              </p>
              <p className="fest-source">Guide de la sécurité, les bénévoles</p>

              <div className="fest-tableau">
                <table className="repartition">
                  <caption className="demarches__legende">
                    Notre règle de travail, au-delà du minimum légal
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Confié aux bénévoles</th>
                      <th scope="col">Confié à des techniciens qualifiés</th>
                    </tr>
                  </thead>
                  <tbody>
                    {REPARTITION.map(([benevoles, techniciens]) => (
                      <tr key={benevoles}>
                        <td>{benevoles}</td>
                        <td className="repartition__technicien">{techniciens}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="fest-puces contrainte__notes">
                <li>Une fiche par mission, un référent technique par équipe</li>
                <li>Une réunion des bénévoles avant l’ouverture, pour les consignes</li>
                <li>L’assurance de vos bénévoles reste celle de votre association</li>
              </ul>
            </Contrainte>
          </div>
        </div>

        <Action />
      </div>
    </section>
  )
}

/* ---- S5 · Ce que vous pouvez vérifier ----
   Aucun festival n'est encore documenté : la version de lancement liste
   ce qui se vérifie avant toute commande, sans rien inventer. Les cas
   (format STAR, deux au plus) attendent dans CAS, vide ; la section passe
   au titre « Un événement que nous avons tenu » dès qu'il y en a un.

   Règles de publication d'un cas : accord écrit de l'organisateur avant
   toute citation (nom, logo, photo, chiffre) ; aucun artiste nommé ni
   reconnaissable sans son accord ; mention « Réalisé par notre fondateur
   avant la création d'Oysen. » si l'événement précède Oysen ; un
   événement tenu comme bénévole se présente comme tel ; un incident
   raconté avec sa résolution vaut mieux qu'un récit sans accroc.
   Le témoignage reste masqué tant qu'aucun n'est validé par écrit. */

const VERIFICATIONS: { titre: string; texte: string; lien?: { href: string; libelle: string } }[] = [
  {
    titre: 'La réponse à votre fiche technique',
    texte: `Envoyez-la : sous ${DELAI_REPONSE_H} h, une réponse ligne par ligne, avant tout devis. Vous jugez notre lecture sur votre propre document.`,
  },
  {
    titre: 'Le matériel',
    texte: 'Notre sonorisation et notre éclairage nous appartiennent. Vous pouvez les voir, et en recevoir la liste détaillée, avant de vous engager.',
    lien: { href: PRESTATION_TECHNIQUE, libelle: 'Voir nos prestations techniques' },
  },
  {
    titre: 'Les documents de préparation',
    texte: 'Dès le premier échange, ceux d’un événement déjà tenu : plan d’implantation, planning de montage, conduite. [À valider : documents réels, anonymisés]',
  },
  {
    titre: 'Les événements déjà tenus',
    texte: `${NB_EVENEMENTS} événements, dont [X] concerts ou spectacles et [X] en extérieur ; jauge la plus élevée : [X] personnes. [À préciser : ceux réalisés avant la création d’Oysen]`,
    lien: { href: '/nos-souvenirs', libelle: 'Voir nos événements' },
  },
  {
    titre: 'La personne qui pilote',
    texte: 'Mathis Amato, fondateur d’Oysen, ingénieur de formation en génie civil et technicien du spectacle depuis [2014]. [À valider avec Mathis]',
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

function Preuves() {
  const avecCas = CAS.length > 0
  return (
    <section
      className="section section--festival section--festival-preuves"
      aria-labelledby="fest-preuves-title"
    >
      <div className="section__inner">
        <div className="fest-verifier">
          <Tete
            surtitre="Avant de signer"
            titre={
              avecCas
                ? 'Un événement que nous avons tenu'
                : 'Ce que vous pouvez vérifier avant de nous confier votre plateau'
            }
            id="fest-preuves-title"
            texte="Oysen est une entreprise récente et ne présente ici que ce qu’elle peut prouver. Cinq éléments se vérifient avant toute commande."
          />

          <ul className="fest-verifier__liste">
            {VERIFICATIONS.map((item) => (
              <li className="fest-verifier__item" key={item.titre}>
                <h3 className="fest-verifier__titre">{item.titre}</h3>
                <p className="fest-verifier__texte">{item.texte}</p>
                {item.lien ? (
                  <a className="fest-lien" href={item.lien.href}>
                    {item.lien.libelle}
                    <Arrow className="fest-lien__fleche" />
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        {avecCas ? (
          <ul className="fest-cas">
            {CAS.map((cas) => (
              <li className="fest-cas__item" key={cas.titre}>
                <h3 className="fest-cas__titre">{cas.titre}</h3>
                <dl className="fest-cas__star">
                  <dt>La demande</dt>
                  <dd>{cas.situation}</dd>
                  <dt>Ce qui nous a été confié</dt>
                  <dd>{cas.tache}</dd>
                  <dt>Ce que nous avons mis en place</dt>
                  <dd>{cas.action}</dd>
                  <dt>Le jour J</dt>
                  <dd>{cas.resultat}</dd>
                </dl>
                {cas.avantOysen ? (
                  <p className="fest-cas__mention">
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

/* ---- S6 · Les moyens techniques ----
   Ce qui nous appartient, losange plein ; ce que nous faisons venir,
   losange évidé. La colonne « Page détaillée » attend les pages du silo
   Prestations techniques : aucune n'est publiée, aucun lien n'est activé
   ligne par ligne. Le bouton mène à la page Prestation technique. */

const MOYENS = [
  {
    domaine: 'Sonorisation',
    propre: 'Système de diffusion jusqu’à [300 à 400] personnes en extérieur, consoles, micros, retours [marques, modèles et puissances à lister]',
    partenaires: 'Système complémentaire au-delà de cette jauge, ou matériel exigé par une fiche technique',
  },
  {
    domaine: 'Éclairage',
    propre: 'Parc d’éclairage de scène et de mise en lumière de site [détail à fournir]',
    partenaires: 'Projecteurs spécifiques demandés par une fiche technique',
  },
  {
    domaine: 'Scène et structures',
    propre: '[Aucune à ce jour ; structure aluminium prévue au plan d’investissement]',
    partenaires: 'Scène, praticables, ponts et pieds de levage, montés par l’installateur, avec notice et attestation de bon montage',
  },
  {
    domaine: 'Vidéo et écran',
    propre: '[Aucun à ce jour ; écran LED prévu au plan d’investissement]',
    partenaires: 'Écran LED, projection, captation',
  },
  {
    domaine: 'Distribution électrique',
    propre: '[À confirmer : armoires et câblage en propre]',
    partenaires: 'Groupe électrogène, armoires, raccordement par un électricien habilité',
  },
  {
    domaine: 'Liaisons de régie',
    propre: '[À confirmer : intercom, talkies]',
    partenaires: 'Complément selon le nombre de postes',
  },
  {
    domaine: 'Équipe',
    propre: 'Le régisseur qui prépare votre événement et se trouve sur le site',
    partenaires: 'Techniciens son, lumière et plateau de notre réseau, indépendants et intermittents, choisis selon la jauge et le nombre de scènes',
  },
]

const NOTES_MOYENS = [
  {
    titre: 'Contrôlé avant chaque départ',
    texte: 'Le matériel est vérifié sur liste au dépôt, puis testé sur le site avant l’arrivée du public. Les équipements dont dépend le spectacle ont un secours sur place : [console, micros, amplification : à confirmer].',
  },
  {
    titre: 'Notre limite',
    texte: 'Notre sonorisation couvre jusqu’à [300 à 400] personnes en extérieur. Au-delà, nous complétons avec nos partenaires ; si votre événement dépasse ce que nous pouvons tenir, nous vous le disons dès le premier échange et vous orientons vers un confrère.',
  },
  {
    titre: 'Votre matériel et vos techniciens',
    texte: 'Scène municipale, parc associatif, équipe technique : nous les intégrons au plan et précisons par écrit qui fournit, qui installe et qui exploite.',
  },
  {
    titre: 'Garanties',
    texte: `Oysen est assurée en responsabilité civile professionnelle (${RC_PRO}) ; l’attestation est jointe à chaque proposition.`,
  },
]

function Moyens() {
  return (
    <section
      className="section section--festival section--festival-moyens"
      aria-labelledby="moyens-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Moyens techniques"
          titre="Quels moyens techniques pouvons-nous mobiliser pour votre événement ?"
          id="moyens-title"
          texte="Notre sonorisation et notre éclairage nous appartiennent ; la scène, les structures, la vidéo et l’électricité viennent de partenaires, sous une coordination unique. Vous savez qui fournit quoi avant de signer."
        />

        <div className="fest-tableau">
          <table className="moyens">
            <caption className="sr-only">
              Moyens techniques : ce qui appartient à Oysen, ce qui vient de ses partenaires
            </caption>
            <thead>
              <tr>
                <th scope="col">Domaine</th>
                <th scope="col" className="moyens__propre">
                  En propre
                </th>
                <th scope="col" className="moyens__partenaires">
                  Avec nos partenaires
                </th>
              </tr>
            </thead>
            <tbody>
              {MOYENS.map((ligne) => (
                <tr key={ligne.domaine}>
                  <th scope="row">{ligne.domaine}</th>
                  <td className="moyens__propre" data-label="En propre">
                    {ligne.propre}
                  </td>
                  <td className="moyens__partenaires" data-label="Avec nos partenaires">
                    {ligne.partenaires}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="moyens__notes">
          {NOTES_MOYENS.map((note) => (
            <li className="moyens__note" key={note.titre}>
              <h3 className="moyens__note-titre">{note.titre}</h3>
              <p>{note.texte}</p>
            </li>
          ))}
        </ul>

        <Action href={PRESTATION_TECHNIQUE}>Voir nos prestations techniques</Action>
      </div>
    </section>
  )
}

/* ---- S7 · Les questions ----
   Onze questions, en dépliants comme la FAQ de l'accueil. */

const QUESTIONS = [
  {
    q: 'Avez-vous l’expérience nécessaire pour gérer la technique d’un spectacle ?',
    a: `Oysen est une entreprise récente ; son fondateur tient des postes techniques sur des événements avec public depuis [2014] : sonorisation, éclairage, installation, coordination. [À valider avec Mathis] Vérifiez-le avant de vous engager : envoyez-nous une fiche technique, nous y répondons ligne par ligne sous ${DELAI_REPONSE_H} h.`,
  },
  {
    q: 'Avez-vous suffisamment de matériel pour notre événement ?',
    a: 'Notre sonorisation couvre jusqu’à [300 à 400] personnes en extérieur, et notre éclairage équipe une scène de cette taille. Au-delà, ou pour une scène, des structures ou un écran, nous complétons avec des partenaires de notre réseau. Notre proposition indique, ligne par ligne, ce qui nous appartient et ce qui est loué.',
  },
  {
    q: 'Combien coûte la prestation technique d’un festival ?',
    a: 'Chaque événement fait l’objet d’un devis détaillé, poste par poste, après un repérage ou l’étude de votre fiche technique. Cinq éléments le déterminent : la jauge, le nombre de scènes, le nombre de jours, les fiches techniques des artistes, et ce que le site fournit déjà en électricité et en structures. Pour chiffrer : la date, le lieu, le type d’événement, la jauge et la durée.',
  },
  {
    q: 'Pouvez-vous prendre en charge une partie seulement de la technique ?',
    a: 'Oui, à trois niveaux : la régie générale et la technique, la technique complète sous la direction de votre régisseur, ou un seul lot, comme la sonorisation d’une scène ou un technicien en renfort. Le périmètre est écrit dans la proposition : ce que nous fournissons, installons et exploitons.',
  },
  {
    q: 'Travaillez-vous avec nos techniciens et nos bénévoles ?',
    a: 'Oui. Vos techniciens gardent leurs postes, et nous précisons par écrit qui exploite quoi. Vos bénévoles reçoivent une fiche par mission et un référent technique. L’accroche, le levage et les raccordements électriques restent confiés à des techniciens qualifiés.',
  },
  {
    q: 'Comment traitez-vous la fiche technique d’un artiste ?',
    a: 'Elle est lue ligne par ligne, puis reçoit une réponse écrite adressée au régisseur de l’artiste : le matériel fourni à l’identique, les équivalences proposées, ce qui doit venir avec l’artiste. Aucune substitution sans son accord écrit. La réponse validée sert de base au plan de scène, au patch et au planning des balances.',
  },
  {
    q: 'Que se passe-t-il en cas de panne pendant le spectacle ?',
    a: 'Les équipements dont dépend le spectacle ont un secours sur place [console, micros, amplification : à confirmer]. Le matériel est contrôlé avant le départ et testé avant l’ouverture des portes. Le technicien qui exploite le système est celui qui l’a installé : en cas d’incident, il bascule sur le secours pendant que le régisseur informe la scène.',
  },
  {
    q: 'Intervenez-vous sur plusieurs jours, et en pleine saison ?',
    a: `Oui, sur des événements d’un à plusieurs jours, montage et démontage compris [à valider : présence en semaine]. De mai à septembre, réservez votre date [quatre à six mois] à l’avance. Chaque date est confirmée par écrit ; si nous ne sommes pas disponibles, nous vous le disons sous ${DELAI_REPONSE_H} h.`,
  },
  {
    q: 'Quelles autorisations faut-il pour organiser un festival, et qui les demande ?',
    a: 'L’organisateur. À Toulouse, un événement sur l’espace public se déclare au moins 3 mois avant ; une manifestation culturelle à but lucratif de plus de 1 500 personnes, au maire 1 mois au moins avant ; une buvette associative, au maire 15 jours avant. Oysen fournit les pièces techniques : plan coté, emprises, horaires, fiches des installations.',
  },
  {
    q: 'Une association a-t-elle besoin d’une licence d’entrepreneur de spectacles ?',
    a: 'Non, tant qu’elle donne 6 représentations par an au plus et que le spectacle n’est pas son activité principale. Attention : chaque spectacle compte pour une représentation, un festival de plusieurs concerts peut dépasser le seuil en une édition. Au-delà, déclaration en ligne et récépissé valable 5 ans. Règles à jour au 4 octobre 2026 (Service-public, Artcena).',
  },
  {
    q: 'Combien de temps à l’avance faut-il vous contacter ?',
    a: '[Quatre à six mois avant la date. À valider.] Le temps de repérer le site, de répondre aux fiches techniques et de tenir les délais administratifs, dont les 3 mois demandés par la mairie de Toulouse pour l’espace public. Votre date est plus proche ? Écrivez-nous : le calendrier se resserre, la méthode reste la même.',
  },
]

function Questions() {
  return (
    <section
      className="section section--festival section--festival-questions"
      aria-labelledby="fest-questions-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Questions fréquentes"
          titre="Vos questions avant de nous confier la technique de votre événement"
          id="fest-questions-title"
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
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---- S8 · L'appel final ----
   La rampe violette de l'accueil, par le bas, et le même libellé que
   tous les boutons de la page. */

function Appel() {
  return (
    <section
      className="section section--appel section--festival-appel"
      aria-labelledby="festival-appel-title"
    >
      <div className="section__inner">
        <h2 className="section__title appel__title" id="festival-appel-title">
          Votre plateau,
          <br />
          prêt avant l’ouverture des portes.
        </h2>
        <p className="appel__lede">
          La date, le lieu, la jauge et, si vous l’avez, la fiche technique :
          nous vous répondons ligne par ligne.
        </p>
        <div className="appel__actions">
          <a className="btn btn--solid" href={CONTACT_FESTIVAL}>
            Présenter votre événement
          </a>
        </div>
        <ul className="appel__garanties">
          <li className="appel__garantie">
            <span className="appel__check" aria-hidden="true">
              ✓
            </span>
            Sans engagement
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
            Si votre projet n’est pas pour nous, on vous le dit
          </li>
        </ul>
      </div>
    </section>
  )
}

