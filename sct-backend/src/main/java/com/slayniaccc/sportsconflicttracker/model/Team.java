package com.slayniaccc.sportsconflicttracker.model;

public record Team(
    Long id,
    String name,
    League league,
    String externalId
) {}
