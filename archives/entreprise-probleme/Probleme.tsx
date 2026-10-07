/* ---- S3 · Le problème, côté client ----
   Le noir complet, comme le problème de l'accueil. À gauche, ce qui
   arrive sur le bureau et la scène redoutée ; à droite, ce qu'on attend
   d'un prestataire, dans ses mots. Puis la bascule : ce que nous
   reprenons, ce que vous gardez. */

const SUR_LE_BUREAU = [
  'Un lieu à trouver',
  'Des devis à demander : traiteur, son, mobilier, animation',
  'Des réponses qui arrivent chacune à son rythme',
  'La coordination, entre deux réunions',
]

const ATTENTES = [
  'Je veux quelque chose de simple, bien organisé, et ne pas avoir à gérer les imprévus le jour J.',
  'Je préfère avoir un seul interlocuteur.',
  'Je veux pouvoir faire confiance au prestataire.',
]

function Probleme() {
  return (
    <section
      className="section section--entreprise section--entreprise-probleme"
      aria-labelledby="probleme-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Le problème"
          titre="Organiser l’événement n’est pas votre métier. C’est pourtant sur vous que cela repose."
          id="probleme-title"
        />

        <div className="probleme-e">
          <div className="probleme-e__recit">
            <p className="probleme-e__qui">
              Responsable de la communication ou des ressources humaines, office
              manager, assistant ou assistante de direction, parfois dirigeant :
              l’événement est arrivé sur votre bureau avec une date, un budget
              approximatif et une attente claire. Que tout se passe bien.
            </p>

            <p className="probleme-e__label">Ce qui vous attend</p>
            <ul className="probleme-e__liste">
              {SUR_LE_BUREAU.map((tache) => (
                <li key={tache}>{tache}</li>
              ))}
            </ul>

            <p className="probleme-e__scene">
              Le jour J, un micro muet, un prestataire en retard, un écran qui
              reste noir. Devant vos collègues, votre direction ou vos clients. Et
              c’est vous que l’on cherche du regard.
            </p>
          </div>

          <figure className="probleme-e__attentes">
            <figcaption className="probleme-e__label">
              Ce que vous attendez d’un prestataire
            </figcaption>
            <ul>
              {ATTENTES.map((attente) => (
                <li key={attente}>
                  <blockquote>« {attente} »</blockquote>
                </li>
              ))}
            </ul>
          </figure>
        </div>

        {/* La bascule. */}
        <div className="bascule">
          <div className="bascule__cote">
            <p className="bascule__titre">Nous reprenons</p>
            <p className="bascule__texte">
              La conception, la coordination des prestataires et le jour J. Le
              reste ne passe plus par votre boîte de réception.
            </p>
          </div>
          <div className="bascule__cote">
            <p className="bascule__titre">Vous gardez</p>
            <p className="bascule__texte">
              Les décisions qui comptent : le lieu, le format, le budget.
            </p>
          </div>
        </div>

        <div className="lendemain">
          <p className="lendemain__label">Le lendemain, notre objectif</p>
          <p className="lendemain__phrase">
            « Tout s’est bien passé, je n’ai pas eu à m’en occuper. »
          </p>
          <a className="btn btn--solid" href={CONTACT_ENTREPRISE}>
            Présenter votre projet
          </a>
        </div>
      </div>
    </section>
  )
}

