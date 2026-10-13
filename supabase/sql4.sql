-- ============================================================
-- sql4 : le contenu des popups passe à la grille de 12 colonnes
--
-- À exécuter une seule fois, après sql3.sql.
--
-- Le constructeur range désormais chaque bloc à sa place sur une
-- grille : contenu = { "version": 2, "blocs": [ … ] }, chaque bloc
-- portant sa place (colonne, largeur, ligne, hauteur, centrage,
-- marges). Voir src/lib/popups.ts.
--
-- Les popups déjà enregistrés gardent l'ancien format (« lignes »)
-- tant qu'ils ne sont pas réenregistrés : le site et le CMS le
-- convertissent à la lecture. La règle de forme accepte donc les
-- deux.
--
-- Les règles d'accès (RLS) de sql1.sql ne changent pas.
-- ------------------------------------------------------------

alter table public.popups
  drop constraint if exists popups_contenu_check;

alter table public.popups
  add constraint popups_contenu_forme
    check (
      jsonb_typeof(contenu -> 'blocs') = 'array'
      or jsonb_typeof(contenu -> 'lignes') = 'array'
    );

alter table public.popups
  alter column contenu set default '{"version": 2, "blocs": []}'::jsonb;
