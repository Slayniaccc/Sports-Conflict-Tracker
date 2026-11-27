import type {League} from "../types/fixture";

export const LEAGUES: League[] = ["NBA", "NFL", "MLB", "EPL"];

//tailwind only generates classes it can find as complete strings

export const LEAGUE_SWATCH: Record<League, string> = {
     NBA: "bg-nba",
  NFL: "bg-nfl",
  MLB: "bg-mlb",
  EPL: "bg-epl",
}

export const GAME_MINUTES: Record<League, number> = {
  NBA: 150,
  NFL: 210,
  MLB: 180,
  EPL: 120,
};