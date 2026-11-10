package com.slayniaccc.sportsconflicttracker.rules;


import com.slayniaccc.sportsconflicttracker.model.Factor;
import com.slayniaccc.sportsconflicttracker.model.Fixture;


import java.util.Optional;
public class PlayoffImplicationRule implements ImportanceRule {
    @Override
   public Optional<Factor> evaluate(Fixture fixture) {
        if (!fixture.isPlayoffImplication()) return Optional.empty();
        return Optional.of(new Factor(Factor.Kind.PLAYOFF, 25, "Playoff implications", "Playoff implications"));
    }
}