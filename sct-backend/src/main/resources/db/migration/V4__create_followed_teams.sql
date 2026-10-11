CREATE TABLE user_followed_team (
    user_id BIGINT NOT NULL REFERENCES app_user(id),
    team_id BIGINT NOT NULL REFERENCES team(id),
    PRIMARY KEY (user_id, team_id)
);