import type { ReactNode } from "react";
import { PortalFrame } from "@/components/layout/portal-frame";
import { staffNavigation } from "@/lib/navigation";

export default function MaintenanceLayout({ children }: { children: ReactNode }) {
  return (
    <PortalFrame role="staff" sections={staffNavigation}>
      {children}
    </PortalFrame>
  );
}
