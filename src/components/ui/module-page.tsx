import type { ReactNode } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";

export function ModulePage({
  title,
  description,
  points,
  children,
}: {
  title: string;
  description: string;
  points: string[];
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        title={title}
        description={description}
        status={<StatusBadge label="In preparation" tone="info" />}
      />
      <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <h2 className="text-sm font-semibold text-foreground">This section will cover</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {points.map((point) => (
            <li
              key={point}
              className="flex gap-3 rounded-xl bg-surface-muted px-4 py-3 text-sm leading-6 text-foreground"
            >
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        {children}
      </section>
    </div>
  );
}
