# Le fondateur, section « Retours de terrain »

Section « Ce que le terrain m'a appris » retirée de la page le 7 octobre
2026, à la demande de l'utilisateur. La section « Sur le terrain »
(l'événement marquant) est gardée.

Pour la remettre : replacer `Lecons.tsx` avant le bloc « Un événement qui
m'a marqué » du composant, rajouter `<Lecons />` entre `<Savoirs />` et
`<Marquant />`, remettre les morceaux de `lecons.css` dans
`src/styles/fondateur.css` (et les deux règles partagées listées à la
fin), et lister dans `src/components/apparition.ts` : `'.lecon-une'`,
`'.lecons > li'`.

Ce dossier est hors de `src` : il n'est ni compilé ni publié.
