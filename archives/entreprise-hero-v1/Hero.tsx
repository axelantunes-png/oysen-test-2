/* ---- S1 · Le hero ----
   Le texte à gauche : les formats, et un seul prestataire pour tout. La
   photo à droite, traitée pour la salle, et posé dessus l'extrait du
   conducteur. Sous les deux colonnes, trois preuves. */

const PREUVES = [
  'Toulouse, Haute-Garonne et Occitanie',
  'Son et lumière avec notre propre matériel',
  'Tout est testé avant l’arrivée du premier participant',
]

/* Un déroulé type, pas un événement réel : les heures sont un exemple.
   `essai` : la ligne se coche, c'est un test fait avant l'ouverture. */
const CONDUCTEUR: { heure: string; action: string; essai?: boolean }[] = [
  { heure: '07:30', action: 'Arrivée de l’équipe, accueil des prestataires' },
  { heure: '08:00', action: 'Son, lumière et vidéo testés', essai: true },
  { heure: '08:15', action: 'Micros de secours en place', essai: true },
  { heure: '08:30', action: 'Répétition des intervenants', essai: true },
  { heure: '09:00', action: 'Ouverture des portes' },
]

function Hero() {
  return (
    <section className="entreprise-hero" aria-labelledby="entreprise-title">
      <div className="entreprise-hero__lueur" aria-hidden="true" />

      <div className="entreprise-hero__inner">
        <div className="entreprise-hero__texte">
          {/* Le h1 est le surtitre, porteur de la requête (événements
              d'entreprise, Toulouse, Occitanie) ; la grande phrase en
              dessous reste l'accroche, en simple paragraphe. */}
          <h1 className="section__eyebrow" id="entreprise-title">
            Organisation d’événements d’entreprise · Toulouse et Occitanie
          </h1>
          <p className="entreprise-hero__titre">
            Un événement fidèle à vos valeurs, maîtrisé dans les moindres détails
          </p>
          <div className="entreprise-hero__lede">
            <p>
              Séminaire, soirée, convention, inauguration : un seul prestataire
              conçoit, coordonne et réalise votre événement, technique comprise.
            </p>
          </div>

          <div className="entreprise-hero__actions">
            <div className="entreprise-hero__appel">
              <a className="btn btn--solid" href={CONTACT_ENTREPRISE}>
                Présenter votre projet
              </a>
              <p className="entreprise-hero__rassurance">
                Premier échange sans engagement · réponse sous{' '}
                {DELAI_REPONSE_H}&nbsp;h
              </p>
            </div>
            {/*
              À RÉACTIVER quand la page partenaires existera (dès que le
              client aura ses partenaires) : vérifier son adresse, puis
              retirer le commentaire.

            <a className="lien-clair" href="/nos-partenaires">
              Découvrir nos partenaires
              <Arrow className="lien-clair__fleche" />
            </a>
            */}
          </div>
        </div>

        {/*
          À REMPLACER par une vraie photo d'un événement Oysen en
          configuration entreprise : une salle prête avant l'ouverture des
          portes, ou la régie pendant une prise de parole. À défaut, une
          photo de montage.
        */}
        <figure className="entreprise-hero__scene">
          <div className="entreprise-hero__photo">
            <img
              src="/images/services/evenement-entreprise-1200.jpg"
              srcSet="/images/services/evenement-entreprise-800.jpg 800w, /images/services/evenement-entreprise-1200.jpg 1200w"
              sizes="(min-width: 1024px) 40vw, 90vw"
              width={1200}
              height={1500}
              alt="Grand chapiteau vitré de nuit, guirlandes lumineuses et longues tablées dressées."
              decoding="async"
            />
          </div>

          {/* L'extrait du conducteur : ce qui se passe avant que le premier
              participant n'entre. */}
          <figcaption className="conducteur">
            <p className="conducteur__tete">
              <span>Conducteur · jour J</span>
              <span>Extrait type</span>
            </p>
            <ol className="conducteur__lignes">
              {CONDUCTEUR.map((ligne, rang) => (
                <li
                  className={`conducteur__ligne${ligne.essai ? ' conducteur__ligne--essai' : ''}`}
                  key={ligne.heure}
                  style={{ '--rang': rang } as CSSProperties}
                >
                  <span className="conducteur__heure">{ligne.heure}</span>
                  <span className="conducteur__action">{ligne.action}</span>
                  {ligne.essai ? (
                    <span className="conducteur__coche">
                      <span className="sr-only">(vérifié)</span>
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          </figcaption>
        </figure>
      </div>

      <ul className="entreprise-preuves">
        {PREUVES.map((preuve) => (
          <li key={preuve}>{preuve}</li>
        ))}
      </ul>
    </section>
  )
}

