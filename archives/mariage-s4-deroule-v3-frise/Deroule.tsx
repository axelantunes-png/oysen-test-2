/* ---- S4 · Comment ça se passe ----
   Un vrai déroulé : huit étapes numérotées, parce que les formules s'y
   réfèrent (la partielle commence souvent à la 3, le jour J à la 5).
   Une frise de gauche à droite, faite de trois lignes, une par formule :
   la complète part tout à gauche, la partielle à l'étape 3, le jour J à
   l'étape 5, chacune à sa place exacte sur la frise. Les étapes se
   posent en alternance au-dessus et au-dessous des lignes. Chacune dit
   ce que nous faisons, et ce qui reste de votre côté, à l'italique.
   (Versions précédentes : archives/mariage-s4-deroule-v1 et -v2-allee.) */

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

/* Les trois formules, chacune une ligne de la frise : elle part de
   l'étape où la formule commence et court jusqu'à la dernière. */
const VOIES = [
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

        <div className="frise-mariage">
          <ul className="voies">
            {VOIES.map((voie) => (
              <li
                className="voie"
                key={voie.formule}
                style={{ '--depuis': voie.depuis } as CSSProperties}
              >
                <span className="voie__nom">{voie.formule}</span>
                <span className="voie__texte">{voie.texte}</span>
              </li>
            ))}
          </ul>

          {/* Sur téléphone, l'échelle des huit étapes sous les lignes. */}
          <p className="voies__echelle" aria-hidden="true">
            {ETAPES.map((etape, index) => (
              <span key={etape.titre}>{String(index + 1).padStart(2, '0')}</span>
            ))}
          </p>

          <ol className="frise-mariage__etapes">
            {ETAPES.map((etape, index) => (
              <li
                className={`frise-mariage__etape${etape.grandJour ? ' frise-mariage__etape--jour-j' : ''}`}
                key={etape.titre}
                style={{ '--col': index + 1 } as CSSProperties}
              >
                <div className="frise-mariage__bloc">
                  <p className="frise-mariage__repere">
                    <span className="frise-mariage__numero">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {etape.quand}
                  </p>
                  <h3 className="frise-mariage__titre">{etape.titre}</h3>
                  <p className="frise-mariage__nous">
                    <span className="frise-mariage__qui">Nous</span>
                    {etape.nous}
                  </p>
                  <p className="frise-mariage__vous">
                    <span className="frise-mariage__qui">Vous</span>
                    {etape.vous}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

