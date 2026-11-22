import type { Metadata } from "next";
import Link from "next/link";
import { CategoryChart, ResolutionChart } from "@/components/dashboard/charts";
import { PageHeader } from "@/components/ui/page-header";
import { StatGroup } from "@/components/ui/stat-group";
import { formatSampleDateTime } from "@/lib/format";
import { getDashboard } from "@/services/operations";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const dashboard = await getDashboard();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Occupancy and complaint workload for the sample PG properties."
      />
      <StatGroup
        title="Occupancy"
        items={[
          { label: "Properties", value: dashboard.occupancy.properties },
          { label: "Rooms", value: dashboard.occupancy.rooms },
          { label: "Beds", value: dashboard.occupancy.beds },
          { label: "Occupied beds", value: dashboard.occupancy.occupied },
          { label: "Available beds", value: dashboard.occupancy.available },
          { label: "Active residents", value: dashboard.occupancy.residents },
        ]}
      />
      <StatGroup
        title="Complaints"
        note="Overdue items are also included in the status counts."
        items={[
          { label: "New", value: dashboard.complaints.new },
          { label: "Pending", value: dashboard.complaints.pending },
          { label: "In progress", value: dashboard.complaints.inProgress },
          { label: "Overdue", value: dashboard.complaints.overdue, emphasis: true },
          { label: "Resolved", value: dashboard.complaints.resolved },
        ]}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <CategoryChart items={dashboard.categories} />
        <ResolutionChart items={dashboard.resolutionTrend} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ActivityList title="Recent complaint activity" items={dashboard.recentComplaints} />
        <ActivityList title="Recent staff activity" items={dashboard.recentStaffActivity} />
      </div>
    </div>
  );
}

function ActivityList({
  title,
  items,
}: {
  title: string;
  items: { id: string; complaintId: string; at: string; actor: string; summary: string }[];
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <ul className="mt-4 flex flex-col gap-4">
        {items.map((item) => (
          <li key={item.id}>
            <Link href={`/complaints/${item.complaintId}`} className="text-sm font-medium text-accent hover:underline">
              {item.complaintId}
            </Link>
            <p className="mt-1 text-sm text-foreground">{item.summary}</p>
            <p className="mt-1 text-xs text-muted">
              {item.actor} · {formatSampleDateTime(item.at)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
