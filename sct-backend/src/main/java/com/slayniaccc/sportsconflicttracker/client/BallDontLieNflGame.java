package com.slayniaccc.sportsconflicttracker.client;

public record BallDontLieNflGame(
    Long id,
    String date,
    BallDontLieGameTeam home_team,
    BallDontLieGameTeam visitor_team
) {}