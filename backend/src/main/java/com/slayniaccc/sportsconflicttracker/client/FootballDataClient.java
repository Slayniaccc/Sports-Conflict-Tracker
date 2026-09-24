package com.slayniaccc.sportsconflicttracker.client;

import com.slayniaccc.sportsconflicttracker.config.EplConfig;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class FootballDataClient {


    private final RestClient restClient =
        RestClient.create("https://api.football-data.org/v4");

    public FootballDataTeamsResponse getPlTeams(String apiKey) {
        return restClient.get()
           .uri(uriBuilder -> uriBuilder
             .path("/competitions/PL/teams")
                .queryParam("season", EplConfig.SEASON)
                .build())
            .header("X-Auth-Token", apiKey)
            .retrieve()
            .body(FootballDataTeamsResponse.class);
    }
     public FootballDataMatchesResponse getPlMatches(String apiKey) {
        return restClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/competitions/PL/matches")
                .queryParam("season", EplConfig.SEASON)
                .build())
            .header("X-Auth-Token", apiKey)
            .retrieve()
            .body(FootballDataMatchesResponse.class);
    }
}