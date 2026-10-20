ALTER TABLE app_user
    ADD COLUMN favorite_team_id BIGINT REFERENCES team(id) on DELETE
    SET NULL;