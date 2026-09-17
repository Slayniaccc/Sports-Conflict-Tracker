package com.slayniaccc.sportsconflicttracker.config;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization"); //reads Authorisation: Bearer token client would send

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String email = jwtUtil.extractEmail(token); 
                var authToken = new UsernamePasswordAuthenticationToken(email, null, Collections.emptyList()); // req is authenticated as email
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } catch (Exception e) {
                // invalid/expired token — leave unauthenticated, security config decides what happens next
            }
        }

        filterChain.doFilter(request, response); //passing req along to continue journey to controllers
        //whether or not authentication succeeds
    }
}