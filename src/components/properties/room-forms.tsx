"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { fieldClass, FormBanner, FormCard } from "@/components/ui/form";
import { emptyActionState } from "@/lib/action-state";
import { createFloorAction, createRoomAction, renameRoomAction } from "@/services/actions";
import type { FloorSummary, PropertySummary, RoomSummary } from "@/services/operations";

const bedCounts = ["1", "2", "3", "4", "5", "6"];

export function RoomForms({
  properties,
  floors,
  rooms,
}: {
  properties: PropertySummary[];
  floors: FloorSummary[];
  rooms: RoomSummary[];
}) {
  const [floorState, floorAction, floorPending] = useActionState(createFloorAction, emptyActionState);
  const [roomState, roomAction, roomPending] = useActionState(createRoomAction, emptyActionState);
  const [renameState, renameAction, renamePending] = useActionState(renameRoomAction, emptyActionState);
  const [propertyId, setPropertyId] = useState(properties[0]?.id ?? "");
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? "");
  const propertyFloors = floors.filter((floor) => floor.propertyId === propertyId);
  const selectedRoom = rooms.find((room) => room.id === roomId) ?? rooms[0];

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <FormCard
        title="Add a floor"
        description="Floors stay in this session. A floor with no rooms still appears in the list below."
      >
        <FormBanner error={floorState.error} message={floorState.message} />
        <form action={floorAction} key={floorState.savedAt ?? "new-floor"} className="grid gap-4">
          <label className="text-xs font-medium text-muted">
            Property
            <select name="propertyId" required className={`${fieldClass} h-10`} defaultValue={properties[0]?.id}>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-medium text-muted">
            Floor name
            <input name="name" required minLength={2} maxLength={40} className={`${fieldClass} h-10`} />
          </label>
          <Button type="submit" disabled={floorPending || properties.length === 0}>
            {floorPending ? "Saving…" : "Add floor"}
          </Button>
        </form>
      </FormCard>
      <FormCard
        title="Add a room"
        description="Beds are labeled A onward. New rooms do not get a QR code in this phase."
      >
        <FormBanner error={roomState.error} message={roomState.message} />
        <form action={roomAction} key={roomState.savedAt ?? "new-room"} className="grid gap-4">
          <label className="text-xs font-medium text-muted">
            Property
            <select
              name="propertyId"
              required
              value={propertyId}
              onChange={(event) => setPropertyId(event.target.value)}
              className={`${fieldClass} h-10`}
            >
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-medium text-muted">
            Floor
            <select
              key={propertyId}
              name="floorId"
              required
              className={`${fieldClass} h-10`}
              defaultValue={propertyFloors[0]?.id}
            >
              {propertyFloors.map((floor) => (
                <option key={floor.id} value={floor.id}>
                  {floor.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-medium text-muted">
            Room number
            <input name="number" required maxLength={12} className={`${fieldClass} h-10`} />
          </label>
          <label className="text-xs font-medium text-muted">
            Beds
            <select name="bedCount" defaultValue="2" className={`${fieldClass} h-10`}>
              {bedCounts.map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </label>
          {propertyFloors.length === 0 ? (
            <p className="text-sm text-muted">Add a floor for this property before adding a room.</p>
          ) : null}
          <Button type="submit" disabled={roomPending || propertyFloors.length === 0}>
            {roomPending ? "Saving…" : "Add room"}
          </Button>
        </form>
      </FormCard>
      <FormCard
        title="Rename a room"
        description="Complaint locations that use this room pick up the new number."
      >
        {selectedRoom ? (
          <>
            <FormBanner error={renameState.error} message={renameState.message} />
            <form
              action={renameAction}
              key={`${selectedRoom.id}:${renameState.savedAt ?? ""}`}
              className="grid gap-4"
            >
              <input type="hidden" name="id" value={selectedRoom.id} />
              <label className="text-xs font-medium text-muted">
                Room
                <select
                  value={selectedRoom.id}
                  onChange={(event) => setRoomId(event.target.value)}
                  className={`${fieldClass} h-10`}
                >
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.number} · {room.propertyName}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-medium text-muted">
                New room number
                <input
                  name="number"
                  required
                  maxLength={12}
                  defaultValue={selectedRoom.number}
                  className={`${fieldClass} h-10`}
                />
              </label>
              <Button type="submit" disabled={renamePending}>
                {renamePending ? "Saving…" : "Save room number"}
              </Button>
            </form>
          </>
        ) : (
          <p className="text-sm text-muted">Add a room before renaming one.</p>
        )}
      </FormCard>
    </div>
  );
}
