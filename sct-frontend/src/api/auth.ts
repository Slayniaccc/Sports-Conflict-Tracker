import type {User} from "../api/user";
import{API_URL} from "./config"


export async function registerUser(email: string, password: string): Promise<User>{
const res = await fetch(`${API_URL}/api/users/register` , {
    method:"POST",
    headers: {"Content-Type": "application/json"},
body: JSON.stringify({email,password}),
});
if(!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json();
}

export interface LoginResponse{
    user: User;
    token: string
}

export async function loginUser(email: string, password: string): Promise<LoginResponse>{
    const res = await fetch(`${API_URL}/api/users/login` , {
    method:"POST",
    headers: {"Content-Type": "application/json"},
body: JSON.stringify({email,password}),
});
if(!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json();
}

