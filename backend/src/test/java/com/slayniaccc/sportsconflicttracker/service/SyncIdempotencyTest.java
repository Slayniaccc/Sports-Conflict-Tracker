package com.slayniaccc.sportsconflicttracker.service;

import com.slayniaccc.sportsconflicttracker.repository.FixtureRepository;
import com.slayniaccc.sportsconflicttracker.repository.TeamRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@EnabledIfEnvironmentVariable(named = "RUN_LIVE_SYNC_TESTS", matches = "true")
class SyncIdempotencyTest {

    @Autowired
    private TeamSyncService teamSyncService;

    @Autowired
    private FixtureSyncService fixtureSyncService;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private FixtureRepository fixtureRepository;

    private String bdlKey() {
        return System.getenv("BALLDONTLIE_API_KEY");
    }

    @Test
    void syncNbaTeams_isIdempotent() {
        teamSyncService.syncNbaTeams(bdlKey());
        long afterFirst = teamRepository.findAll().stream()
            .filter(t -> "NBA".equals(t.getLeague()))
            .count();

        teamSyncService.syncNbaTeams(bdlKey());
        long afterSecond = teamRepository.findAll().stream()
            .filter(t -> "NBA".equals(t.getLeague()))
            .count();

        assertEquals(afterFirst, afterSecond,
            "Re-running NBA team sync must not add rows");
        assertTrue(afterFirst > 0, "NBA teams should exist after sync");
    }

    @Test
    void syncNbaFixtures_isIdempotent() {
        // Requires teams to exist first
        teamSyncService.syncNbaTeams(bdlKey());

        fixtureSyncService.syncNbaFixtures(bdlKey());
        long afterFirst = fixtureRepository.findAll().stream()
            .filter(f -> "NBA".equals(f.getLeague()))
            .count();

        fixtureSyncService.syncNbaFixtures(bdlKey());
        long afterSecond = fixtureRepository.findAll().stream()
            .filter(f -> "NBA".equals(f.getLeague()))
            .count();

        assertEquals(afterFirst, afterSecond,
            "Re-running NBA fixture sync must not add rows");
    }

    @Test
    void syncEplTeams_isIdempotent() {
        String fdKey = System.getenv("FOOTBALL_DATA_API_KEY");

        teamSyncService.syncEplTeams(fdKey);
        long afterFirst = teamRepository.findAll().stream()
            .filter(t -> "EPL".equals(t.getLeague()))
            .count();

        teamSyncService.syncEplTeams(fdKey);
        long afterSecond = teamRepository.findAll().stream()
            .filter(t -> "EPL".equals(t.getLeague()))
            .count();

        assertEquals(afterFirst, afterSecond,
            "Re-running EPL team sync must not add rows");
        assertEquals(20, afterFirst, "EPL should have 20 teams");
    }
}