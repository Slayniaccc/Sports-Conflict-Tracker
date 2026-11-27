import type {ReactNode} from "react";
import {Clock} from "lucide-react";
import type { ScoredFixture } from "../types/fixture";
import { teamShort } from "../lib/teams";

export type ClashState =   | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; rivals: ScoredFixture[] };

function matchName(f: ScoredFixture) {
  const { homeTeam: h, awayTeam: a } = f.fixture;
  return `${teamShort(h.name, h.league)} vs ${teamShort(a.name, a.league)}`;
}

function time(f: ScoredFixture) {
  return new Date(f.fixture.kickoff).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}


function Shell({children, alert = false}: {children: ReactNode; alert?: boolean}){
    return(
           <section
      aria-labelledby="clash-heading"
      className={`rounded-[18px] border bg-surface p-6 ${alert ? "border-clash/40" : "border-line"}`}
    >
      <h2 id="clash-heading" className="flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-clash">
        <Clock aria-hidden="true" className="size-3.5" />
        CLASHES
      </h2>
      {children}
    </section>
    )
}

export default function ClashCard({ fixture, state }: { fixture: ScoredFixture; state: ClashState }) {
  if (state.status === "loading") {
    return <Shell><p className="mt-4 text-sm text-muted">Checking for overlapping games…</p></Shell>;
  }
 if (state.status === "error") {
    return <Shell><p className="mt-4 text-sm text-muted">Couldn't check for clashes right now.</p></Shell>;
  }

  const rivals = [...state.rivals].sort((a, b) => b.score - a.score).slice(0, 3);
  if (rivals.length === 0) {
    return (
      <Shell>
        <p className="mt-4 text-sm text-ink-2">
          Nothing else in the {fixture.fixture.homeTeam.league} overlaps this game.
        </p>
      </Shell>
    );
  }

    const best = rivals[0];
  const diff = fixture.score - best.score;
  const verdict =
    diff > 0
      ? `Watch this one. It scores ${diff} more than ${matchName(best)}.`
      : diff < 0
        ? `${matchName(best)} scores ${-diff} more. Worth considering instead.`
        : `It's a tie with ${matchName(best)}.`;


  const rows = [fixture, ...rivals];
  const max = Math.max(...rows.map((r) => r.score), 1);


  return (
    <Shell alert>
      <ul className="mt-4 flex flex-col gap-3.5">
        {rows.map((r, i) => {
          const isThis = i === 0;
          return (
            <li key={r.fixture.id}>
              <div className={`flex justify-between gap-3 text-[15px] ${isThis ? "font-semibold" : "text-ink-2"}`}>
                <span className="truncate">
                  {matchName(r)} · {time(r)}
                </span>
                <span className="font-mono">{r.score}</span>
              </div>
              <div aria-hidden="true" className="mt-2 h-2.5 overflow-hidden rounded-full bg-raised">
                <div
                  className={`h-full rounded-full ${isThis ? "bg-accent" : "bg-muted/50"}`}
                  style={{ width: `${(r.score / max) * 100}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-[15px] font-medium leading-snug">{verdict}</p>
    </Shell>
  );
}