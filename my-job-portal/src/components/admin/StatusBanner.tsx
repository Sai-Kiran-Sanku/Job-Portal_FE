"use client";

type StatusBannerProps = {
  state: "idle" | "loading" | "success" | "error";
  message?: string;
  provider?: string;
};

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
      aria-hidden
    />
  );
}

export default function StatusBanner({
  state,
  message,
  provider,
}: StatusBannerProps) {
  if (state === "idle") {
    return null;
  }

  if (state === "loading") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
        <Spinner />
        <p>Analyzing with {provider}...</p>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
        <p>✓ Structured by {provider} — Review before publishing</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
      <p>{message}</p>
    </div>
  );
}
