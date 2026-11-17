import {Link} from "react-router";
import {teamAbbr, teamShort} from "../lib/teams";

interface TeamBlockProps{
    name: string;
    league: string;
    side: "home" | "away";
    to?: string;
}

export default function TeamBlock({name, league, side, to}: TeamBlockProps){
    const isHome = side === "home";
    const short = teamShort(name, league);

return (
     <div className={`flex min-w-0 items-center gap-4 ${isHome ? "flex-row-reverse text-right" : ""}`}>
      <span
        aria-hidden="true"
        className="grid size-[72px] shrink-0 place-items-center rounded-full border border-line bg-raised font-display text-2xl"
      >
        {teamAbbr(name)}
      </span>
      <div className="min-w-0">
        <div className="truncate font-display text-[clamp(40px,6vw,84px)] uppercase leading-[0.95]">
          {to ? (
            <Link to={to} className="transition-colors hover:text-accent">
              {short}
            </Link>
          ) : (
            short
          )}
        </div>
        <div className="mt-1.5 truncate text-sm font-medium text-muted">
          {name} · {isHome ? "Home" : "Away"}
        </div>
      </div>
    </div>
)
}