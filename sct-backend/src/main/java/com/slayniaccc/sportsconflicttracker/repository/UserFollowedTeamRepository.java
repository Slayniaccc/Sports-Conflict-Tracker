package com.slayniaccc.sportsconflicttracker.repository;

import com.slayniaccc.sportsconflicttracker.entity.UserFollowedTeamEntity;
import com.slayniaccc.sportsconflicttracker.entity.UserFollowedTeamId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserFollowedTeamRepository extends JpaRepository<UserFollowedTeamEntity, UserFollowedTeamId> {
}