import type { ReactNode } from "react";

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
}: {
  error: string | null;
  message: string | null;
  className?: string;
}) {
  if (error) {
    return (
      <p className={`mb-4 rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger ${className}`} role="alert">
        {error}
      </p>
    );
  }
  if (message) {
    return (
      <p className={`mb-4 rounded-lg bg-info-soft px-3 py-2 text-sm text-info ${className}`}>{message}</p>
    );
  }
  return null;
}
