import type { Metadata } from "next";
import { ComplaintBrowser } from "@/components/complaints/complaint-browser";
import { PageHeader } from "@/components/ui/page-header";
import { sampleAsOf } from "@/data/sample-clock";
import { getPrototypeResident, listComplaintsForResident } from "@/services/operations";

export const metadata: Metadata = { title: "My complaints" };

export default async function ResidentComplaintsPage() {
  const stay = await getPrototypeResident();
  const complaints = stay ? await listComplaintsForResident(stay.id) : [];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        title="My complaints"
        description={
          stay
            ? `Open and resolved requests for ${stay.name}.`
            : "Add a resident as the property manager before complaints can be filed here."
        }
      />
      <ComplaintBrowser complaints={complaints} asOf={sampleAsOf} hrefBase="/resident/complaints" />
    </div>
  );
}
