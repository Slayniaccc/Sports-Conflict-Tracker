package com.slayniaccc.sportsconflicttracker.rules;
import com.slayniaccc.sportsconflicttracker.model.Factor;
import com.slayniaccc.sportsconflicttracker.model.Fixture;


import java.util.Optional;


public interface ImportanceRule {
   Optional<Factor> evaluate(Fixture fixture);
}
