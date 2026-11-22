import { BrandLockup } from "@/components/layout/brand-lockup";
import { RoleSwitch } from "@/components/layout/role-switch";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "@/components/ui/icons";
import type { PrototypeRole } from "@/lib/prototype-role";
import type { Workspace } from "@/types/workspace";

export function Header({
  menuOpen,
  workspace,
  role,
  onMenu,
}: {
  menuOpen: boolean;
  workspace: Workspace;
  role: PrototypeRole;
  onMenu: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur sm:px-6">
      <Button
        variant="secondary"
        size="icon"
        className="lg:hidden"
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        onClick={onMenu}
      >
        <span className="sr-only">Open navigation</span>
        <MenuIcon className="size-5" />
      </Button>
      <div className="min-w-0 lg:hidden">
        <BrandLockup tone="default" />
      </div>
      <p className="hidden min-w-0 truncate text-sm font-medium text-foreground lg:block">
        {workspace.roleLabel}
      </p>
      <div className="ml-auto">
        <RoleSwitch role={role} />
      </div>
    </header>
  );
}
