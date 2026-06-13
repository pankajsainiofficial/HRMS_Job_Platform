"use client";

import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  FiAlertCircle,
  FiBriefcase,
  FiFileText,
  FiLock,
  FiLogOut,
  FiMail,
  FiMapPin,
  FiPaperclip,
  FiUploadCloud,
  FiUser,
  FiX,
} from "react-icons/fi";
import { DashboardFooter } from "../_components/dashboard-footer";
import { DashboardHeader } from "../_components/dashboard-header";

type AuthMode = "login" | "register";

const basicDetails = [
  { icon: FiUser, label: "Full name", value: "Preet Kumar" },
  { icon: FiMail, label: "Email", value: "preet@example.com" },
  { icon: FiBriefcase, label: "Experience", value: "3+ years" },
  { icon: FiMapPin, label: "Location", value: "Bangalore / Remote" },
];

export default function ProfilePage() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [resumeName, setResumeName] = useState("Preet_Kumar_Resume.pdf");
  const [coverLetterName, setCoverLetterName] = useState("Cover_Letter.pdf");

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
    <div className="min-h-screen bg-transparent text-[#2f3747]">
      <DashboardHeader />

      <main className="mx-auto grid w-full max-w-[1180px] gap-5 px-3 py-5 sm:px-4 sm:py-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section className="space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Candidate profile
                </p>
                <h1 className="mt-1 text-2xl font-semibold text-slate-950">
                  {isSignedIn ? "Preet Kumar" : "Welcome back"}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  {isSignedIn
                    ? "Upload your documents and review the basic details recruiters will see."
                    : "Log in or register to manage your candidate workspace."}
                </p>
              </div>

              {isSignedIn ? (
                <button
                  className="inline-flex h-10 w-full shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
                  onClick={() => setShowSignOutConfirm(true)}
                  type="button"
                >
                  <FiLogOut className="mr-2 h-4 w-4 text-slate-400" aria-hidden />
                  Sign out
                </button>
              ) : null}
            </div>
          </div>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <UploadButton
                label="Upload resume"
                onChange={(fileName) => setResumeName(fileName)}
              />
              <UploadButton
                label="Upload cover letter"
                onChange={(fileName) => setCoverLetterName(fileName)}
              />
            </div>

            <div className="mt-5 border-t border-slate-100 pt-5">
              <h2 className="text-base font-semibold text-slate-950">Uploaded documents</h2>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <UploadedDocument title="Resume" fileName={resumeName} />
                <UploadedDocument title="Cover letter" fileName={coverLetterName} />
              </div>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-5">
              <h2 className="text-base font-semibold text-slate-950">Basic details</h2>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {basicDetails.map((detail) => (
                  <BasicDetail
                    icon={detail.icon}
                    key={detail.label}
                    label={detail.label}
                    value={detail.value}
                  />
                ))}
              </div>
            </div>
          </section>
        </section>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
            <div className="border-b border-slate-100 bg-white p-4 sm:p-5">
              <div className="grid grid-cols-2 rounded-lg border border-slate-200 bg-slate-50 p-1">
                <button
                  className={`rounded-md px-4 py-2.5 text-sm font-semibold transition ${
                    isLogin
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-500 hover:bg-white hover:text-slate-800"
                  }`}
                  onClick={() => setAuthMode("login")}
                  type="button"
                >
                  Login
                </button>
                <button
                  className={`rounded-md px-4 py-2.5 text-sm font-semibold transition ${
                    !isLogin
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-500 hover:bg-white hover:text-slate-800"
                  }`}
                  onClick={() => setAuthMode("register")}
                  type="button"
                >
                  Register
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                {isLogin ? "Login" : "Register"}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                {isLogin ? "Login" : "Register"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {isLogin
                  ? "Access your saved jobs, profile and recruiter messages."
                  : "Create your candidate profile and start matching with companies."}
              </p>

              <button
                className="mt-5 flex h-11 w-full items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
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
                  className="h-11 w-full rounded-md bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
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
                className="rounded-md px-5 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                onClick={() => setShowSignOutConfirm(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
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

function UploadButton({
  label,
  onChange,
}: {
  label: string;
  onChange: (fileName: string) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300 hover:bg-slate-50">
      <span className="flex min-w-0 items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-50 text-slate-500 ring-1 ring-slate-100">
          <FiUploadCloud className="h-4 w-4" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-slate-900">{label}</span>
          <span className="mt-0.5 block text-xs text-slate-500">PDF, DOC or DOCX</span>
        </span>
      </span>
      <FiPaperclip className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
      <input
        accept=".pdf,.doc,.docx"
        className="sr-only"
        onChange={(event) => {
          const fileName = event.target.files?.[0]?.name;

          if (fileName) {
            onChange(fileName);
          }
        }}
        type="file"
      />
    </label>
  );
}

function UploadedDocument({ title, fileName }: { title: string; fileName: string }) {
  return (
    <article className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/70 px-4 py-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-white text-slate-500 ring-1 ring-slate-100">
        <FiFileText className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
          {title}
        </p>
        <p className="mt-0.5 truncate text-sm font-medium text-slate-800">{fileName}</p>
      </div>
    </article>
  );
}

function BasicDetail({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-white px-4 py-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-slate-50 text-slate-500 ring-1 ring-slate-100">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
          {label}
        </p>
        <p className="mt-1 truncate text-sm font-medium text-slate-800">{value}</p>
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
      <span className="text-xs font-semibold text-slate-600">{label}</span>
      <span className="mt-2 flex h-11 items-center rounded-md border border-slate-200 bg-white px-3 focus-within:border-slate-400">
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
