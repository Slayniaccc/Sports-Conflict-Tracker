package com.slayniaccc.sportsconflicttracker;
import com.slayniaccc.sportsconflicttracker.engine.ConflictEngine;
import com.slayniaccc.sportsconflicttracker.model.ConflictScore;
import com.slayniaccc.sportsconflicttracker.model.Fixture;
import com.slayniaccc.sportsconflicttracker.model.League;
import com.slayniaccc.sportsconflicttracker.model.Team;
import com.slayniaccc.sportsconflicttracker.rules.HomeAdvantageRule;
import com.slayniaccc.sportsconflicttracker.rules.PlayoffImplicationRule;
import com.slayniaccc.sportsconflicttracker.rules.RivalryRule;

import com.slayniaccc.sportsconflicttracker.engine.RivalryLookup;
import com.slayniaccc.sportsconflicttracker.model.Rivalry;

import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class ConflictEngineTest {

    private final ConflictEngine engine = new ConflictEngine(List.of(
         new RivalryRule(new RivalryLookup(List.of(
        new Rivalry("EPL", "Liverpool", "Manchester City", 2, null),
        new Rivalry("NBA", "LA Clippers", "Los Angeles Lakers", 3, "Battle of LA")
    ))),
        new PlayoffImplicationRule(),
        new HomeAdvantageRule()
    ));

    @Test
void intensityScalesRivalryPoints() {
    Team lakers = new Team(10L, "Los Angeles Lakers", League.NBA, "14");
    Team clippers = new Team(12L, "LA Clippers", League.NBA, "13");
    Fixture f = new Fixture(1L, lakers, clippers, Instant.now(), false);

    ConflictScore result = engine.evaluate(f);

    assertThat(result.score()).isEqualTo(35); // 30 rivalry (intensity 3) + 5 home
    assertThat(result.reasoning())
        .contains("Battle of LA: Los Angeles Lakers vs LA Clippers (+30)");
}

@Test
void rivalryWithoutNoteUsesGenericLabel() {
    Team manCity = new Team(1L, "Manchester City", League.EPL, "65");
    Team liverpool = new Team(2L, "Liverpool", League.EPL, "64");
    Fixture f = new Fixture(1L, liverpool, manCity, Instant.now(), false);

    assertThat(engine.evaluate(f).reasoning())
        .contains("Rivalry: Liverpool vs Manchester City (+20)");
}

    @Test
    void rivalryFixtureScoresHigherThanNonRivalry() {
        Team manCity = new Team(1L, "Manchester City", League.EPL, "65");
        Team liverpool = new Team(2L, "Liverpool", League.EPL, "64");

        Fixture rivalryFixture = new Fixture(
            1L,manCity, liverpool, Instant.now(), false
        );

        ConflictScore result = engine.evaluate(rivalryFixture);

        assertThat(result.score()).isEqualTo(25); // 20 (rivalry) + 5 (home advantage placeholder)
    }

    @Test
    void nonRivalryNonPlayoffFixtureScoresLow() {
        Team manCity = new Team(1L, "Manchester City", League.EPL, "65");
        Team someTeam = new Team(3L, "Some Team", League.EPL, "99");

        Fixture ordinaryFixture = new Fixture(
            1L,manCity, someTeam, Instant.now(), false
        );

        ConflictScore result = engine.evaluate(ordinaryFixture);

        assertThat(result.score()).isEqualTo(5); // just home advantage placeholder
    }

    @Test
    void reasoningMentionsRivalryWhenApplicable() {
        Team manCity = new Team(1L, "Manchester City", League.EPL, "65");
        Team liverpool = new Team(2L,  "Liverpool", League.EPL, "64");

        Fixture rivalryFixture = new Fixture(
            1L,manCity, liverpool, Instant.now(), false
        );

        ConflictScore result = engine.evaluate(rivalryFixture);

        assertThat(result.reasoning()).contains("Rivalry").contains("Manchester City");
    }

    @Test
void favoriteTeamAtHomeIsDescribed() {
    Team lakers = new Team(10L, "Los Angeles Lakers", League.NBA, "14");
    Team jazz = new Team(11L, "Utah Jazz", League.NBA, "29");
    Fixture f = new Fixture(1L, lakers, jazz, Instant.now(), false);

    ConflictScore result = engine.evaluate(f, "14");

    assertThat(result.score()).isEqualTo(20);
    assertThat(result.reasoning())
        .contains("Your team Los Angeles Lakers is at home to Utah Jazz (+15)")
        .contains("Home court for Los Angeles Lakers (+5)");
}

@Test
void favoriteTeamAwayIsDescribed() {
    Team lakers = new Team(10L, "Los Angeles Lakers", League.NBA, "14");
    Team jazz = new Team(11L, "Utah Jazz", League.NBA, "29");
    Fixture f = new Fixture(1L, jazz, lakers, Instant.now(), false);

    ConflictScore result = engine.evaluate(f, "14");

    assertThat(result.reasoning())
        .contains("Your team Los Angeles Lakers travels to Utah Jazz (+15)");
}

@Test
void ordinaryFixtureOnlyMentionsHomeAdvantage() {
    Team manCity = new Team(1L, "Manchester City", League.EPL, "65");
    Team someTeam = new Team(3L, "Some Team", League.EPL, "99");
    Fixture f = new Fixture(1L, manCity, someTeam, Instant.now(), false);

    assertThat(engine.evaluate(f).reasoning())
        .isEqualTo("Home ground for Manchester City (+5)");
}

@Test
void biggestFactorComesFirst() {
    Team manCity = new Team(1L, "Manchester City", League.EPL, "65");
    Team liverpool = new Team(2L, "Liverpool", League.EPL, "64");
    Fixture f = new Fixture(1L, manCity, liverpool, Instant.now(), true);

    assertThat(engine.evaluate(f).reasoning()).startsWith("Playoff implications (+25)");
}
}

//produce expected score
//therefore you want to test a fixture that should score highly
//i.e man city vs liverpool
//against a fixture that doesn't score highly
//i.e man city vs coventry
//then test the reasoning to see whether it is on point

