import {Link} from "react-router";
import {ChevronRight} from "lucide-react";
import type {ScoredFixture} from "../types/fixture";
import {teamAbbr} from "../lib/teams"
import { scoreTier, TIER_BADGE } from "../lib/score";


interface FixtureRowProps {
    item: ScoredFixture;
    clashesWith: ScoredFixture[];
}

const TAG = "inline-flex h-[22px] items-center rounded-md px-2 text-[10px] font-bold tracking-[0.1em]";

function kickoffTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], {hour: "2-digit",  minute: "2-digit", hour12: false});
}

function TeamLine({name, strong = false} :{name: string; strong?: boolean}){
    return (
    <span className="flex min-w-0 items-center gap-2.5">
      <span
        aria-hidden="true"
        className="grid size-[26px] shrink-0 place-items-center rounded-full border border-line bg-raised text-[9px] font-bold text-ink-2"
      >
        {teamAbbr(name)}
      </span>
      <span className={`truncate text-[15px] ${strong ? "font-semibold text-ink" : "font-medium text-ink-2"}`}>
        {name}
      </span>
    </span>
  );
}

export default function FixtureRow({item, clashesWith} : FixtureRowProps){
    const {fixture, score,factors} = item;
    const yours = factors.some((f) => f.kind === "FAVORITE_TEAM");
    const why = factors.length > 0 ? factors.map((f) => f.label).join(" . ") : "No standout factors";
    const clashText = clashesWith
    .map((c) => `${c.fixture.homeTeam.name} vs ${c.fixture.awayTeam.name}`)
    .join(", ");

    return (
    <Link
      to={`/fixtures/${fixture.id}`}
      className={`group grid grid-cols-[56px_minmax(0,1fr)_auto_56px_16px] items-center gap-4 border-l-2 px-5 py-3.5 transition-colors hover:bg-raised ${
        yours ? "border-accent" : "border-transparent"
      }`}
    >
         <span className="font-mono text-[13px] font-semibold text-ink-2">{kickoffTime(fixture.kickoff)}</span>

      <span className="flex min-w-0 flex-col gap-1.5">
        <TeamLine name={fixture.homeTeam.name} strong />
        <TeamLine name={fixture.awayTeam.name} />
        <span className="truncate pl-9 text-[13px] text-muted">{why}</span>
      </span>

      <span className="flex flex-col items-end gap-1.5">
        {yours && <span className={`${TAG} border border-accent text-accent`}>YOUR TEAM</span>}
        {clashesWith.length > 0 && (
          <span className={`${TAG} bg-clash/15 text-clash`} title={`Overlaps ${clashText}`}>
            CLASH
          </span>
        )}
      </span>

      <span
        className={`grid h-10 min-w-[52px] place-items-center rounded-xl px-2.5 font-display text-2xl tabular-nums ${
          TIER_BADGE[scoreTier(score)]
        }`}
      >
        {score}
      </span>

      <ChevronRight
        aria-hidden="true"
        className="size-4 -translate-x-1 text-muted opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
      />
    </Link>
    )
}