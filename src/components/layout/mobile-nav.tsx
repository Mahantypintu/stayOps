import { SidebarPanel } from "@/components/layout/sidebar-panel";
import type { NavSection } from "@/types/navigation";
import type { Workspace } from "@/types/workspace";

export function MobileNav({
  open,
  pathname,
  workspace,
  sections,
  onClose,
}: {
  open: boolean;
  pathname: string;
  workspace: Workspace;
  sections: NavSection[];
  onClose: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-sidebar/60"
        aria-label="Close navigation"
        onClick={onClose}
      />
      <div
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className="stayops-drawer relative flex h-dvh w-72 max-w-[85vw] flex-col shadow-2xl"
      >
        <SidebarPanel
          pathname={pathname}
          workspace={workspace}
          sections={sections}
          onNavigate={onClose}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
