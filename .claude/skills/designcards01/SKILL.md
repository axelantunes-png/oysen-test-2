---
name: designcards01
description: Applique le « design cards 01 » (le design des cartes du jeu de piste, S3 de l'accueil Oysen) aux cartes d'une section désignée, en conservant ses projecteurs (lasers) à leur emplacement.
argument-hint: "<section ou cartes à traiter>"
---

# Design cards 01

Appliquer le « design cards 01 » aux cartes désignées : $ARGUMENTS

Si la section ou les cartes visées ne sont pas claires, demander avant de coder.

## Ce qu'est le design cards 01

Le design des cartes du jeu de piste (S3 de l'accueil, `.balise` dans
`src/styles/home.css`), rendu réutilisable sous la classe `.dc01`, définie
dans `src/styles/app.css` (bloc « Design cards 01 », chargé sur tout le
site). Il comprend :

- fond `#17131c` éclairé en biais, inversé une carte sur deux
  (`:nth-child(even)`) ;
- bordure 1px `#574765` en anneau (`box-shadow`), coins de 0.3rem ;
- petit trait lavande en haut de la carte (`.dc01__repere`) ;
- survol : la carte monte de 4px (`translate`), une bordure violette de
  2px avec lueur et ombre apparaît (`.dc01__survol`, en opacité seulement,
  0,6s), zone de survol prolongée sous la carte (`.dc01__zone`) ;
- titres des cartes en gras (700) blanc pur `#ffffff`.

## Marche à suivre

1. Lire le composant et le CSS des cartes visées.
2. Ajouter la classe `dc01` sur l'élément carte, et les trois calques en
   premiers enfants :

   ```tsx
   <span className="dc01__repere" aria-hidden="true" />
   <span className="dc01__survol" aria-hidden="true" />
   <span className="dc01__zone" aria-hidden="true" />
   ```

   Si la carte n'est pas l'enfant direct de sa liste (son rang dans le
   parent ne dit pas sa place), forcer le sens de l'éclairage avec
   `dc01--impaire` ou `dc01--paire`, selon son rang. Si la carte est un
   `<ul>`, l'envelopper dans un `<div>` qui porte `dc01` et les calques :
   un `<ul>` ne peut contenir que des `<li>`.

3. Dans le CSS de la carte, retirer ce qui contredit le design : fond,
   `border`, `box-shadow`, `border-radius`, halos et `transition` de survol,
   brillances de fond. Régler `--dc01-retrait` sur le padding gauche de la
   carte pour aligner le trait du haut sur le contenu.
4. **Conserver les projecteurs (lasers) tels quels**, à leur emplacement :
   le `::after` de la carte et ses variables `--x`, `--y`, `--dir`, `--ouv`
   par carte. Retirer seulement sa `transition` propre : `.dc01::after`
   donne déjà les coins arrondis et la montée au rythme du survol.
5. Passer le titre de chaque carte en `font-weight: 700` et `color: #ffffff`.
6. Si la carte apparaît au défilement (`apparition.ts`), rien à faire :
   `.dc01` ajoute déjà `translate` aux transitions de l'apparition.
7. Lancer `npx tsc --noEmit`.

## Règles

- Ne modifier que les cartes demandées, rien autour. Ne pas toucher S3.
- N'animer que `translate` et `opacity`, jamais `box-shadow`, flou ou
  dégradés.
- Longueurs en rem, jamais de « — », réponses en français, pas de
  vérification dans Chrome, pas de commit.
