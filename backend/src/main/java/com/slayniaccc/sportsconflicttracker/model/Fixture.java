package com.slayniaccc.sportsconflicttracker.model;

import java.time.Instant;

public record Fixture(
    Team homeTeam,
    Team awayTeam,
    Instant kickoff,
    boolean isRivalry,
    boolean isPlayoffImplication
) {}
