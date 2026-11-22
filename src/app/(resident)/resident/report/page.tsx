import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReportForm } from "@/components/complaints/report-form";
import { PageHeader } from "@/components/ui/page-header";
import { sampleResidentId } from "@/data/sample-clock";
import { getResidentStay } from "@/services/operations";

export const metadata: Metadata = { title: "Report an issue" };

export default async function ReportPage() {
  const stay = await getResidentStay(sampleResidentId);
  if (!stay) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <PageHeader
        title="Report an issue"
        description={
          stay.staying
            ? `File a maintenance request for ${stay.propertyName}, ${stay.locationLabel}.`
            : `${stay.name} is moved out, so this form cannot file a new complaint.`
        }
      />
      <ReportForm propertyName={stay.propertyName} locationLabel={stay.locationLabel} staying={stay.staying} />
    </div>
  );
}
