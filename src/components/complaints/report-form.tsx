"use client";

import { useActionState } from "react";
import { ComplaintDraftFields } from "@/components/complaints/complaint-draft-fields";
import { Button } from "@/components/ui/button";
import { fieldClass, FormBanner } from "@/components/ui/form";
import { emptyActionState } from "@/lib/action-state";
import { createResidentComplaintAction } from "@/services/actions";

export function ReportForm({
  propertyName,
  locationLabel,
  staying,
}: {
  propertyName: string;
  locationLabel: string;
  staying: boolean;
}) {
  const [state, action, pending] = useActionState(createResidentComplaintAction, emptyActionState);

  return (
    <form action={action} className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <p className="text-sm leading-6 text-muted">
        {propertyName}, {locationLabel} is already identified for this resident. The complaint is stored
        in this running session and appears for the property manager. Photos are a later phase.
      </p>
      <FormBanner error={state.error} message={state.message} className="mt-4" />
      {staying ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <ComplaintDraftFields />
          <label className="text-xs font-medium text-muted sm:col-span-2">
            Photos
            <input type="file" disabled className={`${fieldClass} cursor-not-allowed`} />
          </label>
          <p className="text-sm text-muted sm:col-span-2">
            Photo upload is not available yet. You can still submit the complaint.
          </p>
          <Button type="submit" disabled={pending} className="w-fit">
            {pending ? "Submitting…" : "Submit complaint"}
          </Button>
        </div>
      ) : (
        <p className="mt-4 text-sm text-danger">
          This resident is moved out, so a new complaint cannot be filed until a manager assigns a bed again.
        </p>
      )}
    </form>
  );
}
