package com.slayniaccc.sportsconflicttracker.repository;

import com.slayniaccc.sportsconflicttracker.entity.AppUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUserEntity, Long> {
    AppUserEntity findByEmail(String email); //if user no email,this returns null, login crashes
                                             //if come to problem in the future,Optional would be a better use here
}