export type JobType = "Full-time" | "Part-time" | "Remote" | "Contract";

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: JobType;
  salary_min: number;
  salary_max: number;
  tags: string[];
  description: string;
  apply_url: string;
  posted_at: string;
  is_active: boolean;
  responsibilities: string[];
  requirements: string[];
};

export type JobCreateInput = Omit<Job, "id" | "posted_at" | "is_active">;

export function formatSalaryRange(job: Pick<Job, "salary_min" | "salary_max">): string {
  if (job.salary_min >= 1000) {
    const a = Math.round(job.salary_min / 1000);
    const b = Math.round(job.salary_max / 1000);
    return `$${a}k - $${b}k`;
  }
  return `Rs.${job.salary_min}L - Rs.${job.salary_max}L`;
}

export function daysSincePosted(postedAt: string): number {
  const ms = Date.now() - new Date(postedAt).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export function isNewJob(postedAt: string): boolean {
  return daysSincePosted(postedAt) <= 3;
}
