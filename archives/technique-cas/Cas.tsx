/* ---- S6 · Un cas réel ----
   La trame d'un cas (format STAR), affichée avec ses crochets tant que
   le cas n'est pas rédigé : les cas viendront de précédentes expériences
   professionnelles, avec l'accord du client. Rien n'est inventé. */

const ETAPES_CAS = [
  {
    nom: 'Situation',
    texte: '[Type d’événement, lieu, nombre de personnes, demande du client dans ses mots]',
  },
  {
    nom: 'Tâche',
    texte: '[La contrainte : lieu, météo, délai, budget, absence d’électricité…]',
  },
  {
    nom: 'Action',
    texte: '[Matériel installé, équipe, durée de montage, solutions trouvées]',
  },
  {
    nom: 'Résultat',
    texte: '[Ce qui s’est bien passé, retour du client, photos, autorisation de publier]',
  },
]

function Cas() {
  return (
    <section
      className="section section--technique section--technique-cas"
      aria-labelledby="cas-tech-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Sur le terrain"
          titre="Un cas réel : [nom court de l’événement]"
          id="cas-tech-title"
        />

        <ol className="cas-tech">
          {ETAPES_CAS.map((etape, index) => (
            <li className="cas-tech__etape" key={etape.nom}>
              <span className="cas-tech__numero" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="cas-tech__nom">{etape.nom}</h3>
              <p className="cas-tech__texte">{etape.texte}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

