import type { Metadata } from "next";
import { ComplaintBrowser } from "@/components/complaints/complaint-browser";
import { PageHeader } from "@/components/ui/page-header";
import { sampleAsOf, sampleResidentId } from "@/data/sample-clock";
import { listComplaintsForResident } from "@/services/operations";

export const metadata: Metadata = { title: "My complaints" };

export default async function ResidentComplaintsPage() {
  const complaints = await listComplaintsForResident(sampleResidentId);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        title="My complaints"
        description="Maintenance requests recorded for the sample resident Meera Iyer."
      />
      <ComplaintBrowser
        complaints={complaints}
        asOf={sampleAsOf}
        hrefBase="/resident/complaints"
      />
    </div>
  );
}
