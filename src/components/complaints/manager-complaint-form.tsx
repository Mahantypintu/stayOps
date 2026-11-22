"use client";

import { useActionState } from "react";
import { ComplaintDraftFields } from "@/components/complaints/complaint-draft-fields";
import { Button } from "@/components/ui/button";
import { fieldClass, FormBanner, FormCard } from "@/components/ui/form";
import { emptyActionState } from "@/lib/action-state";
import { createManagerComplaintAction } from "@/services/actions";

export function ManagerComplaintForm({
  residents,
}: {
  residents: { id: string; name: string; propertyName: string; roomNumber: string; bedLabel: string }[];
}) {
  const [state, action, pending] = useActionState(createManagerComplaintAction, emptyActionState);

  return (
    <FormCard
      title="Record a complaint"
      description="Files a new complaint for a resident who is currently staying. Photo upload is a later phase."
    >
      <FormBanner error={state.error} message={state.message} revision={state.revision} />
      {residents.length === 0 ? (
        <p className="text-sm text-muted">Add an active resident before recording a complaint.</p>
      ) : (
        <form action={action} className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-medium text-muted sm:col-span-2">
            Resident
            <select name="residentId" required className={`${fieldClass} h-10`} defaultValue={residents[0]?.id}>
              {residents.map((resident) => (
                <option key={resident.id} value={resident.id}>
                  {resident.name} · {resident.propertyName} · Room {resident.roomNumber}, bed {resident.bedLabel}
                </option>
              ))}
            </select>
          </label>
          <ComplaintDraftFields />
          <div className="sm:col-span-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save complaint"}
            </Button>
          </div>
        </form>
      )}
    </FormCard>
  );
}
