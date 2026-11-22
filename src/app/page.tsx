import { redirect } from "next/navigation";
import { portalHome } from "@/lib/prototype-role";
import { getPrototypeRole } from "@/services/prototype-role";

export default async function Home() {
  const role = await getPrototypeRole();
  redirect(portalHome[role]);
}
