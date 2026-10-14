import { createFileRoute } from '@tanstack/react-router'

import { EMAIL } from '../components/contact/content'

/* Même raison que sur la page Contact : chemin depuis la racine. */
import legalCss from '/src/styles/legal.css?url'

export const Route = createFileRoute('/politique-de-confidentialite')({
  head: () => ({
    meta: [
      { title: 'Politique de confidentialité | Oysen' },
      {
        name: 'description',
        content:
          'Ce qu’Oysen fait de vos données : demandes de devis, cookies, durées de conservation et vos droits, expliqués simplement.',
      },
    ],
    links: [{ rel: 'stylesheet', href: legalCss }],
  }),
  component: PolitiqueDeConfidentialite,
})

/*
 * À RENSEIGNER : les informations encore manquantes. Tant qu'une valeur
 * n'est pas connue, son libellé entre crochets s'affiche tel quel.
 */
const MISE_A_JOUR = '[date de mise en ligne]'

/*
 * Deux lignes facultatives, retenues. Passer à false retire la ligne de
 * son tableau.
 */
/** L'envoi de nouvelles aux clients et aux professionnels. */
const NOUVELLES = true
/** Markom comme prestataire d'entretien du site. */
const MARKOM = true

type Ligne = Record<string, string>

const TRAITEMENTS: Ligne[] = [
  {
    Pourquoi: 'Répondre à votre demande et préparer votre devis',
    'Quelles données':
      'Vos coordonnées (nom, e-mail, téléphone) ; les informations sur votre événement (date, lieu, nombre de personnes, durée, besoins) ; les fichiers que vous joignez',
    'Ce qui nous y autorise':
      'Particulier : votre demande de devis. Professionnel : notre intérêt légitime à répondre aux demandes reçues',
    'Combien de temps':
      '3 ans après votre dernier message, si vous ne devenez pas client',
  },
  {
    Pourquoi: 'Organiser votre événement, si vous devenez client',
    'Quelles données':
      'Les mêmes, et ce qui figure au contrat et sur les factures',
    'Ce qui nous y autorise':
      'Le contrat qui nous lie. Ensuite : la loi (factures) et notre intérêt légitime (preuve en cas de litige)',
    'Combien de temps':
      'Le temps de la prestation, puis 5 ans. Factures et pièces comptables : 10 ans, comme la loi l’impose',
  },
  ...(NOUVELLES
    ? [
        {
          Pourquoi:
            'Vous donner de nos nouvelles (clients et professionnels uniquement)',
          'Quelles données': 'Nom, e-mail',
          'Ce qui nous y autorise':
            'Notre intérêt légitime, pour des prestations proches de celles que vous connaissez. Vous pouvez dire non à tout moment, dans chaque e-mail',
          'Combien de temps':
            '3 ans après la fin de la prestation ou votre dernier message',
        },
      ]
    : []),
  {
    Pourquoi: 'Mesurer l’audience du site',
    'Quelles données': 'Pages vues, type d’appareil, ville approximative',
    'Ce qui nous y autorise': 'Votre accord, donné dans le bandeau cookies',
    'Combien de temps': '14 mois',
  },
  {
    Pourquoi: 'Protéger le site contre les attaques',
    'Quelles données': 'Adresse IP, navigateur, pages demandées',
    'Ce qui nous y autorise': 'Notre intérêt légitime : la sécurité du site',
    'Combien de temps': '12 mois au plus',
  },
]

const PRESTATAIRES: Ligne[] = [
  {
    Prestataire: 'Vercel Inc.',
    'Ce qu’il fait': 'Héberge le site',
    Pays: 'États-Unis',
    'Protection hors Union européenne':
      'Data Privacy Framework et clauses types',
  },
  {
    Prestataire: 'Supabase Pte. Ltd.',
    'Ce qu’il fait': 'Stocke les demandes et les fichiers joints',
    Pays: 'Singapour, serveurs aux États-Unis (Oregon)',
    'Protection hors Union européenne': 'Clauses types',
  },
  {
    Prestataire: 'Plus Five Five, Inc. (Resend)',
    'Ce qu’il fait': 'Envoie les e-mails du formulaire',
    Pays: 'États-Unis',
    'Protection hors Union européenne':
      'Data Privacy Framework et clauses types',
  },
  {
    Prestataire: 'Hostinger International Ltd.',
    'Ce qu’il fait': 'Héberge notre boîte e-mail, qui reçoit vos demandes',
    Pays: 'Chypre',
    'Protection hors Union européenne': 'Clauses types',
  },
  {
    Prestataire: 'Google Ireland Limited (Google Analytics)',
    'Ce qu’il fait': 'Mesure l’audience, si vous l’acceptez',
    Pays: 'Irlande, données traitées aux États-Unis',
    'Protection hors Union européenne': 'Data Privacy Framework',
  },
  ...(MARKOM
    ? [
        {
          Prestataire: 'Markom',
          'Ce qu’il fait': 'Entretient le site',
          Pays: 'France',
          'Protection hors Union européenne': 'Aucun transfert',
        },
      ]
    : []),
]

const COOKIES: Ligne[] = [
  {
    Cookie: 'Gestion des cookies (oysen-cookies)',
    'À quoi il sert': 'Retenir votre choix sur les cookies',
    Durée: '6 mois',
    'Votre accord': 'Pas demandé : il est nécessaire au site',
  },
  {
    Cookie: 'Google Analytics (_ga, _ga_…)',
    'À quoi il sert': 'Compter les visites et voir les pages les plus lues',
    Durée: '13 mois au plus',
    'Votre accord': 'Demandé',
  },
]

/**
 * Un tableau de la page. Sur téléphone, chaque ligne devient une fiche :
 * l'intitulé de chaque colonne passe devant sa valeur (data-label), rien
 * n'est masqué ni ne déborde.
 */
function Tableau({ legende, lignes }: { legende: string; lignes: Ligne[] }) {
  const colonnes = Object.keys(lignes[0] ?? {})

  return (
    <div className="legal__tableau">
      <table>
        <caption className="sr-only">{legende}</caption>
        <thead>
          <tr>
            {colonnes.map((colonne) => (
              <th key={colonne} scope="col">
                {colonne}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lignes.map((ligne, rang) => (
            <tr key={rang}>
              {colonnes.map((colonne, i) =>
                i === 0 ? (
                  <th key={colonne} scope="row" data-label={colonne}>
                    {ligne[colonne]}
                  </th>
                ) : (
                  <td key={colonne} data-label={colonne}>
                    {ligne[colonne]}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Courriel() {
  return (
    <a className="legal__lien" href={`mailto:${EMAIL}`}>
      {EMAIL}
    </a>
  )
}

/**
 * La politique de confidentialité : le même gabarit que les mentions
 * légales, avec trois tableaux. Le ton reste celui du texte fourni, en
 * clair et sans jargon.
 */
function PolitiqueDeConfidentialite() {
  return (
    <main className="legal">
      <div className="legal__inner">
        <h1 className="legal__titre legal__titre--chapo">
          Politique de confidentialité
        </h1>
        <p className="legal__chapo">
          Ce que nous faisons de vos données, en clair.
          <br />
          Dernière mise à jour&nbsp;: {MISE_A_JOUR}
        </p>

        <section className="legal__bloc" aria-labelledby="conf-responsable">
          <h2 className="legal__h2" id="conf-responsable">
            Qui s’occupe de vos données&nbsp;?
          </h2>
          <p>
            OYSEN, SAS dont le siège est au 9 rue Jean Bart, 31400 Toulouse,
            est responsable de vos données. Une question&nbsp;? Écrivez à{' '}
            <Courriel />.
          </p>
        </section>

        <section className="legal__bloc" aria-labelledby="conf-collecte">
          <h2 className="legal__h2" id="conf-collecte">
            Ce que nous collectons, et pourquoi
          </h2>
          <Tableau
            legende="Ce que nous collectons, pourquoi, sur quelle base et pour combien de temps"
            lignes={TRAITEMENTS}
          />
          <p>
            Dans le formulaire, les champs marqués d’un astérisque (*) sont
            nécessaires pour préparer votre devis. Les autres sont libres.
            Merci de ne pas y écrire d’informations sensibles (santé,
            religion, opinions…).
          </p>
        </section>

        <section className="legal__bloc" aria-labelledby="conf-photos">
          <h2 className="legal__h2" id="conf-photos">
            Les photos de nos événements
          </h2>
          <p>
            Nous publions des photos et vidéos de nos événements, avec
            l’accord de l’organisateur, pour montrer notre travail. Elles
            restent en ligne tant qu’elles illustrent nos réalisations. Vous
            vous reconnaissez et voulez qu’une image soit retirée&nbsp;?
            Écrivez-nous&nbsp;: nous la retirons.
          </p>
        </section>

        <section className="legal__bloc" aria-labelledby="conf-destinataires">
          <h2 className="legal__h2" id="conf-destinataires">
            Qui voit vos données&nbsp;?
          </h2>
          <p>
            Nous ne vendons pas vos données. Elles sont vues uniquement
            par&nbsp;:
          </p>
          <ul className="legal__puces">
            <li>les personnes d’OYSEN qui suivent votre projet&nbsp;;</li>
            <li>
              les prestataires que nous choisissons pour votre événement
              (traiteur, technicien, photographe…), pour ce dont ils ont
              besoin&nbsp;;
            </li>
            <li>notre expert-comptable, pour les factures&nbsp;;</li>
            <li>les autorités, si la loi nous y oblige&nbsp;;</li>
            <li>
              nos prestataires techniques ci-dessous. Ils agissent pour nous,
              selon nos instructions, et sont liés à nous par contrat.
            </li>
          </ul>
          <Tableau
            legende="Nos prestataires techniques, leur pays et la protection de vos données hors Union européenne"
            lignes={PRESTATAIRES}
          />
          <p>
            Le Data Privacy Framework est un accord entre l’Union européenne
            et les États-Unis. Les clauses types sont des contrats approuvés
            par la Commission européenne. Pour en recevoir une copie,
            écrivez-nous.
          </p>
        </section>

        <section className="legal__bloc" aria-labelledby="conf-cookies">
          <h2 className="legal__h2" id="conf-cookies">
            Les cookies
          </h2>
          <p>
            Un cookie est un petit fichier déposé sur votre appareil quand
            vous visitez un site. Nous en utilisons deux sortes.
          </p>
          <Tableau
            legende="Les cookies du site, leur rôle, leur durée et votre accord"
            lignes={COOKIES}
          />
          <p>
            Refuser ne vous empêche pas d’utiliser le site. Vous pouvez
            changer d’avis à tout moment avec le lien «&nbsp;Gérer mes
            cookies&nbsp;», en bas de chaque page.
          </p>
        </section>

        <section className="legal__bloc" aria-labelledby="conf-droits">
          <h2 className="legal__h2" id="conf-droits">
            Vos droits
          </h2>
          <p>Vous pouvez à tout moment&nbsp;:</p>
          <ul className="legal__puces">
            <li>
              savoir quelles données nous avons sur vous, et en recevoir une
              copie&nbsp;;
            </li>
            <li>les faire corriger&nbsp;;</li>
            <li>les faire effacer&nbsp;;</li>
            <li>vous opposer à leur utilisation&nbsp;;</li>
            <li>
              nous demander de les garder sans les utiliser, le temps de
              régler un désaccord&nbsp;;
            </li>
            <li>
              les récupérer dans un fichier, pour les confier à un autre
              prestataire&nbsp;;
            </li>
            <li>retirer votre accord, quand nous vous l’avons demandé&nbsp;;</li>
            <li>
              nous dire ce que nous devons faire de vos données après votre
              décès.
            </li>
          </ul>
          <p>
            Certaines données, comme les factures, doivent être gardées
            pendant la durée fixée par la loi&nbsp;: nous ne pouvons pas les
            effacer avant.
          </p>
          <p>
            Pour exercer ces droits, écrivez à <Courriel /> ou par courrier à
            notre siège. Nous répondons sous un mois. Si votre demande est
            complexe, ce délai peut passer à trois mois au total&nbsp;: nous
            vous prévenons. En cas de doute sur votre identité, nous pouvons
            vous demander de la prouver.
          </p>
          <p>
            Vous pouvez aussi déposer une plainte auprès de la CNIL&nbsp;: sur{' '}
            <a
              className="legal__lien"
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
            >
              cnil.fr
            </a>
            , ou par courrier au 3 place de Fontenoy, TSA 80715, 75334 Paris
            Cedex 07.
          </p>
        </section>

        <section className="legal__bloc" aria-labelledby="conf-securite">
          <h2 className="legal__h2" id="conf-securite">
            Sécurité
          </h2>
          <p>
            Le site est protégé par le protocole HTTPS. Vos demandes et vos
            fichiers sont stockés chiffrés. Seules les personnes qui en ont
            besoin y ont accès.
          </p>
        </section>
      </div>
    </main>
  )
}
