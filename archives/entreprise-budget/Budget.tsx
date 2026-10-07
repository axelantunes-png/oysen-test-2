/* ---- S7 · Le budget ----
   Les montants entre crochets sont des repères du marché français en
   2026, pas les prix d'Oysen : Mathis vérifie que ses devis s'y situent
   avant publication.

   Version sans montant, si le choix de ne pas afficher de prix est
   maintenu : « Chaque événement fait l'objet d'une proposition détaillée,
   poste par poste, remise après un premier échange. Cinq éléments la
   déterminent : le nombre de participants, la durée, le lieu, la
   restauration et la technique mobilisée. Nous ne serons pas l'offre la
   moins chère ; chaque ligne de notre proposition dit ce qu'elle couvre,
   pour que vous puissiez la comparer à une autre. » */

const BUDGETS = [
  { format: 'Séminaire d’une journée', montant: '[100 à 250 €]', poids: 'Le lieu et la restauration' },
  { format: 'Séminaire avec une nuit sur place', montant: '[250 à 500 €]', poids: 'L’hébergement' },
  { format: 'Soirée d’entreprise', montant: '[100 à 250 €]', poids: 'Le traiteur et le lieu' },
  { format: 'Convention', montant: '[250 à 500 €]', poids: 'La scène, la vidéo et la régie' },
  { format: 'Journée de cohésion', montant: '[100 à 250 €]', poids: 'L’activité, le lieu et le repas' },
  { format: 'Lancement de produit', montant: 'Sur devis', poids: 'La mise en scène et la vidéo' },
  { format: 'Inauguration', montant: 'Sur devis', poids: 'La technique sur un site non équipé' },
]

const VARIABLES = [
  'Le nombre de participants et la durée',
  'Le lieu : standing, distance depuis Toulouse, salle équipée ou site nu',
  'La restauration : cocktail, buffet ou repas servi',
  'La technique : prises de parole, ou scène, écran et lumière complète',
  'Le nombre de prestataires à coordonner',
]

const PROPOSITION = [
  'Nos honoraires de conception et de coordination, et notre matériel, ligne par ligne',
  'Le lieu, le traiteur et les autres prestataires, chiffrés à part [À valider : facturés par chacun ou par Oysen]',
  'Aucun poste « divers » : chaque ligne se comprend, et se compare',
]

function Budget() {
  return (
    <section
      className="section section--entreprise section--entreprise-budget"
      aria-labelledby="budget-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Budget"
          titre="Quel budget prévoir pour un événement d’entreprise ?"
          id="budget-title"
          texte="Il se raisonne par participant. En 2026, comptez [100 à 250 € HT] par personne pour une journée de séminaire ou une soirée, lieu, restauration, technique et coordination compris. Le montant exact est fixé dans une proposition détaillée, après un premier échange."
        />

        <div className="budget-e">
          <table className="budget-e__table">
            <caption className="sr-only">
              Ordre de budget par format, hors taxes et par participant
            </caption>
            <thead>
              <tr>
                <th scope="col">Format</th>
                <th scope="col">HT par participant</th>
                <th scope="col">Ce qui pèse le plus</th>
              </tr>
            </thead>
            <tbody>
              {BUDGETS.map((ligne) => (
                <tr key={ligne.format}>
                  <th scope="row">{ligne.format}</th>
                  <td className="budget-e__montant">{ligne.montant}</td>
                  <td>{ligne.poids}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="budget-e__note">
            Ordres de grandeur du marché en 2026, tout compris, hors transport des
            participants. Ils situent un budget, ils ne remplacent pas un devis.
          </p>
        </div>

        <div className="budget-e__colonnes">
          <div>
            <h3 className="budget-e__titre">Ce qui fait varier votre budget</h3>
            <ul className="liste-losange">
              {VARIABLES.map((variable) => (
                <li key={variable}>{variable}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="budget-e__titre">Ce que contient notre proposition</h3>
            <ul className="liste-losange">
              {PROPOSITION.map((ligne) => (
                <li key={ligne}>{ligne}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className="entreprise-action">
          <a className="btn btn--solid" href={CONTACT_ENTREPRISE}>
            Recevoir une proposition détaillée
          </a>
        </p>
      </div>
    </section>
  )
}

