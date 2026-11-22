export type NavIcon =
  | "dashboard"
  | "properties"
  | "rooms"
  | "residents"
  | "complaints"
  | "staff"
  | "qr"
  | "reports"
  | "settings"
  | "assets"
  | "expenses"
  | "notifications"
  | "assistant";

export type NavItem = {
  label: string;
  href: string;
  icon: NavIcon;
  exact?: boolean;
};

export type NavSection = {
  label: string;
  items: NavItem[];
};
