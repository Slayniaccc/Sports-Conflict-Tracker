import type {ScoredFixture} from "../types/fixture";


export interface DayOption{
    key: string;
    dow: string;
    date: number;
    isToday: boolean;
    count: number;

}


export function dayKey(d: Date): string{
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function buildWeek(items: ScoredFixture[], now = new Date()): DayOption[] {
    const counts = new Map<string, number>();
    for(const item of items){
        const key = dayKey(new Date(item.fixture.kickoff));
        counts.set(key, (counts.get(key) ?? 0) + 1) ;
    }



    const todayKey = dayKey(now);
    return Array.from({length: 7}, (_, i) => {
          const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const key = dayKey(d);
    return {
      key,
      dow: d.toLocaleDateString([], { weekday: "short" }).toUpperCase(),
      date: d.getDate(),
      isToday: key === todayKey,
      count: counts.get(key) ?? 0,
    }
})
}
/** 1 -> "1ST", 2 -> "2ND", 3 -> "3RD", 11 -> "11TH", 22 -> "22ND" */
function ordinal(n: number): string {
  const lastTwo = n % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return `${n}TH`;
  switch (n % 10) {
    case 1: return `${n}ST`;
    case 2: return `${n}ND`;
    case 3: return `${n}RD`;
    default: return `${n}TH`;
  }
}

/** e.g. "SUNDAY 15TH NOV", or "TODAY 11TH NOV" / "TOMORROW 12TH NOV". */
export function dayHeading(key: string, now = new Date()): string {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const daysAway = Math.round((date.getTime() - today.getTime()) / 86_400_000);

  const month = date.toLocaleDateString([], { month: "short" }).toUpperCase();
  const name =
    daysAway === 0 ? "TODAY"
    : daysAway === 1 ? "TOMORROW"
    : date.toLocaleDateString([], { weekday: "long" }).toUpperCase();

  return `${name}, ${ordinal(d)} ${month}`;
}
