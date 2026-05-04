export type ParsedJob = {
  title: string;
  company: string;
  location: string;
  job_type: "Full-time" | "Part-time" | "Remote" | "Contract";
  salary_min: number | null;
  salary_max: number | null;
  description: string;
  apply_url: string | null;
  tags: string[];
  responsibilities: string[];
  requirements: string[];
};

export type ParseResult = {
  result: ParsedJob;
  usedProvider: string;
};

export async function parseJD(rawText: string): Promise<ParseResult> {
  const response = await fetch("/api/admin/parse-jd", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rawText }),
  });

  if (!response.ok) {
    let message = "Failed to parse JD";

    try {
      const errorData = await response.json();
      message = errorData?.detail || errorData?.message || message;
    } catch {
      message = await response.text().catch(() => message);
    }

    throw new Error(message);
  }

  return response.json();
}
