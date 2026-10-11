package com.slayniaccc.sportsconflicttracker.client;

import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.slayniaccc.sportsconflicttracker.config.EplConfig;
@Component
public class FootballDataClient {

  private final RestClient restClient;

    public FootballDataClient() {
        this.restClient = RestClient.builder()
            .baseUrl("https://api.football-data.org/v4")
            .defaultStatusHandler(
                HttpStatusCode::isError,
                (req, res) -> {
                    throw new FootballDataException(
                        "Football-Data " + res.getStatusCode() + " on " + req.getURI());
                })
            .build();
    }
    
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