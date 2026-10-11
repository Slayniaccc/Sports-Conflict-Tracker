package com.slayniaccc.sportsconflicttracker.rules;

import com.slayniaccc.sportsconflicttracker.model.Fixture;

public class RivalryRule implements ImportanceRule {
    @Override 
    public int score(Fixture fixture) {
        return fixture.isRivalry() ? 20 : 0;
    }
}
