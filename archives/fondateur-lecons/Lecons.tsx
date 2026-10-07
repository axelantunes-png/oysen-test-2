/* ---- 4 · Ce que le terrain m'a appris ----
   La première leçon en grand à gauche, les quatre autres en liste à
   droite, entre des filets. */

const LECONS = [
  'Les problèmes du jour J se règlent rarement le jour J. Ils se règlent pendant la préparation.',
  'Un planning qui oublie le démontage n’est pas terminé.',
  'Une régie réussie, c’est une régie que personne ne remarque.',
  'Un bon devis se reconnaît à ce qu’il n’oublie rien, pas à son prix.',
  // À REMPLACER : une leçon tirée d'un événement précis.
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
]

function Lecons() {
  const [premiere, ...suivantes] = LECONS

  return (
    <section
      className="section section--fondateur section--fondateur-lecons"
      aria-labelledby="lecons-title"
    >
      <div className="section__inner">
        <Tete
          surtitre="Retours de terrain"
          titre="Ce que le terrain m’a appris"
          id="lecons-title"
        />

        <div className="lecons-grille">
          <blockquote className="lecon-une">
            <p>«&nbsp;{premiere}&nbsp;»</p>
          </blockquote>

          <ul className="lecons">
            {suivantes.map((lecon) => (
              <li key={lecon}>
                <blockquote className="lecon">
                  <p>«&nbsp;{lecon}&nbsp;»</p>
                </blockquote>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

