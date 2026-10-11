package com.slayniaccc.sportsconflicttracker.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
@Configuration
public class SecurityBeansConfig {

    @Bean //call this method once,manage whatever it returns as a bean avaliable for injection anywhere in app
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}