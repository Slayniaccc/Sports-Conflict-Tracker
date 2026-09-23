package com.slayniaccc.sportsconflicttracker.client;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record BallDontLieNflTeamsResponse(
    List<BallDontLieNflTeam> data,
BallDontLieMeta meta
) {}
