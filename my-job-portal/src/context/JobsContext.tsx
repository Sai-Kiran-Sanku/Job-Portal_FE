"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import apiClient, { API_ENDPOINTS } from "@/lib/api";
import type { Job } from "@/lib/jobs";

const JOBS_PAGE_SIZE = 250;

type JobsContextValue = {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  refreshJobs: () => Promise<void>;
  getJob: (id: string) => Job | undefined;
};

const JobsContext = createContext<JobsContextValue | null>(null);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchAllJobs(includeInactive: boolean): Promise<Job[]> {
  const jobs: Job[] = [];
  let skip = 0;

  while (true) {
    const response = await apiClient.get<Job[]>(
      `${API_ENDPOINTS.JOBS.LIST}?include_inactive=${includeInactive}&skip=${skip}&limit=${JOBS_PAGE_SIZE}`,
    );
    const batch = response.data;
    jobs.push(...batch);

    if (batch.length < JOBS_PAGE_SIZE) {
      return jobs;
    }

    skip += JOBS_PAGE_SIZE;
  }
}

export function JobsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let response;

      try {
        response = await fetchAllJobs(true);
      } catch (err) {
        if (!axios.isAxiosError(err) || err.code !== "ECONNABORTED") {
          throw err;
        }

        // Render can take a bit longer on cold start, so retry once after a short pause.
        await sleep(1500);
        response = await fetchAllJobs(true);
      }

      setJobs(response);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
      if (axios.isAxiosError(err) && err.code === "ECONNABORTED") {
        setError("The job service is waking up. Please wait a moment and refresh.");
      } else {
        setError("Unable to load jobs right now.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshJobs();
  }, [refreshJobs]);

  const getJob = useCallback(
    (id: string) => jobs.find((j) => j.id === id),
    [jobs],
  );

  return (
    <JobsContext.Provider value={{ jobs, loading, error, refreshJobs, getJob }}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error("useJobs must be used within JobsProvider");
  return ctx;
}
