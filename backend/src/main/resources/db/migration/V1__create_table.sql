CREATE TABLE fixture(
    id BIGSERIAL PRIMARY KEY,
    home_team_id BIGINT NOT NULL, REFERENCES team(id),
    away_team_id BIGINT NOT NULL, REFERENCES team(id),
    kickoff  TIMESTAMPTZ NOT NULL,
    is_rivalry BOOLEAN NOT NULL, DEFAULT FALSE
       is_playoff_implication BOOLEAN NOT NULL, DEFAULT FALSE
)