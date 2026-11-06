import type {League, ScoredFixture, TeamDetail} from "../types/fixture";
import { API_URL, authHeaders } from "./config";

export async function getScoredFixtures(league: League): Promise<ScoredFixture[]>{
    const res = await fetch(`${API_URL}/api/fixtures/scored?league=${league}`, {
        headers: authHeaders(),
    });
    if(!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json();
}

export async function getTeamDetail(id: string| number): Promise<TeamDetail>{
    const res = await fetch (`${API_URL}/api/teams/${id}`, {
        headers: authHeaders(),
    });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}