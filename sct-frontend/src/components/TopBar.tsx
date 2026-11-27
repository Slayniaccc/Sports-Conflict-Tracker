import type {ReactNode} from "react";
import {Link} from "react-router";
import { useEffect, useRef } from "react";
import {useAuth} from "../contexts/useAuth";
import type {League} from "../types/fixture";
import LeagueTabs from "./LeagueTabs";
import Logo from "./Logo";


interface TopBarProps {
   selectedLeague: League | null;
  onSelectLeague: (league: League) => void;
  children?: ReactNode;
}

export default function TopBar({selectedLeague, onSelectLeague, children}: TopBarProps){
    const {isLoggedIn, user,logout} = useAuth();
    const headerRef = useRef<HTMLElement>(null);

useEffect(() => {
  const el = headerRef.current;
  if (!el) return;
  const root = document.documentElement;
  const observer = new ResizeObserver(() => {
    root.style.setProperty("--header-h", `${el.offsetHeight}px`);
  });
  observer.observe(el);
  return () => observer.disconnect();
}, []);
    const initials = (user?.email ?? "").slice(0, 2).toUpperCase();
    return (
        <header ref={headerRef} className="sticky top-0 z-10 border-b border-line-soft bg-bg/85
        backdrop-blur-md">
            <div className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-5 px-8 py-3.5">
               <Logo />
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
                         className="h-11 rounded-full border border-line px-4 text-sm font-semibold
                         text-ink-2 transition-colors hover:border-muted hover:text-ink"
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

