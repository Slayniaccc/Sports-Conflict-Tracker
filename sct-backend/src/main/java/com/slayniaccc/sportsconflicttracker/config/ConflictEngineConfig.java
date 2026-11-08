package com.slayniaccc.sportsconflicttracker.config;

import com.slayniaccc.sportsconflicttracker.engine.ConflictEngine;
import com.slayniaccc.sportsconflicttracker.rules.HomeAdvantageRule;
import com.slayniaccc.sportsconflicttracker.rules.ImportanceRule;
import com.slayniaccc.sportsconflicttracker.rules.PlayoffImplicationRule;
import com.slayniaccc.sportsconflicttracker.rules.RivalryRule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.slayniaccc.sportsconflicttracker.engine.RivalryLookup;
import com.slayniaccc.sportsconflicttracker.model.Rivalry;
import com.slayniaccc.sportsconflicttracker.repository.RivalryRepository;


import java.util.List;

@Configuration
public class ConflictEngineConfig {

    @Bean
    public ConflictEngine conflictEngine() {
        List<ImportanceRule> rules = List.of(
            new RivalryRule(),
            new PlayoffImplicationRule(),
            new HomeAdvantageRule()
        );
        return new ConflictEngine(rules);
    }

    @Bean
    public RivalryLookup rivalryLookup(RivalryRepository repository){
        List<Rivalry> rivalries = repository.findAll().stream()
        .map(e -> new Rivalry(e.getLeague(), e.getTeamA(), e.getTeamB(), e.getIntensity(), e.getNote()))
        .toList();
        return new RivalryLookup(rivalries);

        
    }
}