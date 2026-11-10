package com.slayniaccc.sportsconflicttracker.rules;

import com.slayniaccc.sportsconflicttracker.model.Factor;
import com.slayniaccc.sportsconflicttracker.model.Fixture;

import java.util.Optional;

public class HomeAdvantageRule implements ImportanceRule {
    @Override
 public Optional<Factor> evaluate(Fixture fixture){
    String venue = switch (fixture.homeTeam().league()){
        case NBA -> "Home court";
        case NFL, MLB -> "Home field";
        case EPL -> "Home ground";
    };
    return Optional.of(new Factor(Factor.Kind.HOME, 5, venue, venue  + " for " + fixture.homeTeam().name()));
 }
}