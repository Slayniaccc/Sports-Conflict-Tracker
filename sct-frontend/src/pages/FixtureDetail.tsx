import { Loading, Bar } from "../components/Skeleton";
import { useParams, Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { getScoredFixture,getScoredFixtures  } from "../api/fixtures";
import type { ScoredFixture, League } from "../types/fixture"
import { ArrowLeft } from "lucide-react";
import TopBar from "../components/TopBar";
import TeamBlock from "../components/TeamBlock";
import { useCountUp } from "../hooks/useCountUp";
import ScoreBreakdown from "../components/ScoreBreakdown";
import ClashCard, { type ClashState } from "../components/ClashCard";
import { findClashes } from "../lib/clashes";
import PlannedModules from "../components/PlannedModules";

export default function FixtureDetail() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fixture, setFixture] = useState<ScoredFixture | null>(null);
    const [leagueFixtures, setLeagueFixtures] = useState<{
        league: League;
        data: ScoredFixture[] | null;
  } | null>(null);
    const navigate = useNavigate();
    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        setLoading(true);
        setError(null);

        getScoredFixture(id)
            .then((data) => {
                if (cancelled) return;
                setFixture(data);
                setLoading(false);
            })

            .catch((err) => {


                if (cancelled) return;
                setError(err.message)
                setLoading(false)
            })
        return () => {
            cancelled = true;
        }
    }, [id])
    const league = fixture ? (fixture.fixture.homeTeam.league as League) : null;
    useEffect(() => {
        if(!league) return;
        let cancelled = false;
        getScoredFixtures(league)
        .then((data) => {
            if(!cancelled) setLeagueFixtures({league,data});
        })
        .catch(() => {
            if(!cancelled)setLeagueFixtures({ league, data: null });
        })
        return () => {
             cancelled = true;
        }
        
    }, [league])
    let clashState: ClashState = { status: "loading" };
if (fixture && leagueFixtures?.league === league) {
  clashState = leagueFixtures.data
    ? { status: "ready", rivals: findClashes(leagueFixtures.data).get(fixture.fixture.id) ?? [] }
    : { status: "error" };
}
    const notFound = error === "HTTP 404";
    const shown = useCountUp(fixture?.score ?? 0);

    return (
        < div className = "min-h-screen">
                  < TopBar selectedLeague = { league } onSelectLeague = {(l) => navigate(`/?league=${l}`)
} />

    < main className = "mx-auto max-w-[1200px] px-8 pb-16 pt-7" >
        <Link
            to={league ? `/?league=${league}` : "/"}
            className="mb-6 inline-flex h-11 items-center gap-2 text-sm font-semibold text-ink-2 transition-colors hover:text-ink"
        >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to fixtures
        </Link>

{
    loading && (
        <Loading label="Loading fixture">
          <Bar className="h-[240px] w-full rounded-[22px]" />
          <div className="flex flex-wrap gap-6">
            <Bar className="h-[200px] min-w-[280px] flex-1 rounded-[18px]" />
            <Bar className="h-[200px] min-w-[280px] flex-1 rounded-[18px]" />
          </div>
        </Loading>
    )
}

{
    error && (
        <div className="rounded-[18px] border border-dashed border-line px-6 py-12 text-center">
            <p className="font-display text-[28px] uppercase">
                {notFound ? "Fixture not found" : "Couldn't load this fixture"}
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                {notFound
                    ? "It may have been removed, or the link is wrong."
                    : "Something went wrong on our side. Try again in a moment."}
            </p>
        </div>
    )
}

{
    !loading && !error && fixture && (
    <>
          <section
      aria-label="Fixture"
      className="rounded-[22px] border border-line px-8 pb-8 pt-7"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.018) 0 72px, transparent 72px 144px), linear-gradient(180deg, #141712, #0E100C)",
      }}
    >
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-ink-2">
        {league} ·{" "}
        {new Date(fixture.fixture.kickoff).toLocaleString([], {
          weekday: "long",
          day: "numeric",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </p>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-7">
        <TeamBlock
          name={fixture.fixture.homeTeam.name}
          league={fixture.fixture.homeTeam.league}
          side="home"
          to={`/teams/${fixture.fixture.homeTeam.id}`}
        />
        <div className="px-2 text-center">
          <span className="sr-only">Conflict score {fixture.score}</span>
          <div aria-hidden="true" className="font-display text-[clamp(72px,9vw,128px)] leading-[0.9] text-accent tabular-nums">
            {shown}
          </div>
          <div aria-hidden="true" className="mt-2 text-[11px] font-semibold tracking-[0.18em] text-muted">
            CONFLICT SCORE
          </div>
        </div>
        <TeamBlock
          name={fixture.fixture.awayTeam.name}
          league={fixture.fixture.awayTeam.league}
          side="away"
          to={`/teams/${fixture.fixture.awayTeam.id}`}
        />
      </div>
    </section>

    <div className="mt-6 flex flex-wrap items-start gap-6">
  <div className="min-w-0 flex-[3_1_460px]">
    <ScoreBreakdown score={fixture.score} factors={fixture.factors} />
  </div>
  <div className="min-w-0 flex-[2_1_320px]">
    <ClashCard fixture={fixture} state={clashState} />
  </div>
</div>
<PlannedModules />
  </>
    )
}
        </main >
    </div >
)

        
        
}