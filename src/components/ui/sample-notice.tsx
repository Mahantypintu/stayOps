import { formatSampleDateTime } from "@/lib/format";

export function SampleNotice({ asOf }: { asOf: string }) {
  return (
    <p className="border-b border-border bg-info-soft px-4 py-2 text-xs leading-5 text-info sm:px-6">
      Overdue counts use {formatSampleDateTime(asOf)}. Saves stay in this running session and
      clear when the server restarts. The role menu is a prototype switch, not sign-in.
    </p>
  );
}
