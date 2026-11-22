import type { Metadata } from "next";
import { StaffForm } from "@/components/properties/staff-form";
import { PageHeader } from "@/components/ui/page-header";
import { SearchableTable } from "@/components/ui/searchable-table";
import { listStaff } from "@/services/operations";

export const metadata: Metadata = {
  title: "Staff and assignments",
};

export default async function StaffPage() {
  const people = await listStaff();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        title="Staff and assignments"
        description="Maintenance staff in this session, and how many open complaints each person is assigned."
      />
      <StaffForm />
      <SearchableTable
        label="Search staff"
        columns={["Staff", "Phone", "Skills", "Open assignments"]}
        empty="No staff match this search."
        searchText={people.map((person) => `${person.name} ${person.skills} ${person.phone}`)}
        rows={people.map((person) => [
          person.name,
          person.phone,
          person.skills,
          person.openAssignments,
        ])}
      />
    </div>
  );
}
