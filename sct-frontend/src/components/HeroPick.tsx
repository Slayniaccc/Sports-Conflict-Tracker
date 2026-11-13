import { Link } from "react-router";
import {ArrowRight, Clock, Star} from "lucide-react";
import type {ScoredFixture} from "../types/fixture";
import {teamAbbr, teamShort} from "../lib/teams";
import {useCountUp} from "../hooks/useCountUp";
import type {MouseEvent} from "react";

interface HeroPickProps{
    item: ScoredFixture;
    clashesWith: ScoredFixture[];
}

function kickoffLine(iso: string, league: string){
    const d = new Date(iso);
    const day = d.toLocaleDateString([], {weekday: "short", day: "numeric", month: "short"});
    const time = d.toLocaleDateString([], {hour: "2-digit", minute: "2-digit", hour12: false});
    return `${league} · ${day} · ${time}`.toUpperCase();
}

function shortTime(iso: string){
    return new Date(iso).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit", hour12: false})
}

function TeamBlock({name, league, side}: {name: string; league: string; side: "home" | "away"}) {
    const isHome = side === "home";

    return(
         <div className={`flex min-w-0 items-center gap-4 ${isHome ? "flex-row-reverse text-right" : ""}`}>
      <span
        aria-hidden="true"
        className="grid size-[72px] shrink-0 place-items-center rounded-full border border-line bg-raised font-display text-2xl"
      >
           {teamAbbr(name)}
      </span>
      <div className="min-w-0">
        <div className="truncate font-display text-[clamp(40px, 6vw, 84px)] uppercase leading-[0.95]">
                 {teamShort(name, league)}
        </div>
         <div className="mt-1.5 truncate text-sm font-medium text-muted">
          {name} · {isHome ? "Home" : "Away"}
        </div>
      </div>
      </div>
    )
}

export default function HeroPick({item, clashesWith} : HeroPickProps){
  const {fixture, score, factors} = item;
  const league = fixture.homeTeam.league;
  const shown = useCountUp(score);

    const rival = [...clashesWith].sort((a, b) => b.score - a.score)[0];
  const margin = rival ? score - rival.score : 0;

  function handleMove(e: MouseEvent<HTMLElement>){
     const box = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--x", `${e.clientX - box.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - box.top}px`);
  }

  return (
     <section

     
      aria-label="Top pick"
      onMouseMove={handleMove}
      className="group relative overflow-hidden rounded-[22px] border border-line px-8 pb-[30px] pt-7 [--x:50%] [--y:50%]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.018) 0 72px, transparent 72px 144px), linear-gradient(180deg, #141712, #0E100C)",
      }}
    >

            <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden"
        style={{
          background:
            "radial-gradient(520px circle at var(--x) var(--y), color-mix(in oklab, var(--color-accent) 12%, transparent), transparent 62%)",
        }}
      />
       <div className="relative flex flex-wrap items-center gap-3">
        <span className="inline-flex h-7 items-center gap-2 rounded-full bg-accent px-3 text-xs font-bold tracking-[0.08em] text-bg">
          <Star aria-hidden="true" className="size-3 fill-current" />
          TOP PICK
        </span>
        <span className="font-mono text-xs font-semibold tracking-[0.14em] text-ink-2">
          {kickoffLine(fixture.kickoff, league)}
        </span>
        <Link
          to={`/fixtures/${fixture.id}`}
          className="ml-auto inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-bg transition-transform hover:translate-x-0.5"
        >
          Open fixture
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>

       {/* Teams and score */}
      <div className="relative my-6 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-7">
        <TeamBlock name={fixture.homeTeam.name} league={league} side="home" />
        <div className="px-2 text-center">
          <span className="sr-only">Conflict score {score}</span>
          <div
            aria-hidden="true"
            className="font-display text-[clamp(84px,11vw,148px)] leading-[0.9] text-accent tabular-nums"
          >
            {shown}
          </div>
          <div aria-hidden="true" className="mt-2 text-[11px] font-semibold tracking-[0.18em] text-muted">
            CONFLICT SCORE
          </div>
        </div>
        <TeamBlock name={fixture.awayTeam.name} league={league} side="away" />
      </div>

       {/* Reason chips */}
      <ul className="relative flex flex-wrap justify-center gap-2.5">
        {factors.map((f) => (
          <li
            key={f.kind + f.label}
            className="inline-flex h-9 items-center gap-2.5 rounded-full border border-line bg-surface px-3.5 text-sm font-medium text-ink-2"
          >
            {f.label}
            <span className="font-mono text-[13px] font-semibold text-accent">+{f.points}</span>
          </li>
        ))}
      </ul>
{/* Clash line */}
      {rival && (
        <p className="relative mx-auto mt-[18px] flex max-w-[680px] items-center justify-center gap-2.5 text-center text-sm font-medium text-ink-2">
          <Clock aria-hidden="true" className="size-4 shrink-0 text-clash" />
          Overlaps {rival.fixture.homeTeam.name} vs {rival.fixture.awayTeam.name} ({shortTime(rival.fixture.kickoff)}).{" "}
          {margin > 0 ? `This one scores ${margin} more.` : "They score the same."}
        </p>
      )}
    </section>
  )
}
