import {useState, type SubmitEvent} from 'react'
import {useNavigate, Link} from "react-router";
import {loginUser} from "../api/auth";


export default function Login(){
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
    const response = await loginUser(email, password);
    localStorage.setItem("token", response.token)
    navigate("/");
   } catch (err){
     setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
   }
    }
  return (
     <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm p-8">
      <h1 className="text-2xl font-semibold mb-2">Sign in</h1>
<input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Email"
        className="border border-zinc-700 rounded px-3 py-2"
      />
        <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="Password"
        className="border border-zinc-700 rounded px-3 py-2"
      />
       <button
        type="submit"
        disabled={loading}
        className="bg-zinc-100 text-zinc-900 rounded px-4 py-2 disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}

      <p className="text-sm text-zinc-800 mt-2">
        Need an account?{" "}
        <Link to="/register" className="text-zinc-100 underline">
          Register
        </Link>
      </p>
    </form>
  )
}

