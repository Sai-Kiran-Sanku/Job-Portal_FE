"use client";

import { useCallback, useMemo, useState } from "react";
import InputSection from "@/components/admin/InputSection";
import PreviewCard from "@/components/admin/PreviewCard";
import StatusBanner from "@/components/admin/StatusBanner";
import { parseJD, type ParsedJob } from "@/lib/aiParser";
import { publishJob } from "@/lib/jobApi";
import apiClient, { API_ENDPOINTS } from "@/lib/api";
import { useJobs } from "@/context/JobsContext";
import type { Job } from "@/lib/jobs";
import { daysSincePosted } from "@/lib/jobs";

type Stage = "input" | "preview" | "success";
type BannerState = "idle" | "loading" | "success" | "error";

type StatusTab = "All" | "Active" | "Inactive";

const statusTabs: StatusTab[] = ["All", "Active", "Inactive"];

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
      aria-hidden
    />
  );
}

function statusLabel(isActive: boolean) {
  return isActive ? "Active" : "Inactive";
}

function statusClasses(isActive: boolean) {
  return isActive
    ? "inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700"
    : "inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600";
}

function jobStatusButtonLabel(job: Job) {
  return job.is_active ? "Deactivate" : "Reactivate";
}

export default function AdminParserPage() {
  const { jobs, loading: jobsLoading, error: jobsError, refreshJobs } = useJobs();
  const [stage, setStage] = useState<Stage>("input");
  const [rawText, setRawText] = useState("");
  const [parsedData, setParsedData] = useState<ParsedJob | null>(null);
  const [bannerState, setBannerState] = useState<BannerState>("idle");
  const [bannerMessage, setBannerMessage] = useState("");
  const [usedProvider, setUsedProvider] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<StatusTab>("All");
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [busyJobIds, setBusyJobIds] = useState<string[]>([]);

  function resetAll() {
    setStage("input");
    setRawText("");
    setParsedData(null);
    setBannerState("idle");
    setBannerMessage("");
    setUsedProvider("");
    setPublishing(false);
    setPublishError(null);
  }

  async function handleParse(text: string) {
    setRawText(text);
    setBannerState("loading");
    setBannerMessage("");
    setUsedProvider("");
    setPublishError(null);

    try {
      const { result, usedProvider: provider } = await parseJD(text);
      setParsedData(result);
      setUsedProvider(provider);
      setBannerState("success");
      setStage("preview");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to parse JD";
      setBannerState("error");
      setBannerMessage(message);
    }
  }

  async function handlePublish() {
    if (!parsedData) {
      return;
    }

    setPublishing(true);
    setPublishError(null);

    try {
      await publishJob(parsedData);
      await refreshJobs();
      setStage("success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to publish job";
      setPublishError(message);
      setPublishing(false);
    }
  }

  const filteredJobs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return jobs.filter((job) => {
      if (activeTab === "Active") return job.is_active;
      if (activeTab === "Inactive") return !job.is_active;
      return true;
    }).filter((job) => {
      if (!normalizedSearch) return true;
      return (
        job.title.toLowerCase().includes(normalizedSearch) ||
        job.company.toLowerCase().includes(normalizedSearch) ||
        job.location.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [jobs, activeTab, search]);

  const setBusy = useCallback((jobId: string, value: boolean) => {
    setBusyJobIds((current) =>
      value ? [...new Set([...current, jobId])] : current.filter((id) => id !== jobId),
    );
  }, []);

  const updateJobStatus = useCallback(
    async (job: Job) => {
      setActionError(null);
      setSuccessMessage(null);
      setBusy(job.id, true);

      try {
        if (job.is_active) {
          await apiClient.delete(`${API_ENDPOINTS.JOBS.LIST}/${job.id}`);
          setSuccessMessage(`Deactivated ${job.title} at ${job.company}.`);
        } else {
          await apiClient.put(`${API_ENDPOINTS.JOBS.LIST}/${job.id}`, {
            is_active: true,
          });
          setSuccessMessage(`Reactivated ${job.title} at ${job.company}.`);
        }
        await refreshJobs();
      } catch (error) {
        console.error("Failed to update job status", error);
        setActionError("Unable to update job status. Please try again.");
      } finally {
        setBusy(job.id, false);
      }
    },
    [refreshJobs, setBusy],
  );

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h1 className="text-[28px] font-bold text-indigo-600">JD Parser</h1>
              <p className="mt-2 text-sm text-gray-600">
                Paste any raw job description — messy, unformatted, any language.
              </p>
            </div>

          {stage === "input" ? (
            <div className="space-y-6">
              <InputSection
                key={rawText ? "filled" : "empty"}
                onParse={handleParse}
                loading={bannerState === "loading"}
              />

              <StatusBanner
                state={bannerState}
                message={bannerMessage}
                provider={usedProvider}
              />
            </div>
          ) : null}

          {stage === "preview" && parsedData ? (
            <div className="space-y-6">
              <StatusBanner state="success" provider={usedProvider} />

              <PreviewCard data={parsedData} onChange={setParsedData} />

              {publishError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  Failed to publish: {publishError} — Your data is safe, try again.
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={publishing}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
                >
                  {publishing ? <Spinner /> : null}
                  <span>{publishing ? "Publishing..." : "✅ Publish Job"}</span>
                </button>

                <button
                  type="button"
                  onClick={resetAll}
                  className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  ✗ Discard
                </button>
              </div>
            </div>
          ) : null}

          {stage === "success" && parsedData ? (
            <div className="rounded-2xl border border-emerald-200 bg-white px-6 py-12 text-center shadow-sm">
              <div className="text-6xl">✅</div>
              <h2 className="mt-5 text-2xl font-bold text-emerald-600">
                Job Published Successfully!
              </h2>
              <p className="mt-3 text-sm text-gray-500">
                {parsedData.title} at {parsedData.company}
              </p>
              <button
                type="button"
                onClick={resetAll}
                className="mt-8 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Parse Another JD →
              </button>
            </div>
          ) : null}
        </div>

        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">Manage</p>
              <h2 className="text-xl font-bold text-gray-900">Job Status</h2>
            </div>
            <button
              type="button"
              onClick={refreshJobs}
              className="w-full rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-indigo-300 hover:text-indigo-600"
            >
              Refresh
            </button>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {statusTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mb-4 rounded-2xl border border-gray-200 bg-gray-50 p-3">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search..."
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>


          {actionError ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {actionError}
            </div>
          ) : null}

          {successMessage ? (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              {successMessage}
            </div>
          ) : null}

          <div className="overflow-x-auto">
            {jobsLoading ? (
              <div className="rounded-xl border border-gray-200 bg-white px-4 py-8 text-center text-xs text-gray-500">
                Loading...
              </div>
            ) : jobsError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center text-xs text-red-700">
                {jobsError}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-xs text-gray-500">
                No jobs.
              </div>
            ) : (
              <table className="w-full divide-y divide-gray-200 text-left text-xs">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-3 py-2">Role</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <div className="font-medium text-gray-900 line-clamp-1">{job.title}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{job.company}</div>
                      </td>
                      <td className="px-3 py-2">
                        <span className={statusClasses(job.is_active)}>{statusLabel(job.is_active)}</span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => updateJobStatus(job)}
                          disabled={busyJobIds.includes(job.id)}
                          className="inline-flex items-center rounded-full bg-indigo-600 px-2 py-1 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                        >
                          {busyJobIds.includes(job.id) ? "..." : (job.is_active ? "Deactivate" : "Reactivate")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
        </div>
      </div>
    </main>
  );
}
