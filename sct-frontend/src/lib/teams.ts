const OVERRIDES: Record<string, {abbr?: string; short?: string}> = {
"Manchester City FC": { abbr: "MCI", short: "Man City" },
  "Manchester United FC": { abbr: "MUN", short: "Man Utd" },
  "Aston Villa FC": { abbr: "AVL", short: "Villa" },
  "Tottenham Hotspur FC": { short: "Spurs" },
  "Nottingham Forest FC": { short: "Forest" },
  "Brighton & Hove Albion FC": { abbr: "BHA", short: "Brighton" },
  "West Ham United FC": { abbr: "WHU", short: "West Ham" },
  "Newcastle United FC": { short: "Newcastle" },
};

function words(name: string): string[] {
  return name.replace(/\b(A?FC)\b/g, "").trim().split(/\s+/);
}

/** Three-letter code, e.g. "Los Angeles Lakers" -> "LAL", "Boston Celtics" -> "BOS". */
export function teamAbbr(name: string): string {
  const override = OVERRIDES[name]?.abbr;
  if (override) return override;
  const w = words(name);
  if (w.length >= 3) return w.map((x) => x[0]).join("").slice(0, 3).toUpperCase();
  if (w[0].length <= 2 && w[1]) return (w[0] + w[1][0]).toUpperCase(); // "LA Clippers" -> LAC
  return w[0].slice(0, 3).toUpperCase();
}

/** Display name for big headings, e.g. "Lakers", "Red Sox", "Arsenal". */
export function teamShort(name: string, league: string): string {
  const override = OVERRIDES[name]?.short;
  if (override) return override;
  const w = words(name);
  if (league === "EPL") return w.join(" ");
  if (w[w.length - 1] === "Sox") return w.slice(-2).join(" ");
  return w[w.length - 1];
}