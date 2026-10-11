package com.slayniaccc.sportsconflicttracker.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;

import com.slayniaccc.sportsconflicttracker.entity.TeamEntity;
import com.slayniaccc.sportsconflicttracker.repository.*;
import com.slayniaccc.sportsconflicttracker.service.TeamSyncService;
import java.util.*;

@RestController 
public class TeamController{
    private final TeamRepository teamRepository;
        private final TeamSyncService teamSyncService;

          @Value("${balldontlie.api-key}")
    private String bdlApiKey;

    @Value("${football.data.api-key}")
    private String footballDataApiKey;


    public TeamController(TeamRepository teamRepository,  TeamSyncService teamSyncService){
        this.teamRepository = teamRepository;
            this.teamSyncService = teamSyncService;
    }
    @GetMapping("/api/teams")
    public List<TeamEntity> getAllTeams(){
        return teamRepository.findAll();

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