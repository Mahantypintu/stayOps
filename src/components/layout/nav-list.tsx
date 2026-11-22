import Link from "next/link";
import { NavIconGraphic } from "@/components/ui/icons";
import { isNavItemActive } from "@/lib/navigation";
import type { NavSection } from "@/types/navigation";

export function NavList({
  sections,
  pathname,
  onNavigate,
}: {
  sections: NavSection[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Primary" className="flex h-full flex-col gap-4">
      {sections.map((section) => (
        <div key={section.label}>
          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-sidebar-muted">
            {section.label}
          </p>
          <ul className="flex flex-col gap-1">
            {section.items.map((item) => {
              const active = isNavItemActive(pathname, item.href, item.exact);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                      active
                        ? "bg-sidebar-active text-white shadow-[inset_3px_0_0_0_var(--accent)]"
                        : "text-sidebar-foreground hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <NavIconGraphic name={item.icon} className="size-[18px] shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
