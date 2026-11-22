"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { fieldClass, FormBanner, FormCard } from "@/components/ui/form";
import { emptyActionState } from "@/lib/action-state";
import { createPropertyAction, updatePropertyAction } from "@/services/actions";

type PropertyFields = {
  id: string;
  name: string;
  address: string;
  city: string;
};

function PropertyFieldSet({
  initial,
}: {
  initial?: { name: string; address: string; city: string };
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [city, setCity] = useState(initial?.city ?? "");

  return (
    <>
      <label className="text-xs font-medium text-muted">
        Name
        <input
          name="name"
          required
          minLength={2}
          maxLength={80}
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={`${fieldClass} h-10`}
        />
      </label>
      <label className="text-xs font-medium text-muted">
        Address
        <input
          name="address"
          required
          minLength={3}
          maxLength={120}
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          className={`${fieldClass} h-10`}
        />
      </label>
      <label className="text-xs font-medium text-muted">
        City
        <input
          name="city"
          required
          minLength={2}
          maxLength={60}
          value={city}
          onChange={(event) => setCity(event.target.value)}
          className={`${fieldClass} h-10`}
        />
      </label>
    </>
  );
}

export function PropertyForms({ properties }: { properties: PropertyFields[] }) {
  const [createState, createAction, createPending] = useActionState(createPropertyAction, emptyActionState);
  const [editState, editAction, editPending] = useActionState(updatePropertyAction, emptyActionState);
  const [selectedId, setSelectedId] = useState(properties[0]?.id ?? "");
  const selected = properties.find((property) => property.id === selectedId) ?? properties[0];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <FormCard
        title="Add a property"
        description="Saved in this running session only. Restarting the server restores the sample properties."
      >
        <FormBanner error={createState.error} message={createState.message} />
        <form action={createAction} key={createState.savedAt ?? "new-property"} className="grid gap-4">
          <PropertyFieldSet />
          <Button type="submit" disabled={createPending}>
            {createPending ? "Saving…" : "Add property"}
          </Button>
        </form>
      </FormCard>
      <FormCard
        title="Edit a property"
        description="Name and address changes show on rooms, residents, and complaints that already use this property."
      >
        {selected ? (
          <>
            <FormBanner error={editState.error} message={editState.message} />
            <form action={editAction} key={`${selected.id}:${editState.savedAt ?? ""}`} className="grid gap-4">
              <input type="hidden" name="id" value={selected.id} />
              <label className="text-xs font-medium text-muted">
                Property
                <select
                  value={selected.id}
                  onChange={(event) => setSelectedId(event.target.value)}
                  className={`${fieldClass} h-10`}
                >
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.name}
                    </option>
                  ))}
                </select>
              </label>
              <PropertyFieldSet
                key={`${selected.id}:${editState.savedAt ?? ""}`}
                initial={selected}
              />
              <Button type="submit" disabled={editPending}>
                {editPending ? "Saving…" : "Save property"}
              </Button>
            </form>
          </>
        ) : (
          <p className="text-sm text-muted">Add a property before editing one.</p>
        )}
      </FormCard>
    </div>
  );
}
