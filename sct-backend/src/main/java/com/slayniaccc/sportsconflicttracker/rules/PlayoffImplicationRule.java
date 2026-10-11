package com.slayniaccc.sportsconflicttracker.rules;

import com.slayniaccc.sportsconflicttracker.model.Fixture;

public class PlayoffImplicationRule implements ImportanceRule {
    @Override
    public int score(Fixture fixture) {
        return fixture.isPlayoffImplication() ? 25 : 0;
    }
}