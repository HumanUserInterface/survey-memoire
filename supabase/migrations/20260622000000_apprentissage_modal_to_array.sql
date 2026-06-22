-- À exécuter dans le dashboard Supabase > SQL Editor
--
-- Q19 (apprentissage_modal) is a multi-select question but the column was
-- created as `text`, so the survey stored JS arrays as JSON-encoded strings
-- (e.g. '["seul_essais","collegue"]') alongside a few legacy bare strings.
-- Convert the column to text[] without data loss:
--   * JSON-array strings   -> parsed into text[]
--   * legacy bare strings  -> wrapped into a single-element array
--   * empty JSON array '[]' -> empty array
--   * NULL                 -> NULL
--
-- Postgres forbids a subquery directly inside an ALTER ... USING expression,
-- so the JSON parsing lives in a temporary helper function that USING calls.
-- ALTER TABLE ... USING is transactional: if any row failed to convert, the
-- whole statement rolls back, so no partial/lossy state is possible.

create or replace function _apprentissage_modal_to_array(v text)
returns text[]
language sql
immutable
as $$
  select case
    when v is null then null
    when left(btrim(v), 1) = '[' then
      coalesce(
        (select array_agg(e) from jsonb_array_elements_text(btrim(v)::jsonb) as e),
        array[]::text[]
      )
    else array[v]
  end
$$;

alter table responses
  alter column apprentissage_modal type text[]
  using _apprentissage_modal_to_array(apprentissage_modal);

drop function _apprentissage_modal_to_array(text);
