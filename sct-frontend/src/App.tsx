import { useState, useEffect } from "react";
import type { League, ScoredFixture } from "./types/fixture";
import DayGroup from "./components/DayGroup";
import TopBar from "./components/TopBar";
import DayStrip from "./components/DayStrip";
import { buildWeek, dayHeading, dayKey } from "./lib/days";
import { findClashes } from "./lib/clashes";
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
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const[fixtures, setFixtures] = useState<ScoredFixture[]>([]);
  const[loading, setLoading] = useState(true);
  const[error, setError] = useState< string | null>(null);


  function handleSelectLeague(league: League){
  if(league === selectedLeague) return;
  setSelectedLeague(league);
  setSelectedDay(null);
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
const week = buildWeek(upcoming, now);
const visible = selectedDay
    ? upcoming.filter((item) => dayKey(new Date(item.fixture.kickoff))=== selectedDay)
    : upcoming.slice(0,20);
    const clashes = findClashes(upcoming);
  return(
    <div className="min-h-screen">
   <TopBar selectedLeague={selectedLeague} onSelectLeague={handleSelectLeague}>
  <DayStrip days={week} selected={selectedDay} onSelect={setSelectedDay} />
</TopBar>

        
  
      <main className="mx-auto max-w-[1360px] px-8 pb-16 pt-7">
     
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

       {error &&(
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

      </main>
    </div>
  );
}
  