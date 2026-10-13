# L'agence, section « Notre approche », version 1

Version mise de côté le 11 octobre 2026, remplacée par la mise en page de
la maquette : trois colonnes à concilier, la méthode et ses cinq réflexes
en liste, la maxime et la signature. Cette version-ci portait le triangle
de structure tracé en treillis (`Triangle.tsx`), la chaîne de cotes des
réflexes et les deux métiers reliés par le losange.

Pour la remettre : remplacer le bloc « S6. Notre approche » du composant
`src/routes/qui-sommes-nous/l-agence.tsx` par `Approche.tsx`, remettre
`Triangle.tsx` dans `src/components/agence/` et son import dans le
composant, remplacer le bloc « S6 · Notre approche » de
`src/styles/agence.css` par `approche.css`, et lister dans
`src/components/apparition.ts` : `'.approche__schema'`,
`'.approche__intro'`, `'.approche__methode'`, `'.reflexes > li'`,
`'.approche__maxime'`, `'.approche__marque'`, `'.approche__signature'`.

Ce dossier est hors de `src` : il n'est ni compilé ni publié.
