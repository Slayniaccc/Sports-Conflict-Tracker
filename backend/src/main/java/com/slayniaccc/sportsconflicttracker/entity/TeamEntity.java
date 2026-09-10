package com.slayniaccc.sportsconflicttracker.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "team")
public class TeamEntity{

@Id 
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@Column(nullable = false)
private String name;

@Column(nullable = false)
private String league;

@Column(name = "external_id", nullable = false, unique = true)
private String externalId;
 public TeamEntity() {}

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLeague() { return league; }
    public void setLeague(String league) { this.league = league; }
    public String getExternalId() { return externalId; }
    public void setExternalId(String externalId) { this.externalId = externalId; }

}