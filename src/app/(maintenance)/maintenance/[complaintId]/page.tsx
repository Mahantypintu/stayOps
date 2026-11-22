import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComplaintRecordView } from "@/components/complaints/complaint-record";
import { sampleStaffId } from "@/data/sample-clock";
import { getComplaint } from "@/services/operations";

export const metadata: Metadata = { title: "Task" };

export default async function MaintenanceTaskPage({
  params,
}: {
  params: Promise<{ complaintId: string }>;
}) {
  const { complaintId } = await params;
  const complaint = await getComplaint(complaintId);
  if (!complaint || complaint.staffId !== sampleStaffId) {
    notFound();
  }

  return (
    <ComplaintRecordView complaint={complaint} backHref="/maintenance" backLabel="Back to my tasks">
      <p className="text-sm text-muted">
        Accepting this task, updating progress, and adding completion photos are the next phase.
      </p>
    </ComplaintRecordView>
  );
}
