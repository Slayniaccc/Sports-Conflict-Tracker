import type { ReactNode } from "react";
import { Link } from "react-router";
import type { FactorKind, ScoredFixture } from "../types/fixture";
import { matchupText } from "../lib/teams";
import { scoreTier, TIER_BADGE } from "../lib/score";

const BIG_KINDS = new Set<FactorKind>(["RIVALRY", "PLAYOFF"]);
const BIG_SHOWN = 3;

function bigFactorLabel(item: ScoredFixture): string | undefined {
  return item.factors.find((f) => BIG_KINDS.has(f.kind))?.label;
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[18px] border border-line bg-surface p-5">
      <h2 className="text-xs font-bold tracking-[0.14em] text-muted">{title}</h2>
      {children}
    </section>
  );
}

function ScorePill({ score }: { score: number }) {
  return (
    <span
      className={`inline-flex h-7 min-w-9 shrink-0 items-center justify-center rounded-md px-2 font-mono text-sm font-bold ${TIER_BADGE[scoreTier(score)]}`}
    >
      {score}
    </span>
  );
}

interface TeamRailProps {
  teamId: number;
  upcoming: ScoredFixture[];
}

export default function TeamRail({ teamId, upcoming }: TeamRailProps) {
  const next = upcoming[0];
  const bigGames = upcoming.filter((item) => bigFactorLabel(item)).slice(0, BIG_SHOWN);

  return (
    <aside
      aria-label="Next game and big games"
      className="flex w-full shrink-0 flex-col gap-[18px] lg:w-[320px]"
    >
      <Panel title="NEXT GAME">
        {next ? (
          <Link
            to={`/fixtures/${next.fixture.id}`}
            className="group mt-3 flex items-center justify-between gap-3"
          >
            <span className="min-w-0 truncate text-[15px] font-bold transition-colors group-hover:text-accent">
              {matchupText(teamId, next)}
            </span>
            <ScorePill score={next.score} />
          </Link>
        ) : (
          <p className="mt-3 text-sm text-muted">None scheduled</p>
        )}
      </Panel>

      <Panel title="BIG GAMES">
        {bigGames.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No rivalry or playoff games coming up.</p>
        ) : (
          <ul className="mt-2">
            {bigGames.map((item) => (
              <li key={item.fixture.id} className="border-t border-line-soft first:border-t-0">
                <Link
                  to={`/fixtures/${item.fixture.id}`}
                  className="group flex items-center justify-between gap-3 py-2.5"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold transition-colors group-hover:text-accent">
                      {matchupText(teamId, item)}
                    </span>
                    <span className="block truncate text-[13px] text-muted">{bigFactorLabel(item)}</span>
                  </span>
                  <ScorePill score={item.score} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </aside>
  );
}