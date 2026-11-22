"use client";

import { useRouter } from "next/navigation";
import {
  portalHome,
  PROTOTYPE_ROLE_COOKIE,
  prototypeRoles,
  type PrototypeRole,
} from "@/lib/prototype-role";

const labels: Record<PrototypeRole, string> = {
  manager: "Property manager",
  resident: "Resident",
  staff: "Maintenance staff",
};

export function RoleSwitch({ role }: { role: PrototypeRole }) {
  const router = useRouter();

  return (
    <label className="flex items-center gap-2 text-xs font-medium text-muted">
      <span className="hidden md:inline">Prototype role</span>
      <select
        aria-label="Prototype role. This is not sign-in."
        value={role}
        className="h-10 rounded-lg border border-border bg-surface px-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        onChange={(event) => {
          const next = event.target.value as PrototypeRole;
          document.cookie = `${PROTOTYPE_ROLE_COOKIE}=${next}; Path=/; Max-Age=2592000; SameSite=Lax`;
          router.push(portalHome[next]);
          router.refresh();
        }}
      >
        {prototypeRoles.map((item) => (
          <option key={item} value={item}>
            {labels[item]}
          </option>
        ))}
      </select>
    </label>
  );
}
