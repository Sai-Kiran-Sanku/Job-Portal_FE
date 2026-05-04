"use client";

import { useMemo, useState } from "react";
import { estimateTokens } from "@/lib/utils";

type InputSectionProps = {
  onParse: (text: string) => void;
  loading: boolean;
};

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
      aria-hidden
    />
  );
}

export default function InputSection({
  onParse,
  loading,
}: InputSectionProps) {
  const [text, setText] = useState("");

  const tokenEstimate = useMemo(() => estimateTokens(text), [text]);

  async function handlePaste() {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText((prev) => `${prev}${prev ? "\n" : ""}${clipboardText}`);
    } catch (error) {
      console.error("Clipboard read failed", error);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <label htmlFor="raw-jd" className="mb-3 block text-sm font-semibold text-gray-900">
        Raw Job Description
      </label>

      <textarea
        id="raw-jd"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[280px] w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        placeholder="Paste the job description here..."
      />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          {text.length} characters · ~{tokenEstimate} tokens
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePaste}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            📋 Paste
          </button>

          <button
            type="button"
            onClick={() => onParse(text)}
            disabled={loading || text.trim().length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {loading ? <Spinner /> : null}
            <span>{loading ? "Structuring..." : "Structure with AI →"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
