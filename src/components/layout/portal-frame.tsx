import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { prototypePeople } from "@/data/sample-clock";
import { portalHome, type PrototypeRole } from "@/lib/prototype-role";
import { getPrototypeResident } from "@/services/operations";
import { getPrototypeRole } from "@/services/prototype-role";
import { getWorkspace } from "@/services/workspace";
import type { NavSection } from "@/types/navigation";

export async function PortalFrame({
  role,
  sections,
  children,
}: {
  role: PrototypeRole;
  sections: NavSection[];
  children: ReactNode;
}) {
  const current = await getPrototypeRole();
  if (current !== role) {
    redirect(portalHome[current]);
  }

  const workspace = await getWorkspace();
  const prototypeResident = role === "resident" ? await getPrototypeResident() : null;
  const person = prototypePeople[role];
  const roleLabel = prototypeResident?.name ?? (role === "resident" ? "Resident" : person.name);

  return (
    <AppShell
      role={role}
      sections={sections}
      workspace={{
        organizationName: workspace.organizationName,
        roleLabel,
      }}
    >
      {children}
    </AppShell>
  );
}
