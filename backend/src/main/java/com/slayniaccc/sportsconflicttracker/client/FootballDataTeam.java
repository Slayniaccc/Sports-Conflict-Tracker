package com.slayniaccc.sportsconflicttracker.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record FootballDataTeam(
    Long id,
    String name,
    String shortName,
    String tla,
    String crest
) {}