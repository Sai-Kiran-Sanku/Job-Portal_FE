import type { ParsedJob } from "./aiParser";

export async function publishJob(data: ParsedJob): Promise<void> {
  const response = await fetch("/api/proxy/jobs/jobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: data.title,
      company: data.company,
      location: data.location,
      job_type: data.job_type,
      salary_min: data.salary_min ?? 0,
      salary_max: data.salary_max ?? 0,
      description: data.description,
      apply_url: data.apply_url ?? "",
      tags: data.tags,
      responsibilities: data.responsibilities,
      requirements: data.requirements,
    }),
  });

  if (!response.ok) {
    let message = "Failed to publish job";

    try {
      const errorData = await response.json();
      message = errorData?.detail || errorData?.message || message;
    } catch {
      message = await response.text().catch(() => message);
    }

    throw new Error(message);
  }
}
