-- Allow anon role to read responses (dashboard is password-protected at app level)
drop policy if exists "select_authenticated" on responses;
create policy "select_public" on responses
  for select using (true);
