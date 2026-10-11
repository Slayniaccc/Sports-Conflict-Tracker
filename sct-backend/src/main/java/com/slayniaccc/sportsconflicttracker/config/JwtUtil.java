package com.slayniaccc.sportsconflicttracker.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    } //converts secret string into HMAC signing key

    public String generateToken(String email) {
        long oneDayInMillis = 1000 * 60 * 60 * 24;
        return Jwts.builder()
            .subject(email)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + oneDayInMillis))
            .signWith(getSigningKey())
            .compact();
    } //builds JWT then returns it as a compact string

    public String extractEmail(String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .getSubject();
    } //after successful call,token is authentic not expired + belongs to email
}
