import type { ReactNode } from "react";
import Logo from "./Logo";


interface AuthLayoutProps {
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
}

export default function AuthLayout({ title, subtitle, footer, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8">
        <Logo />
      </div>
      <main className="w-full max-w-sm rounded-[22px] border border-line bg-surface p-8">
        <h1 className="font-display text-[40px] uppercase leading-none">{title}</h1>
        <p className="mt-2 text-sm text-muted">{subtitle}</p>
        <div className="mt-7">{children}</div>
      </main>
      <p className="mt-6 text-sm text-muted">{footer}</p>
    </div>
  );
}