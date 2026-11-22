const monthLabels: Record<string, string> = {
  "2026-06": "Jun",
  "2026-07": "Jul",
  "2026-08": "Aug",
  "2026-09": "Sep",
  "2026-10": "Oct",
  "2026-11": "Nov",
};

export function CategoryChart({
  items,
}: {
  items: { category: string; count: number }[];
}) {
  const max = Math.max(...items.map((item) => item.count), 1);

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <h2 className="text-sm font-semibold text-foreground">Complaints by category</h2>
      <p className="mt-1 text-xs text-muted">All complaints in this session, including resolved ones.</p>
      <ul className="mt-4 flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.category}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-foreground">{item.category}</span>
              <span className="text-muted">{item.count}</span>
            </div>
            <div className="h-2 rounded-full bg-surface-muted">
              <div
                className="h-2 rounded-full bg-accent"
                style={{ width: `${(item.count / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ResolutionChart({
  items,
}: {
  items: { month: string; resolved: number }[];
}) {
  const max = Math.max(...items.map((item) => item.resolved), 1);

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <h2 className="text-sm font-semibold text-foreground">Complaints resolved</h2>
      <p className="mt-1 text-xs text-muted">Sample months from June to November 2026.</p>
      <div className="mt-6 flex h-40 items-end gap-3">
        {items.map((item) => (
          <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-xs font-medium text-foreground">{item.resolved}</span>
            <div className="flex h-28 w-full items-end">
              <div
                className="w-full rounded-t-md bg-accent"
                style={{ height: `${Math.max((item.resolved / max) * 100, 8)}%` }}
              />
            </div>
            <span className="text-xs text-muted">{monthLabels[item.month] ?? item.month}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
