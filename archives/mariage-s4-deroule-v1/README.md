# Mariage, S4 « Comment ça se passe », version 1

Version mise de côté le 1er octobre 2026, avant la refonte en « allée ».

Huit étapes en lignes égales sur un fil vertical à gauche, chaque ligne
bordée d'un filet, trois colonnes (repère et titre, Nous, Vous). Au-dessus,
la légende des formules en étiquettes encadrées ; à droite sur ordinateur,
trois barres verticales, une par formule.

Pour revenir à cette version :

1. Dans `src/routes/nos-services/mariages-evenements-prives.tsx`, remplacer
   le bloc « S4 · Comment ça se passe » (des constantes `ETAPES` à la fin de
   la fonction `Deroule`) par le contenu de `Deroule.tsx`.
2. Dans `src/styles/mariage.css`, remplacer le bloc « S4 · Le déroulé » par
   le début de `deroule.css`, et les règles du déroulé du bloc Tablette
   (`@media (max-width: 1023px)`) par l'extrait en fin de fichier. Remettre
   `.deroule` dans la liste `.mariage-hero__inner, .questions-mariage` de ce
   même bloc.
3. Dans `src/components/apparition.ts`, liste `CASCADE`, remplacer
   `'.voies'` et `'.planning__etape'` par `'.departs'`,
   `'.compte__etape'` et `'.couverture'`.

Ce dossier est hors de `src` : il n'est ni compilé ni publié.
