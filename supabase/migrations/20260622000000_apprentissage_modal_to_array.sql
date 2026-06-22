-- À exécuter dans le dashboard Supabase > SQL Editor
--
-- Q19 (apprentissage_modal) is a multi-select question but the column was
-- created as `text`, so the survey stored JS arrays as JSON-encoded strings
-- (e.g. '["seul_essais","collegue"]') alongside a few legacy bare strings.
-- Convert the column to text[] without data loss:
--   * JSON-array strings   -> parsed into text[]
--   * legacy bare strings  -> wrapped into a single-element array
--   * NULL                 -> NULL
-- ALTER TABLE ... USING is transactional: if any row failed to convert, the
-- whole statement rolls back, so no partial/lossy state is possible.

alter table responses
  alter column apprentissage_modal type text[]
  using (
    case
      when apprentissage_modal is null then null
      when left(btrim(apprentissage_modal), 1) = '[' then
        array(select jsonb_array_elements_text(btrim(apprentissage_modal)::jsonb))
      else array[apprentissage_modal]
    end
  );
