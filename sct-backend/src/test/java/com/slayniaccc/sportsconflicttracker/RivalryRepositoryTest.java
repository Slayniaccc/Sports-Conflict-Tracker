package com.slayniaccc.sportsconflicttracker;

import com.slayniaccc.sportsconflicttracker.entity.RivalryEntity;
import com.slayniaccc.sportsconflicttracker.repository.RivalryRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest

class RivalryRepositoryTest{
      @Autowired
    private RivalryRepository repository;

    @Test
    void seededRivalriesAreReadable() {
        List<RivalryEntity> all = repository.findAll();

        assertThat(all).hasSizeGreaterThanOrEqualTo(64);
        assertThat(all).anySatisfy(r -> {
            assertThat(r.getLeague()).isEqualTo("NBA");
            assertThat(r.getTeamA()).isEqualTo("LA Clippers");
            assertThat(r.getTeamB()).isEqualTo("Los Angeles Lakers");
            assertThat(r.getIntensity()).isEqualTo(2);
            assertThat(r.getNote()).isEqualTo("Battle of LA");
        });
    }
}