import type { League } from "../types/fixture";
import {useAuth} from "../contexts/AuthContext";
import {Link} from "react-router";

const LEAGUES : League[] = ["NBA", "NFL", "MLB", "EPL"]

interface SidebarProps{
    selectedLeague: League;
    onSelectLeague: (league: League) => void;
}

export default function Sidebar({selectedLeague, onSelectLeague}: SidebarProps){
    const {isLoggedIn, user, logout} = useAuth();
return(
    <aside className="w-56 border-r border-zinc-800 p-4 shrink-0">
        <h1 className="text-lg font-semibold mb-6">Matchday</h1>
        <nav className="flex flex-col gap-1">
        {LEAGUES.map((league) => (
<button
key = {league}
onClick={() => onSelectLeague(league)}
className={`text-left px-3 py-2.5 rounded-md border-l-2 ${
    selectedLeague === league
    ? "bg-zinc-900 border-amber-400"
    : "border-transparent hover:bg-zinc-900/50"
}`}
>
{league}
</button>
))}
        </nav>

        <div className="border-t border-zinc-800 pt-4 mt-4">
            {isLoggedIn ? (
                < div className="flex flex-col gap-2">
                    <p className="text-xs text-zinc-500 truncate"
                    title={user?.email}>
                        {user?.email}
                    </p>
                    <button 
                    onClick={logout}
                        className="text-left text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
                          Sign out
                        </button>
                        </div>
            ) : (
                <Link
                to="/login"
                className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
                >
                    Sign in
                </Link>
            )}

        </div>
    </aside>
);
}