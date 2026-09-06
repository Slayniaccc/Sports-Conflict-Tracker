package com.slayniaccc.sportsconflicttracker.rules;

import com.slayniaccc.sportsconflicttracker.model.Fixture;

public interface ImportanceRule {
    int score(Fixture fixture);
}
