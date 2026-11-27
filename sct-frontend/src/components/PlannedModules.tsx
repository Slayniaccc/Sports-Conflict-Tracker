import type { ReactNode } from "react";

function Planned({ title, needs, children }: { title: string; needs: string; children: ReactNode }) {
  return (
    <section
      aria-label={`${title} (planned)`}
      className=" h-full min-w-0 rounded-[18px] border border-dashed border-line bg-surface p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{title}</h3>
        <span className="text-[13px] text-muted">Needs: {needs}</span>
      </div>
      <div aria-hidden="true" className="mt-5">
        {children}
      </div>
    </section>
  );
}

const bar = "rounded-md bg-raised";

export default function PlannedModules() {
  return (
    <section aria-labelledby="planned-heading" className="mt-12">
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <h2 id="planned-heading" className="font-display text-4xl uppercase leading-none">
          Planned for this page
        </h2>
        <span className="inline-flex h-6 items-center rounded-md bg-raised px-2.5 text-xs font-semibold text-ink-2">
          Layout preview · no data yet
        </span>
      </div>

      <div className="flex flex-col gap-6">
        <Planned title="Momentum" needs="play-by-play data">
          <div className="relative h-24">
            <span className="absolute inset-x-0 top-1/2 h-px bg-line" />
          </div>
        </Planned>

        <div className="flex flex-wrap gap-6">
          <div className="min-w-0 flex-[3_1_460px]">
            <Planned title="League table and form" needs="standings sync">
              <ul className="flex flex-col gap-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <span className={`h-3 w-5 ${bar}`} />
                    <span className={`h-3 flex-1 ${bar}`} />
                    <span className={`h-3 w-10 ${bar}`} />
                    <span className="flex gap-1.5">
                      {Array.from({ length: 5 }, (_, j) => (
                        <span key={j} className={`size-5 ${bar}`} />
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </Planned>
          </div>

          <div className="min-w-0 flex-[2_1_320px]">
            <Planned title="Scorers" needs="box scores">
              <ul className="flex flex-col gap-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="size-9 shrink-0 rounded-full bg-raised" />
                    <span className={`h-3 flex-1 ${bar}`} />
                    <span className={`h-6 w-9 ${bar}`} />
                  </li>
                ))}
              </ul>
            </Planned>
          </div>
        </div>
      </div>
    </section>
  );
}