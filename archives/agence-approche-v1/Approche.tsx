/*
 * S6. Notre approche. Trois temps, du schéma à la phrase.
 *
 * D'abord ce que le travail tient ensemble : le triangle de structure, la
 * seule forme qui ne se déforme pas. Puis d'où vient la méthode : les cinq
 * réflexes du chantier, posés sur une chaîne de cotes comme sur un plan.
 * Enfin ce qu'elle produit : la maxime, et la signature, les deux métiers
 * reliés par le losange.
 */
function Approche() {
  return (
    <section
      className="section section--agence section--agence-approche"
      aria-labelledby="approche-title"
    >
      <div className="section__inner">
        <p className="section__eyebrow">Notre approche</p>

        <h2 className="section__title approche__titre" id="approche-title">
          L’organisation d’événement,{' '}
          <span className="approche__titre-chute">un projet entier.</span>
        </h2>

        <div className="approche__tenir">
          <figure className="approche__schema">
            <Triangle />
          </figure>

          <div className="approche__intro">
            <p className="approche__intro-phrase">
              Notre travail, c’est de concilier&nbsp;:
            </p>

            <ul className="approche__puces">
              <li className="approche__puce">ce que vous attendez&nbsp;;</li>
              <li className="approche__puce">ce que la technique permet&nbsp;;</li>
              <li className="approche__puce">
                l’émotion que la journée doit produire.
              </li>
            </ul>
          </div>
        </div>

        <div className="approche__methode">
          <h3 className="approche__sous-titre">
            Une méthode transposée
          </h3>

          <p className="approche__texte">
            Notre fondateur est ingénieur. Sur un chantier, on apprend cinq
            réflexes&nbsp;:
          </p>

          {/* La chaîne de cotes : une mesure, cinq segments. */}
          <ul className="reflexes">
            {REFLEXES.map((reflexe) => (
              <li className="reflexe" key={reflexe.verbe}>
                <span className="reflexe__verbe">{reflexe.verbe}</span>{' '}
                <span className="reflexe__suite">{reflexe.suite}</span>
              </li>
            ))}
          </ul>

          <p className="approche__texte">
            Nous les appliquons à vos événements.
          </p>
        </div>

        <p className="approche__maxime">
          La rigueur n’est pas l’inverse de l’émotion.{' '}
          <span className="approche__maxime-chute">
            Elle en est la condition.
          </span>
        </p>

        <p className="approche__marque">
          Un événement qui marque, c’est un événement où tout se passe
          comme prévu.
        </p>

        {/*
          La signature : les deux métiers, reliés par un trait et le losange
          plutôt que par un tiret. Les lecteurs d'écran lisent la phrase.
        */}
        <p className="approche__signature">
          <span className="approche__metiers">
            <span className="approche__metier">Conception</span>
            <span className="sr-only">, </span>
            <span className="approche__lien" aria-hidden="true" />
            <span className="approche__metier">Réalisation</span>
            <span className="sr-only">. </span>
          </span>
          <span className="approche__devise">
            Deux métiers, une expertise.
          </span>
        </p>
      </div>
    </section>
  )
}
