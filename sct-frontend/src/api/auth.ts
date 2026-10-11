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