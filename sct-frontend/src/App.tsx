import { useState, useEffect } from "react";
import type { ScoredFixture } from "./types/fixture";
import FixtureCard from "./components/FixtureCard";

export default function App(){
  const[selectedLeague, setSelectedLeague] = useState("NBA");
  const[fixtures, setFixtures] = useState<ScoredFixture[]>([]);
  const[loading, setLoading] = useState(true);
  const[error, setError] = useState< string | null>(null);
  useEffect(() => {
    fetch("http://localhost:8080/api/fixtures/scored")
    .then((res) => {
      if(!res.ok) throw new Error (`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) =>{
      setFixtures(data);
      setLoading(false)
     })
    .catch((err) => {
      setError(err.message);
      setLoading(false)
    })
  }, [])

  return(
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
     <aside className="w-56 border-r border-zinc-800 p-5 shrink-0">
      <div className="flex items-center gap-2 mb-8">
        <span className="w-2 h-2 rounded-full bg-amber-400" />
        <span className="font-semibold">Matchday</span>
      </div>
      <p className="text-[0.65rem] uppercase tracking-widest text-zinc-600 font-medium mb-3">Leagues</p>

      <nav className="flex flex-col gap-1">

        <button 
        onClick={()=> setSelectedLeague("NBA")}
      className={`text-left px-3 py-2.5 rounded-md border-l-2 ${
  selectedLeague === "NBA"
    ? "bg-zinc-900 border-amber-400"
   : "border-transparent hover:bg-zinc-900/50"
  }`}
  >
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-sm font-medium">NBA</span>
          
          </div>

           <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>Basketball</span>
        <span>4</span>
      </div>
        </button>
        



        <button 
        onClick={()=> setSelectedLeague("NFL")}
      className={`text-left px-3 py-2.5 rounded-md border-l-2 ${
  selectedLeague === "NFL"
    ? "bg-zinc-900 border-amber-400"
   : "border-transparent hover:bg-zinc-900/50"
  }`}
  >
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-sm font-medium">NFL</span>
      </div>
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>Football</span>
        <span>3</span>
      </div>
    </button>


        <button 
        onClick={()=> setSelectedLeague("MLB")}
      className={`text-left px-3 py-2.5 rounded-md border-l-2 ${
  selectedLeague === "MLB"
    ? "bg-zinc-900 border-amber-400"
   : "border-transparent hover:bg-zinc-900/50"
  }`}
  >
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-sm font-medium">MLB</span>
      </div>
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>Baseball</span>
        <span>3</span>
      </div>
    </button>

        <button 
        onClick={()=> setSelectedLeague("EPL")}
      className={`text-left px-3 py-2.5 rounded-md border-l-2 ${
  selectedLeague === "EPL"
    ? "bg-zinc-900 border-amber-400"
   : "border-transparent hover:bg-zinc-900/50"
  }`}
  >
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-sm font-medium">EPL</span>
      </div>
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>Soccer</span>
        <span>4</span>
      </div>
    </button>
  </nav>
</aside> 

        
  
      <main className="flex-1 p-8 overflow-y-auto">
       <p className="text-sm text-zinc-500 mb-1">NBA * Monday, September 28</p>
       <div className="flex items-baseline justify-between mb-6">
<h1 className="text-3xl font-semibold tracking-tight">Today's Fixtures</h1>
        <p className="text-sm text-zinc-500">{fixtures.length} games</p>
        </div>
       
       {loading && (
        <p className="text-zinc-500">Loading fixtures...</p>
       )}

       {error &&(
        <p className="text-red-500">Error: {error}</p>
       )}

      {!loading && !error && (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
{fixtures.slice(0, 20).map((item) => {
 const kickoff = new Date(item.fixture.kickoff);
 const time = kickoff.toLocaleString([], {
  hour: "2-digit",
        minute: "2-digit",
        hour12: false,
});
return(
  <FixtureCard
   key={item.fixture.id}
          time={time}
          venue={item.fixture.homeTeam.name}
          status="upcoming"
          homeAbbr={item.fixture.homeTeam.name.slice(0, 3).toUpperCase()}
          homeName={item.fixture.homeTeam.name}
          awayAbbr={item.fixture.awayTeam.name.slice(0, 3).toUpperCase()}
          awayName={item.fixture.awayTeam.name}
         />
      );
    })}
  </div>
)}
   
      </main>
    </div>
  );
}