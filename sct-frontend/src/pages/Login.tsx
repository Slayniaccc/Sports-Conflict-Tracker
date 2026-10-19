import {useState, type SubmitEvent} from 'react'
import {useNavigate, Link} from "react-router";
import {loginUser} from "../api/auth";
import {useAuth} from "../contexts/AuthContext"


export default function Login(){
        const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate();
    const{login} = useAuth();

    async function handleSubmit(e: SubmitEvent){
            e.preventDefault();
   setLoading(true);
   setError(null);

   try{
    const response = await loginUser(email, password);
  login(response.user, response.token)
    navigate("/");
   } catch (err){
     setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
   }
    }
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4">
     <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4 bg-zinc-900 border border-zinc-800 rounded-lg p-8"
>
  <div className="flex flex-col gap-1 mb-2">
  <h1 className="text-2xl font-semibold mb-2">Sign in</h1>
  <p className="text-sm text-zinc-500">Welcome back to Matchday.</p>
  </div>
    
<input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Email"
        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-zinc-100 
        placeholder-zinc-600 focus:border-zinc-600 outline-none transition-colors"
      />
        <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="Password"
        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-zinc-100 
        placeholder-zinc-600 focus:border-zinc-600 outline-none transition-colors"
      />
       <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-amber-400 text-zinc-950 font-medium rounded-md hover:bg-amber-300
        disabled:opacity-50 transition-colors"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}

      <p className="text-sm text-zinc-500 text-center">
        Need an account?{" "}
        <Link to="/register" className="text-zinc-100 underline 
        hover:text-amber-400 transition-colors">
          Register
        </Link>
      </p>
    </form>
    </div>
  )
}


