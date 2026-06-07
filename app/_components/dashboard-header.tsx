"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBriefcase, FiLogOut, FiUpload, FiUser } from "react-icons/fi";

const navItems = [
  { label: "Jobs", href: "/", badge: "15", icon: FiBriefcase },
  { label: "Profile", href: "/profile", icon: FiUser },
  { label: "Sign Out", href: "/sign-out", icon: FiLogOut },
];

export function DashboardHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/95 shadow-[0_10px_30px_rgba(37,99,235,0.10)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-3 px-4 py-3 xl:flex-row xl:items-center xl:justify-between">
        <Link className="flex w-fit items-center gap-3" href="/">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#2563eb] via-[#0ea5e9] to-[#60a5fa] text-base font-black text-white shadow-sm shadow-blue-200">
            IH
          </span>
          <span className="flex flex-col">
            <span className="text-lg font-black leading-none text-slate-950">Instahyre</span>
            <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Candidate Workspace
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="flex max-w-full items-center gap-2 overflow-x-auto rounded-xl border border-blue-100 bg-blue-50/70 p-1 text-[11px] font-bold uppercase tracking-[0.07em] shadow-inner"
        >
          <label className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-[#2563eb] to-[#0ea5e9] px-4 py-2.5 text-white shadow-sm shadow-blue-200 transition hover:from-[#1d4ed8] hover:to-[#0284c7]">
            <FiUpload className="h-3.5 w-3.5" aria-hidden />
            <span>Upload resume</span>
            <input className="sr-only" type="file" accept=".pdf,.doc,.docx" />
          </label>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2.5 transition ${
                  isActive
                    ? "bg-white text-blue-700 shadow-sm ring-1 ring-blue-100"
                    : "text-slate-600 hover:bg-white hover:text-blue-700 hover:shadow-sm"
                }`}
                href={item.href}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                <span>{item.label}</span>
                {item.badge ? (
                  <span className="rounded-full bg-[#ef4456] px-2 py-0.5 text-[10px] leading-none text-white">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
