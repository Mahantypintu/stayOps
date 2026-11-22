"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { fieldClass, FormBanner } from "@/components/ui/form";
import { emptyActionState } from "@/lib/action-state";
import { renameRoomAction } from "@/services/actions";
import type { RoomSummary } from "@/services/operations";

export function RoomRecords({ rooms }: { rooms: RoomSummary[] }) {
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const needle = query.trim().toLowerCase();
  const visible = rooms.filter((room) =>
    needle ? `${room.number} ${room.propertyName} ${room.floorName}`.toLowerCase().includes(needle) : true,
  );

  return (
    <div className="flex flex-col gap-4">
      <label className="max-w-sm text-xs font-medium text-muted">
        Search rooms
        <input value={query} onChange={(event) => setQuery(event.target.value)} className={`${fieldClass} h-10`} />
      </label>
      <p className="text-sm text-muted">
        {visible.length} of {rooms.length} records
      </p>
      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
          {rooms.length === 0 ? "No rooms yet." : "No rooms match this search."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-surface-muted text-xs uppercase tracking-wide text-muted">
              <tr>
                {["Room", "Property", "Floor", "Beds", "Occupied", "Available", ""].map((column) => (
                  <th key={column || "edit"} scope="col" className="px-3 py-3 font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {visible.map((room) => (
                <RoomRecordRow
                  key={room.id}
                  room={room}
                  editing={editingId === room.id}
                  onEdit={() => setEditingId(room.id)}
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

function RoomNumberForm({ room }: { room: RoomSummary }) {
  const [state, action, pending] = useActionState(renameRoomAction, emptyActionState);
  const [number, setNumber] = useState(room.number);

  return (
    <form action={action} className="grid max-w-sm gap-4">
      <FormBanner error={state.error} message={state.message} revision={state.revision} />
      <input type="hidden" name="id" value={room.id} />
      <label className="text-xs font-medium text-muted">
        Room number
        <input
          name="number"
          required
          maxLength={12}
          value={number}
          onChange={(event) => setNumber(event.target.value)}
          className={`${fieldClass} h-10`}
        />
      </label>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save room"}
      </Button>
    </form>
  );
}

function RoomRecordRow({
  room,
  editing,
  onEdit,
  onClose,
}: {
  room: RoomSummary;
  editing: boolean;
  onEdit: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <tr>
        <td className="px-3 py-3">{room.number}</td>
        <td className="px-3 py-3">{room.propertyName}</td>
        <td className="px-3 py-3">{room.floorName}</td>
        <td className="px-3 py-3">{room.beds}</td>
        <td className="px-3 py-3">{room.occupied}</td>
        <td className="px-3 py-3">{room.available}</td>
        <td className="px-3 py-3 text-right">
          <Button type="button" variant="secondary" onClick={editing ? onClose : onEdit}>
            {editing ? "Close" : "Edit"}
          </Button>
        </td>
      </tr>
      {editing ? (
        <tr>
          <td colSpan={7} className="bg-surface-muted px-3 py-4">
            <RoomNumberForm room={room} />
          </td>
        </tr>
      ) : null}
    </>
  );
}
