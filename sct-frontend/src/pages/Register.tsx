import {useState, type SubmitEvent} from 'react'
import {useNavigate, Link} from "react-router";
import {registerUser} from "../api/auth";

export default function Register(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate();

async function handleSubmit(e: SubmitEvent){
    e.preventDefault();
   setLoading(true);
   setError(null);
   try{
    await registerUser(email, password);
    navigate("/login")
   } catch(err){
    setError(err instanceof Error ? err.message : "Something went wrong");
setLoading(false)
   }
}
    return(
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm p-8">
    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="border border-zinc-700 rounded px-3 py-2" placeholder="Email"/>
     <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="border border-zinc-700 rounded px-3 py-2" placeholder="Password"/>
     <button type="submit" disabled={loading} className="bg-zinc-100 text-zinc-900 rounded px-4 py-2">{loading ? "Registering…" : "Register"}


     </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
<p className="text-sm text-zinc-500 mt-2">
  Already have an account?{" "}
  <Link to="/login" className="text-zinc-100 underline">
    Sign in
  </Link>
</p>
        </form>
        
    )


}