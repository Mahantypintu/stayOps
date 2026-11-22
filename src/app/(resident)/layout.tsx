import type { ReactNode } from "react";
import { PortalFrame } from "@/components/layout/portal-frame";
import { residentNavigation } from "@/lib/navigation";

export default function ResidentLayout({ children }: { children: ReactNode }) {
  return (
    <PortalFrame role="resident" sections={residentNavigation}>
      {children}
    </PortalFrame>
  );
}
