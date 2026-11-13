import {API_URL, authHeaders} from "./config";


export interface User  {
    id: number;
    email: string;
    is_Verified: boolean;
    created_at: string;
    updated_at: string;
}

export interface Me {
  id: number;
  email: string;
  favoriteTeamId: number; // 0 when no favourite is set
  favoriteTeamName: string;
}

export async function getMe(): Promise<Me>{
const res = await fetch(`${API_URL}/api/users/me`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}