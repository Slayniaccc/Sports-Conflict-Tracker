import {useParams, Link} from "react-router";
import { useState, useEffect } from "react";
import { getTeamDetail } from "../api/fixtures";
import type { TeamDetail as TeamDetailData } from "../types/fixture";
import FixtureCard from "../components/FixtureCard";
import { toCardProps } from "../lib/toCardProps";



export default function TeamDetail(){
    const {id} = useParams();
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

    const now = Date.now();
 const byKickoff = (a: { fixture: { kickoff: string } }, b: { fixture: { kickoff: string } }) =>
     new Date(a.fixture.kickoff).getTime() - new Date(b.fixture.kickoff).getTime();

 const upcoming = (team?.fixtures ?? [])
    .filter((f) => new Date(f.fixture.kickoff).getTime() >= now)
    .sort(byKickoff);
  const past = (team?.fixtures ?? [])
    .filter((f) => new Date(f.fixture.kickoff).getTime() < now)
    .sort(byKickoff)
    .reverse();

      return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-4xl mx-auto p-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-100 mb-6 transition-colors"
        >
          ← Back to fixtures
        </Link>

        {loading && <p className="text-zinc-500">Loading team…</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && team && (
          <>
            <div className="mb-8">
              <p className="text-sm text-zinc-500 mb-1">{team.league}</p>
              <h1 className="text-3xl font-semibold tracking-tight">{team.name}</h1>
              <p className="text-sm text-zinc-500 mt-2">
                {upcoming.length} upcoming · {past.length} played
              </p>
            </div>

            <section className="mb-10">
              <h2 className="text-sm font-medium text-zinc-400 mb-3">Upcoming</h2>
              {upcoming.length === 0 ? (
                <p className="text-zinc-500">No upcoming fixtures.</p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {upcoming.map((item) => (
                    <FixtureCard key={item.fixture.id} {...toCardProps(item)} />
                  ))}
                </div>
              )}
            </section>

            {past.length > 0 && (
              <section>
                <h2 className="text-sm font-medium text-zinc-400 mb-3">Played</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {past.map((item) => (
                    <FixtureCard key={item.fixture.id} {...toCardProps(item)} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}