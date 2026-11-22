import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { SearchableTable } from "@/components/ui/searchable-table";
import { listQrTargets } from "@/services/operations";

export const metadata: Metadata = {
  title: "QR code management",
};

export default async function QrCodesPage() {
  const targets = await listQrTargets();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        title="QR code management"
        description="Rooms and common areas that will each have a complaint code. Scanning is not active yet."
      />
      <SearchableTable
        label="Search codes"
        columns={["Place", "Kind", "Property", "Floor", "Sample code"]}
        empty="No sample codes match this search."
        searchText={targets.map((target) => `${target.label} ${target.kind} ${target.propertyName}`)}
        rows={targets.map((target) => [
          target.label,
          target.kind,
          target.propertyName,
          target.floorName,
          target.id,
        ])}
      />
      <p className="text-sm text-muted">
        Printable QR images and the resident scan flow are part of a later phase. These codes
        do not open a public page.
      </p>
    </div>
  );
}
