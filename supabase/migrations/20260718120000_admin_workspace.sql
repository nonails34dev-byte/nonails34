-- L'Atelier des Ongles — admin workspace
-- Safe to run more than once. Private admin data is protected by RLS.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  role text not null default 'client' check (role in ('client', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists role text not null default 'client';
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  service text not null,
  starts_at timestamptz not null,
  duration_minutes integer not null default 60 check (duration_minutes > 0 and duration_minutes <= 480),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  amount_cents integer not null default 0 check (amount_cents >= 0),
  notes text not null default '',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.appointments add column if not exists notes text not null default '';
alter table public.appointments add column if not exists updated_at timestamptz not null default now();

create table if not exists public.client_notes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(trim(body)) > 0),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_messages (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.profiles(id) on delete set null,
  sender_name text not null,
  sender_email text not null,
  subject text not null,
  body text not null,
  status text not null default 'unread' check (status in ('unread', 'read', 'archived')),
  assigned_to uuid references public.profiles(id) on delete set null,
  received_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.internal_threads (
  id uuid primary key default gen_random_uuid(),
  subject text not null default 'Équipe',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.internal_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.internal_threads(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(trim(body)) > 0),
  created_at timestamptz not null default now()
);

create index if not exists appointments_starts_at_idx on public.appointments(starts_at);
create index if not exists appointments_client_id_idx on public.appointments(client_id);
create index if not exists client_notes_client_id_idx on public.client_notes(client_id);
create index if not exists customer_messages_status_received_at_idx on public.customer_messages(status, received_at desc);
create index if not exists internal_messages_thread_id_created_at_idx on public.internal_messages(thread_id, created_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists appointments_set_updated_at on public.appointments;
create trigger appointments_set_updated_at before update on public.appointments for each row execute function public.set_updated_at();
drop trigger if exists client_notes_set_updated_at on public.client_notes;
create trigger client_notes_set_updated_at before update on public.client_notes for each row execute function public.set_updated_at();
drop trigger if exists customer_messages_set_updated_at on public.customer_messages;
create trigger customer_messages_set_updated_at before update on public.customer_messages for each row execute function public.set_updated_at();
drop trigger if exists internal_threads_set_updated_at on public.internal_threads;
create trigger internal_threads_set_updated_at before update on public.internal_threads for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), new.email)
  on conflict (id) do update set email = excluded.email, full_name = coalesce(excluded.full_name, profiles.full_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.get_admin_dashboard(p_from date default current_date, p_to date default current_date + 30)
returns jsonb
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  result jsonb;
begin
  if not public.is_admin() then
    raise exception 'admin access required' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'appointments', coalesce((select jsonb_agg(to_jsonb(a) order by a.starts_at) from public.appointments a where a.starts_at >= p_from::timestamptz and a.starts_at < (p_to + 1)::timestamptz), '[]'::jsonb),
    'unread_messages', (select count(*) from public.customer_messages where status = 'unread'),
    'pending_appointments', (select count(*) from public.appointments where status = 'pending'),
    'client_count', (select count(*) from public.profiles where role = 'client')
  ) into result;
  return result;
end;
$$;

create or replace function public.get_client_history(p_client_id uuid)
returns jsonb
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  result jsonb;
begin
  if not public.is_admin() and auth.uid() <> p_client_id then
    raise exception 'client history access denied' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'profile', (select to_jsonb(p) from public.profiles p where p.id = p_client_id),
    'appointments', coalesce((select jsonb_agg(to_jsonb(a) order by a.starts_at desc) from public.appointments a where a.client_id = p_client_id), '[]'::jsonb),
    'notes', coalesce((select jsonb_agg(to_jsonb(n) order by n.created_at desc) from public.client_notes n where n.client_id = p_client_id), '[]'::jsonb)
  ) into result;
  return result;
end;
$$;

create or replace function public.update_appointment_admin(p_appointment_id uuid, p_notes text default null, p_status text default null)
returns public.appointments
language plpgsql
security invoker
set search_path = public
as $$
declare
  updated public.appointments;
begin
  if not public.is_admin() then
    raise exception 'admin access required' using errcode = '42501';
  end if;
  update public.appointments
  set notes = coalesce(p_notes, notes),
      status = coalesce(p_status, status)
  where id = p_appointment_id
    and (p_status is null or p_status in ('pending', 'confirmed', 'completed', 'cancelled'))
  returning * into updated;
  if updated.id is null then raise exception 'appointment not found or invalid status'; end if;
  return updated;
end;
$$;

create or replace function public.create_internal_message(p_thread_id uuid, p_body text)
returns public.internal_messages
language plpgsql
security invoker
set search_path = public
as $$
declare
  inserted public.internal_messages;
begin
  if not public.is_admin() then
    raise exception 'admin access required' using errcode = '42501';
  end if;
  insert into public.internal_messages (thread_id, sender_id, body)
  values (p_thread_id, auth.uid(), trim(p_body))
  returning * into inserted;
  return inserted;
end;
$$;

alter table public.profiles enable row level security;
alter table public.appointments enable row level security;
alter table public.client_notes enable row level security;
alter table public.customer_messages enable row level security;
alter table public.internal_threads enable row level security;
alter table public.internal_messages enable row level security;

drop policy if exists profiles_self_or_admin_select on public.profiles;
create policy profiles_self_or_admin_select on public.profiles for select using (id = auth.uid() or public.is_admin());
drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists appointments_client_or_admin_select on public.appointments;
create policy appointments_client_or_admin_select on public.appointments for select using (client_id = auth.uid() or public.is_admin());
drop policy if exists appointments_admin_insert on public.appointments;
create policy appointments_admin_insert on public.appointments for insert with check (public.is_admin());
drop policy if exists appointments_admin_update on public.appointments;
create policy appointments_admin_update on public.appointments for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists appointments_admin_delete on public.appointments;
create policy appointments_admin_delete on public.appointments for delete using (public.is_admin());

drop policy if exists client_notes_client_or_admin_select on public.client_notes;
create policy client_notes_client_or_admin_select on public.client_notes for select using (client_id = auth.uid() or public.is_admin());
drop policy if exists client_notes_admin_write on public.client_notes;
create policy client_notes_admin_write on public.client_notes for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists customer_messages_admin_all on public.customer_messages;
create policy customer_messages_admin_all on public.customer_messages for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists internal_threads_admin_all on public.internal_threads;
create policy internal_threads_admin_all on public.internal_threads for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists internal_messages_admin_all on public.internal_messages;
create policy internal_messages_admin_all on public.internal_messages for all using (public.is_admin()) with check (public.is_admin());

grant execute on function public.is_admin() to authenticated;
grant execute on function public.get_admin_dashboard(date, date) to authenticated;
grant execute on function public.get_client_history(uuid) to authenticated;
grant execute on function public.update_appointment_admin(uuid, text, text) to authenticated;
grant execute on function public.create_internal_message(uuid, text) to authenticated;
