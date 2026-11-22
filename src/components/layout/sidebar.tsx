import { SidebarPanel } from "@/components/layout/sidebar-panel";
import type { NavSection } from "@/types/navigation";
import type { Workspace } from "@/types/workspace";

export function Sidebar({
  pathname,
  workspace,
  sections,
}: {
  pathname: string;
  workspace: Workspace;
  sections: NavSection[];
}) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 lg:block">
      <SidebarPanel pathname={pathname} workspace={workspace} sections={sections} />
    </aside>
  );
}
