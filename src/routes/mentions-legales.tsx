import { createFileRoute } from '@tanstack/react-router'

import { EMAIL } from '../components/contact/content'
import { PHONE_DISPLAY, PHONE_TEL } from '../components/home/content'
import { Lien } from '../components/Lien'

/* Même raison que sur la page Contact : chemin depuis la racine. */
import legalCss from '/src/styles/legal.css?url'

export const Route = createFileRoute('/mentions-legales')({
  head: () => ({
    meta: [
      { title: 'Mentions légales | Oysen' },
      {
        name: 'description',
        content:
          'Éditeur, hébergeur et coordonnées du site oysen.fr, édité par OYSEN SAS à Toulouse.',
      },
    ],
    links: [{ rel: 'stylesheet', href: legalCss }],
  }),
  component: MentionsLegales,
})

/*
 * À RENSEIGNER : le médiateur de la consommation. Tant qu'il n'est pas
 * connu, son libellé entre crochets s'affiche tel quel.
 */
const MEDIATEUR = {
  nom: '[Nom du médiateur]',
  adresse: '[Adresse]',
  site: '[Site internet]',
}

/**
 * Les mentions légales : une page de service, sans discours. Un titre, puis
 * les blocs que la loi demande, dans l'ordre où on les cherche.
 */
function MentionsLegales() {
  return (
    <main className="legal">
      <div className="legal__inner">
        <h1 className="legal__titre">Mentions légales</h1>

        <section className="legal__bloc" aria-labelledby="legal-editeur">
          <h2 className="legal__h2" id="legal-editeur">
            Qui édite ce site&nbsp;?
          </h2>
          <p>
            Le site oysen.fr est édité par OYSEN, société par actions
            simplifiée (SAS) au capital de 1&nbsp;000&nbsp;€.
          </p>
          <ul className="legal__liste">
            <li>Siège&nbsp;: 9 rue Jean Bart, 31400 Toulouse</li>
            <li>RCS Toulouse 109&nbsp;000&nbsp;588</li>
            <li>SIRET&nbsp;: 109&nbsp;000&nbsp;588&nbsp;00011</li>
            <li>TVA intracommunautaire&nbsp;: FR32109000588</li>
            <li>
              Téléphone&nbsp;:{' '}
              <a className="legal__lien" href={`tel:${PHONE_TEL}`}>
                {PHONE_DISPLAY}
              </a>
            </li>
            <li>
              E-mail&nbsp;:{' '}
              <a className="legal__lien" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
            </li>
          </ul>

          <h3 className="legal__h3">Directeur de la publication</h3>
          <p>Mathis Amato, président d’OYSEN.</p>
        </section>

        <section className="legal__bloc" aria-labelledby="legal-hebergeur">
          <h2 className="legal__h2" id="legal-hebergeur">
            Qui héberge ce site&nbsp;?
          </h2>
          <p>
            Vercel Inc.
            <br />
            440 N Barranca Avenue #4133
            <br />
            Covina, CA 91723, États-Unis
            <br />
            Téléphone&nbsp;:{' '}
            <a className="legal__lien" href="tel:+14153985463">
              +1&nbsp;415&nbsp;398&nbsp;5463
            </a>
            <br />
            Site&nbsp;:{' '}
            <a
              className="legal__lien"
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              vercel.com
            </a>
          </p>
        </section>

        <section className="legal__bloc" aria-labelledby="legal-donnees">
          <h2 className="legal__h2" id="legal-donnees">
            Où sont stockées les données du formulaire&nbsp;?
          </h2>
          <ul className="legal__liste legal__liste--espacee">
            <li>
              <strong>Supabase Pte. Ltd.</strong>, 65 Chulia Street #38-02/03,
              OCBC Centre, Singapour 049513&nbsp;: demandes et fichiers
              joints, sur des serveurs situés aux États-Unis (Oregon).
            </li>
            <li>
              <strong>Plus Five Five, Inc. (Resend)</strong>, 2261 Market
              Street #5039, San Francisco, CA 94114, États-Unis&nbsp;: envoi
              des e-mails du formulaire.
            </li>
            <li>
              <strong>Hostinger International Ltd.</strong>, 61 Lordou
              Vironos Street, 6023 Larnaca, Chypre&nbsp;: boîte e-mail
              d’OYSEN, qui reçoit les demandes.
            </li>
            <li>
              <strong>Google Ireland Limited</strong>, Gordon House, Barrow
              Street, Dublin 4, Irlande&nbsp;: mesure d’audience (Google
              Analytics), si vous l’acceptez.
            </li>
          </ul>
        </section>

        <section className="legal__bloc" aria-labelledby="legal-mediation">
          <h2 className="legal__h2" id="legal-mediation">
            Médiation de la consommation
          </h2>
          <p>
            Vous êtes un particulier et un désaccord vous oppose à nous&nbsp;?
            Écrivez-nous d’abord. Si nous ne trouvons pas de solution
            ensemble, vous pouvez saisir gratuitement le médiateur de la
            consommation&nbsp;:
          </p>
          <p>
            {MEDIATEUR.nom}
            <br />
            {MEDIATEUR.adresse}
            <br />
            {MEDIATEUR.site}
          </p>
        </section>

        <section className="legal__bloc" aria-labelledby="legal-photos">
          <h2 className="legal__h2" id="legal-photos">
            Photos et vidéos
          </h2>
          <p>
            Les photos et vidéos de ce site appartiennent à OYSEN, sauf
            mention contraire.
          </p>
        </section>

        <section className="legal__bloc" aria-labelledby="legal-perso">
          <h2 className="legal__h2" id="legal-perso">
            Vos données personnelles
          </h2>
          <p>
            Pour savoir ce que nous faisons de vos données et gérer les
            cookies, lisez notre{' '}
            <Lien className="legal__lien" href="/politique-de-confidentialite">
              politique de confidentialité
            </Lien>
            .
          </p>
        </section>

        <section className="legal__bloc" aria-labelledby="legal-creation">
          <h2 className="legal__h2" id="legal-creation">
            Création du site
          </h2>
          <p>
            Site conçu par{' '}
            <a
              className="legal__lien"
              href="https://www.markom.fr"
              target="_blank"
              rel="noopener"
            >
              Markom
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  )
}
