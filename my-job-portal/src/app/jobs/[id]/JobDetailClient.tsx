"use client";

import Link from "next/link";
import { useJobs } from "@/context/JobsContext";
import type { JobType } from "@/lib/jobs";
import { daysSincePosted, formatSalaryRange, isNewJob } from "@/lib/jobs";

function typeBadgeClasses(jobType: JobType): string {
  switch (jobType) {
    case "Remote":
      return "bg-emerald-100 text-emerald-800";
    case "Full-time":
      return "bg-blue-100 text-blue-800";
    case "Part-time":
      return "bg-amber-100 text-amber-900";
    case "Contract":
      return "bg-violet-100 text-violet-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function initials(company: string) {
  const parts = company.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return company.slice(0, 2).toUpperCase();
}

export default function JobDetailClient({ id }: { id: string }) {
  const { getJob, loading, error } = useJobs();
  const job = getJob(id);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center text-gray-500">
        Loading job...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-xl font-semibold text-gray-900">Unable to load job</h1>
        <p className="mt-2 text-gray-600">{error}</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Back to jobs
        </Link>
      </div>
    );
  }

  if (!job || !job.is_active) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-xl font-semibold text-gray-900">Job not found</h1>
        <p className="mt-2 text-gray-600">This listing may have been removed.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Back to jobs
        </Link>
      </div>
    );
  }

  const days = daysSincePosted(job.posted_at);
  const salary = formatSalaryRange(job);
  const showNew = isNewJob(job.posted_at);
  const paras = job.description.split(/\n\n/).filter(Boolean);

  return (
    <div className="min-h-screen animate-page-in bg-[#f9fafb] pb-28">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            {"<-"} Back to all jobs
          </Link>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex flex-wrap items-start gap-4">
          <div
            className="flex size-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white shadow-md"
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
            }}
          >
            {initials(job.company)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-gray-600">
              {job.company}
              <span className="text-gray-400"> . </span>
              {job.location}
            </p>
            <h1 className="mt-1 font-bold tracking-tight text-gray-900 sm:text-3xl">
              {job.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeBadgeClasses(job.job_type)}`}
              >
                {job.job_type}
              </span>
              <span className="text-sm font-semibold text-gray-800">{salary}</span>
              {showNew && (
                <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white">
                  New
                </span>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-gray-200/80 px-2 py-0.5 text-xs text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-400">
              Posted {days === 0 ? "today" : days === 1 ? "1 day ago" : `${days} days ago`}
            </p>
          </div>
        </div>

        <div className="mt-10 max-w-none space-y-4">
          {paras.map((p, i) => (
            <p key={i} className="leading-relaxed text-gray-700">
              {p}
            </p>
          ))}
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900">Responsibilities</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">
            {job.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Requirements</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">
            {job.requirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </article>

      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/95 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-end gap-3 px-4">
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full justify-center rounded-lg bg-indigo-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:w-auto"
          >
            Apply now
          </a>
        </div>
      </div>
    </div>
  );
}
