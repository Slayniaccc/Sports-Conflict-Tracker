import {useParams, Link} from "react-router";
import {useState, useEffect} from "react";
import {API_URL} from "../api/config"
import type {ScoredFixture} from "../types/fixture"

 
export default function FixtureDetail() {
    const {id} = useParams();
          const [loading, setLoading] = useState(true);
          const [error,setError] = useState<string | null>(null);
          const [fixture,setFixture] = useState<ScoredFixture | null>(null);

          useEffect(() => {
            
            let cancelled = false;
            setLoading(true);
            setError(null);
           
            fetch(`${API_URL}/api/fixtures/scored/${id}`)
            .then((res) =>{
                  
                if(!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                
                if(cancelled) return;
                setFixture(data)
                setLoading(false)
            })
            .catch((err) => {
                    

                if(cancelled) return;
                setError(err.message)
                setLoading(false)
            })
            return () => {
                cancelled = true;
            }
        }, [id])
          
    return(
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
           <div className="max-w-2xl mx-auto p-8">
            <Link
                to="/"
                className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-100 mb-6 transition-colors"
            >
                ← Back to fixtures
            </Link>

            {loading && (
                <p className="text-zinc-500">Loading fixture…</p>
            )}

            {error && (
                <p className="text-red-500">Error: {error}</p>
            )}

            {!loading && !error && fixture && (
                <div>
                    <div className="mb-6">
                        <p className="text-sm text-zinc-500 mb-1">
                            {fixture.fixture.homeTeam.league}
                        </p>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {fixture.fixture.homeTeam.name} vs {fixture.fixture.awayTeam.name}
                        </h1>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Kickoff</p>
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

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                        <div className="flex items-baseline justify-between mb-4">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider">Conflict score</p>
                            <span className="text-3xl font-semibold tabular-nums">{fixture.score}</span>
                        </div>
                        <p className="text-sm text-zinc-400">{fixture.reasoning}</p>
                    </div>
                </div>
            )}
        </div>
    </div>
)
        
        
}