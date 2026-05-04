"use client";

import type { ReactNode } from "react";
import type { ParsedJob } from "@/lib/aiParser";
import ListEditor from "./ListEditor";
import TagEditor from "./TagEditor";

type PreviewCardProps = {
  data: ParsedJob;
  onChange: (data: ParsedJob) => void;
};

const jobTypes: ParsedJob["job_type"][] = [
  "Full-time",
  "Part-time",
  "Remote",
  "Contract",
];

function Section({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3 border-t border-gray-100 pt-5 first:border-t-0 first:pt-0">
      <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
      {children}
    </section>
  );
}

function TextInput({
  value,
  onChange,
  type = "text",
}: {
  value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "number";
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
    />
  );
}

export default function PreviewCard({ data, onChange }: PreviewCardProps) {
  function patch<K extends keyof ParsedJob>(key: K, value: ParsedJob[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Structured Preview</h2>
        <p className="mt-1 text-sm text-gray-500">
          Review and adjust the parsed job details before publishing.
        </p>
      </div>

      <div className="space-y-5">
        <Section label="Title">
          <TextInput value={data.title} onChange={(value) => patch("title", value)} />
        </Section>

        <Section label="Company">
          <TextInput value={data.company} onChange={(value) => patch("company", value)} />
        </Section>

        <Section label="Location">
          <TextInput value={data.location} onChange={(value) => patch("location", value)} />
        </Section>

        <Section label="Job Type">
          <select
            value={data.job_type}
            onChange={(e) => patch("job_type", e.target.value as ParsedJob["job_type"])}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          >
            {jobTypes.map((jobType) => (
              <option key={jobType} value={jobType}>
                {jobType}
              </option>
            ))}
          </select>
        </Section>

        <Section label="Salary Range">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
                Salary Min
              </label>
              <div className="flex items-center gap-2">
                <TextInput
                  type="number"
                  value={data.salary_min ?? 0}
                  onChange={(value) => patch("salary_min", Number(value) || 0)}
                />
                <span className="text-sm font-medium text-gray-500">LPA</span>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
                Salary Max
              </label>
              <div className="flex items-center gap-2">
                <TextInput
                  type="number"
                  value={data.salary_max ?? 0}
                  onChange={(value) => patch("salary_max", Number(value) || 0)}
                />
                <span className="text-sm font-medium text-gray-500">LPA</span>
              </div>
            </div>
          </div>
        </Section>

        <Section label="Description">
          <textarea
            rows={3}
            value={data.description}
            onChange={(e) => patch("description", e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </Section>

        <Section label="Apply URL">
          <TextInput
            value={data.apply_url ?? ""}
            onChange={(value) => patch("apply_url", value)}
          />
        </Section>

        <Section label="Tags">
          <TagEditor tags={data.tags} onChange={(value) => patch("tags", value)} />
        </Section>

        <Section label="Responsibilities">
          <ListEditor
            items={data.responsibilities}
            onChange={(value) => patch("responsibilities", value)}
            placeholder="Add responsibility"
          />
        </Section>

        <Section label="Requirements">
          <ListEditor
            items={data.requirements}
            onChange={(value) => patch("requirements", value)}
            placeholder="Add requirement"
          />
        </Section>
      </div>
    </div>
  );
}
