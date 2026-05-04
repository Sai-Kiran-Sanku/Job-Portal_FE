"use client";

import { useState } from "react";
import InputSection from "@/components/admin/InputSection";
import PreviewCard from "@/components/admin/PreviewCard";
import StatusBanner from "@/components/admin/StatusBanner";
import { parseJD, type ParsedJob } from "@/lib/aiParser";
import { publishJob } from "@/lib/jobApi";

type Stage = "input" | "preview" | "success";
type BannerState = "idle" | "loading" | "success" | "error";

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
      aria-hidden
    />
  );
}

export default function AdminParserPage() {
  const [stage, setStage] = useState<Stage>("input");
  const [rawText, setRawText] = useState("");
  const [parsedData, setParsedData] = useState<ParsedJob | null>(null);
  const [bannerState, setBannerState] = useState<BannerState>("idle");
  const [bannerMessage, setBannerMessage] = useState("");
  const [usedProvider, setUsedProvider] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

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
      setStage("success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to publish job";
      setPublishError(message);
      setPublishing(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-4 pt-10 pb-12">
      <div className="mx-auto max-w-[800px]">
        {stage === "input" ? (
          <div className="space-y-6">
            <div>
              <h1 className="text-[28px] font-bold text-indigo-600">JD Parser</h1>
              <p className="mt-2 text-sm text-gray-600">
                Paste any raw job description — messy, unformatted, any language
              </p>
            </div>

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
    </main>
  );
}
