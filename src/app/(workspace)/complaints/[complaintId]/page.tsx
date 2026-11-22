import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComplaintRecordView } from "@/components/complaints/complaint-record";
import { ComplaintStatusForm } from "@/components/complaints/status-form";
import { getComplaint, listStaff } from "@/services/operations";

export const metadata: Metadata = {
  title: "Complaint details",
};

export default async function ComplaintDetailsPage({
  params,
}: {
  params: Promise<{ complaintId: string }>;
}) {
  const { complaintId } = await params;
  const [complaint, staff] = await Promise.all([getComplaint(complaintId), listStaff()]);
  if (!complaint) {
    notFound();
  }

  return (
    <ComplaintRecordView complaint={complaint} backHref="/complaints" backLabel="Back to complaints">
      <ComplaintStatusForm
        complaintId={complaint.id}
        status={complaint.status}
        staffId={complaint.staffId}
        expectedResolution={complaint.expectedResolution}
        staff={staff.map((person) => ({ id: person.id, name: person.name }))}
      />
    </ComplaintRecordView>
  );
}
