package com.slayniaccc.sportsconflicttracker.model;

public record Rivalry(

    String league,
    String teamA,
    String teamB,
    int intensity,
    String note
) {}