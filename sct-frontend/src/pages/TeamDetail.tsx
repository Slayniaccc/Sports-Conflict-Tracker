import {useParams, Link, useNavigate} from "react-router";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { getTeamDetail } from "../api/fixtures";
import type {League, ScoredFixture, TeamDetail as TeamDetailData } from "../types/fixture";
import TopBar from "../components/TopBar";
import DayGroup from "../components/DayGroup";
import { groupByDay } from "../lib/days";
import { teamAbbr } from "../lib/teams";


const NO_CLASHES = new Map<number, ScoredFixture[]>();
const PLAYED_SHOWN = 10;

function byKickoff(a: ScoredFixture, b: ScoredFixture) {
  return new Date(a.fixture.kickoff).getTime() - new Date(b.fixture.kickoff).getTime();
}

export default function TeamDetail(){
    const {id} = useParams();
    const navigate = useNavigate();
    const[loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [team,setTeam] = useState<TeamDetailData | null>(null);

    useEffect(() => {
        if(!id) return;
        let cancelled = false;
        setLoading(true);
        setError(null);

        getTeamDetail(id)
        .then((data) => {
            if(cancelled) return;
            setTeam(data);
            setLoading(false);
        })
        .catch((err) => {
            if(cancelled) return;
            setError(err.message);
            setLoading(false);
        });
        return () => {
            cancelled = true;
        }
    }, [id]);

    const league = team ? (team.league as League) : null;
    const notFound = error === "HTTP 404";

    const now = Date.now();
 const fixtures = team?.fixtures ?? [];
 const upcoming = fixtures.filter((f) => new Date(f.fixture.kickoff).getTime() >= now).sort(byKickoff);
  const played = fixtures.filter((f) => new Date(f.fixture.kickoff).getTime() < now).sort(byKickoff).reverse();
  const recent = played.slice(0, PLAYED_SHOWN);


      return (
    <div className="min-h-screen">
     <TopBar selectedLeague={league} onSelectLeague={(l) => navigate(`/?league=${l}`)} />
        <main className="mx-auto max-w-[1200px] px-8 pb-16 pt-7">
          <Link
          to={league ? `/?league=${league}` : "/"}
          className="mb-6 inline-flex h-11 items-center gap-2 text-sm font-semibold text-ink-2 transition-colors hover:text-ink">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to fixtures
          </Link>
          {loading && <p className="text-muted">Loading team...</p>}
{error && (
  <div className="rounded-[18px] border border-dashed border-line px-6 py-12 text-center">
    <p className="font-display text-[28px] uppercase">
        {notFound ? "Team not found" : "Couldn't load this team"}
    </p>
    <p className="mx-auto mt-2 max-w-md text-sm text-muted">
      {notFound
      ? "It may have been removed,or the link is wrong."
      : "Something went wrong on our side. Try again in a moment"
      }
    </p>
  </div>
)}

 {!loading && !error && team && (
          <>
            <section
              aria-label="Team"
              className="flex flex-wrap items-center gap-6 rounded-[22px] border border-line px-8 py-7"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, rgba(255,255,255,0.018) 0 72px, transparent 72px 144px), linear-gradient(180deg, #141712, #0E100C)",
              }}
            >
              <span
                aria-hidden="true"
                className="grid size-[88px] shrink-0 place-items-center rounded-full border border-line bg-raised font-display text-3xl"
              >
                {teamAbbr(team.name)}
              </span>
              <div className="min-w-0">
                <p className="font-mono text-xs font-semibold tracking-[0.14em] text-ink-2">{team.league}</p>
                <h1 className="mt-1 font-display text-[clamp(44px,7vw,96px)] uppercase leading-[0.95]">
                  {team.name}
                </h1>
                <p className="mt-2 text-sm text-muted">
                  {upcoming.length} upcoming · {played.length} played
                </p>
              </div>
            </section>


       <h2 className="mb-4 mt-10 font-display text-[32px] uppercase leading-none">Upcoming</h2>
            {upcoming.length === 0 ? (
              <p className="text-muted">No upcoming fixtures.</p>
            ) : (
              groupByDay(upcoming).map((group) => (
                <DayGroup key={group.day} label={group.day} items={group.items} clashes={NO_CLASHES} />
              ))
            )}

            {recent.length > 0 && (
              <>
                <div className="mb-4 mt-10 flex flex-wrap items-end gap-3">
                  <h2 className="font-display text-[32px] uppercase leading-none">Recently played</h2>
                  <span className="text-sm text-muted">
                    Last {recent.length} · final scores not stored yet
                  </span>
                </div>
                {groupByDay(recent).map((group) => (
                  <DayGroup key={group.day} label={group.day} items={group.items} clashes={NO_CLASHES} />
                ))}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}