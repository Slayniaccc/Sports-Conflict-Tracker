package com.slayniaccc.sportsconflicttracker.model;

public record ConflictScore(
    Fixture fixture,
    int score,
    String reasoning
) {}