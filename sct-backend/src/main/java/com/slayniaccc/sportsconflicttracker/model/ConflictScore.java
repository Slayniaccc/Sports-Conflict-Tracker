package com.slayniaccc.sportsconflicttracker.model;


import java.util.List;
public record ConflictScore(
    Fixture fixture,
    int score,
    String reasoning,
    List<Factor> factors
) {}