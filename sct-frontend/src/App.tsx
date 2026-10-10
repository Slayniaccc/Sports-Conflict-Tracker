import { useState, useEffect } from "react";
import type { League, ScoredFixture } from "./types/fixture";
import FixtureCard from "./components/FixtureCard";
import Sidebar from "./components/Sidebar";
import  {toCardProps} from "./lib/toCardProps";
import { getScoredFixtures } from "./api/fixtures";

//currently a stand in for a real status field,keeps games that recently kicked off on the page
const IN_PROGRESS_GRACE_MS = 3 * 60 * 60 * 1000; 
function dayLabel(kickoff: string){
  return new Date(kickoff).toLocaleDateString([], {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

//relies on the list already being sorted by kickoff
function groupByDay(items: ScoredFixture[]){
  const groups: { day: string; items: ScoredFixture[] }[] = [];
  for (const item of items){
    const day = dayLabel(item.fixture.kickoff);
    const last = groups[groups.length - 1];
    if(last && last.day === day){
      last.items.push(item);
    } else {
      groups.push({ day, items: [item] });
    }
  }
  return groups;
}
export default function App(){
  const[selectedLeague, setSelectedLeague] = useState<League>("NBA");
  const[fixtures, setFixtures] = useState<ScoredFixture[]>([]);
  const[loading, setLoading] = useState(true);
  const[error, setError] = useState< string | null>(null);
  function handleSelectLeague(league: League){
  if(league === selectedLeague) return;
  setSelectedLeague(league);
  setLoading(true);
  setError(null);
}
  useEffect(() => {
     let cancelled = false;
        getScoredFixtures(selectedLeague)
    .then((data) =>{
      if(cancelled) return;
      setFixtures(data);
      setLoading(false)
     })
    .catch((err) => {
      if(cancelled) return
      setError(err.message);
      setLoading(false)
    })
  return () => {
    cancelled = true;
  };
}, [selectedLeague])
const now = new Date();
const upcoming = fixtures.filter(
  (item) =>
    new Date(item.fixture.kickoff).getTime() >= now.getTime() - IN_PROGRESS_GRACE_MS
)
.sort(
  (a,b) => new Date(a.fixture.kickoff).getTime() - new Date(b.fixture.kickoff).getTime()
);
const visible = upcoming.slice(0, 20);
  return(
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
   <Sidebar selectedLeague={selectedLeague} onSelectLeague={handleSelectLeague} />

        
  
      <main className="flex-1 p-8 overflow-y-auto">
     
       <div className="flex items-baseline justify-between mb-6">
<h1 className="text-3xl font-semibold tracking-tight">Upcoming Fixtures</h1>
        <p className="text-sm text-zinc-500">
          Showing {visible.length} of {upcoming.length}</p>
        </div>
       
       {loading && (
        <p className="text-zinc-500">Loading fixtures...</p>
       )}

       {error &&(
        <p className="text-red-500">Error: {error}</p>
       )}
{!loading && !error && visible.length === 0 && (
  <p className="text-zinc-500">No upcoming {selectedLeague} fixtures.</p>
)}
{!loading && !error && groupByDay(visible).map((group) => (
  <section key={group.day} className="mb-8">
    <h2 className="text-sm font-medium text-zinc-400 mb-3">{group.day}</h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {group.items.map((item) => (
        <FixtureCard
        key={item.fixture.id}
        {...toCardProps(item)}
        />
      ))}
      </div>
      </section>
))}

      </main>
    </div>
  );
}
  