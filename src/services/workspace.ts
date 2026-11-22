import { sampleWorkspace } from "@/data/workspace";
import type { Workspace } from "@/types/workspace";

/** Workspace access. Swap this module when a database is introduced. */
export async function getWorkspace(): Promise<Workspace> {
  return sampleWorkspace;
}
