import { cookies } from "next/headers";
import {
  isPrototypeRole,
  PROTOTYPE_ROLE_COOKIE,
  type PrototypeRole,
} from "@/lib/prototype-role";

export async function getPrototypeRole(): Promise<PrototypeRole> {
  const stored = (await cookies()).get(PROTOTYPE_ROLE_COOKIE)?.value;
  return isPrototypeRole(stored) ? stored : "manager";
}
