import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { SearchableTable } from "@/components/ui/searchable-table";
import { listRooms } from "@/services/operations";

export const metadata: Metadata = {
  title: "Floors and rooms",
};

export default async function RoomsPage() {
  const rooms = await listRooms();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        title="Floors and rooms"
        description="Rooms and bed capacity for each floor in the sample properties."
      />
      <SearchableTable
        label="Search rooms"
        columns={["Room", "Property", "Floor", "Beds", "Occupied", "Available"]}
        empty="No sample rooms match this search."
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
      <p className="text-sm text-muted">Changing floors, rooms, or bed counts is part of the next phase.</p>
    </div>
  );
}
