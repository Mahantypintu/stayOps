import type { Metadata } from "next";
import { LaterPhase } from "@/components/ui/later-phase";

export const metadata: Metadata = { title: "Maintenance expenses" };

export default function ExpensesPage() {
  return (
    <LaterPhase
      title="Maintenance expenses"
      description="Repair costs, spare parts, and vendor records."
      phase="Later phase"
    />
  );
}
