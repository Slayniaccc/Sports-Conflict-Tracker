package com.slayniaccc.sportsconflicttracker.rules;

import com.slayniaccc.sportsconflicttracker.model.Factor;
import com.slayniaccc.sportsconflicttracker.model.Fixture;

import java.util.Optional;

public class RivalryRule implements ImportanceRule {
    @Override 
    public Optional<Factor> evaluate(Fixture fixture){
        if(!fixture.isRivalry()) return Optional.empty();
        return Optional.of(new Factor(20, "Rivalry: " + fixture.homeTeam().name() + " vs " + fixture.awayTeam().name()));
    }
}
