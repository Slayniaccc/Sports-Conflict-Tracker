 import {useState, useEffect} from "react";
 
 
 
 type FixtureStatus = "ft" | "live" | "upcoming";
          interface FixtureCardProps{
           time: string;
  venue: string;
  status: FixtureStatus;
  liveScore?: string;
  homeAbbr: string;
  homeName: string;
  homeScore?: number;
  awayAbbr: string;
  awayName: string;
  awayScore?: number;
          }
interface TeamRowProps{
 abbr: string;
  name: string;
  label: string;
  score?: number;
}

interface StatusBadgeProps {
  status: FixtureStatus;
  liveScore?: string;
  homeScore?: number;
  awayScore?: number;
}
function TeamRow({abbr, name, label, score} : TeamRowProps){
  return(
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[0.6rem] font-bold text-zinc-400">{abbr}</span>

      <div>
      <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-zinc-600">{label}</p>
    </div>
    </div>
    {score !== undefined && (
        <span className="text-2xl font-semibold tabular-nums">{score}</span>
      )}
      </div>
  );
}
function StatusBadge({status, liveScore, homeScore, awayScore} : StatusBadgeProps){
  if(status === "ft"){
    const finalScore =
    homeScore !== undefined && awayScore !== undefined
    ? `${homeScore}-${awayScore}`
    : "";
    return(
      <span className="text-zinc-500 bg-zinc-950/60 border border-zinc-800
      px-2 py-0.5 rounded font-mono text-[0.7rem]">FT * {finalScore}</span>
    )
  
}
if(status === "live"){
  return (
      <span className="flex items-center gap-1.5 text-red-500 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded font-mono text-[0.7rem]">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        LIVE · {liveScore}
      </span>
    );
}
  return (
    <span className="text-amber-400 bg-amber-400/5 border border-amber-400/30 px-2 py-0.5 rounded text-[0.7rem]">
      Upcoming
    </span>
  );
}
function FixtureCard(props: FixtureCardProps){
    const {
    time,
    venue,
    status,
    liveScore,
    homeAbbr,
    homeName,
    homeScore,
    awayAbbr,
    awayName,
    awayScore,
  } = props;
  return(
     <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors">
      <div className="flex items-center justify-between mb-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-zinc-100 font-medium">{time}</span>
          <span className="text-zinc-500">{venue}</span>
        </div>
        <StatusBadge
          status={status}
          liveScore={liveScore}
          homeScore={homeScore}
          awayScore={awayScore}
        />
      </div>
       <TeamRow abbr={homeAbbr} name={homeName} label="Home" score={homeScore} />

      <div className="border-t border-zinc-800/60 my-2" />

      <TeamRow abbr={awayAbbr} name={awayName} label="Away" score={awayScore} />
    </div>
  )
}
export default function App(){
  const[selectedLeague, setSelectedLeague] = useState("NBA");
  const[fixtures, setFixtures] = useState<any[]>([]);
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
      {/* rendering card logic goes here */}
    </div>
  )}
</main>
</div>
)
}
