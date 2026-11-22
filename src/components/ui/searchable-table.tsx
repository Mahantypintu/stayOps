"use client";

import { useState, type ReactNode } from "react";
import { DataTable } from "@/components/ui/data-table";

export function SearchableTable({
  label,
  rows,
  columns,
  searchText,
  empty,
}: {
  label: string;
  columns: string[];
  rows: ReactNode[][];
  searchText: string[];
  empty: string;
}) {
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();
  const visible = rows.filter((_, index) =>
    needle ? searchText[index]?.toLowerCase().includes(needle) : true,
  );

  return (
    <div className="flex flex-col gap-4">
      <label className="max-w-sm text-xs font-medium text-muted">
        {label}
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="mt-1 h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
      </label>
      <p className="text-sm text-muted">
        {visible.length} of {rows.length} sample records
      </p>
      <DataTable columns={columns} rows={visible} empty={empty} />
    </div>
  );
}
