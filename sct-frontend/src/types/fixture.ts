export type League = "NBA" | "NFL" | "MLB" | "EPL"

export type FixtureStatus = "ft" | "live" | "upcoming"

export interface Team{
    id: number;
    name: string;
    league: string;
    externalId: string;
}

export interface Fixture{
    id: number;
     homeTeam: Team;
  awayTeam: Team;
  kickoff: string;
  isPlayoffImplication: boolean;
}

export interface ScoredFixture{
    fixture: Fixture;
    score: number;
    reasoning: string;
}

export interface TeamDetail{
    id: number;
    name: string;
    league: string;
    externalId: string;
    fixtures: ScoredFixture[];
}