import type {DayOption} from "../lib/days";

interface DayStripProps {
    days: DayOption[];
    selected: string | null;
    onSelect: (key: string | null) => void;
}

export default function DayStrip({days, selected, onSelect}: DayStripProps){
    return(
        <div role="group" aria-label="Filter by day" className="flex gap-1 overflow-x-auto">
            {days.map((d) => {
                const active = d.key === selected;
                const empty = d.count === 0;
                const label = d.isToday ? "Today" : d.dow;
                return (
                    <button
                    key={d.key}
                    type="button"
                     disabled={empty}
            aria-pressed={active}
            aria-label={`${label} ${d.date}, ${d.count} ${d.count === 1 ? "game" : "games"}`}
            onClick={()=> onSelect(active ? null: d.key)}
            className={`flex min-w-[76px] flex-col items-center gap-0.5 rounded-xl
                px-3 pb-3 pt-2.5 transition-colors ${
                    active
                    ? "bg-accent text-bg"
                    : empty
                     ? "cursor-default text-muted/50"
                     :"text-ink hover: bg-raised"
                }`}
                >
                    <span
                    className={`text-[11px] font-semibold tracking-[0.12em] ${
                        d.isToday && !active ? "text-accent" : ""
                    }`}
                    >
                        {d.isToday ? "TODAY": d.dow}
                    </span>
                    <span className="font-display text-[26px] leading-tight">{d.date}</span>
                    <span
                    aria-hidden="true"
                    className={`size-1 rounded-full ${empty ? "bg-transparent" : active ? "bg-bg" : "bg-accent"}`}
                    />
                </button>
                );
            })}
        </div>
    )
}