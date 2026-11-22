import type { Metadata } from "next";
import { LaterPhase } from "@/components/ui/later-phase";

export const metadata: Metadata = { title: "Notifications" };

export default function NotificationsPage() {
  return (
    <LaterPhase
      title="Notifications"
      description="In-app alerts for new complaints, assignments, and overdue work."
      phase="Later phase"
    />
  );
}
