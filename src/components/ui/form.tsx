"use client";

import { useState, type ReactNode } from "react";

export const fieldClass =
  "mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function FormCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function FormBanner({
  error,
  message,
  className = "",
  revision = null,
}: {
  error: string | null;
  message: string | null;
  className?: string;
  revision?: string | null;
}) {
  const notice = error ?? message;
  const token = notice ? `${revision ?? ""}:${error ? "error" : "info"}:${notice}` : "";
  const [dismissed, setDismissed] = useState<string | null>(null);

  if (!notice || dismissed === token) {
    return null;
  }

  const tone = error ? "bg-danger-soft text-danger" : "bg-info-soft text-info";

  return (
    <div
      className={`mb-4 flex items-start justify-between gap-3 rounded-lg px-3 py-2 text-sm ${tone} ${className}`}
      role={error ? "alert" : "status"}
    >
      <p>{notice}</p>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => setDismissed(token)}
        className="-mr-1 shrink-0 rounded-md px-1.5 text-lg leading-none hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        ×
      </button>
    </div>
  );
}
