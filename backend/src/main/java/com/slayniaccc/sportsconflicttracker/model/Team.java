package com.slayniaccc.sportsconflicttracker.model;

public record Team(
    String name,
    League league,
    String externalId
) {}
