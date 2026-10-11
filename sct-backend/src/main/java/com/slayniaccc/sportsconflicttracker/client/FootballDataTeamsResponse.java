package com.slayniaccc.sportsconflicttracker.client;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;
@JsonIgnoreProperties(ignoreUnknown = true)
public record FootballDataTeamsResponse(List<FootballDataTeam> teams){}