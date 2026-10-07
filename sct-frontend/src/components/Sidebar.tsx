export type League = "NBA"| "NFL" | "MLB" | "EPL"

const LEAGUES : League[] = ["NBA", "NFL", "MLB", "EPL"]

interface SidebarProps{
    selectedLeague: League;
    onSelectLeague: (league: League) => void;
}

export default function Sidebar({selectedLeague, onSelectLeague}: SidebarProps){
return(
    <aside className="w-56 border-r border-zinc-800 p-4 shrink-0">
        <h1 className="text-lg font-semibold mb-6">Matchday</h1>
        <nav className="flex flex-col gap-1">
        {LEAGUES.map((league) => (
<button
key = {league}
onClick={() => onSelectLeague(league)}
className={`text-left px-3 py=2.5 rounded-md border-l-2 ${
    selectedLeague === league
    ? "bg-zinc-900 border-amber-400"
    : "border-transparent hover:bg-zinc-900/50"
}`}
>
{league}
</button>
))}
        </nav>
    </aside>
);
}