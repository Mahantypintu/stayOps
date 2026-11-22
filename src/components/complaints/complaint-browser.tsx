"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatSampleDateTime } from "@/lib/format";
import { complaintPriorityTone, complaintStatusTone } from "@/lib/status-map";
import {
  complaintCategories,
  complaintPriorities,
  complaintStatuses,
} from "@/types/operations";
import type { ComplaintListItem } from "@/services/operations";

const fieldClass =
  "h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function ComplaintBrowser({
  complaints,
  asOf,
  hrefBase = "/complaints",
}: {
  complaints: ComplaintListItem[];
  asOf: string;
  hrefBase?: string;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [category, setCategory] = useState("All");
  const [property, setProperty] = useState("All");
  const [period, setPeriod] = useState("All");

  const properties = useMemo(
    () => [...new Set(complaints.map((item) => item.propertyName))],
    [complaints],
  );

  const filtered = complaints.filter((item) => {
    const haystack = `${item.id} ${item.title} ${item.residentName} ${item.locationLabel}`.toLowerCase();
    if (query && !haystack.includes(query.trim().toLowerCase())) return false;
    if (status !== "All" && item.status !== status) return false;
    if (priority !== "All" && item.priority !== priority) return false;
    if (category !== "All" && item.category !== category) return false;
    if (property !== "All" && item.propertyName !== property) return false;
    if (period === "This month" && !item.reportedAt.startsWith(asOf.slice(0, 7))) return false;
    if (period === "Overdue" && !item.overdue) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <label className="text-xs font-medium text-muted xl:col-span-2">
          Search
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ID, title, or resident"
            className={`${fieldClass} mt-1`}
          />
        </label>
        <Filter label="Status" value={status} onChange={setStatus} options={["All", ...complaintStatuses]} />
        <Filter label="Priority" value={priority} onChange={setPriority} options={["All", ...complaintPriorities]} />
        <Filter label="Category" value={category} onChange={setCategory} options={["All", ...complaintCategories]} />
        <Filter label="Property" value={property} onChange={setProperty} options={["All", ...properties]} />
        <Filter
          label="Reported"
          value={period}
          onChange={setPeriod}
          options={["All", "This month", "Overdue"]}
        />
      </div>
      <p className="text-sm text-muted">
        {filtered.length} of {complaints.length} sample complaints
      </p>
      <DataTable
        columns={["Complaint", "Status", "Priority", "Location", "Staff", "Reported"]}
        empty="No sample complaints match these filters."
        rows={filtered.map((item) => [
          <Link key={item.id} href={`${hrefBase}/${item.id}`} className="font-medium text-accent hover:underline">
            {item.id}
            <span className="mt-0.5 block font-normal text-foreground">{item.title}</span>
          </Link>,
          <span key={`${item.id}-status`} className="flex flex-col items-start gap-1">
            <StatusBadge label={item.status} tone={complaintStatusTone(item.status)} />
            {item.overdue ? <StatusBadge label="Overdue" tone="danger" /> : null}
          </span>,
          <StatusBadge key={`${item.id}-priority`} label={item.priority} tone={complaintPriorityTone(item.priority)} />,
          <span key={`${item.id}-where`}>
            {item.propertyName}
            <span className="mt-0.5 block text-muted">{item.locationLabel}</span>
          </span>,
          item.staffName,
          formatSampleDateTime(item.reportedAt),
        ])}
      />
    </div>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="text-xs font-medium text-muted">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className={`${fieldClass} mt-1`}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
