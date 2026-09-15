package com.slayniaccc.sportsconflicttracker.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) //disabling here standard for REST APIs
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() //every request is allowed through, no login req for now
            );
        return http.build();
    }
}