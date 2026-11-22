import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComplaintRecordView } from "@/components/complaints/complaint-record";
import { sampleResidentId } from "@/data/sample-clock";
import { getComplaint } from "@/services/operations";

export const metadata: Metadata = { title: "Complaint" };

export default async function ResidentComplaintPage({
  params,
}: {
  params: Promise<{ complaintId: string }>;
}) {
  const { complaintId } = await params;
  const complaint = await getComplaint(complaintId);
  if (!complaint || complaint.residentId !== sampleResidentId) {
    notFound();
  }

  return (
    <ComplaintRecordView
      complaint={complaint}
      backHref="/resident/complaints"
      backLabel="Back to my complaints"
    >
      <p className="text-sm text-muted">
        Status updates from the property manager appear in the activity list above.
      </p>
    </ComplaintRecordView>
  );
}
