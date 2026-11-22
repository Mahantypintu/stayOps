"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FormBanner } from "@/components/ui/form";
import { emptyActionState } from "@/lib/action-state";
import { restoreSampleAction } from "@/services/actions";

export function RestoreSampleForm() {
  const [state, action, pending] = useActionState(restoreSampleAction, emptyActionState);

  return (
    <form action={action} className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <h2 className="text-sm font-semibold text-foreground">Session records</h2>
      <p className="mt-1 text-sm leading-6 text-muted">
        Property, resident, and complaint changes stay in this running server only. Restoring puts the
        original sample records back and removes anything added in this session.
      </p>
      <div className="mt-4">
        <FormBanner error={state.error} message={state.message} />
        <Button type="submit" variant="secondary" disabled={pending}>
          {pending ? "Restoring…" : "Restore sample records"}
        </Button>
      </div>
    </form>
  );
}
