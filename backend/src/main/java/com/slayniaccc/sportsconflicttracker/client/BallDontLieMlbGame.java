package com.slayniaccc.sportsconflicttracker.client;

public record BallDontLieMlbGame(
    Long id,
    String date,
    BallDontLieGameTeam home_team,
    BallDontLieGameTeam away_team
) {}