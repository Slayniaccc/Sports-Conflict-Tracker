export type ScoreTier = "high" | "mid" | "low";

export function scoreTier(score: number): ScoreTier {
  if (score >= 40) return "high";
  if (score >= 25) return "mid";
  return "low";
}

export const TIER_BADGE: Record<ScoreTier, string> = {
  high: "bg-accent text-bg",
  mid: "border border-accent/55 text-accent",
  low: "bg-raised text-muted",
};