import type { Metadata } from "next";
import { ReportForm } from "@/components/complaints/report-form";
import { PageHeader } from "@/components/ui/page-header";
import { getPrototypeResident } from "@/services/operations";

export const metadata: Metadata = { title: "Report an issue" };

export default async function ReportPage() {
  const stay = await getPrototypeResident();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <PageHeader
        title="Report an issue"
        description={
          stay
            ? stay.staying
              ? `File a maintenance request for ${stay.propertyName}, ${stay.locationLabel}.`
              : `${stay.name} is moved out, so this form cannot file a new complaint.`
            : "Add a property, a room, and a resident as the property manager. This form then files for the first resident you add."
        }
      />
      {stay ? (
        <ReportForm propertyName={stay.propertyName} locationLabel={stay.locationLabel} staying={stay.staying} />
      ) : (
        <p className="rounded-2xl border border-border bg-surface p-5 text-sm text-muted shadow-card">
          There is no resident in this session yet.
        </p>
      )}
    </div>
  );
}
