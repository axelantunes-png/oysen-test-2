/* ---- S1 · Le hero ----
   La photo en fond, traitée pour la salle, sous ses projecteurs. Le texte
   à gauche ; à droite, la fiche technique annotée. Sous les deux, cinq
   preuves. */

const PREUVES = [
  'Toulouse, Haute-Garonne et Occitanie',
  'Un seul interlocuteur, du repérage au démontage',
  'Sonorisation et éclairage avec notre propre matériel',
  'Balances terminées avant l’ouverture des portes',
  'Matériel de secours sur les équipements critiques [à confirmer]',
]

type Reponse = 'identique' | 'equivalence' | 'tournee'

const LIBELLES_REPONSE: Record<Reponse, string> = {
  identique: 'Fourni à l’identique',
  equivalence: 'Équivalence proposée',
  tournee: 'Vient avec la tournée',
}

/* Un exemple de réponse, pas une fiche réelle : aucune marque, aucun
   modèle, seulement la logique de la réponse. */
const PATCH: { voie: string; source: string; demande: string; reponse: Reponse }[] = [
  { voie: '01', source: 'Grosse caisse', demande: 'Micro dynamique', reponse: 'identique' },
  { voie: '05', source: 'Caisse claire', demande: 'Micro dynamique', reponse: 'identique' },
  { voie: '09', source: 'Basse', demande: 'Boîte de direct active', reponse: 'equivalence' },
  { voie: '13', source: 'Voix lead', demande: 'Micro HF de l’artiste', reponse: 'tournee' },
  { voie: 'Ret.', source: 'Retours scène', demande: '4 wedges, 2 circuits', reponse: 'identique' },
]

function Hero() {
  return (
    <section className="festival-hero" aria-labelledby="festival-title">
      {/*
        À REMPLACER par une vraie photo d'un plateau Oysen avant
        l'ouverture des portes : scène éclairée, régie en place, public
        absent. À défaut, une régie en exploitation pendant un concert.
        Aucun artiste reconnaissable sans son accord écrit.
      */}
      <img
        className="festival-hero__fond"
        src="/images/services/festivals-evenements-culturels-1200.jpg"
        srcSet="/images/services/festivals-evenements-culturels-800.jpg 800w, /images/services/festivals-evenements-culturels-1200.jpg 1200w"
        sizes="100vw"
        width={1200}
        height={1500}
        alt=""
        decoding="async"
      />
      <div className="festival-hero__voile" aria-hidden="true">
        <i />
        <i />
      </div>

      <div className="festival-hero__inner">
        <div className="festival-hero__texte">
          {/* Le h1 est le surtitre, porteur de la requête (organisation de
              festivals, Toulouse, Occitanie) ; la grande phrase en dessous
              reste l'accroche, en simple paragraphe. */}
          <h1 className="section__eyebrow" id="festival-title">
            Organisation de festivals et d’événements culturels · Toulouse,
            Haute-Garonne, Occitanie
          </h1>
          <p className="festival-hero__titre">
            Toute la technique de votre festival, avec un seul interlocuteur.
          </p>
          <p className="festival-hero__lede">
            Son, lumière, vidéo, scène, électricité : installés, réglés et
            exploités par la même équipe, du montage au démontage.
          </p>

          <div className="festival-hero__actions">
            <div className="festival-hero__appel">
              <a className="btn btn--solid" href={CONTACT_FESTIVAL}>
                Présenter votre événement
              </a>
              <p className="festival-hero__rassurance">
                Fiche technique ou cahier des charges à joindre, si vous en avez
                un · sans engagement · réponse sous {DELAI_REPONSE_H}&nbsp;h
              </p>
            </div>
          </div>
        </div>

        {/* La fiche technique annotée : lue ligne par ligne, chaque ligne
            reçoit sa réponse. */}
        <figure className="fiche">
          <figcaption className="fiche__tete">
            <span>Fiche technique · réponse</span>
            <span>Exemple</span>
          </figcaption>
          <table className="fiche__table">
            <thead>
              <tr>
                <th scope="col">Voie</th>
                <th scope="col">Source</th>
                <th scope="col">Demandé</th>
                <th scope="col">Notre réponse</th>
              </tr>
            </thead>
            <tbody>
              {PATCH.map((ligne, rang) => (
                <tr
                  className={`fiche__ligne fiche__ligne--${ligne.reponse}`}
                  key={ligne.voie}
                  style={{ '--rang': rang } as CSSProperties}
                >
                  <td className="fiche__voie">{ligne.voie}</td>
                  <td>{ligne.source}</td>
                  <td className="fiche__demande">{ligne.demande}</td>
                  <td className="fiche__reponse">{LIBELLES_REPONSE[ligne.reponse]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="fiche__pied">
            Aucune substitution sans l’accord écrit du régisseur de l’artiste.
          </p>
        </figure>
      </div>

      <ul className="fest-preuves">
        {PREUVES.map((preuve) => (
          <li key={preuve}>{preuve}</li>
        ))}
      </ul>
    </section>
  )
}

