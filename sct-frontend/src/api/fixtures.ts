import type {League, ScoredFixture} from "../types/fixture";
import { API_URL } from "./config";

export async function getScoredFixtures(league: League): Promise<ScoredFixture[]>{
    const res = await fetch(`${API_URL}/api/fixtures/scored?league=${league}`);
    if(!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json();
}