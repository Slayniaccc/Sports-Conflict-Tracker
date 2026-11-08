package com.slayniaccc.sportsconflicttracker;

import com.slayniaccc.sportsconflicttracker.engine.RivalryLookup;
import com.slayniaccc.sportsconflicttracker.model.Rivalry;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;


class RivalryLookupTest{
        private final RivalryLookup lookup = new RivalryLookup(List.of(
        new Rivalry("NBA", "LA Clippers", "Los Angeles Lakers", 2, "Battle of LA"),
        new Rivalry("EPL", "Arsenal FC", "Tottenham Hotspur FC", 3, "North London derby")
    ));

    @Test
    void findsRivalryInStoredOrder() {
        assertThat(lookup.find("NBA", "LA Clippers", "Los Angeles Lakers"))
            .hasValueSatisfying(r -> assertThat(r.note()).isEqualTo("Battle of LA"));
    }

    @Test
    void findsRivalryWithHomeAndAwaySwapped() {
        assertThat(lookup.find("NBA", "Los Angeles Lakers", "LA Clippers")).isPresent();
    }

    @Test
    void wrongLeagueIsNotARivalry() {
        assertThat(lookup.find("NFL", "LA Clippers", "Los Angeles Lakers")).isEmpty();
    }

    @Test
    void unrelatedTeamsAreNotARivalry() {
        assertThat(lookup.find("NBA", "Los Angeles Lakers", "Utah Jazz")).isEmpty();
    }

    @Test
    void countsEachRivalryOnce() {
        assertThat(lookup.size()).isEqualTo(2);
    }
}