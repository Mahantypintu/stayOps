"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { fieldClass, FormBanner } from "@/components/ui/form";
import { emptyActionState } from "@/lib/action-state";
import { updateComplaintStatusAction } from "@/services/actions";
import { complaintStatuses, type ComplaintStatus } from "@/types/operations";

function StatusFields({
  status,
  staffId,
  expectedResolution,
  staff,
}: {
  status: ComplaintStatus;
  staffId: string | null;
  expectedResolution: string | null;
  staff: { id: string; name: string }[];
}) {
  const [nextStatus, setNextStatus] = useState(status);
  const [nextStaff, setNextStaff] = useState(staffId ?? "");
  const [expected, setExpected] = useState(expectedResolution ?? "");
  const [note, setNote] = useState("");

  return (
    <>
      <label className="text-xs font-medium text-muted">
        Status
        <select
          name="status"
          value={nextStatus}
          onChange={(event) => setNextStatus(event.target.value as ComplaintStatus)}
          className={`${fieldClass} h-10`}
        >
          {complaintStatuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs font-medium text-muted">
        Staff
        <select
          name="staffId"
          value={nextStaff}
          onChange={(event) => setNextStaff(event.target.value)}
          className={`${fieldClass} h-10`}
        >
          <option value="">Unassigned</option>
          {staff.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs font-medium text-muted sm:col-span-2">
        Expected resolution
        <input
          name="expectedResolution"
          type="date"
          value={expected}
          onChange={(event) => setExpected(event.target.value)}
          className={`${fieldClass} h-10`}
        />
      </label>
      <p className="text-sm text-muted sm:col-span-2">
        An open complaint with an expected date before 22 Nov 2026 counts as overdue.
      </p>
      <label className="text-xs font-medium text-muted sm:col-span-2">
        Note
        <textarea
          name="note"
          required
          minLength={3}
          maxLength={500}
          rows={3}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className={fieldClass}
        />
      </label>
    </>
  );
}

export function ComplaintStatusForm({
  complaintId,
  status,
  staffId,
  expectedResolution,
  staff,
}: {
  complaintId: string;
  status: ComplaintStatus;
  staffId: string | null;
  expectedResolution: string | null;
  staff: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState(updateComplaintStatusAction, emptyActionState);

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <h2 className="text-sm font-semibold text-foreground">Update status</h2>
      <p className="mt-1 text-sm leading-6 text-muted">
        The note is added to the activity timeline. Assigned, Accepted, and In Progress need a staff
        member. Staff still cannot accept the task or add completion photos from their own portal.
      </p>
      <form action={action} key={state.savedAt ?? complaintId} className="mt-4 grid gap-4 sm:grid-cols-2">
        <FormBanner
          error={state.error}
          message={state.message}
          revision={state.revision}
          className="sm:col-span-2"
        />
        <input type="hidden" name="id" value={complaintId} />
        <StatusFields
          key={state.savedAt ?? complaintId}
          status={status}
          staffId={staffId}
          expectedResolution={expectedResolution}
          staff={staff}
        />
        <div className="sm:col-span-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save status"}
          </Button>
        </div>
      </form>
    </section>
  );
}
