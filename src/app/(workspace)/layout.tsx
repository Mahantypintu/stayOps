import type { ReactNode } from "react";
import { PortalFrame } from "@/components/layout/portal-frame";
import { managerNavigation } from "@/lib/navigation";

export default function ManagerLayout({ children }: { children: ReactNode }) {
  return (
    <PortalFrame role="manager" sections={managerNavigation}>
      {children}
    </PortalFrame>
  );
}
