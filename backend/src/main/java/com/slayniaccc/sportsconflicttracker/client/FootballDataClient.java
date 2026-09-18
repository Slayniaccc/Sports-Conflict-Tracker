package com.slayniaccc.sportsconflicttracker.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
@Component
public class FootballDataClient {

    private final RestClient restClient =
        RestClient.create("https://api.football-data.org/v4");

    public FootballDataTeamsResponse getPlTeams(String apiKey) {
        return restClient.get()
            .uri("/competitions/PL/teams")
            .header("X-Auth-Token", apiKey)
            .retrieve()
            .body(FootballDataTeamsResponse.class);
    }
}