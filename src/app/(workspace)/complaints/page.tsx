import type { Metadata } from "next";
import { ManagerComplaintForm } from "@/components/complaints/manager-complaint-form";
import { ComplaintBrowser } from "@/components/complaints/complaint-browser";
import { PageHeader } from "@/components/ui/page-header";
import { sampleAsOf } from "@/data/sample-clock";
import { listComplaints, listResidents } from "@/services/operations";

export const metadata: Metadata = {
  title: "Complaints and maintenance",
};

export default async function ComplaintsPage() {
  const [complaints, residents] = await Promise.all([listComplaints(), listResidents()]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        title="Complaints and maintenance"
        description="Maintenance requests in this session. Filters apply to the records below, including ones added since the sample set."
      />
      <ManagerComplaintForm residents={residents} />
      <ComplaintBrowser complaints={complaints} asOf={sampleAsOf} />
    </div>
  );
}
