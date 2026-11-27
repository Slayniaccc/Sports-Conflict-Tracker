import type { ReactNode } from "react";


export function Bar({ className }: { className: string }) {
  return <span className={`block animate-pulse bg-raised motion-reduce:animate-none ${className}`} />;
}

/** Wraps skeleton pieces: screen readers hear the label, not the grey blocks. */
export function Loading({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div aria-busy="true">
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className="flex flex-col gap-8">
        {children}
      </div>
    </div>
  );
}

export function FixtureListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-line-soft bg-surface">
      <div className="flex items-center gap-3 border-b border-line-soft px-5 py-3.5">
        <Bar className="size-3 rounded-[3px]" />
        <Bar className="h-3.5 w-40 rounded" />
      </div>
      <div className="divide-y divide-line-soft">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="grid grid-cols-[56px_minmax(0,1fr)_56px] items-center gap-4 px-5 py-4">
            <Bar className="h-3.5 w-11 rounded" />
            <span className="flex flex-col gap-2">
              <Bar className="h-4 w-2/3 rounded" />
              <Bar className="h-4 w-1/2 rounded" />
            </span>
            <Bar className="h-7 w-11 justify-self-end rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Looks like the team page header: crest circle, league, big name, counts. */
export function HeaderSkeleton() {
  return (
    <div className="flex items-center gap-6 rounded-[22px] border border-line px-8 py-7">
      <Bar className="size-[88px] shrink-0 rounded-full" />
      <span className="flex flex-1 flex-col gap-3">
        <Bar className="h-3 w-16 rounded" />
        <Bar className="h-12 w-3/4 max-w-[520px] rounded" />
        <Bar className="h-3.5 w-40 rounded" />
      </span>
    </div>
  );
}