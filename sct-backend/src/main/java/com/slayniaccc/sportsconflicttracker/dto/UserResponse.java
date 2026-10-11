package com.slayniaccc.sportsconflicttracker.dto;
import java.time.Instant;
public record UserResponse(Long id, String email, boolean is_Verified, Instant created_at, Instant updated_at){}

