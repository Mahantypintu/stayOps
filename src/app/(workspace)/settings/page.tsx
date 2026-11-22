import type { Metadata } from "next";
import { RestoreSampleForm } from "@/components/settings/restore-sample-form";
import { PageHeader } from "@/components/ui/page-header";
import { brand } from "@/lib/brand";
import { getWorkspace } from "@/services/workspace";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const workspace = await getWorkspace();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Workspace details for this prototype. Sign-in and account settings are not included."
      />
      <dl className="rounded-2xl border border-border bg-surface p-5 shadow-card">
        <div>
          <dt className="text-xs font-medium text-muted">Workspace</dt>
          <dd className="mt-1 text-sm text-foreground">{workspace.organizationName}</dd>
        </div>
        <div className="mt-4">
          <dt className="text-xs font-medium text-muted">Product</dt>
          <dd className="mt-1 text-sm text-foreground">{brand.description}</dd>
        </div>
      </dl>
      <RestoreSampleForm />
    </div>
  );
}
