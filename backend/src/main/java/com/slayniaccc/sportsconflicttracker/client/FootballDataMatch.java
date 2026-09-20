package com.slayniaccc.sportsconflicttracker.client;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
@JsonIgnoreProperties(ignoreUnknown = true)
public record FootballDataMatch(
    Long id,
    String utcDate,
    String status,
    FootballDataTeam homeTeam,
    FootballDataTeam awayTeam
) {}