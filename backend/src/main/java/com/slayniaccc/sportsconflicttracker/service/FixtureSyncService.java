package com.slayniaccc.sportsconflicttracker.service;
import com.slayniaccc.sportsconflicttracker.client.BallDontLieNbaGame;
import com.slayniaccc.sportsconflicttracker.client.BallDontLieNbaGamesResponse;
import com.slayniaccc.sportsconflicttracker.client.BallDontLieNflGame;
import com.slayniaccc.sportsconflicttracker.client.BallDontLieNflGamesResponse;
import com.slayniaccc.sportsconflicttracker.client.BallDontLieNbaTeamsResponse;
import java.time.Instant;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import com.slayniaccc.sportsconflicttracker.entity.FixtureEntity;
import com.slayniaccc.sportsconflicttracker.entity.TeamEntity;
import com.slayniaccc.sportsconflicttracker.repository.FixtureRepository;
import com.slayniaccc.sportsconflicttracker.repository.TeamRepository;

@Service
public class FixtureSyncService{
private final RestClient restClient;
private final FixtureRepository fixtureRepository;
private final TeamRepository teamRepository;

public FixtureSyncService(FixtureRepository fixtureRepository, TeamRepository teamRepository){
     this.restClient = RestClient.create("https://api.balldontlie.io");
        this.fixtureRepository = fixtureRepository;
        this.teamRepository = teamRepository;
}
    public void syncNbaFixtures(String apiKey) {
        BallDontLieNbaGamesResponse response = restClient.get()
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
        BallDontLieNflGamesResponse response = restClient.get()
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

}