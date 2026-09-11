package com.slayniaccc.sportsconflicttracker.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.slayniaccc.sportsconflicttracker.entity.FixtureEntity;
import com.slayniaccc.sportsconflicttracker.repository.*;
import java.util.*;

@RestController
public class FixtureController {
    private final FixtureRepository fixtureRepository;

    public FixtureController(FixtureRepository fixtureRepository) {
        this.fixtureRepository = fixtureRepository;
    }

    @GetMapping("/api/fixtures")
    public List<FixtureEntity> getAllFixtures() {
        return fixtureRepository.findAll();
    }
}