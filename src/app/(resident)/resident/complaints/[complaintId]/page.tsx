import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComplaintRecordView } from "@/components/complaints/complaint-record";
import { getComplaint, getPrototypeResident } from "@/services/operations";

export const metadata: Metadata = { title: "Complaint" };

export default async function ResidentComplaintPage({
  params,
}: {
  params: Promise<{ complaintId: string }>;
}) {
  const { complaintId } = await params;
  const [complaint, stay] = await Promise.all([getComplaint(complaintId), getPrototypeResident()]);
  if (!complaint || !stay || complaint.residentId !== stay.id) {
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
