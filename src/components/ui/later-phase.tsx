import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";

export function LaterPhase({
  title,
  description,
  phase,
}: {
  title: string;
  description: string;
  phase: string;
}) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        title={title}
        description={description}
        status={<StatusBadge label={phase} />}
      />
      <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <p className="text-sm leading-6 text-muted">
          This area is on the StayOps roadmap. It is not part of the current prototype, so
          there is nothing to save or submit here.
        </p>
      </section>
    </div>
  );
}
