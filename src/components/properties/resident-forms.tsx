"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { fieldClass, FormBanner, FormCard } from "@/components/ui/form";
import { emptyActionState } from "@/lib/action-state";
import { createResidentAction, moveOutResidentAction, updateResidentAction } from "@/services/actions";
import type { BedAssignment, BedChoice, ResidentChoice } from "@/services/operations";

export function ResidentForms({
  residents,
  vacantBeds,
  beds,
  today,
}: {
  residents: ResidentChoice[];
  vacantBeds: BedChoice[];
  beds: BedAssignment[];
  today: string;
}) {
  const [createState, createAction, createPending] = useActionState(createResidentAction, emptyActionState);
  const [updateState, updateAction, updatePending] = useActionState(updateResidentAction, emptyActionState);
  const [moveState, moveAction, movePending] = useActionState(moveOutResidentAction, emptyActionState);
  const [residentId, setResidentId] = useState(residents[0]?.id ?? "");
  const [moveId, setMoveId] = useState(residents.find((resident) => resident.staying)?.id ?? "");
  const selected = residents.find((resident) => resident.id === residentId) ?? residents[0];
  const staying = residents.filter((resident) => resident.staying);
  const bedOptions = beds.filter((bed) => bed.residentId === null || bed.residentId === selected?.id);
  const bedValue = bedOptions.some((bed) => bed.id === selected?.bedId)
    ? selected?.bedId
    : bedOptions[0]?.id;

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <FormCard
        title="Add a resident"
        description="The resident is assigned to a vacant bed. This does not create a login."
      >
        <FormBanner error={createState.error} message={createState.message} />
        {vacantBeds.length === 0 ? (
          <p className="text-sm text-muted">Every bed is occupied. Add a room before adding a resident.</p>
        ) : (
          <form action={createAction} key={createState.savedAt ?? "new-resident"} className="grid gap-4">
            <label className="text-xs font-medium text-muted">
              Name
              <input name="name" required minLength={2} maxLength={80} className={`${fieldClass} h-10`} />
            </label>
            <label className="text-xs font-medium text-muted">
              Phone
              <input
                name="phone"
                required
                inputMode="numeric"
                autoComplete="tel"
                placeholder="10 digits"
                className={`${fieldClass} h-10`}
              />
            </label>
            <label className="text-xs font-medium text-muted">
              Vacant bed
              <select name="bedId" required className={`${fieldClass} h-10`} defaultValue={vacantBeds[0]?.id}>
                {vacantBeds.map((bed) => (
                  <option key={bed.id} value={bed.id}>
                    {bed.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-medium text-muted">
              Move-in date
              <input name="moveIn" type="date" required defaultValue={today} className={`${fieldClass} h-10`} />
            </label>
            <Button type="submit" disabled={createPending}>
              {createPending ? "Saving…" : "Add resident"}
            </Button>
          </form>
        )}
      </FormCard>
      <FormCard
        title="Update a stay"
        description="Change the name, phone, or bed. Choosing a bed for someone who moved out brings them back into the active list."
      >
        {selected ? (
          <>
            <FormBanner error={updateState.error} message={updateState.message} />
            <form action={updateAction} key={`${selected.id}:${updateState.savedAt ?? ""}`} className="grid gap-4">
              <input type="hidden" name="id" value={selected.id} />
              <label className="text-xs font-medium text-muted">
                Resident
                <select
                  value={selected.id}
                  onChange={(event) => setResidentId(event.target.value)}
                  className={`${fieldClass} h-10`}
                >
                  {residents.map((resident) => (
                    <option key={resident.id} value={resident.id}>
                      {resident.name}
                      {resident.staying ? "" : " (moved out)"}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-medium text-muted">
                Name
                <input
                  name="name"
                  required
                  minLength={2}
                  maxLength={80}
                  defaultValue={selected.name}
                  className={`${fieldClass} h-10`}
                />
              </label>
              <label className="text-xs font-medium text-muted">
                Phone
                <input
                  name="phone"
                  required
                  inputMode="numeric"
                  defaultValue={selected.phone}
                  className={`${fieldClass} h-10`}
                />
              </label>
              <label className="text-xs font-medium text-muted">
                Bed
                <select name="bedId" required className={`${fieldClass} h-10`} defaultValue={bedValue}>
                  {bedOptions.map((bed) => (
                    <option key={bed.id} value={bed.id}>
                      {bed.label}
                    </option>
                  ))}
                </select>
              </label>
              <Button type="submit" disabled={updatePending || bedOptions.length === 0}>
                {updatePending ? "Saving…" : "Save resident"}
              </Button>
            </form>
          </>
        ) : (
          <p className="text-sm text-muted">No residents are in this session.</p>
        )}
      </FormCard>
      <FormCard
        title="Record a move-out"
        description="The bed becomes vacant. Past complaints stay on the resident's history."
      >
        <FormBanner error={moveState.error} message={moveState.message} />
        {staying.length === 0 ? (
          <p className="text-sm text-muted">No one is currently staying.</p>
        ) : (
          <form action={moveAction} className="grid gap-4">
            <label className="text-xs font-medium text-muted">
              Resident
              <select
                name="id"
                value={staying.some((resident) => resident.id === moveId) ? moveId : staying[0].id}
                onChange={(event) => setMoveId(event.target.value)}
                className={`${fieldClass} h-10`}
              >
                {staying.map((resident) => (
                  <option key={resident.id} value={resident.id}>
                    {resident.name} · Room {resident.roomNumber}, bed {resident.bedLabel}
                  </option>
                ))}
              </select>
            </label>
            <Button type="submit" variant="secondary" disabled={movePending}>
              {movePending ? "Saving…" : "Move out"}
            </Button>
          </form>
        )}
      </FormCard>
    </div>
  );
}
