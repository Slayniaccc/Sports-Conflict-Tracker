package com.slayniaccc.sportsconflicttracker.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;

import com.slayniaccc.sportsconflicttracker.engine.ConflictEngine;
import com.slayniaccc.sportsconflicttracker.entity.FixtureEntity;
import com.slayniaccc.sportsconflicttracker.entity.TeamEntity;
import com.slayniaccc.sportsconflicttracker.model.ConflictScore;
import com.slayniaccc.sportsconflicttracker.repository.*;
import com.slayniaccc.sportsconflicttracker.service.FixtureMapper;
import com.slayniaccc.sportsconflicttracker.service.TeamSyncService;

import com.slayniaccc.sportsconflicttracker.model.TeamDetailResponse;

import java.util.*;

@RestController 
public class TeamController{
    private final TeamRepository teamRepository;
    private final FixtureRepository fixtureRepository;
        private final TeamSyncService teamSyncService;
        private final ConflictEngine conflictEngine;
        private final AppUserRepository userRepository;
        private final FixtureMapper fixtureMapper;

          @Value("${balldontlie.api-key}")
    private String bdlApiKey;

    @Value("${football.data.api-key}")
    private String footballDataApiKey;


    public TeamController(TeamRepository teamRepository,  TeamSyncService teamSyncService, 
        ConflictEngine conflictEngine, FixtureMapper fixtureMapper, AppUserRepository userRepository, FixtureRepository fixtureRepository
    ){
        this.conflictEngine = conflictEngine;
        this.fixtureMapper = fixtureMapper;
        this.userRepository = userRepository;
        this.fixtureRepository = fixtureRepository;
        this.teamRepository = teamRepository;
            this.teamSyncService = teamSyncService;
    }
    @GetMapping("/api/teams")
    public List<TeamEntity> getAllTeams(){
        return teamRepository.findAll();

    }
    @GetMapping("/api/teams/{id}")
    public ResponseEntity<TeamDetailResponse> getTeamDetail(
        @PathVariable Long id,
        Authentication auth){
        TeamEntity team = teamRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Team not found"));

        String favExternalId = null;
        if(auth != null){
            favExternalId = userRepository.findByEmail(auth.getName())
            .map(u -> u.getFavoriteTeam() != null ? u.getFavoriteTeam().getExternalId() : null)
            .orElse(null);
        }
        final String finalFavId = favExternalId;

        List<FixtureEntity> fixtures = fixtureRepository.findAllByTeamId(id);
        List<ConflictScore> scoredFixtures = fixtures.stream()
        .map(entity -> fixtureMapper.toDomain(entity))
        .map(f -> conflictEngine.evaluate(f, finalFavId))
        .toList();

        return ResponseEntity.ok(new TeamDetailResponse(
            team.getId(),
            team.getName(),
            team.getLeague(),
            team.getExternalId(),
            scoredFixtures
        ));
        }


     @PostMapping("/api/teams/sync/nba")
    public String syncNba() {
        teamSyncService.syncNbaTeams(bdlApiKey);
        return "NBA teams synced";
    }

    @PostMapping("/api/teams/sync/epl")
public String syncEpl() {
    teamSyncService.syncEplTeams(footballDataApiKey);
    return "EPL teams synced";
}
}