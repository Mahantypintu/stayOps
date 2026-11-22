import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComplaintRecordView } from "@/components/complaints/complaint-record";
import { getComplaint } from "@/services/operations";

export const metadata: Metadata = {
  title: "Complaint details",
};

export default async function ComplaintDetailsPage({
  params,
}: {
  params: Promise<{ complaintId: string }>;
}) {
  const { complaintId } = await params;
  const complaint = await getComplaint(complaintId);
  if (!complaint) {
    notFound();
  }

  return (
    <ComplaintRecordView
      complaint={complaint}
      backHref="/complaints"
      backLabel="Back to complaints"
    />
  );
}
