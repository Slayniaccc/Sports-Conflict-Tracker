import type {League, ScoredFixture} from "../types/fixture";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080"

export async function getScoredFixtures(league: League): Promise<ScoredFixture[]>{
    const res = await fetch(`${API_URL}/api/fixtures/scored?league=${league}`);
    if(!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json();
}