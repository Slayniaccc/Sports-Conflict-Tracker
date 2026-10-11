package com.slayniaccc.sportsconflicttracker.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record BallDontLieNflGamesResponse(
    List<BallDontLieNflGame> data,
      BallDontLieMeta meta

) {}