import {useState, type SubmitEvent} from 'react'
import {useNavigate, Link} from "react-router";
import {loginUser} from "../api/auth";
import {useAuth} from "../contexts/useAuth"
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";


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

    const message = error === "HTTP 401" ? "Wrong email or password." : error;
  return (
 <AuthLayout
      title="Sign in"
      subtitle="Welcome back. Your games are ranked and waiting."
      footer={
        <>
          New here?{" "}
          <Link to="/register" className="font-semibold text-accent hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Email" type="email" autoComplete="email" required
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field label="Password" type="password" autoComplete="current-password" required
          value={password} onChange={(e) => setPassword(e.target.value)} />

        {message && (
          <p role="alert" className="rounded-xl border border-clash/40 bg-clash/10 px-3.5 py-2.5 text-sm text-clash">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 h-11 rounded-full bg-accent text-sm font-bold text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  )
}


