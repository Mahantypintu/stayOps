import { brand } from "@/lib/brand";

export function BrandMark() {
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 3.2 3.6 10v9.3c0 .6.5 1.1 1.1 1.1h5.1v-6.1h4.4V20.4h5.1c.6 0 1.1-.5 1.1-1.1V10L12 3.2Z"
        />
      </svg>
    </span>
  );
}

export function BrandLockup({ tone = "inverse" }: { tone?: "inverse" | "default" }) {
  const title = tone === "inverse" ? "text-white" : "text-foreground";
  const subtitle = tone === "inverse" ? "text-sidebar-muted" : "text-muted";

  return (
    <div className="flex min-w-0 items-center gap-3">
      <BrandMark />
      <span className="min-w-0">
        <span className={`block truncate text-sm font-semibold tracking-tight ${title}`}>
          {brand.name}
        </span>
        <span className={`block truncate text-xs ${subtitle}`}>{brand.tagline}</span>
      </span>
    </div>
  );
}
