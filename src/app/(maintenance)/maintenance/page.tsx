import type { Metadata } from "next";
import { ComplaintBrowser } from "@/components/complaints/complaint-browser";
import { PageHeader } from "@/components/ui/page-header";
import { prototypePeople, sampleAsOf, sampleStaffId } from "@/data/sample-clock";
import { listComplaintsForStaff } from "@/services/operations";

export const metadata: Metadata = { title: "My tasks" };

export default async function MaintenanceHomePage() {
  const complaints = await listComplaintsForStaff(sampleStaffId);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        title="My tasks"
        description={`Complaints assigned to ${prototypePeople.staff.name}. A manager assignment shows up here. Accepting work and posting completion notes is the next phase.`}
      />
      <ComplaintBrowser complaints={complaints} asOf={sampleAsOf} hrefBase="/maintenance" />
    </div>
  );
}
