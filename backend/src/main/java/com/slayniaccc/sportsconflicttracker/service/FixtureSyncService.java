package com.slayniaccc.sportsconflicttracker.service;
import com.slayniaccc.sportsconflicttracker.client.BallDontLieNbaGamesResponse;
import com.slayniaccc.sportsconflicttracker.client.BallDontLieMlbGamesResponse;
import com.slayniaccc.sportsconflicttracker.client.BallDontLieNflGamesResponse;
import com.slayniaccc.sportsconflicttracker.client.FootballDataMatchesResponse;


import java.time.Instant;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import com.slayniaccc.sportsconflicttracker.entity.FixtureEntity;
import com.slayniaccc.sportsconflicttracker.entity.TeamEntity;
import com.slayniaccc.sportsconflicttracker.repository.FixtureRepository;
import com.slayniaccc.sportsconflicttracker.repository.TeamRepository;

@Service
public class FixtureSyncService{
private final RestClient bdlClient;
private final RestClient footballDataClient;
private final FixtureRepository fixtureRepository;
private final TeamRepository teamRepository;


public FixtureSyncService(FixtureRepository fixtureRepository, TeamRepository teamRepository){
     this.bdlClient = RestClient.create("https://api.balldontlie.io");
        this.fixtureRepository = fixtureRepository;
        this.teamRepository = teamRepository;
        this.footballDataClient = RestClient.create("https://api.football-data.org");
}
    public void syncNbaFixtures(String apiKey) {
        BallDontLieNbaGamesResponse response = bdlClient.get()
            .uri("/nba/v1/games?seasons[]=2026")
            .header("Authorization", apiKey)
            .retrieve() 
            .body(BallDontLieNbaGamesResponse.class);

        for (var game : response.data()) {
                 if (fixtureRepository.findByLeagueAndExternalId("NBA", String.valueOf(game.id())).isPresent())  {
            continue;
          }
               TeamEntity home = teamRepository.findByLeagueAndExternalId("NBA", String.valueOf(game.home_team().id()))
            .orElseThrow(() -> new IllegalStateException("Unknown home team: " + game.home_team().id()));
     TeamEntity away = teamRepository.findByLeagueAndExternalId("NBA", String.valueOf(game.visitor_team().id()))
            .orElseThrow(() -> new IllegalStateException("Unknown visitor team: " + game.visitor_team().id()));

            FixtureEntity entity = new FixtureEntity(); 
            entity.setHomeTeam(home);
            entity.setAwayTeam(away);
            entity.setKickoff(Instant.parse(game.datetime()));
            entity.setLeague("NBA");
            entity.setExternalId(String.valueOf(game.id()));
            fixtureRepository.save(entity);
        }
    }


    public void syncNflFixtures(String apiKey) {
        BallDontLieNflGamesResponse response = bdlClient.get()
            .uri("/nfl/v1/games?seasons[]=2026")
            .header("Authorization", apiKey)
            .retrieve() 
            .body(BallDontLieNflGamesResponse.class);

        for (var game : response.data()) {
           if (fixtureRepository.findByLeagueAndExternalId("NFL", String.valueOf(game.id())).isPresent()) {
            continue;
          }
               TeamEntity home = teamRepository.findByLeagueAndExternalId("NFL", String.valueOf(game.home_team().id()))
            .orElseThrow(() -> new IllegalStateException("Unknown home team: " + game.home_team().id()));
     TeamEntity away = teamRepository.findByLeagueAndExternalId("NFL", String.valueOf(game.visitor_team().id()))
            .orElseThrow(() -> new IllegalStateException("Unknown visitor team: " + game.visitor_team().id()));

            FixtureEntity entity = new FixtureEntity(); 
            entity.setHomeTeam(home);
            entity.setAwayTeam(away);
            entity.setLeague("NFL");
            entity.setKickoff(Instant.parse(game.date()));
            entity.setExternalId(String.valueOf(game.id()));
            fixtureRepository.save(entity);
        }
    }
public void syncMlbFixtures(String apiKey) {
    BallDontLieMlbGamesResponse response = bdlClient.get()
        .uri("/mlb/v1/games?seasons[]=2025")
        .header("Authorization", apiKey)
        .retrieve()
        .body(BallDontLieMlbGamesResponse.class);

    for (var game : response.data()) {
        if (fixtureRepository.findByLeagueAndExternalId("MLB", String.valueOf(game.id())).isPresent()) {
            continue;
        }

        TeamEntity home = teamRepository.findByLeagueAndExternalId("MLB", String.valueOf(game.home_team().id()))
            .orElseThrow(() -> new IllegalStateException("Unknown home team: " + game.home_team().id()));

        TeamEntity away = teamRepository.findByLeagueAndExternalId("MLB", String.valueOf(game.away_team().id()))
            .orElseThrow(() -> new IllegalStateException("Unknown away team: " + game.away_team().id()));

        FixtureEntity entity = new FixtureEntity();
        entity.setHomeTeam(home);
        entity.setAwayTeam(away);
        entity.setKickoff(Instant.parse(game.date()));
        entity.setLeague("MLB");
        entity.setExternalId(String.valueOf(game.id()));

        fixtureRepository.save(entity);
    }
}

public void syncEplFixtures(String apiKey) {
    FootballDataMatchesResponse response = footballDataClient.get()
        .uri("/v4/competitions/PL/matches?season=2026")
        .header("X-Auth-Token", apiKey)
        .retrieve()
        .body(FootballDataMatchesResponse.class);

    for (var match : response.matches()) {
        if (fixtureRepository.findByLeagueAndExternalId("EPL", String.valueOf(match.id())).isPresent()) {
            continue;
        }

        TeamEntity home = teamRepository.findByLeagueAndExternalId("EPL", String.valueOf(match.homeTeam().id()))
            .orElseThrow(() -> new IllegalStateException("Unknown home team: " + match.homeTeam().id()));

        TeamEntity away = teamRepository.findByLeagueAndExternalId("EPL", String.valueOf(match.awayTeam().id()))
            .orElseThrow(() -> new IllegalStateException("Unknown away team: " + match.awayTeam().id()));

        FixtureEntity entity = new FixtureEntity();
        entity.setHomeTeam(home);
        entity.setAwayTeam(away);
        entity.setKickoff(Instant.parse(match.utcDate()));
        entity.setLeague("EPL");
        entity.setExternalId(String.valueOf(match.id()));

        fixtureRepository.save(entity);
    }
}

}