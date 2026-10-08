-- Run after 001_cms.sql. Enquiries are private; only CMS editors can read.
create table public.enquiries (
 id uuid primary key,
 kind text not null check (kind in ('offer','contact')),
 email text not null check(length(email)<=254),
 name text not null default '' check(length(name)<=100),
 message text not null default '' check(length(message)<=4000),
 mode boolean not null default false,
 offer_code text,
 consent_at timestamptz not null default now(),
 created_at timestamptz not null default now(),
 visitor_hash text not null
);
create index enquiries_rate_idx on public.enquiries(visitor_hash,created_at);
alter table public.enquiries enable row level security;
revoke all on public.enquiries from anon, authenticated;
grant select on public.enquiries to authenticated;
create policy "Editors read enquiries" on public.enquiries for select to authenticated
 using (exists(select 1 from public.cms_editors where user_id=auth.uid()));
create function public.submit_enquiry(payload jsonb,visitor_hash text) returns void
language plpgsql security invoker set search_path=public as $$
begin
 perform pg_advisory_xact_lock(hashtextextended(visitor_hash,0));
 if exists(select 1 from public.enquiries where id=(payload->>'id')::uuid) then return; end if;
 if (select count(*) from public.enquiries e where e.visitor_hash=submit_enquiry.visitor_hash and created_at>now()-interval '1 hour')>=5 then
  raise exception 'Please wait before submitting again.';
 end if;
 insert into public.enquiries(id,kind,email,name,message,mode,offer_code,visitor_hash)
 values((payload->>'id')::uuid,payload->>'kind',payload->>'email',payload->>'name',payload->>'message',coalesce((payload->>'mode')::boolean,false),case when payload->>'kind'='offer' then 'YELLO15' else null end,visitor_hash);
end; $$;
revoke all on function public.submit_enquiry(jsonb,text) from public,anon,authenticated;
grant execute on function public.submit_enquiry(jsonb,text) to service_role;
grant all on public.enquiries to service_role;
