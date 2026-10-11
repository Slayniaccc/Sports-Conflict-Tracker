-- Align team and fixture tables with current entity definitions.
-- Captures manual schema changes made during fixture sync development:
--   * team: replace single-column unique on external_id with composite
--     (league, external_id)
--   * fixture: add external_id and league columns, add composite unique

-- ---- team ------------------------------------------------------------

ALTER TABLE team DROP CONSTRAINT IF EXISTS team_external_id_key;

ALTER TABLE team DROP CONSTRAINT IF EXISTS team_league_external_id_key;
ALTER TABLE team ADD CONSTRAINT team_league_external_id_key UNIQUE (league, external_id);

-- ---- fixture ---------------------------------------------------------

ALTER TABLE fixture ADD COLUMN IF NOT EXISTS external_id VARCHAR(255);
ALTER TABLE fixture ADD COLUMN IF NOT EXISTS league      VARCHAR(10);

UPDATE fixture SET league      = 'NBA' WHERE league      IS NULL;
UPDATE fixture SET external_id = 'legacy-' || id WHERE external_id IS NULL;

ALTER TABLE fixture ALTER COLUMN league      SET NOT NULL;
ALTER TABLE fixture ALTER COLUMN external_id SET NOT NULL;

ALTER TABLE fixture DROP CONSTRAINT IF EXISTS fixture_external_id_key;
ALTER TABLE fixture DROP CONSTRAINT IF EXISTS fixture_league_external_id_key;
ALTER TABLE fixture ADD CONSTRAINT fixture_league_external_id_key UNIQUE (league, external_id);
