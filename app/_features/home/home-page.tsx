"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiArrowRight,
  FiBriefcase,
  FiCheckCircle,
  FiExternalLink,
  FiFilter,
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
    <div className="min-h-screen bg-transparent text-[#2f3747]">
      <DashboardHeader />

      <main className="mx-auto grid w-full max-w-[1180px] gap-5 px-3 py-5 sm:px-4 sm:py-7 lg:grid-cols-[252px_minmax(0,1fr)]">
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
            <div className="border-b border-slate-100 bg-white px-4 py-4 sm:px-5">
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-50 text-slate-500 ring-1 ring-slate-200">
                  <FiFilter className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Filters
                  </p>
                  <h2 className="mt-0.5 text-base font-bold text-slate-950">Refine matches</h2>
                </div>
              </div>
            </div>
            <div className="space-y-3 p-3.5">
              <FilterBox
                title="Filter by status"
                items={["Undecided (15)", "Interested (14)"]}
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
          <FollowUsCard />
        </aside>

        <section className="space-y-3.5">
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
    <section className="rounded-lg border border-slate-100 bg-white p-3.5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-[13px] font-bold text-slate-900">{title}</h2>
        <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
      </div>
      <div className="space-y-1">
        {items.map((item, index) => (
          <label
            key={item}
            className={`flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-xs transition ${
              index === 0
                ? "bg-slate-50 font-semibold text-slate-950 ring-1 ring-slate-200"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <input
              defaultChecked={index === 0}
              name={title}
              type={radio ? "radio" : "checkbox"}
              className="h-3.5 w-3.5 shrink-0 accent-slate-900"
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </section>
  );
}

function FollowUsCard() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 text-center shadow-sm shadow-slate-200/70">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
        Stay connected
      </p>
      <h2 className="mt-1 text-base font-bold text-slate-950">Follow Us</h2>
      <p className="mt-3 text-xs leading-5 text-slate-500">
        Get hiring updates, career events and new opportunities first.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button className="inline-flex h-10 items-center justify-center rounded-md bg-[#0a66c2] px-3 text-xs font-bold text-white transition hover:bg-[#084e96]">
          <FiLinkedin className="mr-1.5 h-3.5 w-3.5" aria-hidden />
          LinkedIn
        </button>
        <button className="inline-flex h-10 items-center justify-center rounded-md bg-sky-500 px-3 text-xs font-bold text-white transition hover:bg-sky-600">
          <FiInstagram className="mr-1.5 h-3.5 w-3.5" aria-hidden />
          Instagram
        </button>
      </div>
    </section>
  );
}

function JobCard({ job, onView }: { job: Job; onView: () => void }) {
  return (
    <article className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/60 transition hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/80 md:grid-cols-[minmax(0,1fr)_132px] md:hover:-translate-y-0.5">
      <div className="min-w-0 px-4 py-4 sm:px-5 sm:py-4.5">
        <div className="flex min-w-0 gap-3 sm:gap-4">
          <CompanyLogo job={job} size="card" />
          <div className="min-w-0 flex-1">
            <div className="min-w-0">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-600">{job.company}</p>
                <h2 className="mt-1 overflow-hidden text-ellipsis text-base font-semibold leading-snug text-slate-950 sm:text-lg sm:leading-tight">
                  {job.title}
                </h2>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <FiMapPin className="h-3.5 w-3.5 text-slate-400" aria-hidden />
                {job.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FiBriefcase className="h-3.5 w-3.5 text-slate-400" aria-hidden />
                {job.experience}
              </span>
              <span>Founded: {job.founded}</span>
              <span>{job.size}</span>
            </div>

            <p className="mt-3 line-clamp-2 max-w-[650px] text-sm leading-6 text-slate-600">
              {job.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {job.tags.slice(0, 6).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-100"
                >
                  {tag}
                </span>
              ))}
              {job.tags.length > 6 ? (
                <span className="rounded-md bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-slate-100">
                  +{job.tags.length - 6}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-stretch border-t border-slate-100 bg-white px-4 py-3 sm:px-5 sm:py-4 md:justify-center md:border-l md:border-t-0">
        <button
          className="inline-flex h-10 w-full items-center justify-center rounded-md border border-slate-950 bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-slate-950 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 md:w-auto md:min-w-24"
          onClick={onView}
          type="button"
        >
          View
          <FiArrowRight className="ml-2 h-4 w-4" aria-hidden />
        </button>
      </div>
    </article>
  );
}

function CompanyLogo({ job, size }: { job: Job; size: "card" | "modal" }) {
  const dimensions =
    size === "modal"
      ? "h-12 w-12 text-xl sm:h-14 sm:w-14 sm:text-2xl"
      : "h-12 w-12 text-xl sm:h-16 sm:w-16 sm:text-2xl";

  return (
    <div
      className={`${dimensions} grid place-items-center rounded-xl border font-semibold shadow-sm ${logoStyles[job.logoTone]}`}
    >
      {job.logoText}
    </div>
  );
}

function JobModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const workMode = job.location === "Work From Home" ? "Remote" : "On-site";
  const primarySkills = job.tags.slice(0, 4).join(", ");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden overscroll-none bg-slate-950/45 px-2 py-3 sm:px-4 sm:py-6">
      <section className="flex max-h-[calc(100vh-24px)] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-950/15 sm:max-h-[calc(100vh-48px)]">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-white px-4 py-4 sm:gap-4 sm:px-5">
          <div className="min-w-0">
            <div className="flex min-w-0 gap-3">
              <CompanyLogo job={job} size="card" />
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-slate-600">{job.company}</p>
                <h2 className="mt-1 overflow-hidden text-ellipsis text-lg font-semibold leading-snug text-slate-950 sm:text-xl sm:leading-tight">
                  {job.title}
                </h2>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-medium text-slate-600">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1 ring-1 ring-slate-100">
                    <FiMapPin className="h-3.5 w-3.5" aria-hidden />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1 ring-1 ring-slate-100">
                    <FiBriefcase className="h-3.5 w-3.5" aria-hidden />
                    {job.experience}
                  </span>
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

        <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain bg-white px-4 py-4 sm:px-5 sm:py-5">
          <div className="grid gap-2 sm:grid-cols-4">
            <SummaryTile label="Job type" value="Full time" />
            <SummaryTile label="Work mode" value={workMode} />
            <SummaryTile label="Founded" value={job.founded} />
            <SummaryTile label="Employees" value={job.size} />
          </div>

          <section className="mt-5 border-t border-slate-100 pt-5">
            <h3 className="text-base font-semibold text-slate-900">About {job.company}</h3>
            <div className="mt-2 space-y-3 text-[13px] leading-6 text-slate-600">
              <p>{job.description}</p>
              <p>
                The team is looking for people who can understand the business context,
                build carefully and keep improving the product after release. You will work
                close to real user problems instead of being limited to narrow implementation
                tickets.
              </p>
            </div>
          </section>

          <section className="mt-5 border-t border-slate-100 pt-5">
            <h3 className="text-base font-semibold text-slate-900">Job description</h3>
            <div className="mt-2 space-y-3 text-[13px] leading-6 text-slate-600">
              <p>
                <b>Function:</b> Software Engineering - {job.title}
              </p>
              <p>
                This opening is best suited for someone who enjoys building complete product
                flows, understands both frontend polish and backend reliability, and can
                move comfortably between planning, coding, testing and iteration.
              </p>
            </div>
          </section>

          <section className="mt-5 border-t border-slate-100 pt-5">
            <h3 className="text-base font-semibold text-slate-900">What you will do</h3>
            <ul className="mt-2 space-y-2.5">
              {responsibilityItems.map((item) => (
                <li key={item} className="flex gap-2.5 text-[13px] leading-6 text-slate-600">
                  <FiCheckCircle className="mt-1 h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-5 border-t border-slate-100 pt-5">
            <h3 className="text-base font-semibold text-slate-900">What they are looking for</h3>
            <ul className="mt-2 space-y-2.5">
              {requirementItems.map((item) => (
                <li key={item} className="flex gap-2.5 text-[13px] leading-6 text-slate-600">
                  <FiCheckCircle className="mt-1 h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-5 border-t border-slate-100 pt-5">
            <h3 className="text-base font-semibold text-slate-900">Why this role stands out</h3>
            <div className="mt-2 space-y-3 text-[13px] leading-6 text-slate-600">
              <p>
                The role gives you room to contribute beyond task execution. You can shape
                implementation details, improve product quality and learn how the company
                converts customer needs into working software.
              </p>
            </div>
            <ul className="mt-2 space-y-2.5">
              {whyJoinItems.map((item) => (
                <li key={item} className="flex gap-2.5 text-[13px] leading-6 text-slate-600">
                  <FiCheckCircle className="mt-1 h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-5 border-t border-slate-100 pt-5">
            <h3 className="text-base font-semibold text-slate-900">Skills</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-xs font-medium text-slate-500">
            Applying shares your profile with {job.company}.
          </p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            <button className="w-full rounded-md bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 sm:w-auto" type="button">
              Apply now
              <FiExternalLink className="ml-2 inline h-4 w-4 align-[-2px]" aria-hidden />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-[13px] font-semibold text-slate-800">{value}</p>
    </div>
  );
}
