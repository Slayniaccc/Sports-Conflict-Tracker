import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function SignInCard() {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) return null;

  return (
    <section aria-labelledby="sign-in-card-heading" className="rounded-[18px] bg-accent p-[22px] text-bg">
      <h2 id="sign-in-card-heading" className="font-display text-[34px] uppercase leading-[0.98]">
        Make it
        <br />
        your matchday
      </h2>
      <p className="mb-[18px] mt-3 text-sm font-medium leading-snug">
        Sign in and games involving your favourite team get +15 and rise to the top.
      </p>
      <Link
        to="/login"
        className="inline-flex h-11 items-center rounded-full bg-bg px-5 text-sm font-bold text-ink transition-transform hover:translate-x-0.5"
      >
        Sign in
      </Link>
    </section>
  );
}