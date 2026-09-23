package com.slayniaccc.sportsconflicttracker.service;
import com.slayniaccc.sportsconflicttracker.client.BallDontLieNbaTeamsResponse;
import com.slayniaccc.sportsconflicttracker.client.BallDontLieNflTeam;
import com.slayniaccc.sportsconflicttracker.client.BallDontLieNflTeamsResponse;
import com.slayniaccc.sportsconflicttracker.client.BallDontLieMlbTeamsResponse;
import com.slayniaccc.sportsconflicttracker.client.BallDontLieNbaTeam;
import com.slayniaccc.sportsconflicttracker.client.FootballDataClient;
import com.slayniaccc.sportsconflicttracker.client.FootballDataTeamsResponse;
import com.slayniaccc.sportsconflicttracker.entity.TeamEntity;
import com.slayniaccc.sportsconflicttracker.repository.TeamRepository;
import com.slayniaccc.sportsconflicttracker.client.BallDontLieClient;
import com.slayniaccc.sportsconflicttracker.client.BallDontLieMlbTeam;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.List;
import java.util.Map;


@Service
public class TeamSyncService {

    private final BallDontLieClient bdlClient;
    private final TeamRepository teamRepository;
    private final FootballDataClient footballDataClient;

    public TeamSyncService(TeamRepository teamRepository, FootballDataClient footballDataClient, BallDontLieClient bdlClient) {
       this.bdlClient = bdlClient;
        this.teamRepository = teamRepository;
        this.footballDataClient = footballDataClient;
    }

    public void syncNbaTeams(String apiKey) {
       List<BallDontLieNbaTeam> teams = bdlClient.fetchAll(
            apiKey,
            "/nba/v1/teams",
            Map.of(),
            BallDontLieNbaTeamsResponse.class,
            BallDontLieNbaTeamsResponse::data,
            r -> r.meta() == null ? null : r.meta().next_cursor()
        );

        for (var bdlTeam : teams) {
            if (bdlTeam.id() < 1 || bdlTeam.id() > 30) {
                continue;
            }

            if (teamRepository.findByLeagueAndExternalId("NBA", String.valueOf(bdlTeam.id())).isPresent()) {
                continue;
            }

            TeamEntity entity = new TeamEntity();
            entity.setName(bdlTeam.full_name());
            entity.setLeague("NBA");
            entity.setExternalId(String.valueOf(bdlTeam.id()));
            teamRepository.save(entity);
        }
       

        }

        
      

       public void syncNflTeams(String apiKey) {
        List<BallDontLieNflTeam> teams = bdlClient.fetchAll(
            apiKey,
            "/nfl/v1/teams",
            Map.of(),
            BallDontLieNflTeamsResponse.class,
            BallDontLieNflTeamsResponse::data,
            r -> r.meta() == null ? null : r.meta().next_cursor()
        );


        for (var bdlTeam : teams) {
            if (teamRepository.findByLeagueAndExternalId("NFL", String.valueOf(bdlTeam.id())).isPresent()) {
    continue;
}
              //iterates over parsed dto objects
            TeamEntity entity = new TeamEntity(); //fresh entity
            entity.setName(bdlTeam.full_name());//maps dto field to entity field
            entity.setLeague("NFL");
            entity.setExternalId(String.valueOf(bdlTeam.id()));
            teamRepository.save(entity);
        }
    }

         public void syncMlbTeams(String apiKey) {
         List<BallDontLieMlbTeam> teams = bdlClient.fetchAll(
            apiKey,
            "/mlb/v1/teams",
            Map.of(),
            BallDontLieMlbTeamsResponse.class,
            BallDontLieMlbTeamsResponse::data,
            r -> r.meta() == null ? null : r.meta().next_cursor()
        );
        for (var bdlTeam : teams) {
            if (teamRepository.findByLeagueAndExternalId("MLB", String.valueOf(bdlTeam.id())).isPresent()) {
    continue;
}
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
        if (teamRepository.findByLeagueAndExternalId("EPL", String.valueOf(t.id())).isPresent()) {
    continue;
}
        TeamEntity entity = new TeamEntity();
        entity.setName(t.name());
        entity.setLeague("EPL");
        entity.setExternalId(String.valueOf(t.id()));
        teamRepository.save(entity);
    }
}
}