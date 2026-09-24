package com.slayniaccc.sportsconflicttracker.controller;



import com.slayniaccc.sportsconflicttracker.entity.FixtureEntity;
import com.slayniaccc.sportsconflicttracker.repository.FixtureRepository;
import com.slayniaccc.sportsconflicttracker.service.FixtureSyncService;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FixtureController {
    private final FixtureRepository fixtureRepository;
    private final FixtureSyncService fixtureSyncService;

        @Value("${balldontlie.api-key}")
    private String bdlApiKey;

    @Value("${football.data.api-key}")
    private String footballDataApiKey;


    public FixtureController(FixtureRepository fixtureRepository, FixtureSyncService fixtureSyncService) {
        this.fixtureRepository = fixtureRepository;
        this.fixtureSyncService = fixtureSyncService;
    }

    @GetMapping("/api/fixtures")
    public List<FixtureEntity> getAllFixtures() {
        return fixtureRepository.findAll();
    }

      @PostMapping("/api/fixtures/sync/nba")
    public String syncNba() {
        fixtureSyncService.syncNbaFixtures(bdlApiKey);
        return "NBA fixtures synced";
    }
    @PostMapping("/api/fixtures/sync/epl")
public String syncEpl() {
    fixtureSyncService.syncEplFixtures(footballDataApiKey);
    return "EPL fixtures synced";
}
}