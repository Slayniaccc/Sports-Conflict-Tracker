package com.slayniaccc.sportsconflicttracker.repository;

import com.slayniaccc.sportsconflicttracker.entity.FixtureEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FixtureRepository extends JpaRepository<FixtureEntity, Long> {
}