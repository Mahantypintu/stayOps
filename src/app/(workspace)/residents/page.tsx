import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { SearchableTable } from "@/components/ui/searchable-table";
import { formatSampleDate } from "@/lib/format";
import { listResidents } from "@/services/operations";

export const metadata: Metadata = {
  title: "Residents",
};

export default async function ResidentsPage() {
  const residents = await listResidents();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        title="Residents"
        description="People currently staying in the sample PG, and the bed each person is assigned to."
      />
      <SearchableTable
        label="Search residents"
        columns={["Resident", "Phone", "Property", "Room", "Bed", "Move-in", "Open complaints"]}
        empty="No sample residents match this search."
        searchText={residents.map(
          (resident) =>
            `${resident.name} ${resident.phone} ${resident.propertyName} ${resident.roomNumber}`,
        )}
        rows={residents.map((resident) => [
          resident.name,
          resident.phone,
          resident.propertyName,
          `${resident.floorName}, ${resident.roomNumber}`,
          resident.bedLabel,
          formatSampleDate(resident.moveIn),
          resident.openComplaints,
        ])}
      />
      <p className="text-sm text-muted">
        Adding a resident or recording a move-out is part of the next phase.
      </p>
    </div>
  );
}
