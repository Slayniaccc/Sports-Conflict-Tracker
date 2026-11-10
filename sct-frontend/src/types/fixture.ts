export type League = "NBA" | "NFL" | "MLB" | "EPL"

export type FixtureStatus = "ft" | "live" | "upcoming"

export type FactorKind = "RIVALRY" | "PLAYOFF" | "HOME" | "FAVORITE_TEAM"

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

export interface Factor {
    kind: FactorKind;
    points: number;
    label: string;
    reason: string;
}
export interface ScoredFixture{
    fixture: Fixture;
    score: number;
    reasoning: string;
    factors: Factor[];

}

export interface TeamDetail{
    id: number;
    name: string;
    league: string;
    externalId: string;
    fixtures: ScoredFixture[];
}