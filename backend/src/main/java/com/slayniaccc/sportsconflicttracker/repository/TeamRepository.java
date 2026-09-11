package com.slayniaccc.sportsconflicttracker.repository;

import com.slayniaccc.sportsconflicttracker.entity.TeamEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<TeamEntity, Long>{
    
}