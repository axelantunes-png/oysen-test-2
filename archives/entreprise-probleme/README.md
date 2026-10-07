# Événements d'entreprise, section « Le problème »

Section retirée de la page le 5 octobre 2026, à la demande de l'utilisateur.

Pour la remettre : replacer `Probleme.tsx` avant le bloc « S4 · Le
dispositif » du composant, rajouter `<Probleme />` après `<Formats />`
dans `Entreprise()`, remettre `probleme.css` avant le bloc « S4 · LE
DISPOSITIF » de `src/styles/entreprise.css` (avec les règles listées à la
fin), et lister dans `src/components/apparition.ts` :
`'.probleme-e__recit'`, `'.probleme-e__attentes'`, `'.bascule'`,
`'.lendemain'`.

Ce dossier est hors de `src` : il n'est ni compilé ni publié.
