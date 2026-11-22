export function StatGroup({
  title,
  note,
  items,
}: {
  title: string;
  note?: string;
  items: { label: string; value: number; emphasis?: boolean }[];
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {note ? <p className="text-xs text-muted">{note}</p> : null}
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl bg-surface-muted px-3 py-3">
            <dt className="text-xs text-muted">{item.label}</dt>
            <dd
              className={`mt-1 text-2xl font-semibold tracking-tight ${
                item.emphasis ? "text-danger" : "text-foreground"
              }`}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
