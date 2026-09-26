package com.slayniaccc.sportsconflicttracker.service;

import com.slayniaccc.sportsconflicttracker.repository.FixtureRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class FixtureSyncServiceTest {

    @Autowired
    TeamSyncService teamSyncService;

    @Autowired
    FixtureSyncService fixtureSyncService;

    @Autowired
    FixtureRepository fixtureRepository;

    @Test
    void syncsRealNbaFixtures() {
        String apiKey = System.getenv("BALLDONTLIE_API_KEY");

        teamSyncService.syncNbaTeams(apiKey);
        fixtureSyncService.syncNbaFixtures(apiKey);

        long count = fixtureRepository.count();
        System.out.println("Fixtures in DB: " + count);
        assertThat(count).isGreaterThan(0);

        var sample = fixtureRepository.findAll().get(0);
        System.out.println(sample.getHomeTeam().getName()
            + " vs " + sample.getAwayTeam().getName()
            + " @ " + sample.getKickoff());
    }
}
