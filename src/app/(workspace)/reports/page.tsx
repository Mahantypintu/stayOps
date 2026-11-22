import type { Metadata } from "next";
import { LaterPhase } from "@/components/ui/later-phase";

export const metadata: Metadata = { title: "Reports and analytics" };

export default function ReportsPage() {
  return (
    <LaterPhase
      title="Reports and analytics"
      description="Monthly operational summaries beyond the dashboard snapshot."
      phase="Later phase"
    />
  );
}
