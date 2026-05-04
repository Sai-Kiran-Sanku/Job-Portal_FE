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

function summarizeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function parseAndValidate(text: string): ParsedJob {
  const parsed = JSON.parse(cleanJsonResponse(text)) as ParsedJob;

  if (!parsed?.title || !parsed?.company) {
    throw new Error("Invalid parsed job response");
  }

  return parsed;
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
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("Mistral returned empty response");
  }

  return {
    result: parseAndValidate(text),
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
      const text = data.choices?.[0]?.message?.content;
      if (!text) {
        throw new Error("OpenRouter returned empty response");
      }

      return {
        result: parseAndValidate(text),
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
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("Groq returned empty response");
  }

  return {
    result: parseAndValidate(text),
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
