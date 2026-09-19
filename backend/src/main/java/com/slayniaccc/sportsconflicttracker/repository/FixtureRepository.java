package com.slayniaccc.sportsconflicttracker.repository;

import com.slayniaccc.sportsconflicttracker.entity.FixtureEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FixtureRepository extends JpaRepository<FixtureEntity, Long> {
     Optional<FixtureEntity> findByLeagueAndExternalId(String league, String externalId);
}