"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiArrowRight,
  FiBriefcase,
  FiCheckCircle,
  FiChevronDown,
  FiExternalLink,
  FiInfo,
  FiInstagram,
  FiLinkedin,
  FiMapPin,
  FiX,
} from "react-icons/fi";
import { DashboardFooter } from "../../_components/dashboard-footer";
import { DashboardHeader } from "../../_components/dashboard-header";
import { Job, jobs } from "./data";

const logoStyles: Record<Job["logoTone"], string> = {
  green: "bg-emerald-50 text-emerald-700 border-emerald-100",
  red: "bg-red-50 text-red-600 border-red-100",
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  teal: "bg-teal-50 text-teal-700 border-teal-100",
  purple: "bg-purple-50 text-purple-700 border-purple-100",
  dark: "bg-slate-900 text-white border-slate-800",
};

export function HomePage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const featuredJob = useMemo(() => selectedJob ?? jobs[0], [selectedJob]);

  useEffect(() => {
    if (!selectedJob) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [selectedJob]);

  return (
    <div className="min-h-screen bg-transparent text-[#333b48]">
      <DashboardHeader />

      <main className="mx-auto grid w-full max-w-[1180px] gap-7 px-4 py-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm shadow-blue-100/70">
            <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-sky-50 px-5 py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-blue-600">
                Job controls
              </p>
              <h2 className="mt-1 text-lg font-black text-slate-950">Refine matches</h2>
            </div>
            <div className="space-y-5 p-4">
              <SearchJobsCard />
              <QuickTip />
              <FilterBox
                title="Filter by status"
                items={["Undecided (15)", "Interested (14)", "Not Interested (1)"]}
                radio
              />
              <FilterBox
                title="Filter by location"
                items={["All (15)", "Work From Home (5)", "Noida (3)", "Bangalore (3)", "Pune (1)"]}
              />
              <FilterBox
                title="Filter by company size"
                items={["All (15)", "Small (10)", "Large (2)", "Medium (3)"]}
              />
              <FilterBox
                title="Filter by industry"
                items={[
                  "All (15)",
                  "Renewables / Environment (1)",
                  "Education / Training (1)",
                  "Computer Software / IT / Internet (10)",
                  "Hospitality / Travel (1)",
                ]}
              />
            </div>
          </div>
          <PromoCards />
        </aside>

        <section className="space-y-5">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onView={() => setSelectedJob(job)} />
          ))}
        </section>
      </main>

      <DashboardFooter />

      {selectedJob ? (
        <JobModal job={featuredJob} onClose={() => setSelectedJob(null)} />
      ) : null}
    </div>
  );
}

function QuickTip() {
  return (
    <section className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-sm font-black text-blue-700">
          <FiInfo className="h-4 w-4" aria-hidden />
        </span>
        <h2 className="text-base font-bold text-slate-900">Quick tip</h2>
      </div>
      <p className="mt-4 text-xs leading-6 text-slate-600">
        Since not all companies will go ahead, we encourage you to apply to several
        companies.
      </p>
      <p className="mt-4 text-xs leading-6 text-slate-600">
        However, avoid applying if you don&apos;t want to interview, as any interview
        backouts will be shown to other companies!
      </p>
    </section>
  );
}

function SearchJobsCard() {
  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-blue-600">
        Explore jobs
      </p>
      <button
        className="mt-3 flex w-full items-center justify-between rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:border-blue-200 hover:bg-blue-50"
        type="button"
      >
        <span>Search other jobs</span>
        <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-xs text-blue-700 shadow-sm">
          <FiChevronDown className="h-3.5 w-3.5" aria-hidden />
        </span>
      </button>
    </section>
  );
}

function FilterBox({
  title,
  items,
  radio = false,
}: {
  title: string;
  items: string[];
  radio?: boolean;
}) {
  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>
        <span className="h-2 w-2 rounded-full bg-blue-500" />
      </div>
      <div className="space-y-1.5">
        {items.map((item, index) => (
          <label
            key={item}
            className={`flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-xs transition ${
              index === 0
                ? "bg-blue-50 font-semibold text-blue-800"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <input
              defaultChecked={index === 0}
              name={title}
              type={radio ? "radio" : "checkbox"}
              className="h-3.5 w-3.5 shrink-0 accent-blue-600"
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </section>
  );
}

function PromoCards() {
  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm shadow-blue-100/60">
        <div className="bg-gradient-to-br from-[#1e3a8a] via-[#2563eb] to-[#38bdf8] px-5 py-5 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-blue-100">
            Online event
          </p>
          <h2 className="mt-3 text-xl font-black leading-tight">UX Design Hacks</h2>
          <span className="mt-4 inline-flex rounded-full bg-white/18 px-3 py-1 text-[10px] font-bold uppercase">
            Webinar recording
          </span>
        </div>
        <p className="px-5 py-4 text-xs leading-5 text-slate-600">
          Learn practical UX methods by watching this webinar recording.
        </p>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm shadow-blue-100/60">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-blue-600">
          From our blog
        </p>
        <div className="mt-4 h-24 rounded-xl bg-[linear-gradient(135deg,#dbeafe,#93c5fd,#2563eb)]" />
        <h2 className="mt-4 text-sm font-bold leading-6 text-slate-900">
          Salary Negotiation 101: The Secret to Getting the Salary You Ask
        </h2>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-white p-5 text-center shadow-sm shadow-blue-100/60">
        <h2 className="text-base font-black text-slate-900">Follow Us</h2>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          Be the first to know about roles at top companies and exclusive events.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-700">
            <FiLinkedin className="mr-1 inline h-3.5 w-3.5 align-[-2px]" aria-hidden />
            LinkedIn
          </button>
          <button className="rounded-lg bg-sky-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-sky-600">
            <FiInstagram className="mr-1 inline h-3.5 w-3.5 align-[-2px]" aria-hidden />
            Instagram
          </button>
        </div>
      </section>
    </div>
  );
}

function JobCard({ job, onView }: { job: Job; onView: () => void }) {
  return (
    <article className="grid overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm shadow-blue-100/50 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100 md:grid-cols-[104px_minmax(0,1fr)_156px]">
      <div className="flex items-start justify-center bg-blue-50/70 p-6">
        <CompanyLogo job={job} size="card" />
      </div>

      <div className="min-w-0 px-5 py-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold leading-tight text-slate-950">
              {job.title}
            </h2>
            <p className="mt-1 text-sm font-semibold text-blue-700">{job.company}</p>
          </div>
          <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-blue-700">
            Match
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <FiMapPin className="h-3.5 w-3.5 text-blue-500" aria-hidden />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FiBriefcase className="h-3.5 w-3.5 text-blue-500" aria-hidden />
            {job.experience}
          </span>
          <span>Founded: {job.founded}</span>
          <span>{job.size}</span>
        </div>

        <p className="mt-3 line-clamp-2 max-w-[640px] text-sm leading-6 text-slate-600">
          {job.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.tags.slice(0, 6).map((tag, index) => (
            <span
              key={tag}
              className={`rounded-sm px-2 py-1 text-[11px] ${
                index < 4 ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-700"
              }`}
            >
              {tag}
            </span>
          ))}
          {job.tags.length > 6 ? (
            <span className="rounded-sm bg-slate-100 px-2 py-1 text-[11px] text-slate-700">
              +{job.tags.length - 6}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-row items-center justify-between gap-3 border-t border-blue-100 bg-blue-50/50 px-5 py-4 md:flex-col md:justify-center md:border-l md:border-t-0">
        <button
          className="inline-flex h-11 min-w-28 items-center justify-center rounded-lg bg-gradient-to-r from-[#2563eb] to-[#0ea5e9] px-6 text-sm font-bold text-white shadow-sm shadow-blue-200 transition hover:from-[#1d4ed8] hover:to-[#0284c7] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={onView}
          type="button"
        >
          View
          <FiArrowRight className="ml-2 h-4 w-4" aria-hidden />
        </button>
        <button className="rounded-md px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-white hover:text-slate-800" type="button">
          Not interested
        </button>
      </div>
    </article>
  );
}

function CompanyLogo({ job, size }: { job: Job; size: "card" | "modal" }) {
  const dimensions = size === "modal" ? "h-36 w-36 text-8xl" : "h-16 w-16 text-2xl";

  return (
    <div
      className={`${dimensions} grid place-items-center rounded-xl border font-black shadow-sm ${logoStyles[job.logoTone]}`}
    >
      {job.logoText}
    </div>
  );
}

function JobModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const workMode = job.location === "Work From Home" ? "Remote" : "On-site";
  const primarySkills = job.tags.slice(0, 4).join(", ");
  const roleHighlights = [
    `${workMode} role based in ${job.location}`,
    `${job.experience} experience range`,
    `${job.size} company size`,
  ];
  const responsibilityItems = [
    `Own full-stack product work for ${job.company}, from user-facing screens to dependable service integrations.`,
    "Translate product requirements into clean interfaces, reusable components and maintainable API flows.",
    "Collaborate with product, design and business teams to improve hiring, workflow and reporting experiences.",
    "Review code, debug production issues and keep delivery quality high without slowing the team down.",
  ];
  const requirementItems = [
    `Hands-on experience with ${primarySkills || "modern web technologies"} in production or strong project work.`,
    "Comfort with component-driven frontend development, REST APIs, state management and browser debugging.",
    "Ability to reason through edge cases, communicate tradeoffs clearly and write code that teammates can extend.",
    "Interest in building practical software for real users rather than only shipping isolated features.",
  ];
  const whyJoinItems = [
    "Work on a visible product area where engineering decisions directly affect customer and team outcomes.",
    "Join a hiring team that values ownership, clear communication and steady iteration over noisy process.",
    "Get exposure across product planning, implementation, release feedback and ongoing improvement.",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden overscroll-none bg-slate-950/65 px-4 py-6">
      <section className="flex max-h-[calc(100vh-48px)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-950/25">
        <div className="flex items-start justify-between gap-5 border-b border-slate-200 bg-white px-6 py-5">
          <div className="min-w-0">
            <div className="flex min-w-0 gap-4">
              <CompanyLogo job={job} size="card" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-blue-700">{job.company}</p>
                <h2 className="mt-1 truncate text-2xl font-black leading-tight text-slate-950">
                  {job.title}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                    <FiMapPin className="h-3.5 w-3.5" aria-hidden />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1">
                    <FiBriefcase className="h-3.5 w-3.5" aria-hidden />
                    {job.experience}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">{job.size}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            aria-label="Close job modal"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            onClick={onClose}
            type="button"
          >
            <FiX className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 overflow-hidden bg-slate-50 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="thin-scrollbar hidden space-y-4 overflow-y-auto overscroll-contain border-r border-slate-200 bg-gradient-to-b from-blue-50/70 to-white p-5 lg:block lg:h-full">
            <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-black text-slate-900">Company overview</h3>
              <div className="mt-4 grid gap-3">
                <InfoRow label="Founded" value={job.founded} />
                <InfoRow label="Employees" value={job.size} />
                <InfoRow label="Location" value={job.location} />
              </div>
            </div>

            <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-black text-slate-900">Match score</h3>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">High</span>
              </div>
              <div className="mt-4 h-2 rounded-full bg-slate-100">
                <div className="h-2 w-[86%] rounded-full bg-blue-600" />
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-600">
                Strong fit based on your listed skills, preferred role type and expected
                experience range.
              </p>
            </div>

            <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-black text-slate-900">Role snapshot</h3>
              <div className="mt-4 space-y-3">
                {roleHighlights.map((item) => (
                  <p key={item} className="flex gap-2 text-xs leading-5 text-slate-600">
                    <FiCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" aria-hidden />
                    <span>{item}</span>
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-black text-slate-900">Hiring contact</h3>
              <div className="mt-4 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-blue-600 text-sm font-black text-white">
                  {job.recruiter
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{job.recruiter}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{job.recruiterRole}</p>
                </div>
              </div>
            </div>
          </aside>

          <div className="thin-scrollbar min-h-0 overflow-y-auto overscroll-contain bg-white p-6">
            <div className="max-w-3xl pb-4">
              <div className="mb-7 grid gap-3 sm:grid-cols-3">
                <SummaryTile label="Job type" value="Full time" />
                <SummaryTile label="Work mode" value={workMode} />
                <SummaryTile label="Experience" value={job.experience} />
              </div>

              <h3 className="text-lg font-black text-slate-900">About {job.company}</h3>
              <div className="mt-3 space-y-4 text-sm leading-7 text-slate-600">
                <p>
                  {job.description}
                </p>
                <p>
                  The team is looking for people who can understand the business context,
                  build carefully and keep improving the product after release. You will work
                  close to real user problems instead of being limited to narrow implementation
                  tickets.
                </p>
              </div>

              <h3 className="mt-8 text-lg font-black text-slate-900">Job description</h3>
              <div className="mt-3 space-y-4 text-sm leading-7 text-slate-600">
                <p>
                  <b>Function:</b> Software Engineering - {job.title}
                </p>
                <p>
                  This opening is best suited for someone who enjoys building complete product
                  flows, understands both frontend polish and backend reliability, and can
                  move comfortably between planning, coding, testing and iteration.
                </p>
              </div>

              <h3 className="mt-8 text-lg font-black text-slate-900">What you will do</h3>
              <ul className="mt-3 space-y-3">
                {responsibilityItems.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-7 text-slate-600">
                    <FiCheckCircle className="mt-1 h-4 w-4 shrink-0 text-blue-600" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 text-lg font-black text-slate-900">What they are looking for</h3>
              <ul className="mt-3 space-y-3">
                {requirementItems.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-7 text-slate-600">
                    <FiCheckCircle className="mt-1 h-4 w-4 shrink-0 text-blue-600" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 text-lg font-black text-slate-900">Why this role stands out</h3>
              <div className="mt-3 space-y-4 text-sm leading-7 text-slate-600">
                <p>
                  The role gives you room to contribute beyond task execution. You can shape
                  implementation details, improve product quality and learn how the company
                  converts customer needs into working software.
                </p>
              </div>
              <ul className="mt-3 space-y-3">
                {whyJoinItems.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-7 text-slate-600">
                    <FiCheckCircle className="mt-1 h-4 w-4 shrink-0 text-blue-600" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 text-lg font-black text-slate-900">Skills</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium text-slate-500">
            Applying shares your profile with {job.company}.
          </p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            <button className="rounded-lg px-5 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800" type="button">
              Not interested
            </button>
            <button className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-700" type="button">
              Apply now
              <FiExternalLink className="ml-2 inline h-4 w-4 align-[-2px]" aria-hidden />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2.5">
      <span className="text-xs font-bold uppercase tracking-[0.06em] text-slate-400">
        {label}
      </span>
      <span className="text-right text-xs font-bold text-slate-700">{value}</span>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
      <p className="text-[10px] font-black uppercase tracking-[0.08em] text-blue-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}
