"use client";

import { useState } from "react";
import { complaintCategories } from "@/types/operations";

const fieldClass =
  "mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function ReportForm() {
  const [category, setCategory] = useState<string>(complaintCategories[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <form
      className="rounded-2xl border border-border bg-surface p-5 shadow-card"
      onSubmit={(event) => event.preventDefault()}
    >
      <p className="text-sm leading-6 text-muted">
        Room H-102 at Harbour House PG is already identified for this sample resident. Saving a
        complaint is the next phase, so Submit stays off.
      </p>
      <div className="mt-5 grid gap-4">
        <label className="text-xs font-medium text-muted">
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={`${fieldClass} h-10`}
          >
            {complaintCategories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium text-muted">
          Title
          <input value={title} onChange={(event) => setTitle(event.target.value)} className={`${fieldClass} h-10`} />
        </label>
        <label className="text-xs font-medium text-muted">
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className={fieldClass}
          />
        </label>
        <label className="text-xs font-medium text-muted">
          Photos
          <input type="file" disabled className={`${fieldClass} cursor-not-allowed`} />
        </label>
        <button
          type="submit"
          disabled
          className="h-10 cursor-not-allowed rounded-lg bg-accent/40 px-4 text-sm font-medium text-accent-foreground"
        >
          Submit complaint
        </button>
      </div>
    </form>
  );
}
