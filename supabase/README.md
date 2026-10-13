# Base de données Supabase

Les scripts SQL de la base, numérotés dans l'ordre où ils doivent être
exécutés : `sql1.sql`, `sql2.sql`, `sql3.sql`…

## Comment les appliquer

1. Ouvrir le projet Supabase, puis **SQL Editor → New query**.
2. Coller le contenu du script suivant dans la numérotation, et l'exécuter.
3. Ne jamais rejouer un script déjà exécuté, ni en modifier un après coup :
   tout changement passe par un nouveau script.

## Règles suivies par chaque script

- Chaque table créée active sa sécurité par ligne (RLS) dans le même script,
  avec ses règles d'accès écrites : l'activation automatique est désactivée
  sur le projet.
- Sans règle, rien n'est permis : chaque accès autorisé est écrit
  explicitement (lecture publique du site, écriture réservée à
  l'administrateur connecté…).
