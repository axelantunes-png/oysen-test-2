-- ============================================================
-- sql3 : les brouillons de popups
--
-- À exécuter une seule fois, après sql2.sql.
--
-- Un popup dont la création est commencée mais pas terminée est
-- enregistré tout seul, en brouillon, au fil de la saisie : rien
-- n'est perdu si le client quitte l'éditeur sans cliquer sur
-- « Enregistrer ». Ce clic termine la création (brouillon = false).
--
-- Un brouillon peut encore n'avoir aucun nom, et ne peut jamais
-- être activé : il n'est donc jamais envoyé au site.
--
-- Les règles d'accès (RLS) de sql1.sql couvrent la nouvelle
-- colonne : le site ne lit que les popups activés, ce qu'un
-- brouillon n'est jamais. Rien à y changer.
-- ------------------------------------------------------------

alter table public.popups
  add column brouillon boolean not null default false;

-- Le nom n'est plus exigé que d'un popup terminé.
alter table public.popups
  drop constraint if exists popups_nom_check;

alter table public.popups
  add constraint popups_nom_requis
    check (brouillon or length(trim(nom)) > 0);

alter table public.popups
  add constraint popups_brouillon_inactif
    check (not (brouillon and actif));
