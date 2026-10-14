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
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm p-8">
        <div className="flex flex-col gap-1 mb-2">
            <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
            <p className="text-sm text-zinc-500">Get started with Matchday.</p>
        </div>
    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-zinc-100 
    placeholder-zinc-600 focus:border-zinc-600 outline-none transition-colors
    " placeholder="Email"/>
     <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 outline-none transition-colors
     " placeholder="Password"/>
     <button type="submit" disabled={loading} className="w-full px-4 py-2 bg-amber-400 text-zinc-950 font-medium
     rounded-md hover:bg-amber-300 disabled:opacity-50 transition-colors">{loading ? "Registering…" : "Register"}


     </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
<p className="text-sm text-zinc-500 text-center">
  Already have an account?{" "}
  <Link to="/login" className="text-zinc-100 underline hover:text-amber-400 transition-colors">
    Sign in
  </Link>
</p>
        </form>
        </div>
        
    )


}