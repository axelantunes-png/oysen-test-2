---
name: g1
description: Commite tout le travail en cours et pousse la branche main sur « git prod » (remote `origin`, oysen).
argument-hint: "[message de commit, facultatif]"
disable-model-invocation: true
---

# Push sur « git prod »

Pousser sur « git prod » : remote `origin`, https://github.com/axelantunes-png/oysen.git, branche `main`.

1. `git status --short` et `git diff --stat` pour voir ce qui part. Ne jamais ajouter
   de secret (`.env`, clés) ; les documents internes (`A-FAIRE.md`, `avancé.md`,
   `RECAP-SESSION-*.md`, `image/`) sont déjà exclus par le `.gitignore`.
2. Vérifier que le remote `origin` existe (`git remote -v`). S'il manque, l'ajouter :
   `git remote add origin https://github.com/axelantunes-png/oysen.git`. Ne jamais renommer
   ni modifier les autres remotes.
3. S'il y a des changements : `git add -A`, puis un commit en français. Message :
   $ARGUMENTS s'il est fourni, sinon un résumé court de ce qui change. Sans « — ».
   Terminer par la ligne d'attribution habituelle.

   **Dépôt de production.** Avant le push, afficher le résumé (commit, nombre de
   fichiers) et demander une confirmation explicite à l'utilisateur. Sans « oui »,
   ne rien pousser.
4. `git push origin main`. Jamais de `--force` sans demande explicite. Si le push est
   refusé (historique divergent), s'arrêter et expliquer, sans forcer.
5. Rendre compte en français : le commit, le dépôt, et ce qui a été poussé.
