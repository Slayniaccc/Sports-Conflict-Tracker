package com.slayniaccc.sportsconflicttracker.engine;

import com.slayniaccc.sportsconflicttracker.model.Rivalry;


import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


public class RivalryLookup{

    private final Map<String, Rivalry> byPair = new HashMap<>();

    public RivalryLookup(Collection<Rivalry> rivalries) {
        for(Rivalry r : rivalries){
            byPair.put(key(r.league(), r.teamA(), r.teamB()), r);
             byPair.put(key(r.league(), r.teamB(), r.teamA()), r);
        }
    }

    public Optional<Rivalry> find(String league, String home, String away){
        return Optional.ofNullable(byPair.get(key(league, home, away)));
    }
    public int size(){
        return byPair.size() / 2;
    }
    private static String key(String league, String a, String b){
        return league + "|" + a + "|" + b;
    }
}