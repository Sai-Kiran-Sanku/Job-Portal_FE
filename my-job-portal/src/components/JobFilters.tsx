"use client";

import type { JobType } from "@/lib/mockJobs";

export type FilterType = "All" | JobType;

type JobFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  jobType: FilterType;
  onJobTypeChange: (value: FilterType) => void;
};

const TYPES: FilterType[] = [
  "All",
  "Full-time",
  "Part-time",
  "Remote",
  "Contract",
];

export default function JobFilters({
  search,
  onSearchChange,
  jobType,
  onJobTypeChange,
}: JobFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="job-search" className="sr-only">
          Search jobs
        </label>
        <input
          id="job-search"
          type="search"
          placeholder="Search by title or company…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {TYPES.map((t) => {
          const active = jobType === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => onJobTypeChange(t)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}
