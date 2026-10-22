package com.slayniaccc.sportsconflicttracker.controller;

import com.slayniaccc.sportsconflicttracker.entity.AppUserEntity;
import com.slayniaccc.sportsconflicttracker.entity.TeamEntity;
import com.slayniaccc.sportsconflicttracker.repository.AppUserRepository;
import com.slayniaccc.sportsconflicttracker.repository.TeamRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import java.util.Map;

@RestController
@RequestMapping("/api/users/me")
public class UserController{
    private final AppUserRepository userRepository;
    private final TeamRepository teamRepository;
    public UserController(AppUserRepository userRepository, TeamRepository teamRepository){
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
    }

    @GetMapping
    public ResponseEntity<?> getMe(Authentication auth){
        AppUserEntity user = userRepository.findByEmail(auth.getName())
        .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "email", user.getEmail(),
            "favoriteTeamId", user.getFavoriteTeam() != null ? user.getFavoriteTeam().getId() : 0,
            "favoriteTeamName", user.getFavoriteTeam() != null ? user.getFavoriteTeam().getName() : ""
        ));       
    }

    @PutMapping("/favorite-team")
    public ResponseEntity<?> setFavoriteTeam(@RequestBody Map<String, Long> body, Authentication auth){
        AppUserEntity user = userRepository.findByEmail(auth.getName())
             .orElseThrow(() -> new RuntimeException("User not found"));
              Long teamId = body.get("teamId");
    if(teamId == null || teamId == 0){
        user.setFavoriteTeam(null);
    } else{
        TeamEntity team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
                user.setFavoriteTeam(team);
    }
   
                userRepository.save(user);
                return ResponseEntity.ok(Map.of("status", "success"));
    }

}