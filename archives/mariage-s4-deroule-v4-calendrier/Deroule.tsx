/* ---- S4 · Comment ça se passe ----
   Un vrai déroulé : huit étapes numérotées, parce que les formules s'y
   réfèrent (la partielle commence souvent à la 3, le jour J à la 5).
   Un calendrier qu'on parcourt : les huit étapes en une ligne, de
   gauche à droite, puis les trois formules, chacune une ligne qui part
   de son étape. Un curseur descend de l'étape choisie et traverse les
   formules : celles qui la comprennent s'allument. Dessous, une seule
   fiche à la fois, ce que nous faisons et ce qui reste de votre côté.
   Toutes les fiches sont dans la page, les autres simplement masquées.
   (Versions précédentes : archives/mariage-s4-deroule-v1, -v2-allee
   et -v3-frise.) */

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

/* Les trois formules, chacune une ligne sous le calendrier : elle part
   de l'étape où la formule commence et court jusqu'à la dernière. */
const VOIES = [
  { formule: 'Complète', depuis: 1, texte: 'les huit étapes' },
  { formule: 'Partielle', depuis: 3, texte: 'là où vous en êtes, souvent dès l’étape 3' },
  { formule: 'Jour J', depuis: 5, texte: 'les étapes 5 à 8, [trois mois] avant la date' },
]

const numero = (rang: number) => String(rang).padStart(2, '0')

function Deroule() {
  const [actif, setActif] = useState(1)
  const onglets = useRef<(HTMLButtonElement | null)[]>([])

  /* Les flèches parcourent les étapes, Début et Fin vont aux bouts. */
  const choisir = (rang: number, focus = false) => {
    const borne = Math.min(ETAPES.length, Math.max(1, rang))
    setActif(borne)
    if (focus) onglets.current[borne - 1]?.focus()
  }

  const clavier = (event: KeyboardEvent<HTMLDivElement>) => {
    const cible = {
      ArrowRight: actif + 1,
      ArrowLeft: actif - 1,
      Home: 1,
      End: ETAPES.length,
    }[event.key]
    if (cible === undefined) return
    event.preventDefault()
    choisir(cible, true)
  }

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

        <div className="calendrier" style={{ '--actif': actif } as CSSProperties}>
          <div className="calendrier__haut">
            {/* Les huit étapes, de gauche à droite : chacune ouvre sa fiche. */}
            <div
              className="calendrier__etapes"
              role="tablist"
              aria-label="Les huit étapes de l’organisation"
              onKeyDown={clavier}
            >
              {ETAPES.map((etape, index) => {
                const rang = index + 1
                const choisi = rang === actif
                return (
                  <button
                    className={`calendrier__onglet${choisi ? ' calendrier__onglet--actif' : ''}${etape.grandJour ? ' calendrier__onglet--jour-j' : ''}`}
                    type="button"
                    role="tab"
                    id={`etape-onglet-${rang}`}
                    aria-selected={choisi}
                    aria-controls={`etape-fiche-${rang}`}
                    tabIndex={choisi ? 0 : -1}
                    key={etape.titre}
                    style={{ '--rang': rang } as CSSProperties}
                    ref={(bouton) => {
                      onglets.current[index] = bouton
                    }}
                    onClick={() => choisir(rang)}
                  >
                    <span className="calendrier__repere">
                      <span className="calendrier__numero">{numero(rang)}</span>
                      <span className="calendrier__quand">{etape.quand}</span>
                    </span>
                    <span className="calendrier__losange" aria-hidden="true" />
                    <span className="calendrier__titre">{etape.titre}</span>
                  </button>
                )
              })}
            </div>

            {/* Les formules. Le curseur de l'étape choisie (dessiné par la
                liste) les traverse : celles qu'il croise s'allument, ce
                sont celles qui la comprennent. */}
            <ul className="voies">
              {VOIES.map((voie) => (
                <li
                  className={`voie${actif >= voie.depuis ? ' voie--comprise' : ''}`}
                  key={voie.formule}
                  style={{ '--depuis': voie.depuis } as CSSProperties}
                >
                  <span className="voie__nom">{voie.formule}</span>
                  <span className="voie__texte">{voie.texte}</span>
                </li>
              ))}
            </ul>

          </div>

          {/* Les fiches : une par étape, seule celle choisie est montrée. */}
          <div className="calendrier__fiches">
            {ETAPES.map((etape, index) => {
              const rang = index + 1
              const comprise = VOIES.filter((voie) => rang >= voie.depuis)
              return (
                <div
                  className={`fiche${etape.grandJour ? ' fiche--jour-j' : ''}`}
                  role="tabpanel"
                  id={`etape-fiche-${rang}`}
                  aria-labelledby={`etape-onglet-${rang}`}
                  hidden={rang !== actif}
                  key={etape.titre}
                >
                  <div className="fiche__tete">
                    <p className="fiche__repere">
                      <span className="fiche__numero">{numero(rang)}</span>
                      {etape.quand}
                    </p>
                    <h3 className="fiche__titre">{etape.titre}</h3>
                  </div>
                  <p className="fiche__nous">
                    <span className="fiche__qui">Nous</span>
                    {etape.nous}
                  </p>
                  <p className="fiche__vous">
                    <span className="fiche__qui">Vous</span>
                    {etape.vous}
                  </p>

                  <div className="fiche__pied">
                    <p className="fiche__formules">
                      Dans {comprise.length > 1 ? 'les formules' : 'la formule'}{' '}
                      {comprise.map((voie, rangVoie) => (
                        <span key={voie.formule}>
                          {rangVoie > 0 ? (rangVoie === comprise.length - 1 ? ' et ' : ', ') : null}
                          <span className="fiche__formule">{voie.formule}</span>
                        </span>
                      ))}
                    </p>
                    <p className="fiche__suite">
                      {rang > 1 ? (
                        <button
                          className="lien-doux fiche__bouton fiche__bouton--avant"
                          type="button"
                          onClick={() => choisir(rang - 1)}
                        >
                          <Arrow className="lien-doux__fleche" />
                          Étape précédente
                        </button>
                      ) : null}
                      {rang < ETAPES.length ? (
                        <button
                          className="lien-doux fiche__bouton"
                          type="button"
                          onClick={() => choisir(rang + 1)}
                        >
                          Étape suivante
                          <Arrow className="lien-doux__fleche" />
                        </button>
                      ) : null}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

