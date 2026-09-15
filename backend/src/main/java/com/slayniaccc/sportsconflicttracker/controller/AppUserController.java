package com.slayniaccc.sportsconflicttracker.controller;
import com.slayniaccc.sportsconflicttracker.repository.AppUserRepository;
import com.slayniaccc.sportsconflicttracker.dto.RegisterUserRequest;
import com.slayniaccc.sportsconflicttracker.entity.AppUserEntity;
import com.slayniaccc.sportsconflicttracker.dto.UserResponse;
import com.slayniaccc.sportsconflicttracker.dto.LoginRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.time.Instant;


@RestController
public class AppUserController{
private final AppUserRepository appUserRepository;
private final PasswordEncoder passwordEncoder;
public AppUserController(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder){
    this.appUserRepository = appUserRepository;
    this.passwordEncoder = passwordEncoder;
}


@PostMapping("/api/users/register")
public UserResponse register(@RequestBody RegisterUserRequest request){
AppUserEntity user = new AppUserEntity(); //
user.setEmail(request.email());
user.setPasswordHash(passwordEncoder.encode(request.password()));
user.setCreatedAt(Instant.now());
user.setUpdatedAt(Instant.now());
appUserRepository.save(user);
return new UserResponse(user.getId(), user.getEmail(), user.isVerified(), user.getCreatedAt(), user.getUpdatedAt());
}
@PostMapping("/api/users/login")
public UserResponse login(@RequestBody LoginRequest logged){
    AppUserEntity user = appUserRepository.findByEmail(logged.email());
boolean matches = passwordEncoder.matches(logged.password(), user.getPasswordHash());
return new UserResponse(user.getId(), user.getEmail(), user.isVerified(), user.getCreatedAt(), user.getUpdatedAt());
}
}
