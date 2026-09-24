package com.slayniaccc.sportsconflicttracker.client;

public record BallDontLieMlbGame(
    Long id,
    String date,
    String season_type,
    BallDontLieGameTeam home_team,
    BallDontLieGameTeam away_team
) {}