package com.slayniaccc.sportsconflicttracker.rules;

import com.slayniaccc.sportsconflicttracker.model.Fixture;

public class HomeAdvantageRule implements ImportanceRule {
    @Override
    public int score(Fixture fixture) {
       //to come back to once we can track what team the user follows
        return 5;
    }
}