import type { League, ScoredFixture } from "../types/fixture";
import { GAME_MINUTES } from "./leagues";

/** For each fixture id, the other fixtures whose game time overlaps it. */
export function findClashes(items: ScoredFixture[]): Map<number, ScoredFixture[]> {
  const span = (f: ScoredFixture) => {
    const start = new Date(f.fixture.kickoff).getTime();
    const minutes = GAME_MINUTES[f.fixture.homeTeam.league as League] ?? 150;
    return { start, end: start + minutes * 60_000 };
  };

  const sorted = [...items].sort((a, b) => span(a).start - span(b).start);
  const clashes = new Map<number, ScoredFixture[]>();
  const add = (a: ScoredFixture, b: ScoredFixture) => {
    clashes.set(a.fixture.id, [...(clashes.get(a.fixture.id) ?? []), b]);
  };

  for (let i = 0; i < sorted.length; i++) {
    const a = span(sorted[i]);
    for (let j = i + 1; j < sorted.length; j++) {
      if (span(sorted[j]).start >= a.end) break; // sorted, so nothing later can overlap
      add(sorted[i], sorted[j]);
      add(sorted[j], sorted[i]);
    }
  }
  return clashes;
}