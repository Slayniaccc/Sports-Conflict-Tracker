
package com.slayniaccc.sportsconflicttracker.service;

import com.slayniaccc.sportsconflicttracker.repository.TeamRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class EplTeamSyncTest {

    @Autowired TeamSyncService teamSyncService;
    @Autowired TeamRepository teamRepository;

    @Test
    void syncsEplTeams() {
        String apiKey = System.getenv("FOOTBALL_DATA_API_KEY");
        teamSyncService.syncEplTeams(apiKey);

        long count = teamRepository.findAll().stream()
            .filter(t -> "EPL".equals(t.getLeague()))
            .count();
        System.out.println("EPL teams in DB: " + count);
        assertThat(count).isEqualTo(20);
    }
}