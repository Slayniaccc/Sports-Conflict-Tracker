package com.slayniaccc.sportsconflicttracker.client;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record BallDontLieMlbGamesResponse(
    List<BallDontLieMlbGame> data,
    BallDontLieMeta meta
) {}