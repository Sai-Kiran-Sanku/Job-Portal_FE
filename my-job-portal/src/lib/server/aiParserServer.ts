import "server-only";

import { estimateTokens } from "@/lib/utils";
import type { ParseResult, ParsedJob } from "@/lib/aiParser";

const systemPrompt =
  "You are a job description parser. Extract structured data from raw job postings.\nAlways return valid JSON only. No explanation, no markdown, no backticks. Just raw JSON.";

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

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

async function tryGemini(rawText: string): Promise<ParseResult> {
  const userPrompt = buildUserPrompt(rawText);
  const response = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${getRequiredEnv("GEMINI_API_KEY")}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt}\n${userPrompt}` }] }],
      }),
    },
    10000,
  );

  if (!response.ok) {
    throw new Error(`Gemini failed with status ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini returned empty response");
  }

  return {
    result: parseAndValidate(text),
    usedProvider: "Gemini 1.5 Flash",
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
    10000,
  );

  if (!response.ok) {
    throw new Error(`Mistral failed with status ${response.status}`);
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
    10000,
  );

  if (!response.ok) {
    throw new Error(`Cohere failed with status ${response.status}`);
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
  const response = await fetchWithTimeout(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getRequiredEnv("GROQ_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    },
    10000,
  );

  if (!response.ok) {
    throw new Error(`Groq failed with status ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("Groq returned empty response");
  }

  return {
    result: parseAndValidate(text),
    usedProvider: "Groq",
  };
}

export async function parseJDServer(rawText: string): Promise<ParseResult> {
  const tokens = estimateTokens(rawText);

  try {
    return await tryGemini(rawText);
  } catch (error) {
    console.error("Gemini 1.5 Flash failed", error);
  }

  try {
    return await tryMistral(rawText);
  } catch (error) {
    console.error("Mistral failed", error);
  }

  try {
    return await tryCohere(rawText);
  } catch (error) {
    console.error("Cohere failed", error);
  }

  if (tokens <= 6000) {
    try {
      return await tryGroq(rawText);
    } catch (error) {
      console.error("Groq failed", error);
    }
  }

  throw new Error("All AI providers failed. Please try again.");
}
