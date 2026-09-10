package com.slayniaccc.sportsconflicttracker.entity;

import org.hibernate.annotations.ColumnDefault;

import jakarta.persistence.*;
import java.time.Instant;


@Entity 
@Table(name = "fixture")
public class FixtureEntity{

    @Id 
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@ManyToOne 
@JoinColumn(name = "home_team_id", nullable = false)
private TeamEntity homeTeam;

@ManyToOne 
@JoinColumn(name = "away_team_id", nullable = false)
private TeamEntity awayTeam;

@Column(nullable = false)
private Instant kickoff;

@Column ( name = "is_rivalry", nullable = false)
@ColumnDefault("false")
private boolean isRivalry;

@Column (name = "is_playoff_implication", nullable = false)
@ColumnDefault("false")
private boolean isPlayoffImplication;

public FixtureEntity() {}

public Long getId() { return id; }
public TeamEntity getHomeTeam() { return homeTeam; }
public void setHomeTeam(TeamEntity homeTeam) { this.homeTeam = homeTeam; }
public TeamEntity getAwayTeam() { return awayTeam; }
public void setAwayTeam(TeamEntity awayTeam) { this.awayTeam = awayTeam; }
public Instant getKickoff() { return kickoff; }
public void setKickoff(Instant kickoff) { this.kickoff = kickoff; }
public boolean isRivalry() { return isRivalry; }
public void setRivalry(boolean rivalry) { this.isRivalry = rivalry; }
public boolean isPlayoffImplication() { return isPlayoffImplication; }
public void setPlayoffImplication(boolean playoffImplication) { this.isPlayoffImplication = playoffImplication; }
}


