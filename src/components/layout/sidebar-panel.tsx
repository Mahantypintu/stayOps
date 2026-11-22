import { BrandLockup } from "@/components/layout/brand-lockup";
import { NavList } from "@/components/layout/nav-list";
import { CloseIcon } from "@/components/ui/icons";
import type { NavSection } from "@/types/navigation";
import type { Workspace } from "@/types/workspace";

export function SidebarPanel({
  pathname,
  workspace,
  sections,
  onNavigate,
  onClose,
}: {
  pathname: string;
  workspace: Workspace;
  sections: NavSection[];
  onNavigate?: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4">
        <BrandLockup />
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="grid size-10 place-items-center rounded-lg text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span className="sr-only">Close navigation</span>
            <CloseIcon className="size-5" />
          </button>
        ) : null}
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-4">
        <NavList sections={sections} pathname={pathname} onNavigate={onNavigate} />
      </div>
      <div className="shrink-0 border-t border-white/10 px-4 py-4">
        <p className="truncate text-sm font-medium text-white">{workspace.organizationName}</p>
        <p className="truncate text-xs text-sidebar-muted">{workspace.roleLabel}</p>
      </div>
    </div>
  );
}
