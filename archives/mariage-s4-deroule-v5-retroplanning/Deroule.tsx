/* ---- S4 · Comment ça se passe ----
   Un vrai déroulé : huit étapes numérotées, parce que les formules s'y
   réfèrent (la partielle commence souvent à la 3, le jour J à la 5).
   Mis en page comme un rétroplanning d'organisateur : en tête, trois
   lignes, une par formule, qui partent au prorata de la frise (la
   complète tout à gauche, la partielle à la 3, le jour J à la 5) ;
   dessous, les huit étapes en colonnes, rang par rang. Tout le texte
   reste affiché. (Versions précédentes : archives/mariage-s4-deroule-*.) */

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

/* Les trois formules, chacune une ligne en tête du rétroplanning : elle
   part de l'étape où la formule commence et court jusqu'à la dernière. */
const VOIES = [
  { formule: 'Complète', depuis: 1, texte: 'les huit étapes' },
  { formule: 'Partielle', depuis: 3, texte: 'là où vous en êtes, souvent dès l’étape 3' },
  { formule: 'Jour J', depuis: 5, texte: 'les étapes 5 à 8, [trois mois] avant la date' },
]

const numero = (rang: number) => String(rang).padStart(2, '0')

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

        <div className="planning">
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

          {/* Sous les lignes, quand les étapes s'empilent : l'échelle de
              01 à 08 qui donne leurs départs. */}
          <p className="voies__echelle" aria-hidden="true">
            {ETAPES.map((etape, index) => (
              <span key={etape.titre}>{numero(index + 1)}</span>
            ))}
          </p>

          <ol className="planning__etapes">
            {ETAPES.map((etape, index) => (
              <li
                className={`planning__etape${etape.grandJour ? ' planning__etape--jour-j' : ''}`}
                key={etape.titre}
                style={{ '--col': index + 1 } as CSSProperties}
              >
                <p className="planning__numero">{numero(index + 1)}</p>
                <p className="planning__quand">{etape.quand}</p>
                <h3 className="planning__titre">{etape.titre}</h3>
                <p className="planning__nous">
                  <span className="planning__qui">Nous</span>
                  {etape.nous}
                </p>
                <p className="planning__vous">
                  <span className="planning__qui">Vous</span>
                  {etape.vous}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ---- S5 · La galerie ----
