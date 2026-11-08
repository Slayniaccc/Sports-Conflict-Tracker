package com.slayniaccc.sportsconflicttracker.rules;

import com.slayniaccc.sportsconflicttracker.engine.RivalryLookup;
import com.slayniaccc.sportsconflicttracker.model.Factor;
import com.slayniaccc.sportsconflicttracker.model.Fixture;

import java.util.Optional;

public class RivalryRule implements ImportanceRule {
private static final int POINTS_PER_INTENSITY = 10;
private final RivalryLookup lookup;

public RivalryRule(RivalryLookup lookup){
    this.lookup = lookup;
}
    @Override 
    public Optional<Factor> evaluate(Fixture fixture){
        String home = fixture.homeTeam().name();
        String away = fixture.awayTeam().name();
        String league = fixture.homeTeam().league().name();

      
       return lookup.find(league, home, away).map(r -> {
            String label = r.note() != null ? r.note() : "Rivalry";
            return new Factor(r.intensity() * POINTS_PER_INTENSITY,
                label + ": " + home + " vs " + away);
        });
    }
}