package com.slayniaccc.sportsconflicttracker.controller;



import com.slayniaccc.sportsconflicttracker.entity.FixtureEntity;
import com.slayniaccc.sportsconflicttracker.model.ConflictScore;
import com.slayniaccc.sportsconflicttracker.repository.FixtureRepository;
import com.slayniaccc.sportsconflicttracker.service.FixtureSyncService;
import com.slayniaccc.sportsconflicttracker.service.FixtureMapper;
import com.slayniaccc.sportsconflicttracker.engine.ConflictEngine;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FixtureController {
    private final FixtureRepository fixtureRepository;
    private final FixtureSyncService fixtureSyncService;
    private final ConflictEngine conflictEngine;
private final FixtureMapper fixtureMapper;

        @Value("${balldontlie.api-key}")
    private String bdlApiKey;

    @Value("${football.data.api-key}")
    private String footballDataApiKey;


    public FixtureController(FixtureRepository fixtureRepository, FixtureSyncService fixtureSyncService, ConflictEngine conflictEngine, FixtureMapper fixtureMapper) {
        this.fixtureRepository = fixtureRepository;
        this.fixtureSyncService = fixtureSyncService;
        this.conflictEngine = conflictEngine;
        this.fixtureMapper = fixtureMapper;
    }

    @GetMapping("/api/fixtures")
    public List<FixtureEntity> getAllFixtures() {
        return fixtureRepository.findAll();
    }


    @GetMapping("/api/fixtures/scored")
    public List<ConflictScore> getScoredFixtures(
         @RequestParam(value = "league", required = false) String league) {
List<FixtureEntity> fixtures = (league == null)
? fixtureRepository.findAll()
: fixtureRepository.findByLeague(league.toUpperCase());
return fixtures.stream()
.map(fixtureMapper::toDomain)
.map(conflictEngine::evaluate)
.toList();
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