package com.slayniaccc.sportsconflicttracker.repository;

import com.slayniaccc.sportsconflicttracker.entity.TeamEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TeamRepository extends JpaRepository<TeamEntity, Long>{
      Optional<TeamEntity> findByExternalId(String externalId);
}