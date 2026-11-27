package com.slayniaccc.sportsconflicttracker.model;

public record Factor(Kind kind, int points, String label, String reason) {

public enum Kind {RIVALRY, PLAYOFF, HOME, FAVORITE_TEAM}
}