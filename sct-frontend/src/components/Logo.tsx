import { Link } from "react-router";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 text-ink no-underline">
      <span className="grid size-[34px] place-items-center rounded-[9px] bg-accent">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.4" strokeLinecap="round" className="text-bg" aria-hidden="true">
          <path d="M5 19V11" /><path d="M12 19V5" /><path d="M19 19v-6" />
        </svg>
      </span>
      <span className="font-display text-[26px] tracking-[0.02em]">MATCHDAY</span>
    </Link>
  );
}