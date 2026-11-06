package com.slayniaccc.sportsconflicttracker.model;

import java.util.List;




public record TeamDetailResponse(
    Long id,
    String name,
    String league,
    String externalId,
    List<ConflictScore> fixtures

) {}