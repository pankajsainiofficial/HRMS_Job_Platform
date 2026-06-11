"use client";

import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  FiAlertCircle,
  FiBriefcase,
  FiCheckCircle,
  FiLock,
  FiLogOut,
  FiMail,
  FiMapPin,
  FiUser,
  FiX,
} from "react-icons/fi";
import { DashboardFooter } from "../_components/dashboard-footer";
import { DashboardHeader } from "../_components/dashboard-header";

type AuthMode = "login" | "register";

const profileStats = [
  { label: "Profile strength", value: "82%" },
  { label: "Applications", value: "15" },
  { label: "Interview ready", value: "High" },
];

const profileHighlights = [
  "Frontend and full-stack roles preferred",
  "Open to remote and Bangalore opportunities",
  "Resume available for recruiter review",
];

export default function ProfilePage() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

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

  const signIn = () => {
    localStorage.setItem("instahyre-auth", "signed-in");
    window.dispatchEvent(new Event("instahyre-auth-change"));
    setIsSignedIn(true);
  };

  const signOut = () => {
    localStorage.setItem("instahyre-auth", "signed-out");
    window.dispatchEvent(new Event("instahyre-auth-change"));
    setIsSignedIn(false);
    setAuthMode("login");
  };

  const isLogin = authMode === "login";

  return (
    <div className="min-h-screen bg-transparent text-[#333b48]">
      <DashboardHeader />

      <main className="mx-auto grid w-full max-w-[1180px] gap-6 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section className="space-y-6">
          <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm shadow-blue-100/60 sm:p-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-400 text-2xl font-black text-white shadow-sm shadow-blue-200">
                  PK
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
                    User profile
                  </p>
                  <h1 className="mt-1 text-2xl font-black text-slate-950">
                    {isSignedIn ? "Preet Kumar" : "Welcome back"}
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {isSignedIn
                      ? "Manage your candidate profile, resume and job preferences."
                      : "Log in or register to manage your candidate workspace."}
                  </p>
                </div>
              </div>

              {isSignedIn ? (
                <button
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 px-5 text-sm font-bold text-blue-700 transition hover:border-blue-200 hover:bg-blue-100"
                  onClick={() => setShowSignOutConfirm(true)}
                  type="button"
                >
                  <FiLogOut className="mr-2 h-4 w-4" aria-hidden />
                  Sign out
                </button>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {profileStats.map((stat) => (
              <article
                className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm shadow-blue-100/50"
                key={stat.label}
              >
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
                  {stat.label}
                </p>
                <h2 className="mt-3 text-2xl font-black text-slate-950">{stat.value}</h2>
              </article>
            ))}
          </div>

          <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm shadow-blue-100/60">
            <div className="grid gap-5 md:grid-cols-2">
              <ProfileInfo icon={FiMail} label="Email" value="preet@example.com" />
              <ProfileInfo icon={FiBriefcase} label="Experience" value="3+ years" />
              <ProfileInfo icon={FiMapPin} label="Location" value="Bangalore / Remote" />
              <ProfileInfo icon={FiUser} label="Role" value="Software Engineer" />
            </div>

            <div className="mt-6 border-t border-blue-100 pt-5">
              <h2 className="text-base font-black text-slate-950">Profile highlights</h2>
              <div className="mt-4 grid gap-3">
                {profileHighlights.map((item) => (
                  <p className="flex gap-3 text-sm leading-6 text-slate-600" key={item}>
                    <FiCheckCircle className="mt-1 h-4 w-4 shrink-0 text-blue-600" aria-hidden />
                    <span>{item}</span>
                  </p>
                ))}
              </div>
            </div>
          </section>
        </section>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm shadow-blue-100/60">
            <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-sky-50 p-5">
              <div className="grid grid-cols-2 rounded-xl bg-white p-1 shadow-inner shadow-blue-100/60">
                <button
                  className={`rounded-lg px-4 py-2.5 text-sm font-black transition ${
                    isLogin
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                      : "text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                  onClick={() => setAuthMode("login")}
                  type="button"
                >
                  Login
                </button>
                <button
                  className={`rounded-lg px-4 py-2.5 text-sm font-black transition ${
                    !isLogin
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                      : "text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                  onClick={() => setAuthMode("register")}
                  type="button"
                >
                  Register
                </button>
              </div>
            </div>

            <div className="p-5">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
                {isLogin ? "Login" : "Register"}
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">
                {isLogin ? "Login" : "Register"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {isLogin
                  ? "Access your saved jobs, profile and recruiter messages."
                  : "Create your candidate profile and start matching with companies."}
              </p>

              <button
                className="mt-5 flex h-11 w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
                onClick={signIn}
                type="button"
              >
                <FcGoogle className="mr-2 h-5 w-5" aria-hidden />
                {isLogin ? "Login with Google" : "Register with Google"}
              </button>

              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  or
                </span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  signIn();
                }}
              >
                {!isLogin ? (
                  <AuthField
                    icon={FiUser}
                    label="Full name"
                    placeholder="Enter your name"
                    type="text"
                  />
                ) : null}
                <AuthField
                  icon={FiMail}
                  label="Email address"
                  placeholder="Enter your email"
                  type="email"
                />
                <AuthField
                  icon={FiLock}
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                />

                <button
                  className="h-11 w-full rounded-lg bg-gradient-to-r from-[#2563eb] to-[#0ea5e9] px-5 text-sm font-black text-white shadow-sm shadow-blue-200 transition hover:from-[#1d4ed8] hover:to-[#0284c7]"
                  type="submit"
                >
                  {isLogin ? "Login" : "Register"}
                </button>
              </form>
            </div>
          </section>
        </aside>
      </main>

      <DashboardFooter />

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
                onClick={() => {
                  signOut();
                  setShowSignOutConfirm(false);
                }}
                type="button"
              >
                Yes, sign out
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function ProfileInfo({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-blue-50/60 px-4 py-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-blue-700 shadow-sm shadow-blue-100">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
          {label}
        </p>
        <p className="mt-1 text-sm font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function AuthField({
  icon: Icon,
  label,
  placeholder,
  type,
}: {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  placeholder: string;
  type: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-slate-600">{label}</span>
      <span className="mt-2 flex h-11 items-center rounded-lg border border-slate-200 bg-white px-3 focus-within:border-blue-300">
        <Icon className="mr-2 h-4 w-4 text-slate-400" aria-hidden />
        <input
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          placeholder={placeholder}
          type={type}
        />
      </span>
    </label>
  );
}
