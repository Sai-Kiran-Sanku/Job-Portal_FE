import "server-only";

import { estimateTokens } from "@/lib/utils";
import type { ParseResult, ParsedJob } from "@/lib/aiParser";

const systemPrompt =
  "You are a job description parser. Extract structured data from raw job postings.\nAlways return valid JSON only. No explanation, no markdown, no backticks. Just raw JSON.";
const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";
const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";
const DEFAULT_OPENROUTER_MODEL = "openrouter/free";
const DEFAULT_PROVIDER_TIMEOUT_MS = 20000;
const OPENROUTER_TIMEOUT_MS = 30000;
const OPENROUTER_MAX_ATTEMPTS = 2;

function buildUserPrompt(rawText: string): string {
  return `Parse this job description and return ONLY a JSON object with exactly these fields:
{
  title: string,
  company: string,
  location: string,
  job_type: exactly one of Full-time | Part-time | Remote | Contract,
  salary_min: number or null (annual),
  salary_max: number or null (annual),
  description: 2-3 line summary of the role,
  apply_url: string or null,
  tags: array of max 8 specific skills (React, Python, AWS etc),
  responsibilities: array of strings,
  requirements: array of strings
}
Return ONLY the JSON. Nothing else.
Raw text: ${rawText}`;
}

function cleanJsonResponse(text: string): string {
  return text.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
}

function extractJsonObject(text: string): string {
  const cleaned = cleanJsonResponse(text);
  const firstBrace = cleaned.indexOf("{");

  if (firstBrace === -1) {
    return cleaned;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = firstBrace; index < cleaned.length; index += 1) {
    const char = cleaned[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "\"") {
        inString = false;
      }
      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }

    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return cleaned.slice(firstBrace, index + 1);
      }
    }
  }

  return cleaned;
}

function summarizeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function normalizeJobType(value: unknown): ParsedJob["job_type"] {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();

  if (normalized.includes("part")) return "Part-time";
  if (normalized.includes("contract")) return "Contract";
  if (normalized.includes("remote")) return "Remote";
  return "Full-time";
}

function toStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n|,|;/)
      .map((item) => item.replace(/^[-*]\s*/, "").trim())
      .filter(Boolean);
  }

  return [];
}

function toNullableNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const numeric = Number(value.replace(/[^\d.]/g, ""));
    return Number.isFinite(numeric) ? numeric : null;
  }

  return null;
}

function normalizeParsedJob(input: unknown): ParsedJob {
  const parsed = (input ?? {}) as Record<string, unknown>;
  const title = String(parsed.title ?? "").trim();
  const company = String(parsed.company ?? "").trim();

  if (!title || !company) {
    throw new Error("Invalid parsed job response");
  }

  const location = String(parsed.location ?? "").trim() || "Not specified";
  const description = String(parsed.description ?? "").trim() || "No description provided.";
  const responsibilities = toStringList(parsed.responsibilities);
  const requirements = toStringList(parsed.requirements);
  const tags = toStringList(parsed.tags).slice(0, 8);

  return {
    title,
    company,
    location,
    job_type: normalizeJobType(parsed.job_type),
    salary_min: toNullableNumber(parsed.salary_min),
    salary_max: toNullableNumber(parsed.salary_max),
    description,
    apply_url: typeof parsed.apply_url === "string" && parsed.apply_url.trim()
      ? parsed.apply_url.trim()
      : null,
    tags,
    responsibilities,
    requirements,
  };
}

function parseAndValidate(payload: unknown): ParsedJob {
  if (typeof payload === "string") {
    const extracted = extractJsonObject(payload);
    return normalizeParsedJob(JSON.parse(extracted));
  }

  return normalizeParsedJob(payload);
}

function extractMessageText(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part) {
          return String((part as { text?: unknown }).text ?? "");
        }
        return "";
      })
      .join("\n")
      .trim();
  }

  return "";
}

function extractOpenAiStylePayload(data: Record<string, unknown>): unknown {
  const choices = Array.isArray(data.choices) ? data.choices : [];
  const message = (choices[0] as { message?: Record<string, unknown> } | undefined)?.message;

  if (!message) {
    return null;
  }

  const toolCalls = Array.isArray(message.tool_calls) ? message.tool_calls : [];
  const toolArgs = toolCalls
    .map((toolCall) => (toolCall as { function?: { arguments?: unknown } }).function?.arguments)
    .find(Boolean);

  if (toolArgs) {
    return toolArgs;
  }

  return extractMessageText(message.content);
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

function getConfiguredEnv(name: string): string | null {
  const value = process.env[name]?.trim();

  if (!value) {
    return null;
  }

  // Ignore example placeholder values copied from `.env.example`.
  if (/^(your_|example|changeme)/i.test(value)) {
    return null;
  }

  return value;
}

function getRequiredEnv(name: string): string {
  const value = getConfiguredEnv(name);
  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}

function getGeminiModel(): string {
  return getConfiguredEnv("GEMINI_MODEL") ?? DEFAULT_GEMINI_MODEL;
}

function getGroqModel(): string {
  return getConfiguredEnv("GROQ_MODEL") ?? DEFAULT_GROQ_MODEL;
}

function getOpenRouterModel(): string {
  return getConfiguredEnv("OPENROUTER_MODEL") ?? DEFAULT_OPENROUTER_MODEL;
}

function isProviderEnabled(name: string): boolean {
  const flag = process.env[`${name}_ENABLED`]?.trim().toLowerCase();

  if (!flag) {
    return true;
  }

  return flag !== "false" && flag !== "0" && flag !== "no";
}

async function readErrorBody(response: Response): Promise<string> {
  const text = await response.text().catch(() => "");
  return text.trim().slice(0, 300);
}

function shuffleProviders<T>(items: T[]): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldRetryOpenRouter(error: unknown): boolean {
  return error instanceof Error && /aborted|timeout/i.test(error.message);
}

async function tryGemini(rawText: string): Promise<ParseResult> {
  const userPrompt = buildUserPrompt(rawText);
  const model = getGeminiModel();
  const response = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${getRequiredEnv("GEMINI_API_KEY")}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: userPrompt }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      }),
    },
    DEFAULT_PROVIDER_TIMEOUT_MS,
  );

  if (!response.ok) {
    const details = await readErrorBody(response);
    throw new Error(
      `Gemini failed with status ${response.status}${details ? `: ${details}` : ""}`,
    );
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini returned empty response");
  }

  return {
    result: parseAndValidate(text),
    usedProvider: `Gemini (${model})`,
  };
}

async function tryMistral(rawText: string): Promise<ParseResult> {
  const userPrompt = buildUserPrompt(rawText);
  const response = await fetchWithTimeout(
    "https://api.mistral.ai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getRequiredEnv("MISTRAL_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    },
    DEFAULT_PROVIDER_TIMEOUT_MS,
  );

  if (!response.ok) {
    const details = await readErrorBody(response);
    throw new Error(
      `Mistral failed with status ${response.status}${details ? `: ${details}` : ""}`,
    );
  }

  const data = await response.json();
  const payload = extractOpenAiStylePayload(data);
  if (!payload) {
    throw new Error("Mistral returned empty response");
  }

  return {
    result: parseAndValidate(payload),
    usedProvider: "Mistral",
  };
}

async function tryOpenRouter(rawText: string): Promise<ParseResult> {
  const userPrompt = buildUserPrompt(rawText);
  const model = getOpenRouterModel();
  let lastError: unknown;

  for (let attempt = 1; attempt <= OPENROUTER_MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetchWithTimeout(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getRequiredEnv("OPENROUTER_API_KEY")}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.2,
            response_format: {
              type: "json_object",
            },
          }),
        },
        OPENROUTER_TIMEOUT_MS,
      );

      if (!response.ok) {
        const details = await readErrorBody(response);
        throw new Error(
          `OpenRouter failed with status ${response.status}${details ? `: ${details}` : ""}`,
        );
      }

      const data = await response.json();
      const payload = extractOpenAiStylePayload(data);
      if (!payload) {
        throw new Error("OpenRouter returned empty response");
      }

      return {
        result: parseAndValidate(payload),
        usedProvider: `OpenRouter (${model})`,
      };
    } catch (error) {
      lastError = error;

      if (attempt < OPENROUTER_MAX_ATTEMPTS && shouldRetryOpenRouter(error)) {
        await wait(500 * attempt);
        continue;
      }

      throw error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("OpenRouter failed after retries");
}

async function tryCohere(rawText: string): Promise<ParseResult> {
  const userPrompt = buildUserPrompt(rawText);
  const response = await fetchWithTimeout(
    "https://api.cohere.ai/v1/chat",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getRequiredEnv("COHERE_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "command-r",
        preamble: systemPrompt,
        message: userPrompt,
      }),
    },
    DEFAULT_PROVIDER_TIMEOUT_MS,
  );

  if (!response.ok) {
    const details = await readErrorBody(response);
    throw new Error(
      `Cohere failed with status ${response.status}${details ? `: ${details}` : ""}`,
    );
  }

  const data = await response.json();
  const text = data.text;
  if (!text) {
    throw new Error("Cohere returned empty response");
  }

  return {
    result: parseAndValidate(text),
    usedProvider: "Cohere",
  };
}

async function tryGroq(rawText: string): Promise<ParseResult> {
  const userPrompt = buildUserPrompt(rawText);
  const model = getGroqModel();
  const response = await fetchWithTimeout(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getRequiredEnv("GROQ_API_KEY")}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        response_format: {
          type: "json_object",
        },
      }),
    },
    DEFAULT_PROVIDER_TIMEOUT_MS,
  );

  if (!response.ok) {
    const details = await readErrorBody(response);
    throw new Error(
      `Groq failed with status ${response.status}${details ? `: ${details}` : ""}`,
    );
  }

  const data = await response.json();
  const payload = extractOpenAiStylePayload(data);
  if (!payload) {
    throw new Error("Groq returned empty response");
  }

  return {
    result: parseAndValidate(payload),
    usedProvider: `Groq (${model})`,
  };
}

export async function parseJDServer(rawText: string): Promise<ParseResult> {
  const tokens = estimateTokens(rawText);
  const configuredProviders: Array<{
    name: string;
    enabled: boolean;
    run: () => Promise<ParseResult>;
  }> = [
    {
      name: `Groq (${getGroqModel()})`,
      enabled:
        tokens <= 6000 &&
        isProviderEnabled("GROQ") &&
        Boolean(getConfiguredEnv("GROQ_API_KEY")),
      run: () => tryGroq(rawText),
    },
    {
      name: `OpenRouter (${getOpenRouterModel()})`,
      enabled:
        isProviderEnabled("OPENROUTER") &&
        Boolean(getConfiguredEnv("OPENROUTER_API_KEY")),
      run: () => tryOpenRouter(rawText),
    },
    {
      name: "Mistral",
      enabled:
        isProviderEnabled("MISTRAL") &&
        Boolean(getConfiguredEnv("MISTRAL_API_KEY")),
      run: () => tryMistral(rawText),
    },
    {
      name: "Cohere",
      enabled:
        isProviderEnabled("COHERE") && Boolean(getConfiguredEnv("COHERE_API_KEY")),
      run: () => tryCohere(rawText),
    },
    {
      name: `Gemini (${getGeminiModel()})`,
      enabled:
        isProviderEnabled("GEMINI") && Boolean(getConfiguredEnv("GEMINI_API_KEY")),
      run: () => tryGemini(rawText),
    },
  ];
  const failures: string[] = [];
  const groqProvider = configuredProviders.find((provider) =>
    provider.name.startsWith("Groq "),
  );
  const otherEnabledProviders = configuredProviders.filter(
    (provider) => provider.enabled && !provider.name.startsWith("Groq "),
  );
  const enabledProviders = [
    ...(groqProvider?.enabled ? [groqProvider] : []),
    ...shuffleProviders(otherEnabledProviders),
  ];
  const disabledProviders = configuredProviders.filter((provider) => !provider.enabled);

  for (const provider of disabledProviders) {
    failures.push(`${provider.name}: not configured`);
  }

  for (const provider of enabledProviders) {
    try {
      return await provider.run();
    } catch (error) {
      const reason = summarizeError(error);
      console.error(`${provider.name} failed`, error);
      failures.push(`${provider.name}: ${reason}`);
    }
  }

  throw new Error(`All AI providers failed. ${failures.join(" | ")}`);
}
