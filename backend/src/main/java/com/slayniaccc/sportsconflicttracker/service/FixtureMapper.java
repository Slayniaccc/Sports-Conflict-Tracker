package com.slayniaccc.sportsconflicttracker.service;

import com.slayniaccc.sportsconflicttracker.entity.FixtureEntity;
import com.slayniaccc.sportsconflicttracker.entity.TeamEntity;
import com.slayniaccc.sportsconflicttracker.model.Fixture;
import com.slayniaccc.sportsconflicttracker.model.League;
import com.slayniaccc.sportsconflicttracker.model.Team;
import org.springframework.stereotype.Component;

@Component
public class FixtureMapper {

    public Fixture toDomain(FixtureEntity entity) {
        return new Fixture(
            toDomain(entity.getHomeTeam()),
            toDomain(entity.getAwayTeam()),
            entity.getKickoff(),
            entity.isRivalry(),
            entity.isPlayoffImplication()
        );
    }

    public Team toDomain(TeamEntity entity) {
        return new Team(
            entity.getName(),
            League.valueOf(entity.getLeague()),
            entity.getExternalId()
        );
    }
}