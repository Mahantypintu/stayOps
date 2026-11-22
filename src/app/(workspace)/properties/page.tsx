import type { Metadata } from "next";
import { PropertyForms } from "@/components/properties/property-forms";
import { PropertyRecords } from "@/components/properties/property-records";
import { PageHeader } from "@/components/ui/page-header";
import { listProperties } from "@/services/operations";

export const metadata: Metadata = {
  title: "Properties",
};

export default async function PropertiesPage() {
  const properties = await listProperties();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        title="Properties"
        description="PG properties in this session, with beds counted from the room records."
      />
      <PropertyForms />
      <PropertyRecords properties={properties} />
    </div>
  );
}
