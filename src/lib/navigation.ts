import type { NavSection } from "@/types/navigation";

export const managerNavigation: NavSection[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard", icon: "dashboard", exact: true }],
  },
  {
    label: "Property management",
    items: [
      { label: "Properties", href: "/properties", icon: "properties" },
      { label: "Floors and rooms", href: "/rooms", icon: "rooms" },
      { label: "Residents", href: "/residents", icon: "residents" },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Complaints", href: "/complaints", icon: "complaints" },
      { label: "QR codes", href: "/qr-codes", icon: "qr" },
      { label: "Staff", href: "/staff", icon: "staff" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Assets", href: "/assets", icon: "assets" },
      { label: "Expenses", href: "/expenses", icon: "expenses" },
    ],
  },
  {
    label: "Management",
    items: [
      { label: "Notifications", href: "/notifications", icon: "notifications" },
      { label: "Reports", href: "/reports", icon: "reports" },
      { label: "Assistant", href: "/assistant", icon: "assistant" },
      { label: "Settings", href: "/settings", icon: "settings" },
    ],
  },
];

export const residentNavigation: NavSection[] = [
  {
    label: "Resident",
    items: [
      { label: "Home", href: "/resident", icon: "dashboard", exact: true },
      { label: "My complaints", href: "/resident/complaints", icon: "complaints" },
      { label: "Report an issue", href: "/resident/report", icon: "notifications" },
    ],
  },
];

export const staffNavigation: NavSection[] = [
  {
    label: "Maintenance",
    items: [{ label: "My tasks", href: "/maintenance", icon: "staff", exact: true }],
  },
];

export function isNavItemActive(pathname: string, href: string, exact = false) {
  if (exact) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
