import type { Metadata } from "next";
import { ResidentForms } from "@/components/properties/resident-forms";
import { PageHeader } from "@/components/ui/page-header";
import { SearchableTable } from "@/components/ui/searchable-table";
import { todayKey } from "@/lib/session-time";
import { formatSampleDate } from "@/lib/format";
import { listBedAssignments, listResidentChoices, listResidents, listVacantBeds } from "@/services/operations";

export const metadata: Metadata = {
  title: "Residents",
};

export default async function ResidentsPage() {
  const [residents, choices, vacantBeds, beds] = await Promise.all([
    listResidents(),
    listResidentChoices(),
    listVacantBeds(),
    listBedAssignments(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        title="Residents"
        description="People staying in this session, and the bed each person is assigned to."
      />
      <ResidentForms residents={choices} vacantBeds={vacantBeds} beds={beds} today={todayKey()} />
      <SearchableTable
        label="Search residents"
        columns={["Resident", "Phone", "Property", "Room", "Bed", "Move-in", "Open complaints"]}
        empty="No active residents match this search."
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
    </div>
  );
}
