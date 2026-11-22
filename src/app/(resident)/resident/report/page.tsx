import type { Metadata } from "next";
import { ReportForm } from "@/components/complaints/report-form";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Report an issue" };

export default function ReportPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <PageHeader
        title="Report an issue"
        description="The resident form for a room that is already known. It does not save a complaint."
      />
      <ReportForm />
    </div>
  );
}
