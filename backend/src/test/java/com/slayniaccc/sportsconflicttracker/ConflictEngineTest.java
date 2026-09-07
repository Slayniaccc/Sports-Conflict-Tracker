package com.slayniaccc.sportsconflicttracker;
import com.slayniaccc.sportsconflicttracker.engine.ConflictEngine;
import com.slayniaccc.sportsconflicttracker.model.ConflictScore;
import com.slayniaccc.sportsconflicttracker.model.Fixture;
import com.slayniaccc.sportsconflicttracker.model.League;
import com.slayniaccc.sportsconflicttracker.model.Team;
import com.slayniaccc.sportsconflicttracker.rules.HomeAdvantageRule;
import com.slayniaccc.sportsconflicttracker.rules.PlayoffImplicationRule;
import com.slayniaccc.sportsconflicttracker.rules.RivalryRule;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class ConflictEngineTest {

    private final ConflictEngine engine = new ConflictEngine(List.of(
        new RivalryRule(),
        new PlayoffImplicationRule(),
        new HomeAdvantageRule()
    ));

    @Test
    void rivalryFixtureScoresHigherThanNonRivalry() {
        Team manCity = new Team("Manchester City", League.EPL, "65");
        Team liverpool = new Team("Liverpool", League.EPL, "64");

        Fixture rivalryFixture = new Fixture(
            manCity, liverpool, Instant.now(), true, false
        );

        ConflictScore result = engine.evaluate(rivalryFixture);

        assertThat(result.score()).isEqualTo(25); // 20 (rivalry) + 5 (home advantage placeholder)
    }

    @Test
    void nonRivalryNonPlayoffFixtureScoresLow() {
        Team manCity = new Team("Manchester City", League.EPL, "65");
        Team someTeam = new Team("Some Team", League.EPL, "99");

        Fixture ordinaryFixture = new Fixture(
            manCity, someTeam, Instant.now(), false, false
        );

        ConflictScore result = engine.evaluate(ordinaryFixture);

        assertThat(result.score()).isEqualTo(5); // just home advantage placeholder
    }

    @Test
    void reasoningMentionsRivalryWhenApplicable() {
        Team manCity = new Team("Manchester City", League.EPL, "65");
        Team liverpool = new Team("Liverpool", League.EPL, "64");

        Fixture rivalryFixture = new Fixture(
            manCity, liverpool, Instant.now(), true, false
        );

        ConflictScore result = engine.evaluate(rivalryFixture);

        assertThat(result.reasoning()).contains("RivalryRule");
    }
}

//produce expected score
//therefore you want to test a fixture that should score highly
//i.e man city vs liverpool
//against a fixture that doesn't score highly
//i.e man city vs coventry
//then test the reasoning to see whether it is on point