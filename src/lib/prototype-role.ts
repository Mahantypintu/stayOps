export const prototypeRoles = ["manager", "resident", "staff"] as const;

export type PrototypeRole = (typeof prototypeRoles)[number];

export const PROTOTYPE_ROLE_COOKIE = "stayops_prototype_role";

export const portalHome: Record<PrototypeRole, string> = {
  manager: "/dashboard",
  resident: "/resident",
  staff: "/maintenance",
};

export function isPrototypeRole(value: string | undefined): value is PrototypeRole {
  return prototypeRoles.some((role) => role === value);
}
