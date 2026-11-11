import type {ReactNode} from "react";
import {Link} from "react-router";
import {useAuth} from "../contexts/AuthContext";
import type {League} from "../types/fixture";
import LeagueTabs from "./LeagueTabs";


interface TopBarProps {
   selectedLeague: League;
  onSelectLeague: (league: League) => void;
  children?: ReactNode;
}

export default function TopBar({selectedLeague, onSelectLeague, children}: TopBarProps){
    const {isLoggedIn, user,logout} = useAuth();
    const initials = (user?.email ?? "").slice(0, 2).toUpperCase();
    return (
        <header className="sticky top-0 z-10 border-b border-line-soft bg-bg/85
        backdrop-blur-md">
            <div className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-5 px-8 py-3.5">
                <Link to="/" className="flex items-center gap-2.5 text-ink no-underline">
                <span className="grid size-[34px] place-items-center rounded-[9px] bg-accent">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2.4" strokeLinecap="round" className="text-bg" aria-hidden="true">
                        <path d="m5 19v11" /><path d="m12 19V5" /><path d="M19 19v-6" />
                    </svg>
                </span>
                <span className="font-display text-[26px] tracking=[0.02em]">MATCHDAY</span>
                </Link>
                <LeagueTabs selected={selectedLeague} onSelect={onSelectLeague} />
                <div className="ml-auto flex items-center gap-3">
                    {isLoggedIn ? (
                        <>
                         <span
                         aria-hidden="true"
                         className="grid size-11 place-items-center rounded-full border border-line bg-raised text-[13px] font-bold">{initials}
                         </span>
                         <span className="hidden max-w-[180px] truncate text-sm text-muted md:inline" title={user?.email}>
                            {user?.email}
                         </span>
                         <button
                         type="button"
                         onClick={logout}
                         className="h=11 rounded-full border border-line px-4 text-sm font-semibold
                         text-ink-2 transition-colors hover:border-muted hover: text-ink"
                         >
                            Sign out
                         </button>

                        </>
                        ) : (
                            <Link
                            to="/login"
                            className="inline-flex h-11 items-center rounded-full bg-accent px-5
                            text-sm font-bold text-bg transition-transform hover:translate-x-0.5"
                            >
                                Sign in
                            </Link>
                        )}
                </div>
            </div>
             {children && <div className="mx-auto max-w-[1360px] px-8">{children}</div>}
        </header>
    )
}

