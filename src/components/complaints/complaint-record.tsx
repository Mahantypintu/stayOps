import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatSampleDate, formatSampleDateTime } from "@/lib/format";
import { complaintPriorityTone, complaintStatusTone } from "@/lib/status-map";
import type { ComplaintDetail } from "@/services/operations";

export function ComplaintRecordView({
  complaint,
  backHref,
  backLabel,
}: {
  complaint: ComplaintDetail;
  backHref: string;
  backLabel: string;
}) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-accent hover:underline">
          {backLabel}
        </Link>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-xs text-muted">{complaint.id}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {complaint.title}
            </h1>
            <p className="mt-2 text-sm text-muted">
              {complaint.propertyName} · {complaint.locationLabel}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge label={complaint.status} tone={complaintStatusTone(complaint.status)} />
            <StatusBadge label={complaint.priority} tone={complaintPriorityTone(complaint.priority)} />
            {complaint.overdue ? <StatusBadge label="Overdue" tone="danger" /> : null}
          </div>
        </div>
      </div>

      <section className="grid gap-4 rounded-2xl border border-border bg-surface p-5 shadow-card sm:grid-cols-2">
        <Field label="Category" value={complaint.category} />
        <Field label="Resident" value={complaint.residentName} />
        <Field label="Floor" value={complaint.floorName} />
        <Field label="Room" value={complaint.roomNumber} />
        <Field label="Bed" value={complaint.bedLabel} />
        <Field label="Assigned staff" value={complaint.staffName} />
        <Field label="Reported" value={formatSampleDateTime(complaint.reportedAt)} />
        <Field
          label="Expected resolution"
          value={complaint.expectedResolution ? formatSampleDate(complaint.expectedResolution) : "Not set"}
        />
        <div className="sm:col-span-2">
          <Field label="Description" value={complaint.description} />
        </div>
        {complaint.managerNote ? (
          <div className="sm:col-span-2">
            <Field label="Manager note" value={complaint.managerNote} />
          </div>
        ) : null}
        {complaint.resolutionRemarks ? (
          <div className="sm:col-span-2">
            <Field label="Resolution remarks" value={complaint.resolutionRemarks} />
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
        <h2 className="text-sm font-semibold text-foreground">Photos</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <PhotoSlot label="Report photos" present={complaint.hasReportPhotos} />
          <PhotoSlot label="Completion photos" present={complaint.hasCompletionPhotos} />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
        <h2 className="text-sm font-semibold text-foreground">Activity</h2>
        {complaint.events.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No activity is recorded for this sample complaint.</p>
        ) : (
          <ol className="mt-4 flex flex-col gap-4">
            {complaint.events.map((event) => (
              <li key={event.id} className="border-l-2 border-accent pl-4">
                <p className="text-sm text-foreground">{event.summary}</p>
                <p className="mt-1 text-xs text-muted">
                  {event.actor} · {formatSampleDateTime(event.at)}
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>

      <p className="text-sm text-muted">
        Changing status, assigning staff, and uploading photos are not available in this
        prototype.
      </p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-1 text-sm leading-6 text-foreground">{value}</p>
    </div>
  );
}

function PhotoSlot({ label, present }: { label: string; present: boolean }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface-muted px-4 py-6">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="mt-1 text-sm text-muted">
        {present
          ? "The sample record is marked as having a photo. Image files are not included."
          : "No photo on this sample record."}
      </p>
    </div>
  );
}
