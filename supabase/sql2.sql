-- ============================================================
-- sql2 : le ciblage des pages des popups
--
-- À exécuter une seule fois, après sql1.sql.
--
-- Trois façons de choisir les pages d'un popup :
--   toutes     toutes les pages du site ;
--   sauf       toutes les pages, sauf celles de pages_exclues ;
--   certaines  seulement les pages de pages.
--
-- Remplace la colonne toutes_pages, dont la valeur est reprise.
-- Les règles d'accès (RLS) de sql1.sql couvrent les nouvelles
-- colonnes : rien à y changer.
-- ------------------------------------------------------------

alter table public.popups
  add column ciblage text not null default 'toutes'
    check (ciblage in ('toutes', 'sauf', 'certaines'));

alter table public.popups
  add column pages_exclues text[] not null default '{}';

update public.popups
set ciblage = case when toutes_pages then 'toutes' else 'certaines' end;

alter table public.popups drop column toutes_pages;
