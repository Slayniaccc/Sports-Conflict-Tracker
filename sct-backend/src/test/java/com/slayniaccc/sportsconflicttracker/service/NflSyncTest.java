package com.slayniaccc.sportsconflicttracker.service;

import com.slayniaccc.sportsconflicttracker.repository.FixtureRepository;
import com.slayniaccc.sportsconflicttracker.repository.TeamRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class NflSyncTest {

    @Autowired TeamSyncService teamSyncService;
    @Autowired FixtureSyncService fixtureSyncService;
    @Autowired TeamRepository teamRepository;
    @Autowired FixtureRepository fixtureRepository;

    @Test
    void syncsNflTeamsAndFixtures() {
        String apiKey = System.getenv("BALLDONTLIE_API_KEY");

        // 1. Teams first
        teamSyncService.syncNflTeams(apiKey);
        long nflTeamCount = teamRepository.findAll().stream()
            .filter(t -> "NFL".equals(t.getLeague()))
            .count();
        System.out.println("NFL teams in DB: " + nflTeamCount);
        assertThat(nflTeamCount).isGreaterThan(0);

        // 2. Then fixtures
        fixtureSyncService.syncNflFixtures(apiKey);
        long nflFixtureCount = fixtureRepository.findAll().stream()
            .filter(f -> "NFL".equals(f.getLeague()))
            .count();
        System.out.println("NFL fixtures in DB: " + nflFixtureCount);
        assertThat(nflFixtureCount).isGreaterThan(0);

        // 3. Spot-check one
        var sample = fixtureRepository.findAll().stream()
            .filter(f -> "NFL".equals(f.getLeague()))
            .findFirst()
            .orElseThrow();
        System.out.println(sample.getHomeTeam().getName()
            + " vs " + sample.getAwayTeam().getName()
            + " @ " + sample.getKickoff());
    }
}