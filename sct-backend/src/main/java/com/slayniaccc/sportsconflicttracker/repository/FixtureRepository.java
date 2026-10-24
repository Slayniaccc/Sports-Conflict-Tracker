package com.slayniaccc.sportsconflicttracker.repository;

import com.slayniaccc.sportsconflicttracker.entity.FixtureEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface FixtureRepository extends JpaRepository<FixtureEntity, Long> {
     Optional<FixtureEntity> findByLeagueAndExternalId(String league, String externalId);
        List<FixtureEntity> findByLeague(String league);


 @Query("SELECT f FROM FixtureEntity f WHERE f.homeTeam.id = :teamId OR f.awayTeam.id = :teamId ORDER BY f.kickoff ASC")
     List<FixtureEntity> findAllByTeamId(@Param("teamId") Long teamId);
   
}