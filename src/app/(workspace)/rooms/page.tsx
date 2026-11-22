import type { Metadata } from "next";
import { RoomForms } from "@/components/properties/room-forms";
import { PageHeader } from "@/components/ui/page-header";
import { SearchableTable } from "@/components/ui/searchable-table";
import { listFloors, listProperties, listRooms } from "@/services/operations";

export const metadata: Metadata = {
  title: "Floors and rooms",
};

export default async function RoomsPage() {
  const [properties, floors, rooms] = await Promise.all([listProperties(), listFloors(), listRooms()]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        title="Floors and rooms"
        description="Add floors and rooms for the properties in this session. Bed counts come from the beds created with each room."
      />
      <RoomForms properties={properties} floors={floors} rooms={rooms} />
      <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
        <h2 className="text-sm font-semibold text-foreground">Floors</h2>
        {floors.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No floors yet.</p>
        ) : (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {floors.map((floor) => (
              <li key={floor.id} className="rounded-xl bg-surface-muted px-4 py-3 text-sm text-foreground">
                {floor.name}
                <span className="mt-1 block text-muted">{floor.propertyName}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <SearchableTable
        label="Search rooms"
        columns={["Room", "Property", "Floor", "Beds", "Occupied", "Available"]}
        empty="No rooms match this search."
        searchText={rooms.map((room) => `${room.number} ${room.propertyName} ${room.floorName}`)}
        rows={rooms.map((room) => [
          room.number,
          room.propertyName,
          room.floorName,
          room.beds,
          room.occupied,
          room.available,
        ])}
      />
    </div>
  );
}
