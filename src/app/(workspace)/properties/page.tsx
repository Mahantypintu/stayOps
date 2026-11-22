import type { Metadata } from "next";
import { PropertyForms } from "@/components/properties/property-forms";
import { PageHeader } from "@/components/ui/page-header";
import { SearchableTable } from "@/components/ui/searchable-table";
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
      <PropertyForms properties={properties} />
      <SearchableTable
        label="Search properties"
        columns={["Property", "Address", "Floors", "Rooms", "Beds", "Occupied", "Available"]}
        empty="No properties match this search."
        searchText={properties.map((property) => `${property.name} ${property.address} ${property.city}`)}
        rows={properties.map((property) => [
          property.name,
          `${property.address}, ${property.city}`,
          property.floors,
          property.rooms,
          property.beds,
          property.occupied,
          property.available,
        ])}
      />
    </div>
  );
}
