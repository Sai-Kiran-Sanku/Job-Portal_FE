import Link from "next/link";
import type { Job, JobType } from "@/lib/mockJobs";
import { daysSincePosted, formatSalaryRange, isNewJob } from "@/lib/mockJobs";

function initials(company: string) {
  const parts = company.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return company.slice(0, 2).toUpperCase();
}

function typeBadgeClasses(jobType: JobType): string {
  switch (jobType) {
    case "Remote":
      return "bg-emerald-100 text-emerald-800 ring-emerald-600/20";
    case "Full-time":
      return "bg-blue-100 text-blue-800 ring-blue-600/20";
    case "Part-time":
      return "bg-amber-100 text-amber-900 ring-amber-600/20";
    case "Contract":
      return "bg-violet-100 text-violet-800 ring-violet-600/20";
    default:
      return "bg-gray-100 text-gray-800 ring-gray-600/20";
  }
}

type JobCardProps = {
  job: Job;
};

export default function JobCard({ job }: JobCardProps) {
  const days = daysSincePosted(job.posted_at);
  const salary = formatSalaryRange(job);
  const showNew = isNewJob(job.posted_at);

  return (
    <Link href={`/jobs/${job.id}`} className="group block h-full">
      <article
        className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
      >
        <div className="flex gap-4">
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white shadow-inner"
            style={{
              background: `linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)`,
            }}
            aria-hidden
          >
            {initials(job.company)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h2 className="font-semibold text-gray-900 group-hover:text-indigo-600">
                {job.title}
              </h2>
              {showNew && (
                <span className="shrink-0 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white">
                  New
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm text-gray-600">
              {job.company}
              <span className="text-gray-400"> · </span>
              {job.location}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${typeBadgeClasses(job.job_type)}`}
          >
            {job.job_type}
          </span>
          <span className="text-sm font-medium text-gray-800">{salary}</span>
          {job.is_active && (
            <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Hiring
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="mt-4 text-xs text-gray-400">
          Posted {days === 0 ? "today" : days === 1 ? "1 day ago" : `${days} days ago`}
        </p>
      </article>
    </Link>
  );
}
