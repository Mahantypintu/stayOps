import type { Metadata } from "next";
import { ComplaintBrowser } from "@/components/complaints/complaint-browser";
import { PageHeader } from "@/components/ui/page-header";
import { sampleAsOf } from "@/data/sample-clock";
import { listComplaints } from "@/services/operations";

export const metadata: Metadata = {
  title: "Complaints and maintenance",
};

export default async function ComplaintsPage() {
  const complaints = await listComplaints();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        title="Complaints and maintenance"
        description="Sample maintenance requests. Filters apply to these records only."
      />
      <ComplaintBrowser complaints={complaints} asOf={sampleAsOf} />
    </div>
  );
}
