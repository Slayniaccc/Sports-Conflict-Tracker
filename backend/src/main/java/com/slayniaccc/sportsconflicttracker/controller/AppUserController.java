package com.slayniaccc.sportsconflicttracker.controller;
import com.slayniaccc.sportsconflicttracker.repository.AppUserRepository;
import com.slayniaccc.sportsconflicttracker.dto.RegisterUserRequest;
import com.slayniaccc.sportsconflicttracker.entity.AppUserEntity;
import com.slayniaccc.sportsconflicttracker.dto.UserResponse;
import com.slayniaccc.sportsconflicttracker.dto.LoginRequest;
import org.springframework.http.HttpStatus;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
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
public ResponseEntity<UserResponse> login(@RequestBody LoginRequest logged){
    Optional<AppUserEntity> foundUser = appUserRepository.findByEmail(logged.email());
if(foundUser.isEmpty()){
return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
}
   AppUserEntity user = foundUser.get();

   boolean matches = passwordEncoder.matches(logged.password(), user.getPasswordHash());
if(!matches){
     return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
}
 UserResponse response = new UserResponse(user.getId(), user.getEmail(), user.isVerified(), user.getCreatedAt(), user.getUpdatedAt());
    return ResponseEntity.ok(response);
}
}


