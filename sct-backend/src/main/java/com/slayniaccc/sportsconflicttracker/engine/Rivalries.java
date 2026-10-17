package com.slayniaccc.sportsconflicttracker.engine;

import java.util.Set;

public final class Rivalries{
    private Rivalries() {}

        public static final Set<String> NBA = Set.of(
        "Boston Celtics|Los Angeles Lakers",
        "New York Knicks|Brooklyn Nets",
        "Boston Celtics|Philadelphia 76ers",
        "New York Knicks|Miami Heat",
        "New York Knicks|Chicago Bulls",
        "Golden State Warriors|LA Clippers",
        "Golden State Warriors|Sacramento Kings",
        "Chicago Bulls|Detroit Pistons",
        "San Antonio Spurs|Houston Rockets",
        "Dallas Mavericks|Phoenix Suns",
        "Miami Heat|Boston Celtics",
        "Indiana Pacers|Milwaukee Bucks",
        "Denver Nuggets|Minnesota Timberwolves"
    );
    public static final Set<String> NFL = Set.of(
        "Dallas Cowboys|Philadelphia Eagles",
        "Dallas Cowboys|Washington Commanders",
        "Dallas Cowboys|New York Giants",
        "Philadelphia Eagles|Washington Commanders",
        "Green Bay Packers|Chicago Bears",
        "Green Bay Packers|Minnesota Vikings",
        "Chicago Bears|Minnesota Vikings",
        "Pittsburgh Steelers|Baltimore Ravens",
        "Pittsburgh Steelers|Cleveland Browns",
        "Cleveland Browns|Cincinnati Bengals",
        "Baltimore Ravens|Cincinnati Bengals",
        "Kansas City Chiefs|Las Vegas Raiders",
        "Kansas City Chiefs|Denver Broncos",
        "Kansas City Chiefs|Los Angeles Chargers",
        "San Francisco 49ers|Seattle Seahawks",
        "San Francisco 49ers|Los Angeles Rams",
        "Seattle Seahawks|Arizona Cardinals",
        "Seattle Seahawks|Los Angeles Rams",
        "New York Jets|New England Patriots",
        "New York Jets|Buffalo Bills",
        "New England Patriots|Buffalo Bills",
        "New England Patriots|Miami Dolphins",
        "Buffalo Bills|Miami Dolphins"
    );
    public static final Set<String> MLB = Set.of(
      "New York Yankees|Boston Red Sox",
        "New York Yankees|New York Mets",
        "Los Angeles Dodgers|San Diego Padres",
        "Milwaukee Brewers|Los Angeles Dodgers",
        "Los Angeles Dodgers|San Francisco Giants",
        "San Francisco Giants|San Diego Padres",
        "Chicago Cubs|St. Louis Cardinals",
        "Chicago Cubs|Chicago White Sox",
        "St. Louis Cardinals|Cincinnati Reds",
        "Cleveland Guardians|Detroit Tigers",
        "Houston Astros|Texas Rangers",
        "Houston Astros|Seattle Mariners",
        "Texas Rangers|Seattle Mariners",
        "Baltimore Orioles|Toronto Blue Jays",
        "New York Mets|Philadelphia Phillies",
        "Atlanta Braves|Philadelphia Phillies"
    );

   public static final Set<String> EPL = Set.of(
        "Arsenal FC|Tottenham Hotspur FC",
        "Liverpool FC|Manchester City FC",
        "Manchester United FC|Manchester City FC",
        "Manchester United FC|Liverpool FC",
        "Liverpool FC|Everton FC",
        "Chelsea FC|Tottenham Hotspur FC",
        "Chelsea FC|Fulham FC",
        "Aston Villa FC|Coventry City FC",
        "Newcastle United FC|Sunderland AFC",
        "Leeds United FC|Manchester United FC",
        "Nottingham Forest FC|Leeds United FC"
    );

    public static boolean isRivalry(String league, String homeName, String awayName){
        Set<String> set = switch (league){
            case "NBA" -> NBA;
            case "NFL" -> NFL;
            case "MLB" -> MLB;
            case "EPL" -> EPL;
            default -> Set.of();
        };
        return set.contains(homeName + "|" + awayName)
        || set.contains(awayName + "|" + homeName);
    }
    
}