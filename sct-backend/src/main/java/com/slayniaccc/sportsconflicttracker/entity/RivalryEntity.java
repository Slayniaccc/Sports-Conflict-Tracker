package com.slayniaccc.sportsconflicttracker.entity;

import java.lang.annotation.Inherited;

import jakarta.persistence.*;


@Entity

@Table(name = "rivalry")

public class RivalryEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String league;

    @Column(name="team_a", nullable = false)
    private String teamA;

   @Column(name = "team_b", nullable = false)
    private String teamB;
    
   @Column(nullable = false)
   private int intensity;

   private String note;

   protected RivalryEntity() {}

   public Long getId() { return id; }
    public String getLeague() { return league; }
    public String getTeamA() { return teamA; }
    public String getTeamB() { return teamB; }
    public int getIntensity() { return intensity; }
    public String getNote() { return note; }
   


}