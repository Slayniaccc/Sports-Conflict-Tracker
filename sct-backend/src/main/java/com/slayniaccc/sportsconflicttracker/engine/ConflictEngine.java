package com.slayniaccc.sportsconflicttracker.engine;
import com.slayniaccc.sportsconflicttracker.model.ConflictScore;
import com.slayniaccc.sportsconflicttracker.model.Fixture;
import com.slayniaccc.sportsconflicttracker.rules.ImportanceRule;

import java.util.List;

public class ConflictEngine {
    private final List<ImportanceRule> rules; //

    public ConflictEngine(List<ImportanceRule> rules) {
        this.rules = rules;
    }
    public ConflictScore evaluate(Fixture fixture) {
    return evaluate(fixture, null);
}

    public ConflictScore evaluate(Fixture fixture, String favoriteTeamExternalId) {
        int total = rules.stream()
            .mapToInt(rule -> rule.score(fixture))
            .sum();

        String reasoning = buildReasoning(fixture);

        if(favoriteTeamExternalId != null &&
            (favoriteTeamExternalId.equals(fixture.homeTeam().externalId()) ||
            favoriteTeamExternalId.equals(fixture.awayTeam().externalId()))){
                total += 15;
                reasoning = reasoning + " FavoriteTeamRule: +15";
            }
        

        return new ConflictScore(fixture, total, reasoning);
    }

    private String buildReasoning(Fixture fixture) {
        StringBuilder reasoning = new StringBuilder();
        for (ImportanceRule rule : rules) {
            int ruleScore = rule.score(fixture);
            if (ruleScore > 0) {
                reasoning.append(rule.getClass().getSimpleName())
                         .append(": +")
                         .append(ruleScore)
                         .append(". ");
            }
        }
        return reasoning.length() == 0 ? "No significant factors." : reasoning.toString().trim();
    }
}