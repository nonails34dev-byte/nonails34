-- Client space messaging: clients can see their own threads and reply safely.

create table if not exists public.message_replies (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.customer_messages(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(trim(body)) > 0),
  created_at timestamptz not null default now()
);

alter table public.customer_messages add column if not exists client_id uuid references public.profiles(id) on delete set null;
create index if not exists message_replies_message_id_created_at_idx on public.message_replies(message_id, created_at);

create or replace function public.get_client_space()
returns jsonb
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  result jsonb;
begin
  if auth.uid() is null or exists (select 1 from public.profiles where id = auth.uid() and role <> 'client') then
    raise exception 'client access required' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'profile', (select to_jsonb(p) from public.profiles p where p.id = auth.uid()),
    'appointments', coalesce((select jsonb_agg(to_jsonb(a) order by a.starts_at) from public.appointments a where a.client_id = auth.uid()), '[]'::jsonb),
    'notes', coalesce((select jsonb_agg(to_jsonb(n) order by n.created_at desc) from public.client_notes n where n.client_id = auth.uid()), '[]'::jsonb),
    'messages', coalesce((select jsonb_agg(jsonb_build_object('message', to_jsonb(m), 'replies', coalesce((select jsonb_agg(to_jsonb(r) order by r.created_at) from public.message_replies r where r.message_id = m.id), '[]'::jsonb)) order by m.received_at desc) from public.customer_messages m where m.client_id = auth.uid() and m.status <> 'archived'), '[]'::jsonb)
  ) into result;
  return result;
end;
$$;

create or replace function public.create_client_message(p_subject text, p_body text)
returns public.customer_messages
language plpgsql
security invoker
set search_path = public
as $$
declare
  inserted public.customer_messages;
  current_profile public.profiles;
begin
  select * into current_profile from public.profiles where id = auth.uid() and role = 'client';
  if current_profile.id is null then raise exception 'client access required' using errcode = '42501'; end if;
  if char_length(trim(coalesce(p_subject, ''))) = 0 or char_length(trim(coalesce(p_body, ''))) = 0 then
    raise exception 'subject and body are required';
  end if;
  insert into public.customer_messages (client_id, sender_name, sender_email, subject, body)
  values (auth.uid(), coalesce(current_profile.full_name, 'Cliente'), coalesce(current_profile.email, ''), trim(p_subject), trim(p_body))
  returning * into inserted;
  return inserted;
end;
$$;

create or replace function public.reply_to_client_message(p_message_id uuid, p_body text)
returns public.message_replies
language plpgsql
security invoker
set search_path = public
as $$
declare
  inserted public.message_replies;
begin
  if not public.is_admin() then raise exception 'admin access required' using errcode = '42501'; end if;
  insert into public.message_replies (message_id, author_id, body)
  values (p_message_id, auth.uid(), trim(p_body))
  returning * into inserted;
  update public.customer_messages set status = 'read' where id = p_message_id;
  return inserted;
end;
$$;

create or replace function public.reply_to_own_message(p_message_id uuid, p_body text)
returns public.message_replies
language plpgsql
security invoker
set search_path = public
as $$
declare
  inserted public.message_replies;
begin
  if not exists (select 1 from public.customer_messages where id = p_message_id and client_id = auth.uid()) then
    raise exception 'message access denied' using errcode = '42501';
  end if;
  insert into public.message_replies (message_id, author_id, body)
  values (p_message_id, auth.uid(), trim(p_body))
  returning * into inserted;
  return inserted;
end;
$$;

drop policy if exists customer_messages_admin_all on public.customer_messages;
drop policy if exists customer_messages_client_select on public.customer_messages;
drop policy if exists customer_messages_client_insert on public.customer_messages;
create policy customer_messages_admin_all on public.customer_messages for all using (public.is_admin()) with check (public.is_admin());
create policy customer_messages_client_select on public.customer_messages for select using (client_id = auth.uid());
create policy customer_messages_client_insert on public.customer_messages for insert with check (client_id = auth.uid());

drop policy if exists message_replies_admin_all on public.message_replies;
drop policy if exists message_replies_client_own on public.message_replies;
create policy message_replies_admin_all on public.message_replies for all using (public.is_admin()) with check (public.is_admin());
create policy message_replies_client_own on public.message_replies for select using (exists (select 1 from public.customer_messages m where m.id = message_id and m.client_id = auth.uid()));
create policy message_replies_client_insert on public.message_replies for insert with check (author_id = auth.uid() and exists (select 1 from public.customer_messages m where m.id = message_id and m.client_id = auth.uid()));

grant execute on function public.get_client_space() to authenticated;
grant execute on function public.create_client_message(text, text) to authenticated;
grant execute on function public.reply_to_client_message(uuid, text) to authenticated;
grant execute on function public.reply_to_own_message(uuid, text) to authenticated;
