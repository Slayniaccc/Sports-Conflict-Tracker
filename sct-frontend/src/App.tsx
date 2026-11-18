import { useState, useEffect } from "react";
import type { League, ScoredFixture } from "./types/fixture";
import DayGroup from "./components/DayGroup";
import HeroPick from "./components/HeroPick";
import YourTeamCard from "./components/YourTeamCard";
import ComingNextCard from "./components/ComingNextCard";
import SignInCard from "./components/SignInCard";
import TopBar from "./components/TopBar";
import DayStrip from "./components/DayStrip";
import { buildWeek, dayHeading, dayKey, groupByDay } from "./lib/days";
import { findClashes } from "./lib/clashes";
import { getScoredFixtures } from "./api/fixtures";
import {useSearchParams} from "react-router";
import { LEAGUES } from "./lib/leagues";

//currently a stand in for a real status field,keeps games that recently kicked off on the page
const IN_PROGRESS_GRACE_MS = 3 * 60 * 60 * 1000;


function parseLeague(value: string|null):League{
  const upper = value?.toUpperCase();
 return LEAGUES.find((l) => l === upper) ?? "NBA";
}

export default function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedLeague = parseLeague(searchParams.get("league"));
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
const [result, setResult] = useState<{
 league: League;
  data: ScoredFixture[];
  error: string | null;
} | null>(null);

  function handleSelectLeague(league: League) {
    if (league === selectedLeague) return;
    setSearchParams({ league });
  setSelectedDay(null);
  }
  useEffect(() => {
    let cancelled = false;
      const league = selectedLeague;
    getScoredFixtures(selectedLeague)
      .then((data) => {
         if (!cancelled) setResult({ league, data, error: null });
      })
      .catch((err) => {
          if (!cancelled) setResult({league, data: [], error: err.message });
      })
    return () => {
      cancelled = true;
    };
  }, [selectedLeague])

  const loading = result?.league !== selectedLeague;
const fixtures = loading ? [] : result.data;
const error = loading ? null : result.error;
  const now = new Date();
  const upcoming = fixtures.filter(
    (item) =>
      new Date(item.fixture.kickoff).getTime() >= now.getTime() - IN_PROGRESS_GRACE_MS
  )
    .sort(
      (a, b) => new Date(a.fixture.kickoff).getTime() - new Date(b.fixture.kickoff).getTime()
    );
  const week = buildWeek(upcoming, now);
  const visible = selectedDay
    ? upcoming.filter((item) => dayKey(new Date(item.fixture.kickoff)) === selectedDay)
    : upcoming.slice(0, 20);
  const clashes = findClashes(upcoming);
  const weekKeys = new Set(week.map((d) => d.key));
  const candidates = selectedDay
    ? visible
    : upcoming.filter((item) => weekKeys.has(dayKey(new Date(item.fixture.kickoff))));
  const topPick = candidates.reduce<ScoredFixture | null>(
    (best, item) => (best === null || item.score > best.score ? item : best),
    null,
  );
  return (
    <div className="min-h-screen">
      <TopBar selectedLeague={selectedLeague} onSelectLeague={handleSelectLeague}>
        <DayStrip days={week} selected={selectedDay} onSelect={setSelectedDay} />
      </TopBar>



      <main className="mx-auto max-w-[1360px] px-8 pb-16 pt-7">
        {!loading && !error && topPick && (
          <div className="mb-8">
            <HeroPick
              key={topPick.fixture.id}
              item={topPick}
              clashesWith={clashes.get(topPick.fixture.id) ?? []}
            />
          </div>
        )}

        <div className="flex flex-col gap-7 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>

                <h1 className="font-display text-[44px] leading-none tracking-[0.01em]">{selectedDay ? dayHeading(selectedDay, now) : "UP NEXT"}</h1>
                <p className="mt-1.5 text-sm text-muted">Ranked by how much each game matters to you.</p>
              </div>
              <p className="text-sm text-muted">
                {selectedDay
                  ? `${visible.length} ${visible.length === 1 ? "game" : "games"}`
                  : `Showing ${visible.length} of ${upcoming.length}`}
              </p>
            </div>


            {loading && (
              <p className="text-zinc-500">Loading fixtures...</p>
            )}

            {error && (
              <p className="text-red-500">Error: {error}</p>
            )}
            {!loading && !error && visible.length === 0 && (
              <p className="text-zinc-500">No upcoming {selectedLeague} fixtures.</p>
            )}
            {!loading && !error && groupByDay(visible).map((group) => (
              <DayGroup
                key={group.day}
                label={selectedDay ? null : group.day}
                items={group.items}
                clashes={clashes}


              />
            ))}
          </div>
          <aside aria-label="Your team and what's next" className="flex w-full shrink-0 flex-col gap-[18px] lg:w-[320px]">
            <YourTeamCard />
            <ComingNextCard />
            <SignInCard />
          </aside>
        </div>

      </main>
    </div>
  );
}
