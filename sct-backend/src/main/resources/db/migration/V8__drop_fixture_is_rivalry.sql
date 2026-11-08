-- Rivalries are looked up from the rivalry table at scoring time (V7),
-- so the per-fixture flag is no longer read or written.
ALTER TABLE fixture DROP COLUMN is_rivalry;
