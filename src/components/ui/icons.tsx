import type { ReactNode, SVGProps } from "react";
import type { NavIcon } from "@/types/navigation";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ className, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </IconBase>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </IconBase>
  );
}

const navIconPaths: Record<NavIcon, ReactNode> = {
  dashboard: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </>
  ),
  properties: (
    <>
      <path d="M4 20.5V9.5L12 4l8 5.5v11" />
      <path d="M9.5 20.5V13h5v7.5" />
    </>
  ),
  rooms: (
    <>
      <path d="M5 20.5V5.5A1.5 1.5 0 0 1 6.5 4h8.2L19 8.2V20.5" />
      <path d="M14.5 4.2V8.5H19" />
      <path d="M8.5 12h4M8.5 15.5h4" />
    </>
  ),
  residents: (
    <>
      <path d="M16 19.5v-1.2a3.2 3.2 0 0 0-2.2-3 4 4 0 0 0-1.8-.3" />
      <circle cx="9" cy="8" r="2.6" />
      <path d="M4.2 19.5v-1.3A3.4 3.4 0 0 1 7.6 15c.8-.2 1.6-.3 2.4-.2" />
      <circle cx="16.2" cy="8.4" r="2.1" />
    </>
  ),
  complaints: (
    <>
      <path d="M6 16.5 4 20l3.8-1.4A8 8 0 1 0 6 16.5Z" />
      <path d="M8.5 10.5h7M8.5 14h4.5" />
    </>
  ),
  staff: (
    <>
      <circle cx="12" cy="8" r="2.7" />
      <path d="M6.2 19.2a5.8 5.8 0 0 1 11.6 0" />
      <path d="M17.2 6.2 18.4 8l1.8.3-1.3 1.3.3 1.8-1.6-.8-1.6.8.3-1.8-1.3-1.3 1.8-.3Z" />
    </>
  ),
  qr: (
    <>
      <path d="M5 5h5v5H5zM14 5h5v5h-5zM5 14h5v5H5z" />
      <path d="M14 14h2.2M18.8 14H19M14 19h5M16.5 16.5h2.5" />
    </>
  ),
  reports: (
    <>
      <path d="M4.5 19.5h15" />
      <path d="M7.5 16.5v-4M12 16.5V8M16.5 16.5v-6" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.8v2.1M12 18.1v2.1M4.9 6.6l1.6 1.4M17.5 16l1.6 1.4M3.8 12h2.1M18.1 12h2.1M4.9 17.4l1.6-1.4M17.5 8l1.6-1.4" />
    </>
  ),
  assets: (
    <>
      <path d="M4 8.5 12 4.5l8 4v11l-8 4-8-4v-11Z" />
      <path d="M12 12.5 20 8.5M12 12.5V20.5M12 12.5 4 8.5" />
    </>
  ),
  expenses: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2" />
      <path d="M8.5 8h7M8.5 12h7M8.5 16h4" />
    </>
  ),
  notifications: (
    <>
      <path d="M6 16.5h12l-1.2-2V10a4.8 4.8 0 0 0-9.6 0v4.5L6 16.5Z" />
      <path d="M10 18.2a2 2 0 0 0 4 0" />
    </>
  ),
  assistant: (
    <>
      <path d="M12 3.5 13.6 8l4.9.4-3.8 3.2 1.2 4.8L12 13.8 8.1 16.4l1.2-4.8L5.5 8.4 10.4 8 12 3.5Z" />
    </>
  ),
};

export function NavIconGraphic({
  name,
  ...props
}: IconProps & { name: NavIcon }) {
  return <IconBase {...props}>{navIconPaths[name]}</IconBase>;
}
