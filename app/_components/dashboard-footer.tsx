import Link from "next/link";
import { FiBriefcase } from "react-icons/fi";

const footerColumns = [
  {
    title: "Jobs by Location",
    links: ["Jobs in Bangalore", "Jobs in Delhi / NCR", "Jobs in Hyderabad", "Jobs in Mumbai"],
  },
  {
    title: "Jobs by Function",
    links: ["Software Engineering Jobs", "Marketing Jobs", "Sales Jobs", "Internship Jobs"],
  },
  {
    title: "For Employers",
    links: ["Post Your Jobs", "Success Stories", "Product Academy", "Resources"],
  },
  {
    title: "Instahyre",
    links: ["Workspace", "About", "Privacy", "Terms"],
  },
  {
    title: "Connect",
    links: ["Help Center", "Contact Us"],
  },
];

export function DashboardFooter() {
  return (
    <footer className="mt-8 border-t border-slate-200 bg-white sm:mt-10">
      <div className="mx-auto w-full max-w-[1180px] px-3 py-7 sm:px-4 sm:py-9">
        <div className="grid gap-7 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
          <div>
            <Link className="flex w-fit items-center gap-3" href="/">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-950 text-sm font-semibold text-white">
                <FiBriefcase className="h-4 w-4" aria-hidden />
              </span>
              <span className="text-lg font-semibold text-slate-950">Instahyre</span>
            </Link>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Matched jobs and candidate workspace for modern hiring.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 text-xs text-slate-500 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h2 className="mb-3 font-bold text-slate-800">{column.title}</h2>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link}>
                      <Link className="transition hover:text-slate-900" href="#">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026 Instahyre style dashboard.</p>
          <div className="flex flex-wrap gap-4">
            <Link className="hover:text-slate-900" href="#">
              Privacy
            </Link>
            <Link className="hover:text-slate-900" href="#">
              Terms
            </Link>
            <Link className="hover:text-slate-900" href="#">
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
