import type { Metadata } from "next";
import { LaterPhase } from "@/components/ui/later-phase";

export const metadata: Metadata = { title: "Assets and equipment" };

export default function AssetsPage() {
  return (
    <LaterPhase
      title="Assets and equipment"
      description="Appliance records and repair history for PG equipment."
      phase="Later phase"
    />
  );
}
