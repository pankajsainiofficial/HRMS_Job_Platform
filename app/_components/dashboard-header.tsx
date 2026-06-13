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
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm shadow-slate-200/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-3 px-3 py-3 sm:px-4 xl:flex-row xl:items-center xl:justify-between">
          <Link className="flex w-fit items-center gap-3" href="/">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-950 text-sm font-semibold text-white sm:h-10 sm:w-10 sm:text-base">
              IH
            </span>
            <span className="flex flex-col">
              <span className="text-base font-semibold leading-none text-slate-950 sm:text-lg">
                Instahyre
              </span>
              <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:block">
                Candidate Workspace
              </span>
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="thin-scrollbar flex w-full max-w-full items-center gap-1.5 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-1 text-[11px] font-semibold uppercase tracking-[0.06em] xl:w-auto"
          >
            <label className="flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-md bg-slate-950 px-3 text-white transition hover:bg-slate-800 sm:h-10 sm:px-4">
              <FiUpload className="h-3.5 w-3.5" aria-hidden />
              <span className="whitespace-nowrap">Upload resume</span>
              <input className="sr-only" type="file" accept=".pdf,.doc,.docx" />
            </label>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  className={`flex h-9 shrink-0 items-center gap-2 rounded-md px-3 transition sm:h-10 sm:px-3.5 ${
                    isActive
                      ? "bg-white text-slate-950 shadow-sm ring-1 ring-slate-200"
                      : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm"
                  }`}
                  href={item.href}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.badge ? (
                    <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] leading-none text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
            <button
              className="flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-slate-600 transition hover:bg-white hover:text-slate-900 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-55 sm:h-10 sm:px-3.5"
              disabled={!isSignedIn}
              onClick={() => setShowSignOutConfirm(true)}
              type="button"
            >
              <FiLogOut className="h-3.5 w-3.5" aria-hidden />
              <span className="whitespace-nowrap">Sign Out</span>
            </button>
          </nav>
        </div>
      </header>

      {showSignOutConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-3 py-5 sm:px-4">
          <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-950/15 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-50 text-slate-500 ring-1 ring-slate-100">
                  <FiAlertCircle className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">Sign out?</h2>
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
                className="rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
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
