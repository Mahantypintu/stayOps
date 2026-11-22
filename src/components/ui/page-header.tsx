import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  status,
}: {
  title: string;
  description: string;
  status?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted sm:text-base">{description}</p>
      </div>
      {status ? <div className="shrink-0">{status}</div> : null}
    </div>
  );
}
