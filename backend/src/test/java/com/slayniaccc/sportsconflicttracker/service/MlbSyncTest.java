package com.slayniaccc.sportsconflicttracker.service;

import com.slayniaccc.sportsconflicttracker.repository.FixtureRepository;
import com.slayniaccc.sportsconflicttracker.repository.TeamRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class MlbSyncTest {

    @Autowired TeamSyncService teamSyncService;
    @Autowired FixtureSyncService fixtureSyncService;
    @Autowired TeamRepository teamRepository;
    @Autowired FixtureRepository fixtureRepository;

    @Test
    void syncMlbTeamsAndFixtures() {
        String apiKey = System.getenv("BALLDONTLIE_API_KEY");

        // 1. Teams first
        teamSyncService.syncMlbTeams(apiKey);
        long mlbTeamCount = teamRepository.findAll().stream()
            .filter(t -> "MLB".equals(t.getLeague()))
            .count();
        System.out.println("MLB teams in DB: " + mlbTeamCount);
        assertThat(mlbTeamCount).isGreaterThan(0);

        // 2. Then fixtures
        fixtureSyncService.syncMlbFixtures(apiKey);
        long mlbFixtureCount = fixtureRepository.findAll().stream()
            .filter(f -> "MLB".equals(f.getLeague()))
            .count();
        System.out.println("MLB fixtures in DB: " + mlbFixtureCount);
        assertThat(mlbFixtureCount).isGreaterThan(0);

        // 3. Spot-check one
        var sample = fixtureRepository.findAll().stream()
            .filter(f -> "MLB".equals(f.getLeague()))
            .findFirst()
            .orElseThrow();
        System.out.println(sample.getHomeTeam().getName()
            + " vs " + sample.getAwayTeam().getName()
            + " @ " + sample.getKickoff());
    }
}