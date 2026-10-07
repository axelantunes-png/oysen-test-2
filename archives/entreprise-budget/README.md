# Événements d'entreprise, section « Budget »

Section retirée de la page le 5 octobre 2026, à la demande de l'utilisateur.
Elle contenait le tableau des ordres de budget par format (repères du
marché en 2026, entre crochets), ce qui fait varier le budget, ce que
contient la proposition, et, en commentaire, la version sans montant.

Pour la remettre : replacer `Budget.tsx` avant le bloc « S8 · Les
questions » du composant, rajouter `<Budget />` avant `<Questions />`
dans `Entreprise()`, remettre `budget.css` dans `src/styles/entreprise.css`
(avant le bloc « S8 · LES QUESTIONS »), et lister dans
`src/components/apparition.ts` : `'.budget-e'`, `'.budget-e__colonnes'`.

Ce dossier est hors de `src` : il n'est ni compilé ni publié.
