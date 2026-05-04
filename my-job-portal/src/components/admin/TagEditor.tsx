"use client";

import { useState } from "react";

type TagEditorProps = {
  tags: string[];
  onChange: (tags: string[]) => void;
};

export default function TagEditor({ tags, onChange }: TagEditorProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  function commitDraft() {
    const nextTag = draft.trim();
    if (nextTag && !tags.includes(nextTag)) {
      onChange([...tags, nextTag]);
    }
    setDraft("");
    setAdding(false);
  }

  function removeTag(tagToRemove: string) {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700"
        >
          <span>{tag}</span>
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="text-indigo-500 transition hover:text-indigo-800"
            aria-label={`Remove ${tag}`}
          >
            ×
          </button>
        </span>
      ))}

      {adding ? (
        <input
          autoFocus
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitDraft}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitDraft();
            }
          }}
          className="min-w-[120px] rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900 outline-none ring-indigo-500/20 transition focus:border-indigo-500 focus:ring-2"
          placeholder="Tag name"
        />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="rounded-full border border-dashed border-indigo-300 px-3 py-1 text-sm font-medium text-indigo-600 transition hover:border-indigo-400 hover:bg-indigo-50"
        >
          + Add tag
        </button>
      )}
    </div>
  );
}
