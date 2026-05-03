"use client";

import { useEffect, useState } from "react";
import type { Job, JobType } from "@/lib/mockJobs";

const JOB_TYPES: JobType[] = ["Full-time", "Part-time", "Remote", "Contract"];

export type AdminModalProps = {
  open: boolean;
  onClose: () => void;
  editingJob: Job | null;
  onSave: () => void;
  onAdd: (job: Omit<Job, "id" | "posted_at" | "is_active">) => void;
  onUpdate: (id: string, patch: Partial<Job>) => void;
};

type FieldErrors = Partial<Record<string, string>>;

type FormState = {
  title: string;
  company: string;
  location: string;
  job_type: JobType;
  salary_min: string;
  salary_max: string;
  tagString: string;
  description: string;
  apply_url: string;
};

function emptyForm(): FormState {
  return {
    title: "",
    company: "",
    location: "",
    job_type: "Full-time",
    salary_min: "",
    salary_max: "",
    tagString: "",
    description: "",
    apply_url: "",
  };
}

function jobToForm(job: Job): FormState {
  return {
    title: job.title,
    company: job.company,
    location: job.location,
    job_type: job.job_type,
    salary_min: String(job.salary_min),
    salary_max: String(job.salary_max),
    tagString: job.tags.join(", "),
    description: job.description,
    apply_url: job.apply_url,
  };
}

export default function AdminModal({
  open,
  onClose,
  editingJob,
  onSave,
  onAdd,
  onUpdate,
}: AdminModalProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (!open) return;
    if (editingJob) {
      setForm(jobToForm(editingJob));
    } else {
      setForm(emptyForm());
    }
    setErrors({});
  }, [open, editingJob]);

  if (!open) return null;

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!form.title.trim()) next.title = "Required";
    if (!form.company.trim()) next.company = "Required";
    if (!form.location.trim()) next.location = "Required";
    if (!form.description.trim()) next.description = "Required";
    if (!form.apply_url.trim()) next.apply_url = "Required";

    const min = Number(form.salary_min);
    const max = Number(form.salary_max);
    if (form.salary_min === "" || Number.isNaN(min)) next.salary_min = "Required";
    if (form.salary_max === "" || Number.isNaN(max)) next.salary_max = "Required";
    if (!Number.isNaN(min) && !Number.isNaN(max) && max < min) {
      next.salary_max = "Must be ≥ minimum";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const min = Number(form.salary_min);
    const max = Number(form.salary_max);
    const tags = form.tagString
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Omit<Job, "id" | "posted_at" | "is_active"> = {
      title: form.title.trim(),
      company: form.company.trim(),
      location: form.location.trim(),
      job_type: form.job_type,
      salary_min: min,
      salary_max: max,
      tags,
      description: form.description.trim(),
      apply_url: form.apply_url.trim(),
      responsibilities: editingJob ? editingJob.responsibilities : [],
      requirements: editingJob ? editingJob.requirements : [],
    };

    if (editingJob) {
      onUpdate(editingJob.id, payload);
    } else {
      onAdd(payload);
    }
    onSave();
    onClose();
  }

  const inputCls =
    "mt-1 w-full rounded-lg border px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/25";
  const errBorder = (field: string) =>
    errors[field] ? "border-red-500 ring-1 ring-red-200" : "border-gray-300";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-gray-900/50"
        aria-label="Close modal"
        onClick={onClose}
      />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900">
          {editingJob ? "Edit job" : "Add job"}
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              className={`${inputCls} ${errBorder("title")}`}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
            {errors.title && <p className="mt-0.5 text-xs text-red-600">{errors.title}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Company</label>
            <input
              className={`${inputCls} ${errBorder("company")}`}
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            />
            {errors.company && <p className="mt-0.5 text-xs text-red-600">{errors.company}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Location</label>
            <input
              className={`${inputCls} ${errBorder("location")}`}
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            />
            {errors.location && <p className="mt-0.5 text-xs text-red-600">{errors.location}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Job type</label>
            <select
              className={`${inputCls} border-gray-300`}
              value={form.job_type}
              onChange={(e) =>
                setForm((f) => ({ ...f, job_type: e.target.value as JobType }))
              }
            >
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Salary min</label>
              <input
                type="number"
                className={`${inputCls} ${errBorder("salary_min")}`}
                value={form.salary_min}
                onChange={(e) => setForm((f) => ({ ...f, salary_min: e.target.value }))}
              />
              {errors.salary_min && (
                <p className="mt-0.5 text-xs text-red-600">{errors.salary_min}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Salary max</label>
              <input
                type="number"
                className={`${inputCls} ${errBorder("salary_max")}`}
                value={form.salary_max}
                onChange={(e) => setForm((f) => ({ ...f, salary_max: e.target.value }))}
              />
              {errors.salary_max && (
                <p className="mt-0.5 text-xs text-red-600">{errors.salary_max}</p>
              )}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Tags (comma-separated)</label>
            <input
              className={`${inputCls} border-gray-300`}
              value={form.tagString}
              onChange={(e) => setForm((f) => ({ ...f, tagString: e.target.value }))}
              placeholder="React, TypeScript, AWS"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={4}
              className={`${inputCls} ${errBorder("description")}`}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
            {errors.description && (
              <p className="mt-0.5 text-xs text-red-600">{errors.description}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Apply URL</label>
            <input
              className={`${inputCls} ${errBorder("apply_url")}`}
              value={form.apply_url}
              onChange={(e) => setForm((f) => ({ ...f, apply_url: e.target.value }))}
            />
            {errors.apply_url && (
              <p className="mt-0.5 text-xs text-red-600">{errors.apply_url}</p>
            )}
          </div>
          <div className="mt-2 flex justify-end gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
