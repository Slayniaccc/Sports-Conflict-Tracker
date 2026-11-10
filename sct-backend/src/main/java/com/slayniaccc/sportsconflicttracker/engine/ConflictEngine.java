package com.slayniaccc.sportsconflicttracker.engine;


import com.slayniaccc.sportsconflicttracker.model.ConflictScore;
import com.slayniaccc.sportsconflicttracker.model.Factor;
import com.slayniaccc.sportsconflicttracker.model.Fixture;
import com.slayniaccc.sportsconflicttracker.model.Team;
import com.slayniaccc.sportsconflicttracker.rules.ImportanceRule;


import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class ConflictEngine {
    private final List<ImportanceRule> rules; //

    public ConflictEngine(List<ImportanceRule> rules) {
        this.rules = rules;
    }
    public ConflictScore evaluate(Fixture fixture) {
    return evaluate(fixture, null);
}

    public ConflictScore evaluate(Fixture fixture, String favoriteTeamExternalId) {
        List<Factor> factors = new ArrayList<>();
        for(ImportanceRule rule: rules){
            rule.evaluate(fixture).ifPresent(factors::add);
        }
        favoriteTeamFactor(fixture, favoriteTeamExternalId).ifPresent(factors::add);


        int total = factors.stream().mapToInt(Factor::points).sum();

        List<Factor> sorted = factors.stream()
        .sorted(Comparator.comparingInt(Factor::points).reversed())
        .toList();
         

        String reasoning = sorted.stream()
        .map(f -> f.reason() + " (+" + f.points() + ")")
        .collect(Collectors.joining(" · "));

     
        

        return new ConflictScore(fixture, total, reasoning.isEmpty() ? "No significant factors." : reasoning, sorted);
    }

    private Optional<Factor> favoriteTeamFactor(Fixture fixture, String favoriteId) {
       if(favoriteId == null) return Optional.empty();
        Team home = fixture.homeTeam();
        Team away = fixture.awayTeam();

        if(favoriteId.equals(home.externalId())){
            return Optional.of(new Factor(Factor.Kind.FAVORITE_TEAM, 15, "Your team is at home ", "Your team " + home.name() + " is at home to " + away.name()));
        }
         if (favoriteId.equals(away.externalId())) {
            return Optional.of(new Factor(Factor.Kind.FAVORITE_TEAM, 15,
                "Your team travels", "Your team " + away.name() + " travels to " + home.name()));
        }

        return Optional.empty();
    }
}