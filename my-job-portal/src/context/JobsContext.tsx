"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MOCK_JOBS, type Job } from "@/lib/mockJobs";

const DEFAULT_RESP = [
  "Collaborate with teammates to deliver user-facing features",
  "Participate in planning, code reviews, and quality practices",
  "Improve reliability and performance where you touch the stack",
];

const DEFAULT_REQ = [
  "Relevant experience for the role and stack",
  "Strong communication and ownership",
  "Comfortable working in a fast-moving product environment",
];

type JobsContextValue = {
  jobs: Job[];
  addJob: (data: Omit<Job, "id" | "posted_at" | "is_active">) => void;
  updateJob: (id: string, data: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  getJob: (id: string) => Job | undefined;
};

const JobsContext = createContext<JobsContextValue | null>(null);

export function JobsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(() => [...MOCK_JOBS]);

  const getJob = useCallback(
    (id: string) => jobs.find((j) => j.id === id),
    [jobs],
  );

  const addJob = useCallback((data: Omit<Job, "id" | "posted_at" | "is_active">) => {
    const job: Job = {
      ...data,
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `job-${Date.now()}`,
      posted_at: new Date().toISOString(),
      is_active: true,
      responsibilities: data.responsibilities?.length ? data.responsibilities : [...DEFAULT_RESP],
      requirements: data.requirements?.length ? data.requirements : [...DEFAULT_REQ],
    };
    setJobs((prev) => [job, ...prev]);
  }, []);

  const updateJob = useCallback((id: string, data: Partial<Job>) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, ...data, id: j.id } : j)),
    );
  }, []);

  const deleteJob = useCallback((id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }, []);

  const value = useMemo(
    () => ({ jobs, addJob, updateJob, deleteJob, getJob }),
    [jobs, addJob, updateJob, deleteJob, getJob],
  );

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
}

export function useJobs() {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error("useJobs must be used within JobsProvider");
  return ctx;
}
