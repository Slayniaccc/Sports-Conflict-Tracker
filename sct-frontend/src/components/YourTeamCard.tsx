import type {ReactNode} from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { useFavoriteTeam } from "../hooks/useFavoriteTeam";
import { teamAbbr, teamShort } from "../lib/teams";
import type { ScoredFixture, TeamDetail } from "../types/fixture";


function Panel({children}: {children: ReactNode}) {
    return(
        <section aria-labelledby="your-team-heading" className="rounded-[18px] border border-line bg-surface p-5">
            <h2 id="your-team-heading" className="text-xs font-bold tracking-[0.14em] text-muted">
                YOUR TEAM
            </h2>
            {children}
        </section>
    )
}

function nextGameText(team: TeamDetail, next: ScoredFixture): string {
    const atHome = next.fixture.homeTeam.id === team.id;
    const opponent = atHome ? next.fixture.awayTeam : next.fixture.homeTeam;
    const when = new Date(next.fixture.kickoff).toLocaleString([], {
          weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    })
     return `${atHome ? "vs" : "at"} ${teamShort(opponent.name, opponent.league)} · ${when}`;
}

export default function YourTeamCard() {
    const fav = useFavoriteTeam();
    
    if(fav.status === "loggedOut") return null;

    if(fav.status === "loading"){
        return(
            <Panel>
               <div aria-busy="true" className="mt-4 flex items-center gap-3.5">
          <span className="sr-only">Loading your team</span>
          <span aria-hidden="true" className="size-[52px] shrink-0 animate-pulse rounded-full bg-raised" />
          <span aria-hidden="true" className="flex flex-1 flex-col gap-2">
            <span className="h-4 w-2/3 animate-pulse rounded bg-raised" />
            <span className="h-3 w-1/2 animate-pulse rounded bg-raised" />
          </span>
        </div> 
            </Panel>
        )
    }
      if (fav.status === "error") {
    return (
      <Panel>
        <p className="mt-3 text-sm text-muted">Couldn't load your team right now.</p>
      </Panel>
    );
  }
    if (fav.status === "none") {
    return (
      <Panel>
        <p className="mt-3 text-sm font-semibold">No favourite team yet</p>
        <p className="mt-1 text-sm text-muted">Pick one and its games get +15 and rise to the top.</p>
      </Panel>
    );
  }
  const {team, next} = fav;
  return(
    <Panel>
        <div className="mt-4 flex items-center gap-3.5">
        <span
          aria-hidden="true"
          className="grid size-[52px] shrink-0 place-items-center rounded-full border border-accent bg-raised font-display text-lg"
        >  
        {teamAbbr(team.name)}
        </span>  
         <div className="min-w-0">
          <p className="truncate text-[17px] font-bold">{team.name}</p>
          <p className="mt-0.5 text-[13px] text-muted">{team.league} · +15 on every game</p>
        </div>
      </div>
       <dl className="mt-4 flex justify-between gap-3 border-t border-line-soft pt-3.5 text-sm">
        <dt className="text-muted">Next game</dt>
        <dd className="text-right">{next ? nextGameText(team, next) : "None scheduled"}</dd>
      </dl>
    <Link
        to={`/teams/${team.id}`}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-transform hover:translate-x-0.5"
      >
          Team page
        <ArrowRight aria-hidden="true" className="size-3.5" />
      </Link>
    </Panel>
  )
}