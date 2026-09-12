package com.slayniaccc.sportsconflicttracker.service;
import com.slayniaccc.sportsconflicttracker.client.BallDontLieTeamsResponse;
import com.slayniaccc.sportsconflicttracker.entity.TeamEntity;
import com.slayniaccc.sportsconflicttracker.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;


@Service
public class TeamSyncService {

    private final RestClient restClient;
    private final TeamRepository teamRepository;

    public TeamSyncService(TeamRepository teamRepository) {
        this.restClient = RestClient.create("https://api.balldontlie.io");
        this.teamRepository = teamRepository;
    }

    public void syncNbaTeams(String apiKey) {
        BallDontLieTeamsResponse response = restClient.get()
            .uri("/nba/v1/teams")
            .header("Authorization", apiKey)
            .retrieve() //network call occurs here
            .body(BallDontLieTeamsResponse.class);

        for (var bdlTeam : response.data()) {
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
}