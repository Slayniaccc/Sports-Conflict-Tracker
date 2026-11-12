import type {League, ScoredFixture} from "../types/fixture";
import {LEAGUE_SWATCH} from "../lib/leagues";
import FixtureRow from "./FixtureRow";


interface DayGroupProps {
  label: string | null;
  items: ScoredFixture[];
  clashes: Map<number, ScoredFixture[]>;
}

export default function DayGroup({label, items, clashes} : DayGroupProps){
const ranked =[...items].sort((a, b)=> b.score - a.score);
const league = items[0]?.fixture.homeTeam.league as League;

return (
    <section className="mb-5 overflow-hidden rounded-[18px] border border-line-soft 
    bg-surface">
        {label && (
            <header className="flex items-center gap-3 border-b border-line-soft
            px-5 py-3.5">
                <span aria-hidden="true" className={`size-3 rounded-[3px] ${LEAGUE_SWATCH[league]}`} />
                <h2 className="text-[13px] font-bold uppercase tracking-[0.12em]">{label}</h2>
                <span className="text-[13px] text-muted">
                    {ranked.length} {ranked.length === 1 ? "game" : "games"}
                </span>
            </header>
        )}
        <ul>
            {ranked.map((item) => (
                <li key={item.fixture.id} className="border-t border-line-soft first:border-t-0">
                    <FixtureRow item={item} clashesWith={clashes.get(item.fixture.id) ?? []} />
                </li>
            ))}
        </ul>
    </section>
)
}