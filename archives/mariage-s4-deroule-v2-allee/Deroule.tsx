/* ---- S4 · Comment ça se passe ----
   Un vrai déroulé : huit étapes numérotées, parce que les formules s'y
   réfèrent (la partielle commence souvent à la 3, le jour J à la 5).
   Mis en page comme une allée de cérémonie : le temps descend au milieu,
   nous d'un côté, vous de l'autre, à l'italique de faire-part. L'allée
   compte un fil par formule en cours : un seul au départ, deux dès que la
   partielle commence, trois avec le jour J. Pas de cases, pas de filets
   entre les étapes, seulement l'espace et le fil.
   (Version précédente : archives/mariage-s4-deroule-v1.) */

const ETAPES = [
  {
    quand: '12 à 18 mois avant',
    titre: 'Le premier échange',
    nous: 'Écouter votre date, vos invités, votre budget. Vous remettre une proposition poste par poste.',
    vous: 'Nous racontez le mariage qui vous ressemble.',
  },
  {
    quand: '10 à 12 mois avant',
    titre: 'Le lieu',
    nous: 'Présélectionner et visiter les lieux : accès, électricité, acoustique, repli en cas de pluie.',
    vous: 'Visitez les deux ou trois qui le méritent, et choisissez.',
  },
  {
    quand: '8 à 10 mois avant',
    titre: 'Les prestataires',
    nous: 'Sélectionner traiteur, photographe, fleuriste ou DJ. Comparer leurs devis ligne par ligne.',
    vous: 'Rencontrez ceux que vous souhaitez, et tranchez.',
  },
  {
    quand: '4 à 6 mois avant',
    titre: 'L’ambiance',
    nous: 'Concevoir la lumière et le son, de la cérémonie à la soirée. Suivre la décoration.',
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
    vous: 'Soyez les invités de votre propre mariage.',
    grandJour: true,
  },
  {
    quand: 'Le soir ou le lendemain',
    titre: 'Le démontage et le bilan',
    nous: 'Démonter, récupérer notre matériel, revenir vers vous.',
    vous: 'Dites-nous ce que vous en avez retenu.',
  },
]

/* Où chaque formule commence, en numéro d'étape, et la place de son fil
   dans l'allée. */
const DEPARTS = [
  { formule: 'Complète', depuis: 1, fil: 'centre', texte: 'les huit étapes' },
  {
    formule: 'Partielle',
    depuis: 3,
    fil: 'gauche',
    texte: 'là où vous en êtes, souvent dès l’étape 3',
  },
  {
    formule: 'Jour J',
    depuis: 5,
    fil: 'droite',
    texte: 'les étapes 5 à 8, [trois mois] avant la date',
  },
]

function Deroule() {
  return (
    <section
      className="section section--mariage section--mariage-deroule"
      aria-labelledby="deroule-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Comment ça se passe"
          titre="Comment se déroule l’organisation de votre mariage, mois par mois ?"
          id="deroule-title"
          texte="Pour une organisation complète, idéalement 12 à 18 mois avant. Plus tard, le calendrier se resserre, la méthode reste la même."
        />

        {/* La légende des formules, en toutes lettres. */}
        <ul className="departs">
          {DEPARTS.map((depart) => (
            <li className="depart" key={depart.formule}>
              <span className="depart__formule">{depart.formule}</span>
              <span className="depart__texte">{depart.texte}</span>
            </li>
          ))}
        </ul>

        <div className="allee">
          {/* Les deux côtés de l'allée, nommés une fois sur ordinateur. */}
          <p className="allee__cotes" aria-hidden="true">
            <span>Nous</span>
            <span>Vous</span>
          </p>

          <ol className="allee__etapes">
            {ETAPES.map((etape, index) => {
              const rang = index + 1
              const fils = DEPARTS.filter((depart) => depart.depuis <= rang)
              const departs = DEPARTS.filter((depart) => depart.depuis === rang)
              return (
                <li
                  className={`allee__etape${etape.grandJour ? ' allee__etape--jour-j' : ''}`}
                  key={etape.titre}
                  style={{ '--rang': rang } as CSSProperties}
                >
                  {/* Les fils des formules en cours, et le départ de celles
                      qui commencent ici. Décor : la légende dit la même chose. */}
                  <span className="allee__fils" aria-hidden="true">
                    {fils.map((depart) => (
                      <i
                        className={`allee__fil allee__fil--${depart.fil}${depart.depuis === rang ? ' allee__fil--part' : ''}`}
                        key={depart.formule}
                      />
                    ))}
                    {departs.map((depart) => (
                      <span
                        className={`allee__depart allee__depart--${depart.fil}`}
                        key={depart.formule}
                      >
                        {depart.formule}
                      </span>
                    ))}
                  </span>

                  <div className="allee__cartouche">
                    <p className="allee__repere">
                      <span className="allee__numero">{String(rang).padStart(2, '0')}</span>
                      {etape.quand}
                    </p>
                    <h3 className="allee__titre">{etape.titre}</h3>
                  </div>
                  <p className="allee__nous">
                    <span className="allee__qui">Nous</span>
                    {etape.nous}
                  </p>
                  <p className="allee__vous">
                    <span className="allee__qui">Vous</span>
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

