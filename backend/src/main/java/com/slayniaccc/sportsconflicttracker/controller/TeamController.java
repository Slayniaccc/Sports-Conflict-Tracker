package com.slayniaccc.sportsconflicttracker.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.slayniaccc.sportsconflicttracker.entity.TeamEntity;
import com.slayniaccc.sportsconflicttracker.repository.*;
import java.util.*;

@RestController 
public class TeamController{
    private final TeamRepository teamRepository;
    public TeamController(TeamRepository teamRepository){
        this.teamRepository = teamRepository;
    }
    @GetMapping("/api/teams")
    public List<TeamEntity> getAllTeams(){
        return teamRepository.findAll();

    }
}