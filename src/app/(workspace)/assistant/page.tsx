import type { Metadata } from "next";
import { LaterPhase } from "@/components/ui/later-phase";

export const metadata: Metadata = { title: "AI operations assistant" };

export default function AssistantPage() {
  return (
    <LaterPhase
      title="AI operations assistant"
      description="Complaint classification and questions about operational records. Gemini is not connected, and this screen does not answer questions."
      phase="Later phase"
    />
  );
}
