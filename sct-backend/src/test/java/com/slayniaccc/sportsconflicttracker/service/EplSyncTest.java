package com.slayniaccc.sportsconflicttracker.service;

import com.slayniaccc.sportsconflicttracker.repository.FixtureRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class EplSyncTest {

    @Autowired
    TeamSyncService teamSyncService;

    @Autowired
    FixtureSyncService fixtureSyncService;

    @Autowired
    FixtureRepository fixtureRepository;

    @Test
    void syncsEplFixtures() {
        String apiKey = System.getenv("FOOTBALL_DATA_API_KEY");

        teamSyncService.syncEplTeams(apiKey);
        fixtureSyncService.syncEplFixtures(apiKey);

        long count = fixtureRepository.findAll().stream()
            .filter(f -> "EPL".equals(f.getLeague()))
            .count();
        System.out.println("EPL fixtures in DB: " + count);
        assertThat(count).isGreaterThan(0);

        var sample = fixtureRepository.findAll().stream()
            .filter(f -> "EPL".equals(f.getLeague()))
            .findFirst()
            .orElseThrow();
        System.out.println(sample.getHomeTeam().getName()
            + " vs " + sample.getAwayTeam().getName()
            + " @ " + sample.getKickoff());
    }
}
