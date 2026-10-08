-- Run once in the Supabase SQL editor. No service-role key is used by the website.
create table if not exists public.cms_editors (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.cms_editors enable row level security;
create policy "Editors see their membership" on public.cms_editors for select to authenticated using (user_id = (select auth.uid()));
grant select on public.cms_editors to authenticated;
revoke all on public.cms_editors from anon;

create table if not exists public.cms_drafts (id text primary key check (id = 'site'), content jsonb not null, revision integer not null default 1, updated_at timestamptz not null default now());
create table if not exists public.cms_public (id text primary key check (id = 'site'), content jsonb not null, published_at timestamptz not null default now());
alter table public.cms_drafts enable row level security;
alter table public.cms_public enable row level security;
create policy "Editors manage drafts" on public.cms_drafts for all to authenticated using (exists(select 1 from public.cms_editors where user_id = (select auth.uid()))) with check (exists(select 1 from public.cms_editors where user_id = (select auth.uid())));
create policy "Anyone reads published content" on public.cms_public for select to anon, authenticated using (true);
create policy "Editors publish content" on public.cms_public for all to authenticated using (exists(select 1 from public.cms_editors where user_id = (select auth.uid()))) with check (exists(select 1 from public.cms_editors where user_id = (select auth.uid())));
grant select, insert, update on public.cms_drafts, public.cms_public to authenticated;
grant select on public.cms_public to anon;
revoke all on public.cms_drafts from anon;

create or replace function public.cms_save(payload jsonb, expected_revision integer, publish_now boolean default false)
returns integer language plpgsql security invoker set search_path = public as $$
declare next_revision integer;
begin
  if not exists(select 1 from public.cms_editors where user_id = auth.uid()) then raise exception 'Forbidden'; end if;
  perform pg_advisory_xact_lock(7251459);
  if coalesce((select revision from public.cms_drafts where id = 'site'),0) <> expected_revision then raise exception 'Revision conflict: reload before saving'; end if;
  next_revision := expected_revision + 1;
  insert into public.cms_drafts(id,content,revision) values('site',payload,next_revision)
  on conflict(id) do update set content=excluded.content, revision=excluded.revision, updated_at=now();
  if publish_now then
    insert into public.cms_public(id,content) values('site',payload)
    on conflict(id) do update set content=excluded.content, published_at=now();
  end if;
  return next_revision;
end $$;
revoke all on function public.cms_save(jsonb,integer,boolean) from public, anon;
grant execute on function public.cms_save(jsonb,integer,boolean) to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('site-media','site-media',true,3145728,array['image/jpeg','image/png','image/webp','image/avif'])
on conflict(id) do update set public=true, file_size_limit=3145728, allowed_mime_types=excluded.allowed_mime_types;
create policy "Editors upload media" on storage.objects for insert to authenticated with check (bucket_id='site-media' and exists(select 1 from public.cms_editors where user_id=(select auth.uid())));
create policy "Editors view media" on storage.objects for select to authenticated using (bucket_id='site-media' and exists(select 1 from public.cms_editors where user_id=(select auth.uid())));
-- Invite/create an Auth user, then add their UUID (not an email):
-- insert into public.cms_editors(user_id) values ('YOUR-AUTH-USER-UUID');
