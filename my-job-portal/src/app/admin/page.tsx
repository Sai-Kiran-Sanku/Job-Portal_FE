"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import AdminModal from "@/components/AdminModal";
import { useJobs } from "@/context/JobsContext";
import type { Job } from "@/lib/mockJobs";
import { daysSincePosted, formatSalaryRange } from "@/lib/mockJobs";

export default function AdminPage() {
  const { jobs, addJob, updateJob, deleteJob } = useJobs();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(t);
  }, [toast]);

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(job: Job) {
    setEditing(job);
    setModalOpen(true);
  }

  return (
    <div className="min-h-screen animate-page-in bg-[#f9fafb]">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
            <p className="text-sm text-gray-500">Manage job listings (in-memory only)</p>
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            Add job
          </button>
        </div>

        <div className="mt-8 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-900">Title</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Company</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Type</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Location</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Salary</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Posted</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50/80">
                  <td className="max-w-[180px] truncate px-4 py-3 font-medium text-gray-900">
                    {job.title}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{job.company}</td>
                  <td className="px-4 py-3 text-gray-700">{job.job_type}</td>
                  <td className="max-w-[140px] truncate px-4 py-3 text-gray-700">
                    {job.location}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                    {formatSalaryRange(job)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {daysSincePosted(job.posted_at)}d ago
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        job.is_active
                          ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800"
                          : "rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
                      }
                    >
                      {job.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <button
                      type="button"
                      onClick={() => openEdit(job)}
                      className="mr-2 text-indigo-600 hover:text-indigo-800"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteJob(job.id);
                        setToast("Job deleted");
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <AdminModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        editingJob={editing}
        onSave={() => setToast(editing ? "Job updated" : "Job created")}
        onAdd={addJob}
        onUpdate={updateJob}
      />

      {toast && (
        <div
          className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-lg"
          role="status"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
