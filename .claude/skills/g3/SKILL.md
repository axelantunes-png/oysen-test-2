---
name: g3
description: Commite tout le travail en cours et pousse la branche main sur « git test 2 » (remote `test2`, oysen-test-2).
argument-hint: "[message de commit, facultatif]"
disable-model-invocation: true
---

# Push sur « git test 2 »

Pousser sur « git test 2 » : remote `test2`, https://github.com/axelantunes-png/oysen-test-2.git, branche `main`.

1. `git status --short` et `git diff --stat` pour voir ce qui part. Ne jamais ajouter
   de secret (`.env`, clés) ; les documents internes (`A-FAIRE.md`, `avancé.md`,
   `RECAP-SESSION-*.md`, `image/`) sont déjà exclus par le `.gitignore`.
2. Vérifier que le remote `test2` existe (`git remote -v`). S'il manque, l'ajouter :
   `git remote add test2 https://github.com/axelantunes-png/oysen-test-2.git`. Ne jamais renommer
   ni modifier les autres remotes.
3. S'il y a des changements : `git add -A`, puis un commit en français. Message :
   $ARGUMENTS s'il est fourni, sinon un résumé court de ce qui change. Sans « — ».
   Terminer par la ligne d'attribution habituelle.
4. `git push test2 main`. Jamais de `--force` sans demande explicite. Si le push est
   refusé (historique divergent), s'arrêter et expliquer, sans forcer.
5. Rendre compte en français : le commit, le dépôt, et ce qui a été poussé.
