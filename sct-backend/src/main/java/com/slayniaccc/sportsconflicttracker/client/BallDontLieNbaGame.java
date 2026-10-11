package com.slayniaccc.sportsconflicttracker.client;



public record BallDontLieNbaGame(
Long id,
String datetime,
BallDontLieGameTeam home_team,
BallDontLieGameTeam visitor_team

){}

