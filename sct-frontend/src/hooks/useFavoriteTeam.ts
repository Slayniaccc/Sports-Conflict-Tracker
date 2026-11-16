import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getMe } from "../api/user";
import { getTeamDetail } from "../api/fixtures";
import type { ScoredFixture, TeamDetail } from "../types/fixture";

export type FavoriteTeam =
  | { status: "loggedOut" }
  | { status: "loading" }
  | { status: "none" }
  | { status: "error" }
  | { status: "ready"; team: TeamDetail; next: ScoredFixture | null };

function nextFixture(team: TeamDetail): ScoredFixture | null {
  const now = Date.now();
  const upcoming = team.fixtures
    .filter((f) => new Date(f.fixture.kickoff).getTime() >= now)
    .sort((a, b) => new Date(a.fixture.kickoff).getTime() - new Date(b.fixture.kickoff).getTime());
  return upcoming[0] ?? null;
}

export function useFavoriteTeam(): FavoriteTeam {
  const { isLoggedIn, user } = useAuth();
  const who = isLoggedIn ? (user?.email ?? "me") : null;
  const [result, setResult] = useState<{ who: string; value: FavoriteTeam } | null>(null);

  useEffect(() => {
    if (!who) return;
    let cancelled = false;

    getMe()
      .then(async (me): Promise<FavoriteTeam> => {
        if (me.favoriteTeamId === 0) return { status: "none" };
        const team = await getTeamDetail(me.favoriteTeamId);
        return { status: "ready", team, next: nextFixture(team) };
      })
      .catch((): FavoriteTeam => ({ status: "error" }))
      .then((value) => {
        if (!cancelled) setResult({ who, value });
      });

    return () => {
      cancelled = true;
    };
  }, [who]);

  if (!who) return { status: "loggedOut" };
  if (!result || result.who !== who) return { status: "loading" };
  return result.value;
}