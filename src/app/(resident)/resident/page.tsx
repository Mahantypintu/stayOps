import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatSampleDateTime } from "@/lib/format";
import { complaintStatusTone } from "@/lib/status-map";
import { getPrototypeResident, listComplaintsForResident } from "@/services/operations";

export const metadata: Metadata = { title: "Resident home" };

const emptyStay =
  "No resident is in this session yet. Switch to Property manager and add a property, a floor, a room, and a resident. This view follows the first resident you add.";

export default async function ResidentHomePage() {
  const stay = await getPrototypeResident();
  const complaints = stay ? await listComplaintsForResident(stay.id) : [];
  const open = complaints.filter((item) => item.status !== "Resolved");

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        title={stay ? `Hello, ${stay.name}` : "Resident"}
        description={
          stay
            ? stay.staying
              ? `Your stay at ${stay.propertyName}, ${stay.locationLabel}. This is the resident view, not the manager workspace.`
              : `${stay.name} is moved out. A manager can assign a bed again from the residents screen.`
            : emptyStay
        }
      />
      <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
        <h2 className="text-sm font-semibold text-foreground">Open complaints</h2>
        {open.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No open complaints.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {open.map((item) => (
              <li key={item.id} className="rounded-xl bg-surface-muted px-4 py-3">
                <Link
                  href={`/resident/complaints/${item.id}`}
                  className="text-sm font-medium text-accent hover:underline"
                >
                  {item.id} · {item.title}
                </Link>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StatusBadge label={item.status} tone={complaintStatusTone(item.status)} />
                  <span className="text-xs text-muted">{formatSampleDateTime(item.reportedAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
