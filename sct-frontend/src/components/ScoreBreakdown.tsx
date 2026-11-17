import { motion } from "motion/react";
import type { Factor } from "../types/fixture";

interface ScoreBreakdownProps {
    score: number;
    factors: Factor[];
}

export default function ScoreBreakdown({ score, factors }: ScoreBreakdownProps) {
    return (
        <section aria-labelledby="why-heading" className="rounded-[18px] border border-line bg-surface p-6">
            <h2 id="why-heading" className="text-xs font-bold tracking-[0.14em] text-muted">
                WHY IT SCORES {score}
            </h2>


            {factors.length === 0 ? (
                <p className="mt-4 text-sm text-muted">No standout factors for this game.</p>
            ) : (
                <ul className="mt-5 flex flex-col gap-5">
                    {factors.map((f, i) => {
                        const pct = score > 0 ? (f.points / score) * 100 : 0;
                        return (
                            <li key={f.kind + f.label}>
                                <div className="flex justify-between gap-4 text-[15px] font-medium">
                                    <span>{f.reason}</span>
                                    <span className="shrink-0 font-mono text-sm font-semibold text-accent">+{f.points}</span>
                                </div>
                                <div aria-hidden="true" className="mt-2 h-2 overflow-hidden rounded-full bg-raised">
                                    <motion.div
                                        className="h-full rounded-full bg-accent"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${pct}%` }}
                                        transition={{ duration: 0.8, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
                                    />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )
            }
        </section>
    )
}
