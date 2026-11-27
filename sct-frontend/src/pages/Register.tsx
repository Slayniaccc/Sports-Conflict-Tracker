import {useState, type SubmitEvent} from 'react'
import {useNavigate, Link} from "react-router";
import {registerUser} from "../api/auth";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";

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
     return (
    <AuthLayout
      title="Create account"
      subtitle="Get every fixture ranked by how much it matters to you."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-accent hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Email" type="email" autoComplete="email" required
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field label="Password" type="password" autoComplete="new-password" required
          value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && (
          <p role="alert" className="rounded-xl border border-clash/40 bg-clash/10 px-3.5 py-2.5 text-sm text-clash">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 h-11 rounded-full bg-accent text-sm font-bold text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}