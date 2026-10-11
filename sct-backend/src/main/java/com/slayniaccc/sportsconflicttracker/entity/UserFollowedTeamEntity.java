
package com.slayniaccc.sportsconflicttracker.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_followed_team")
public class UserFollowedTeamEntity {

    @EmbeddedId
    private UserFollowedTeamId id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private AppUserEntity user;

    @ManyToOne
    @MapsId("teamId")
    @JoinColumn(name = "team_id")
    private TeamEntity team;

    public UserFollowedTeamEntity() {}

    public UserFollowedTeamId getId() { return id; }
    public AppUserEntity getUser() { return user; }
    public void setUser(AppUserEntity user) { this.user = user; }
    public TeamEntity getTeam() { return team; }
    public void setTeam(TeamEntity team) { this.team = team; }
}
