import { useState, useEffect } from "react";
import type { ScoredFixture } from "./types/fixture";
import FixtureCard from "./components/FixtureCard";
import Sidebar, { type League } from "./components/Sidebar";
import  {toCardProps} from "./lib/toCardProps";

//currently a stand in for a real status field,keeps games that recently kicked off on the page
const IN_PROGRESS_GRACE_MS = 3 * 60 * 60 * 1000; 

export default function App(){
  const[selectedLeague, setSelectedLeague] = useState<League>("NBA");
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
const now = new Date();
const upcoming = fixtures.filter(
  (item) =>
    new Date(item.fixture.kickoff).getTime() >= now.getTime() - IN_PROGRESS_GRACE_MS
);
const visible = upcoming.slice(0, 20);
  return(
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
   <Sidebar selectedLeague={selectedLeague} onSelectLeague={setSelectedLeague} />

        
  
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
      {...toCardProps(item)}
         />
      );
    })}
  </div>
)}
   
      </main>
    </div>
  );
}