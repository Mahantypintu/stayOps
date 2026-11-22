"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FormBanner, FormCard } from "@/components/ui/form";
import { emptyActionState } from "@/lib/action-state";
import { createPropertyAction } from "@/services/actions";
import { PropertyFieldSet } from "@/components/properties/property-fields";

export function PropertyForms() {
  const [createState, createAction, createPending] = useActionState(createPropertyAction, emptyActionState);

  return (
    <FormCard title="Add a property" description="The property appears in the list below, where you can edit it.">
      <FormBanner error={createState.error} message={createState.message} revision={createState.revision} />
      <form action={createAction} key={createState.savedAt ?? "new-property"} className="grid gap-4 sm:grid-cols-3">
        <PropertyFieldSet />
        <div className="sm:col-span-3">
          <Button type="submit" disabled={createPending}>
            {createPending ? "Saving…" : "Add property"}
          </Button>
        </div>
      </form>
    </FormCard>
  );
}
