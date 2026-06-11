"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiAlertCircle, FiBriefcase, FiLogOut, FiUpload, FiUser, FiX } from "react-icons/fi";

const navItems = [
  { label: "Jobs", href: "/", badge: "15", icon: FiBriefcase },
  { label: "Profile", href: "/profile", icon: FiUser },
];

export function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(true);

  useEffect(() => {
    const syncAuthState = () => {
      setIsSignedIn(localStorage.getItem("instahyre-auth") !== "signed-out");
    };

    syncAuthState();
    window.addEventListener("storage", syncAuthState);
    window.addEventListener("instahyre-auth-change", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("instahyre-auth-change", syncAuthState);
    };
  }, []);

  const handleConfirmSignOut = () => {
    localStorage.setItem("instahyre-auth", "signed-out");
    window.dispatchEvent(new Event("instahyre-auth-change"));
    setIsSignedIn(false);
    setShowSignOutConfirm(false);
    router.push("/profile");
  };

  return (
    <>
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
            <button
              className="flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2.5 text-slate-600 transition hover:bg-white hover:text-blue-700 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-55"
              disabled={!isSignedIn}
              onClick={() => setShowSignOutConfirm(true)}
              type="button"
            >
              <FiLogOut className="h-3.5 w-3.5" aria-hidden />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>
      </header>

      {showSignOutConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6">
          <section className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl shadow-slate-950/20">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
                  <FiAlertCircle className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h2 className="text-lg font-black text-slate-950">Sign out?</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    You will be signed out of this candidate workspace.
                  </p>
                </div>
              </div>
              <button
                aria-label="Close sign out confirmation"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                onClick={() => setShowSignOutConfirm(false)}
                type="button"
              >
                <FiX className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                className="rounded-lg px-5 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                onClick={() => setShowSignOutConfirm(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-700"
                onClick={handleConfirmSignOut}
                type="button"
              >
                Yes, sign out
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
