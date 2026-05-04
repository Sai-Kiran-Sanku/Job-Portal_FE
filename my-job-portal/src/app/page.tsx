"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import JobCard from "@/components/JobCard";
import JobFilters, { type FilterType } from "@/components/JobFilters";
import { useJobs } from "@/context/JobsContext";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
      <svg
        className="mb-4 h-24 w-24 text-gray-300"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect x="20" y="28" width="80" height="64" rx="8" stroke="currentColor" strokeWidth="2" />
        <path d="M35 48h50M35 58h36M35 68h44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="78" cy="78" r="16" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2" />
        <path d="M74 78l3 3 6-6" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <h2 className="text-lg font-semibold text-gray-900">No jobs found</h2>
      <p className="mt-1 max-w-sm text-sm text-gray-500">
        Try a different search or filter and check back soon for new openings.
      </p>
    </div>
  );
}

export default function HomePage() {
  const { jobs, loading, error } = useJobs();
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState<FilterType>("All");

  const filtered = useMemo(() => {
    let list = jobs.filter((j) => j.is_active);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (j) => j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q),
      );
    }
    if (jobType !== "All") {
      list = list.filter((j) => j.job_type === jobType);
    }
    return list;
  }, [jobs, search, jobType]);

  return (
    <div className="min-h-screen animate-page-in bg-[#f9fafb]">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <JobFilters
          search={search}
          onSearchChange={setSearch}
          jobType={jobType}
          onJobTypeChange={setJobType}
        />

        <p className="mt-6 text-sm font-medium text-gray-600">
          Showing {filtered.length} job{filtered.length === 1 ? "" : "s"}
        </p>

        {loading ? (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center text-gray-500 shadow-sm">
            Loading jobs...
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-6 py-16 text-center text-red-700">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8">
            <EmptyState />
          </div>
        ) : (
          <ul className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {filtered.map((job) => (
              <li key={job.id}>
                <JobCard job={job} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
