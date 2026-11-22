"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import type { PrototypeRole } from "@/lib/prototype-role";
import type { NavSection } from "@/types/navigation";
import type { Workspace } from "@/types/workspace";

export function AppShell({
  workspace,
  role,
  sections,
  children,
}: {
  workspace: Workspace;
  role: PrototypeRole;
  sections: NavSection[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const menuOpen = openPath === pathname;

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenPath(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <div className="flex min-h-dvh bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-card"
      >
        Skip to content
      </a>
      <Sidebar pathname={pathname} workspace={workspace} sections={sections} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          menuOpen={menuOpen}
          workspace={workspace}
          role={role}
          onMenu={() => setOpenPath(pathname)}
        />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 px-4 py-6 outline-none sm:px-6 lg:px-8 lg:py-8"
        >
          {children}
        </main>
      </div>
      <MobileNav
        open={menuOpen}
        pathname={pathname}
        workspace={workspace}
        sections={sections}
        onClose={() => setOpenPath(null)}
      />
    </div>
  );
}
