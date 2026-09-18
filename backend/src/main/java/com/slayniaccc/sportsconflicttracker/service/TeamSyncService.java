package com.slayniaccc.sportsconflicttracker.service;
import com.slayniaccc.sportsconflicttracker.client.BallDontLieNbaTeamsResponse;
import com.slayniaccc.sportsconflicttracker.client.BallDontLieNflTeamsResponse;
import com.slayniaccc.sportsconflicttracker.client.BallDontLieMlbTeamsResponse;
import com.slayniaccc.sportsconflicttracker.client.FootballDataClient;
import com.slayniaccc.sportsconflicttracker.client.FootballDataTeamsResponse;
import com.slayniaccc.sportsconflicttracker.entity.TeamEntity;
import com.slayniaccc.sportsconflicttracker.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;


@Service
public class TeamSyncService {

    private final RestClient restClient;
    private final TeamRepository teamRepository;
    private final FootballDataClient footballDataClient;

    public TeamSyncService(TeamRepository teamRepository, FootballDataClient footballDataClient) {
        this.restClient = RestClient.create("https://api.balldontlie.io");
        this.teamRepository = teamRepository;
        this.footballDataClient = footballDataClient;
    }

    public void syncNbaTeams(String apiKey) {
        BallDontLieNbaTeamsResponse response = restClient.get()
            .uri("/nba/v1/teams")
            .header("Authorization", apiKey)
            .retrieve() //network call occurs here
            .body(BallDontLieNbaTeamsResponse.class);

        for (var bdlTeam : response.data()) {
           // /nba/v1/teams returns 89 rows: 1–30 are current NBA franchises,
// 37+ are defunct/historical/exhibition teams. Keep only current ones.
              if (bdlTeam.id() < 1 || bdlTeam.id() > 30) {
                continue;
            } //iterates over parsed dto objects
            TeamEntity entity = new TeamEntity(); //fresh entity
            entity.setName(bdlTeam.full_name());//maps dto field to entity field
            entity.setLeague("NBA");
            entity.setExternalId(String.valueOf(bdlTeam.id()));
            teamRepository.save(entity);
        }
    }

       public void syncNflTeams(String apiKey) {
        BallDontLieNflTeamsResponse response = restClient.get()
            .uri("/nfl/v1/teams")
            .header("Authorization", apiKey)
            .retrieve() //network call occurs here
            .body(BallDontLieNflTeamsResponse.class);

        for (var bdlTeam : response.data()) {
              //iterates over parsed dto objects
            TeamEntity entity = new TeamEntity(); //fresh entity
            entity.setName(bdlTeam.full_name());//maps dto field to entity field
            entity.setLeague("NFL");
            entity.setExternalId(String.valueOf(bdlTeam.id()));
            teamRepository.save(entity);
        }
    }

         public void syncMlbTeams(String apiKey) {
        BallDontLieMlbTeamsResponse response = restClient.get()
            .uri("/mlb/v1/teams")
            .header("Authorization", apiKey)
            .retrieve() //network call occurs here
            .body(BallDontLieMlbTeamsResponse.class);

        for (var bdlTeam : response.data()) {
              //iterates over parsed dto objects
            TeamEntity entity = new TeamEntity(); //fresh entity
            entity.setName(bdlTeam.display_name());//maps dto field to entity field
            entity.setLeague("MLB");
            entity.setExternalId(String.valueOf(bdlTeam.id()));
            teamRepository.save(entity);
        }
    }
public void syncEplTeams(String apiKey) {
    FootballDataTeamsResponse response = footballDataClient.getPlTeams(apiKey);

    for (var t : response.teams()) {
        TeamEntity entity = new TeamEntity();
        entity.setName(t.name());
        entity.setLeague("EPL");
        entity.setExternalId(String.valueOf(t.id()));
        teamRepository.save(entity);
    }
}
}