"use client";

import { useActionState, useState } from "react";
import { PropertyFieldSet } from "@/components/properties/property-fields";
import { Button } from "@/components/ui/button";
import { fieldClass, FormBanner } from "@/components/ui/form";
import { emptyActionState } from "@/lib/action-state";
import { updatePropertyAction } from "@/services/actions";
import type { PropertySummary } from "@/services/operations";

export function PropertyRecords({ properties }: { properties: PropertySummary[] }) {
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const needle = query.trim().toLowerCase();
  const visible = properties.filter((property) =>
    needle ? `${property.name} ${property.address} ${property.city}`.toLowerCase().includes(needle) : true,
  );

  return (
    <div className="flex flex-col gap-4">
      <label className="max-w-sm text-xs font-medium text-muted">
        Search properties
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className={`${fieldClass} h-10`}
        />
      </label>
      <p className="text-sm text-muted">
        {visible.length} of {properties.length} records
      </p>
      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
          {properties.length === 0 ? "No properties yet." : "No properties match this search."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-surface-muted text-xs uppercase tracking-wide text-muted">
              <tr>
                {["Property", "Address", "Floors", "Rooms", "Beds", "Occupied", "Available", ""].map((column) => (
                  <th key={column || "edit"} scope="col" className="px-3 py-3 font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {visible.map((property) => (
                <PropertyRecordRow
                  key={property.id}
                  property={property}
                  editing={editingId === property.id}
                  onEdit={() => setEditingId(property.id)}
                  onClose={() => setEditingId(null)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PropertyRecordRow({
  property,
  editing,
  onEdit,
  onClose,
}: {
  property: PropertySummary;
  editing: boolean;
  onEdit: () => void;
  onClose: () => void;
}) {
  const [state, action, pending] = useActionState(updatePropertyAction, emptyActionState);

  return (
    <>
      <tr>
        <td className="px-3 py-3">{property.name}</td>
        <td className="px-3 py-3">
          {property.address}, {property.city}
        </td>
        <td className="px-3 py-3">{property.floors}</td>
        <td className="px-3 py-3">{property.rooms}</td>
        <td className="px-3 py-3">{property.beds}</td>
        <td className="px-3 py-3">{property.occupied}</td>
        <td className="px-3 py-3">{property.available}</td>
        <td className="px-3 py-3 text-right">
          <Button type="button" variant="secondary" onClick={editing ? onClose : onEdit}>
            {editing ? "Close" : "Edit"}
          </Button>
        </td>
      </tr>
      {editing ? (
        <tr>
          <td colSpan={8} className="bg-surface-muted px-3 py-4">
            <form action={action} className="grid gap-4 sm:grid-cols-3">
              <FormBanner
                error={state.error}
                message={state.message}
                revision={state.revision}
                className="sm:col-span-3"
              />
              <input type="hidden" name="id" value={property.id} />
              <PropertyFieldSet key={state.savedAt ?? property.id} initial={property} />
              <div className="sm:col-span-3">
                <Button type="submit" disabled={pending}>
                  {pending ? "Saving…" : "Save property"}
                </Button>
              </div>
            </form>
          </td>
        </tr>
      ) : null}
    </>
  );
}
