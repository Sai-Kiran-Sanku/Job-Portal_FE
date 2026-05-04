export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function stripNullValues(obj: Record<string, any>): Record<string, any> {
  const next: Record<string, any> = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    if ((key === "salary_min" || key === "salary_max") && value === null) {
      next[key] = 0;
      return;
    }

    if (key === "apply_url" && value === null) {
      next[key] = "";
      return;
    }

    next[key] = value;
  });

  return next;
}
