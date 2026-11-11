import {motion} from "motion/react";
import type {League} from "../types/fixture";
import {LEAGUES, LEAGUE_SWATCH} from "../lib/leagues";

interface LeagueTabsProps{
    selected: League;
    onSelect: (league: League) => void;
}

export default function LeagueTabs({selected, onSelect}: LeagueTabsProps){
    return(
        <nav aria-label="Leagues" className="flex gap-1 rounded-full border border-line
        bg-surface p-1">
            {LEAGUES.map((league) => {
                const active = league === selected;
                return (
                    <button
                    key={league}
                    type="button"
                    onClick={() => onSelect(league)}
                    aria-pressed={active}
                    className={`relative flex h-10 w-[88px] items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors ${
                        active ? "text-bg" : "text-ink-2 hover:text-ink"
                    }`}
                    >
                        {active && (
                            <motion.span
                            layoutId="league-pill"
                            aria-hidden="true"
                            className="absolute inset-0 rounded-full bg-accent"
                            transition={{type: "spring", stiffness: 500, damping: 40}}
                            />
                        )} 
                        <span aria-hidden="true" className={`relative size-2 rounded-[2px] ${LEAGUE_SWATCH[league]}`}/>
                        <span className="relative">{league}</span>
                    </button>
                );
            })}
        </nav>
    )
}