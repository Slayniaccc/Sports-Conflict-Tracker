import {Activity, Table, Target} from "lucide-react";

const PLANNED = [
  { icon: Activity, title: "Momentum chart", detail: "Who is on top, minute by minute" },
  { icon: Table, title: "League table and form", detail: "Standings with last-five results" },
  { icon: Target, title: "Scorers", detail: "Goal scorers and points leaders" },
]

export default function ComingNextCard(){
    return(
       <section aria-labelledby="coming-next-heading" className="rounded-[18px] border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <h2 id="coming-next-heading" className="text-xs font-bold tracking-[0.14em] text-muted">
          COMING NEXT
        </h2>
        <span className="inline-flex h-[22px] items-center rounded-md bg-raised px-2 text-[11px] font-semibold text-ink-2">
          Roadmap
        </span>
      </div>  

       <ul className="mt-3.5 flex flex-col gap-3">
        {PLANNED.map(({ icon: Icon, title, detail }) => (
          <li key={title} className="flex items-start gap-3">
            <Icon aria-hidden="true" className="mt-0.5 size-[18px] shrink-0 text-accent" />
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-[13px] text-muted">{detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
    )
}