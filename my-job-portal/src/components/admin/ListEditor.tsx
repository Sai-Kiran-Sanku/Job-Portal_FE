"use client";

type ListEditorProps = {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
};

export default function ListEditor({
  items,
  onChange,
  placeholder,
}: ListEditorProps) {
  function updateItem(index: number, value: string) {
    const next = [...items];
    next[index] = value;
    onChange(next);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  }

  function addItem() {
    onChange([...items, ""]);
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={`${index}-${item}`} className="flex items-center gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-red-600"
            aria-label={`Remove item ${index + 1}`}
          >
            ×
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="text-sm font-medium text-indigo-600 transition hover:text-indigo-800"
      >
        ＋ Add item
      </button>
    </div>
  );
}
