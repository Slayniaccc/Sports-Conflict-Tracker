package com.slayniaccc.sportsconflicttracker.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class UserFollowedTeamId implements Serializable {

    private Long userId;
    private Long teamId;

    public UserFollowedTeamId() {}

    public UserFollowedTeamId(Long userId, Long teamId) {
        this.userId = userId;
        this.teamId = teamId;
    }

    public Long getUserId() { return userId; }
    public Long getTeamId() { return teamId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserFollowedTeamId)) return false;
        UserFollowedTeamId that = (UserFollowedTeamId) o;
        return Objects.equals(userId, that.userId) && Objects.equals(teamId, that.teamId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, teamId);
    }
}
