import { useParams, Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { getScoredFixture } from "../api/fixtures";
import type { ScoredFixture, League } from "../types/fixture"
import { ArrowLeft } from "lucide-react";
import TopBar from "../components/TopBar";

export default function FixtureDetail() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fixture, setFixture] = useState<ScoredFixture | null>(null);
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
    const notFound = error === "HTTP 404";

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
        <p className="text-muted">Loading fixture…</p>
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
        <div>
            <div className="mb-6">
                <p className="mb-1 text-sm text-muted">
                    {fixture.fixture.homeTeam.league}
                </p>
                <h1 className="text-2xl font-semibold tracking-tight">
                    <Link
                        to={`/teams/${fixture.fixture.homeTeam.id}`}
                        className="transition-colors hover:text-accent"
                    >
                        {fixture.fixture.homeTeam.name}
                    </Link>
                    <span className="text-muted"> vs </span>
                    <Link
                        to={`/teams/${fixture.fixture.awayTeam.id}`}
                        className="transition-colors hover:text-accent"
                    >
                        {fixture.fixture.awayTeam.name}
                    </Link>
                </h1>
            </div>

            <div className="mb-6 rounded-lg border border-line bg-surface p-6">
                <p className="mb-2 text-xs uppercase tracking-wider text-muted">Kickoff</p>
                <p className="text-lg">
                    {new Date(fixture.fixture.kickoff).toLocaleString([], {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                    })}
                </p>
            </div>

            <div className="rounded-lg border border-line bg-surface p-6">
                <div className="mb-4 flex items-baseline justify-between">
                    <p className="text-xs  uppercase tracking-wider">Conflict score</p>
                    <span className="text-3xl font-semibold tabular-nums">{fixture.score}</span>
                </div>
                <p className="text-sm text-zinc-400">{fixture.reasoning}</p>
            </div>
        </div>
    )
}
        </main >
    </div >
)

        
        
}