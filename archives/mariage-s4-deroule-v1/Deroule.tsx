/* ---- S4 · Comment ça se passe ----
   Un vrai déroulé : huit étapes numérotées, parce que les formules s'y
   réfèrent (la partielle commence souvent à la 3, le jour J à la 5).
   Chaque étape dit ce que nous faisons, et ce qui reste de votre côté, à
   l'italique de faire-part. À droite, sur ordinateur, trois barres
   montrent d'un coup d'œil où chaque formule commence. */

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

/* Où chaque formule commence, en numéro d'étape. */
const DEPARTS = [
  { formule: 'Complète', depuis: 1, texte: 'les huit étapes' },
  { formule: 'Partielle', depuis: 3, texte: 'là où vous en êtes, souvent dès l’étape 3' },
  { formule: 'Jour J', depuis: 5, texte: 'les étapes 5 à 8, [trois mois] avant la date' },
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

        {/* La légende des formules, lisible partout. */}
        <ul className="departs">
          {DEPARTS.map((depart) => (
            <li className="depart" key={depart.formule}>
              <span className="depart__formule">{depart.formule}</span>
              <span className="depart__texte">{depart.texte}</span>
            </li>
          ))}
        </ul>

        <div className="deroule">
          <ol className="compte">
            {ETAPES.map((etape, index) => (
              <li
                className={`compte__etape${etape.grandJour ? ' compte__etape--jour-j' : ''}`}
                key={etape.titre}
              >
                <p className="compte__repere">
                  <span className="compte__numero">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {etape.quand}
                </p>
                <h3 className="compte__titre">{etape.titre}</h3>
                <p className="compte__nous">
                  <span className="compte__qui">Nous</span>
                  {etape.nous}
                </p>
                <p className="compte__vous">
                  <span className="compte__qui">Vous</span>
                  {etape.vous}
                </p>
              </li>
            ))}
          </ol>

          {/*
            Les trois barres, une par formule : de l'étape où elle commence
            jusqu'à la dernière. Décor, la légende au-dessus dit la même chose.
          */}
          <div className="couverture" aria-hidden="true">
            {DEPARTS.map((depart) => (
              <span
                className="couverture__barre"
                key={depart.formule}
                style={
                  {
                    '--depuis': depart.depuis,
                    '--total': ETAPES.length,
                  } as CSSProperties
                }
              >
                <span className="couverture__nom">{depart.formule}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
