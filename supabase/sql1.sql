-- ============================================================
-- sql1 : les administrateurs et les popups promotionnels
--
-- À exécuter une seule fois, dans SQL Editor → New query.
-- Le compte contact@oysen.fr doit déjà exister (Authentication → Users).
-- ============================================================


-- ------------------------------------------------------------
-- 1. Les administrateurs
--
-- Être connecté ne suffit pas : seuls les comptes inscrits ici
-- peuvent modifier le contenu du site. Pour ajouter un jour un
-- second administrateur, insérer son identifiant dans cette table.
-- ------------------------------------------------------------

create table public.administrateurs (
  user_id uuid primary key references auth.users (id) on delete cascade,
  cree_le timestamptz not null default now()
);

alter table public.administrateurs enable row level security;

-- Chaque compte ne voit que sa propre ligne ; personne n'écrit
-- dans cette table depuis le site (seulement depuis SQL Editor).
create policy administrateurs_lecture_soi
  on public.administrateurs
  for select
  to authenticated
  using (user_id = (select auth.uid()));

revoke all on public.administrateurs from anon, authenticated;
grant select on public.administrateurs to authenticated;

insert into public.administrateurs (user_id)
select id from auth.users where email = 'contact@oysen.fr'
on conflict do nothing;

-- Le compte connecté est-il administrateur ? Utilisée par les
-- règles d'accès de toutes les tables du CMS.
create function public.est_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.administrateurs
    where user_id = (select auth.uid())
  );
$$;

revoke execute on function public.est_admin() from public, anon;
grant execute on function public.est_admin() to authenticated;


-- ------------------------------------------------------------
-- 2. Les popups promotionnels
--
-- date_fin est exclusive : un popup « jusqu'au 30 juin inclus »
-- a pour date_fin le 1er juillet à minuit.
-- contenu : la grille de lignes, colonnes et blocs construite
-- dans le CMS (voir src/lib/popups.ts).
-- ------------------------------------------------------------

create table public.popups (
  id uuid primary key default gen_random_uuid(),
  nom text not null check (length(trim(nom)) > 0),
  actif boolean not null default false,
  date_debut timestamptz not null default now(),
  date_fin timestamptz not null default (now() + interval '15 days'),
  toutes_pages boolean not null default false,
  pages text[] not null default '{}',
  frequence text not null default 'visite'
    check (frequence in ('chaque_page', 'visite', 'une_fois', 'jours')),
  frequence_jours integer not null default 7
    check (frequence_jours between 1 and 365),
  format text not null default 'moyen'
    check (format in ('petit', 'moyen', 'grand')),
  contenu jsonb not null default '{"lignes": []}'::jsonb
    check (jsonb_typeof(contenu -> 'lignes') = 'array'),
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now(),
  constraint popups_dates_ordonnees check (date_fin > date_debut)
);

create index popups_en_ligne on public.popups (actif, date_debut, date_fin);

-- La date de dernière modification se tient à jour seule.
create function public.maj_modifie_le()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.modifie_le = now();
  return new;
end;
$$;

create trigger popups_modifie_le
  before update on public.popups
  for each row
  execute function public.maj_modifie_le();

alter table public.popups enable row level security;

-- Le site (visiteurs) ne reçoit que les popups en ligne : activés,
-- commencés et pas encore terminés. Un popup terminé n'est donc
-- plus jamais envoyé au site, même s'il reste activé.
create policy popups_lecture_site
  on public.popups
  for select
  to anon, authenticated
  using (actif and date_debut <= now() and date_fin > now());

-- L'administrateur voit tout, y compris les inactifs et les terminés.
create policy popups_lecture_admin
  on public.popups
  for select
  to authenticated
  using ((select public.est_admin()));

create policy popups_creation_admin
  on public.popups
  for insert
  to authenticated
  with check ((select public.est_admin()));

create policy popups_modification_admin
  on public.popups
  for update
  to authenticated
  using ((select public.est_admin()))
  with check ((select public.est_admin()));

create policy popups_suppression_admin
  on public.popups
  for delete
  to authenticated
  using ((select public.est_admin()));

revoke all on public.popups from anon, authenticated;
grant select on public.popups to anon;
grant select, insert, update, delete on public.popups to authenticated;


-- ------------------------------------------------------------
-- 3. Les images des popups
--
-- Un espace de stockage public en lecture (les images s'affichent
-- sur le site), 5 Mo maximum par image, JPEG, PNG ou WebP.
-- Seul l'administrateur dépose, remplace ou supprime.
-- ------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'popups',
  'popups',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy popups_images_lecture_admin
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'popups' and (select public.est_admin()));

create policy popups_images_depot_admin
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'popups' and (select public.est_admin()));

create policy popups_images_modification_admin
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'popups' and (select public.est_admin()))
  with check (bucket_id = 'popups' and (select public.est_admin()));

create policy popups_images_suppression_admin
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'popups' and (select public.est_admin()));
