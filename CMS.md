# CMS Oysen

Document de référence du CMS : l'espace où le client gère lui-même une partie du
site. État au 12 octobre 2026.

---

## 1. Accès et connexion

| | |
|---|---|
| Adresse de connexion | `/admin-prive` (plus tard `https://www.oysen.fr/admin-prive`) |
| Compte | `contact@oysen.fr`, créé à la main dans Supabase, sans validation par e-mail |
| Accueil du CMS | `/admin-prive/cms` (« Bienvenue sur ton CMS », à refaire) |

- **Connexion** : identifiant (l'e-mail) et mot de passe. Déjà connecté, `/admin-prive`
  mène droit au CMS.
- **Connexion persistante** : la session est gardée dans le navigateur. Elle tient au
  rechargement et à la fermeture du navigateur, et se renouvelle seule (jeton d'une
  heure). Elle prend fin à la déconnexion, si les données du site sont effacées, en
  navigation privée à la fermeture, ou si une durée maximale est réglée dans Supabase
  (*Authentication → Sessions*, offres payantes ; aucune par défaut).
- **Barre du CMS** : Accueil, Promotion, « Retour au site » (vers l'accueil du site,
  sans se déconnecter) et « Se déconnecter ».
- **Pages d'administration** : ni menu, ni pied de page, ni rideau, ni popups. Exclues
  de l'indexation (`noindex`).
- **Lien « Admin » du pied de page** : PROVISOIRE, à retirer (constante `LEGAL` dans
  `src/components/Footer.tsx`). À terme, le seul accès est l'adresse.

### Mot de passe oublié

1. Sur la page de connexion, saisir l'identifiant puis « Réinitialiser mon mot de passe ».
2. Supabase envoie un e-mail ; le clic sur son lien prouve que la demande vient du
   titulaire.
3. Le lien mène à `/admin-prive/nouveau-mot-de-passe` : nouveau mot de passe (8
   caractères au moins), confirmé deux fois, puis arrivée sur le CMS.

Le message affiché ne dit jamais si l'adresse a un compte. Le lien marche même ouvert
sur un autre appareil (flux « implicit »). Expiré ou déjà servi, la page le dit.

### Réglages Supabase à faire ou à vérifier

- [x] Compte créé, inscriptions désactivées (vérifié : une inscription est refusée).
- [x] URL de redirection définitive autorisée :
      `https://www.oysen.fr/admin-prive/nouveau-mot-de-passe`.
- [ ] **Site URL** sur `https://www.oysen.fr` au passage au domaine
      (*Authentication → URL Configuration*).
- [ ] **Envoi des e-mails par Resend** (*Authentication → Emails → SMTP Settings*).
      Le serveur d'envoi fourni par Supabase n'écrit qu'aux membres de l'équipe
      Supabase : sans Resend, l'e-mail de réinitialisation n'arrive jamais à
      `contact@oysen.fr`. Le même compte Resend servira au formulaire de contact
      (voir § 8).
- [ ] Traduire en français le modèle d'e-mail « Reset password ».

En local ou sur une adresse Vercel provisoire, le lien de réinitialisation ne mène pas
à la bonne page (adresse non autorisée, Supabase renvoie à la Site URL). Voulu : la
réinitialisation ne se fera que sur le domaine définitif.

---

## 2. Sécurité

- **Le verrou est dans la base** : les règles d'accès (RLS) de Supabase sont
  vérifiées à chaque requête. Le reste (garde des pages, cache) n'est que du confort.
- **Administrateurs** : table `administrateurs`. Être connecté ne suffit pas, il faut
  y figurer. Fonction `est_admin()`, utilisée par toutes les règles du CMS. Pour
  ajouter un administrateur : insérer son `user_id` dans cette table (SQL Editor).
- **Clé publique** (`sb_publishable_…`) dans `src/lib/supabase.ts` : faite pour être
  livrée au navigateur. Ne jamais y mettre la clé secrète.
- **Le site public lit en anonyme** (`getSupabasePublic()`), même quand
  l'administrateur est connecté dans le même navigateur : il voit le site comme un
  visiteur, popups inactifs exclus.
- **Inscriptions désactivées** dans Supabase : à laisser ainsi.
- **Cache du CMS en mémoire seulement** (voir § 5) : rien n'est écrit sur le disque,
  tout est vidé à la déconnexion.

---

## 3. Base de données

Pas d'accès en écriture direct à la base pour Claude : chaque changement est un
script numéroté dans `supabase/`, exécuté à la main dans **SQL Editor → New query**,
une seule fois, dans l'ordre. Un script livré n'est jamais modifié ; une correction
passe par le numéro suivant. Chaque table créée active sa RLS avec ses règles dans le
même script (l'activation automatique est désactivée sur le projet).

| Script | Contenu | Exécuté |
|---|---|---|
| `sql1.sql` | Table `administrateurs`, fonction `est_admin()`, table `popups`, stockage d'images `popups` | oui |
| `sql2.sql` | Ciblage des pages : colonnes `ciblage` et `pages_exclues`, retrait de `toutes_pages` | oui |
| `sql3.sql` | Brouillons : colonne `brouillon`, nom exigé seulement hors brouillon, brouillon jamais actif | **non, à exécuter** |
| `sql4.sql` | Contenu en grille (`blocs`) accepté à côté de l'ancien (`lignes`) | **non, à exécuter** |

### Table `popups`

| Colonne | Rôle |
|---|---|
| `nom` | Nom interne, jamais affiché sur le site |
| `actif` | Interrupteur du client |
| `brouillon` | Création commencée, pas terminée : enregistré seul, jamais actif, nom facultatif |
| `date_debut`, `date_fin` | Période d'affichage ; `date_fin` exclusive (dernier jour inclus + 1, à minuit) |
| `ciblage` | `toutes`, `sauf` ou `certaines` |
| `pages` | Pages visées (`certaines`) |
| `pages_exclues` | Pages exclues (`sauf`) |
| `frequence`, `frequence_jours` | `chaque_page`, `visite`, `une_fois` ou `jours` (tous les N jours) |
| `format` | `petit`, `moyen` ou `grand` |
| `contenu` | La grille millimétrée (JSON) : `{ version: 3, blocs: [...] }`, chaque bloc avec sa `place` (colonne et largeur sur 48, ligne et hauteur en lignes de 0,5 rem, alignH, alignV, marges, plan), et le `cadre` (largeur en rem, nombre de lignes). Les formats précédents (`{ lignes }`, puis `{ version: 2 }` sur 12 colonnes) sont convertis à la lecture (`normaliserContenu()`) |
| `cree_le`, `modifie_le` | Tenues à jour par la base |

Règles : le site (anonyme) ne lit que les popups activés, commencés et pas terminés.
L'administrateur lit, crée, modifie et supprime tout.

### Stockage `popups` (images)

Lecture publique, dépôt réservé à l'administrateur, 5 Mo maximum, JPEG, PNG ou WebP.

---

## 4. Module Promotion (popups promotionnels)

### La liste (`/admin-prive/cms/promotion`)

- Titre « Popups », bouton « + Nouveau popup ».
- **Filtres** avec leur nombre : Tous, En ligne, Programmés, Brouillons, Terminés
  (`categorie()` dans `src/lib/popups.ts`) :
  - **En ligne** : activé, commencé, pas terminé ;
  - **Programmé** : pas terminé et pas en ligne (activé mais pas commencé, ou
    désactivé avant sa fin) ;
  - **Brouillon** : création commencée sans « Enregistrer » (voir l'éditeur) ;
  - **Terminé** : dates passées. Un popup terminé ne disparaît jamais.
  La liste est rangée dans cet ordre, du plus récent au plus ancien dans chacun.
- **Une fiche par popup**, arrondie : nom, période (« Du 12 au 26 octobre »), pages
  (« Tout le site »), fréquence, puce de statut (En ligne, Programmé, Brouillon,
  Terminé), puis les actions :
  - en ligne et programmé : interrupteur Actif / Inactif (enregistré d'un clic),
    « Modifier » ;
  - brouillon : « Continuer » ;
  - terminé : « Relancer avec de nouvelles dates » (dialogue d'activation : 7 jours
    de plus ou autre date de fin) ;
  - toujours : poubelle, message « Attention, cette action est irréversible. » ;
    efface le popup de la base et ses images du stockage.
- **Popups superposés** : si plusieurs popups activés visent une même page sur des
  dates qui se recouvrent, un bandeau orangé sous celui qui commence le plus tard le
  dit (« Du 20 au 26 octobre, la page … aura deux popups : celui-ci et « … ». »), avec
  « Ajuster les dates » (éditeur sur l'onglet Diffusion). Sans l'empêcher : sur le
  site, ils s'empilent l'un sous l'autre.
- **Sur téléphone** (sous 40 rem, fin de la partie liste de cms.css ; l'ordinateur ne
  change pas) : tout est resserré. La barre du CMS met le logo et les boutons de sortie
  en haut et les rubriques dessous. Les filtres tiennent sur une ligne qui défile sur le
  côté, avec une fine barre de défilement. Les fiches sont plus compactes, avec la puce de statut à gauche et les
  actions à droite sur toute la largeur.

### Activer selon les dates

- **Pas encore commencé** : confirmation, avec « L'activer, il démarrera le … » ou
  « L'afficher dès aujourd'hui » (la date de début passe à aujourd'hui).
- **Déjà terminé** : il ne peut pas s'afficher ; « Ajouter 7 jours à partir
  d'aujourd'hui » ou « Choisir une autre date de fin ».

### L'éditeur (`/admin-prive/cms/promotion/nouveau` ou `/…/<id>`)

Trois colonnes : réglages à gauche, aperçu avec sa grille au centre, réglages du bloc
choisi à droite (sous l'aperçu sur un écran moins large). Un popup déjà créé n'est enregistré
qu'avec « Enregistrer » (l'état « Modifications non enregistrées » le rappelle).

**Brouillon automatique** : un nouveau popup s'enregistre seul, en brouillon, une
seconde après chaque changement (et en quittant l'éditeur), sans clic, jamais activé
et même sans nom. « Enregistrer » termine la création : le nom est alors exigé.
« Continuer » reprend un brouillon, qui continue de s'enregistrer seul.

Le panneau **Général** (arrondi) se tient en haut, au-dessus des onglets. Les autres
réglages sont répartis en deux onglets numérotés : **1 Contenu** (« Ce que
voient vos visiteurs » : mise en page, palette des blocs) et **2 Diffusion**
(« Où, quand, combien de fois » : dates, pages, fréquence). L'éditeur s'ouvre sur
Contenu, sauf venant de la liste par `#diffusion` (choix d'une autre date de fin).
Il passe de lui-même sur Diffusion quand une erreur de pages bloque
l'enregistrement, ou pour choisir une autre date de fin.

- **Général** : nom interne, statut.
- **Diffusion** :
  - date de début ; durée de 3, 7, 15 ou 30 jours, ou jusqu'à une date précise ;
  - pages : toutes, toutes sauf (cases des pages à exclure), ou seulement certaines ;
  - fréquence : à chaque page vue, une fois par visite, une seule fois puis plus
    jamais pour ce visiteur, une fois tous les X jours. Elle s'applique même après
    fermeture du popup.
- **Mise en page** (un seul panneau, arrondi) :
  - trois modèles en cartes à miniature : Centré, Offre + texte, Photo + texte. Un
    modèle remplit la grille (et règle la taille) ; tout reste ensuite modifiable.
    La carte du modèle dont le contenu garde la forme est éclairée
    (`modeleReconnu()`, d'après la place des blocs) ;
  - taille, en trois segments : Compacte (24 rem), Standard (34 rem), Large (50 rem).
    Elle donne sa largeur au cadre (sa hauteur ne change pas) ; le segment s'éclaire
    si le cadre a cette largeur, sinon « Taille sur mesure » s'affiche. Le format
    enregistré en base (`petit`, `moyen`, `grand`) est la taille la plus proche.
- **Le constructeur** (grille millimétrée, placement libre, `src/lib/grille.ts`) :
  - **la grille** : 48 colonnes sur la largeur de l'encart, des lignes de 0,5 rem
    (`COLONNES`, `PAS_LIGNE`), dessinée en papier millimétré à faible opacité derrière
    l'aperçu (un trait plus marqué tous les 4 carreaux). Chaque bloc s'y cale par son
    coin haut gauche et sa taille ; deux blocs peuvent se superposer ;
  - **palette** (onglet Contenu, panneau « Blocs ») : surtitre, titre, sous-titre,
    explication, offre (valeur et précision), date (texte libre), image, bouton
    (texte, destination, plein ou contour), liens, séparateur. Glissé sur l'aperçu,
    son coin haut gauche se pose sous le pointeur, à sa taille habituelle
    (`HAUTEURS`), sa largeur réduite pour tenir ; cliqué, il s'ajoute en bas sur
    toute la largeur ;
  - **déplacer** : le bloc suit le pointeur librement (au pixel), sa place d'arrivée
    calée s'affiche en pointillés ; au lâcher, il se cale sur la grille. Glisser au
    pointeur (souris, doigt, stylet), pas le glisser natif du navigateur ;
  - **redimensionner** : huit poignées sur le bloc choisi (4 côtés, 4 coins), le
    côté opposé ne bouge pas ; taille calée sur la grille, 2 colonnes et 2 lignes au
    moins ;
  - **hauteur au contenu** : un bloc dont le contenu dépasse s'agrandit seul, jusqu'au
    bas du cadre au plus (jamais de rétrécissement) ; au-delà, il est entouré
    d'orange et marqué « Le texte dépasse du cadre » (le texte est coupé au bas du
    bloc), à raccourcir ou à remonter ;
  - **le cadre** du popup : sa largeur (rem) et sa hauteur (lignes), enregistrées
    dans `contenu.cadre`. Les blocs n'en changent jamais la taille : ils restent
    dedans : un bloc qu'on déplace ne sort pas du cadre, même pendant le geste, et
    la grille a une hauteur fixe (aucune ligne ne s'y ajoute). Trois poignées le règlent :
    les deux côtés (la largeur, des deux côtés à la fois, le cadre restant centré)
    et le bas (la hauteur) ; sa taille s'affiche pendant le geste. Limites : 18 à
    60 rem de large, 8 à 160 lignes. Réduit, il fait remonter (ou rétrécir) les
    blocs qui en sortiraient. Un popup d'avant les cadres en reçoit un : la largeur
    de sa taille, la hauteur de ses blocs plus une marge ;
  - **clavier**, sur le bloc choisi : flèches pour décaler d'un cran, Maj + flèche
    de quatre, Suppr pour le retirer ;
  - au-dessus du bloc choisi, « Centrer sur la ligne », « … » (réglages avancés) et
    la poubelle ;
  - **centrer sur la ligne** : le bloc se place au milieu exact de toute la ligne,
    quelle que soit sa largeur (`place.centre`, rendu par `.popup__bloc--centre`,
    au demi-carreau près). Il le reste quand on le monte, le descend ou l'étire
    (il s'élargit alors des deux côtés) ; un déplacement sur le côté, une poignée
    de gauche ou « Pleine largeur » le décentrent ;
  - **réglages du bloc** (à droite) : ses champs ; « Centrer sur la ligne »,
    « Pleine largeur », flèches pour décaler d'un cran ; son centrage dans son cadre,
    horizontal (gauche, centre, droite) et vertical (haut, centre, bas) ; « … » :
    marges intérieures des quatre côtés (0 à 3 rem), « Passer devant » / « Passer
    derrière » pour les blocs superposés ;
  - **Rendu sans la grille** (en tête de l'aperçu, sur ordinateur, à côté de Tout
    vider) : l'aperçu montre le popup tel que le verra le visiteur (`PopupCarte`),
    sans grille, poignées ni outils ; le bouton devient
    « Revenir à la grille » (Tout vider est masqué pendant ce temps) ;
  - **Tout vider** (en tête de l'aperçu, avec confirmation) : retire tous les blocs,
    garde le cadre tel quel ; les images retirées sont effacées du stockage au
    prochain enregistrement ;
  - destinations : une page du site dans une liste, ou une autre adresse ;
  - image : dépôt dans le stockage, description pour les malvoyants ; elle remplit
    tout son cadre.
  - **Sur téléphone** (écran de moins de 40 rem) : les blocs s'empilent dans l'ordre
    de lecture (de haut en bas, puis de gauche à droite), chacun sur toute la largeur.
- **Créer depuis un téléphone** (éditeur sous 40 rem de large ; rien ne change au-delà,
  `useTelephone()` dans Constructeur.tsx, règles en fin de cms.css) :
  - l'aperçu garde la grille de l'ordinateur, réduite à la largeur de l'écran
    (échelle `--echelle`) ; les mesures des gestes suivent la réduction ;
  - poignées et outils du bloc gardent une taille utilisable au doigt, avec une zone
    de toucher élargie ;
  - au doigt, toucher un bloc le choisit seulement (la page défile sur les autres
    blocs) ; le bloc choisi se glisse et s'étire ;
  - palette : un bloc s'ajoute en le touchant (pas de glisser), en bas du popup ;
  - réglages du bloc : boutons − / + pour sa largeur et sa hauteur (2 carreaux par
    appui), à la place du rappel des raccourcis clavier ;
  - barre d'actions fixée en bas : « + Bloc » (feuille qui monte du bas avec la
    palette, refermée après l'ajout, l'aperçu revient), « Régler » (descend aux
    réglages du bloc choisi), « Aperçu », « Enregistrer » ;
  - champs à 16 px : le téléphone ne zoome plus quand on les touche.
- **Supprimer ce popup** : en bas de l'éditeur, même avertissement que la liste.

Le client choisit le contenu, jamais les couleurs ni les polices : le popup reste dans
la DA du site (quatre couleurs de texte).

### Sur le site

- Ouverture 2,5 s après la découverte de la page (après le rideau à l'arrivée).
- Popups relus à chaque page : un popup désactivé disparaît dès la page suivante, même
  dans un onglet déjà ouvert.
- Fermeture : croix, Échap, clic à côté. Un lien du popup le referme en menant à sa page.
- Fréquence retenue par le navigateur du visiteur (en navigation privée, un popup peut
  revenir).
- Supabase n'est téléchargé qu'à ce moment-là, après l'affichage de la page.

### Images : nettoyage

- À la suppression d'un popup : ses images sont effacées.
- À l'enregistrement : les images retirées ou remplacées depuis le dernier
  enregistrement sont effacées.
- Reste possible : une image déposée puis abandonnée sans jamais enregistrer demeure
  dans le stockage (nettoyage à ajouter si besoin).

---

## 5. Cache et performances

- **TanStack Query** (`src/lib/cms-cache.ts`) : la liste et l'éditeur partagent le
  même cache. Retour instantané d'une page à l'autre ; préchargement au survol des
  liens (chargeurs du routeur).
- Au-delà de 30 s, les données en cache s'affichent quand même aussitôt, puis sont
  revérifiées en arrière-plan (et au retour sur l'onglet).
- Actions immédiates (activer, désactiver, supprimer) : l'écran change tout de suite
  et revient en arrière si la base refuse.
- **Pas de cache sur le disque** (choix du 12 octobre 2026, pour ne pas laisser de
  données sur l'ordinateur).
- Le site public ne télécharge ni TanStack Query ni Supabase au départ : ils ne sont
  chargés qu'à l'ouverture du CMS, ou à l'affichage des popups pour Supabase.

---

## 6. Où est le code

| Fichier | Rôle |
|---|---|
| `src/routes/admin-prive/index.tsx` | Page de connexion et demande de réinitialisation |
| `src/routes/admin-prive/nouveau-mot-de-passe.tsx` | Nouveau mot de passe |
| `src/routes/admin-prive/cms/route.tsx` | Cadre du CMS : garde de session, barre, cache, vidage à la déconnexion |
| `src/routes/admin-prive/cms/index.tsx` | Accueil du CMS |
| `src/routes/admin-prive/cms/promotion/index.tsx` | Liste des popups |
| `src/routes/admin-prive/cms/promotion/$id.tsx` | Route de l'éditeur |
| `src/components/cms/EditeurPopup.tsx` | L'éditeur |
| `src/components/cms/Constructeur.tsx` | Le constructeur : palette, grille de l'aperçu, réglages du bloc |
| `src/components/cms/ChoixDestination.tsx` | Choix d'une page ou d'une adresse |
| `src/components/cms/useActivation.tsx` | Activation selon les dates (dialogues) |
| `src/components/cms/suppression.ts` | Suppression et nettoyage des images |
| `src/components/cms/Dialogue.tsx`, `Interrupteur.tsx`, `EtatsCms.tsx` | Dialogue, interrupteur, chargement et erreur |
| `src/components/cms/Icones.tsx` | Icônes du CMS (calendrier, page, répétition, poubelle, attention, plus) |
| `src/components/popup/PopupCarte.tsx` | Rendu d'un popup (site et aperçu) |
| `src/components/popup/Popups.tsx` | Affichage des popups sur le site |
| `src/lib/supabase.ts` | Clients Supabase (CMS et site public anonyme) |
| `src/lib/cms-cache.ts` | Cache du CMS |
| `src/lib/popups.ts` | Modèle des popups : types, modèles, conversion de l'ancien format, dates, statut, ciblage |
| `src/lib/grille.ts` | Placement des blocs : ajout, calage sur la grille, décalage, centrage, plan, hauteur au contenu |
| `src/lib/pages-du-site.ts` | Pages proposées dans le CMS |
| `src/styles/admin.css`, `cms.css`, `popup.css` | Styles |
| `supabase/sql1.sql` à `sql4.sql` | Scripts de la base |

**Une page ajoutée au site** doit aussi l'être dans `src/lib/pages-du-site.ts` pour
être choisissable dans le CMS (pages d'un popup, destinations des liens).

---

## 7. Choix techniques

- Le site reste sur **TanStack Start + TanStack Router**. Les liens internes passent
  par `<Lien>` (`src/components/Lien.tsx`), le `<Link>` de TanStack : changement de
  page sans rechargement.
- Les pages d'administration sont rendues dans le navigateur seulement (`ssr: false`) :
  la session n'existe que là.
- Les chargeurs et gardes des routes d'administration importent Supabase et le cache
  à la demande : ils font partie de l'arbre des routes, téléchargé par tout le site.

---

## 8. À faire

- [ ] **Exécuter `supabase/sql4.sql`** (contenu en grille), après sql3 : sans lui,
      enregistrer un popup échoue.
- [ ] **Exécuter `supabase/sql3.sql`** (brouillons) : sans lui, créer ou enregistrer
      un popup échoue.
- [ ] Retirer le lien « Admin » du pied de page.
- [ ] Brancher Resend : SMTP de Supabase (réinitialisation) et formulaire de contact
      (clé API côté serveur, variable d'environnement Vercel ; expéditeur en
      `@oysen.fr`, adresse du visiteur en « Répondre à »). Ajouter les lignes DNS de
      Resend sans toucher aux MX de Hostinger.
- [ ] Site URL Supabase sur le domaine définitif.
- [ ] Refaire l'accueil du CMS.
- [ ] Affiner le constructeur de popups après les tests du client.
- [ ] Nettoyage des images abandonnées sans enregistrement, si besoin.
