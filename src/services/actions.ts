"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sampleResidentId } from "@/data/sample-clock";
import { actionFailure, actionSuccess, type ActionState } from "@/lib/action-state";
import { nowStamp } from "@/lib/session-time";
import { getPrototypeRole } from "@/services/prototype-role";
import {
  createComplaintForResident,
  createFloor,
  createProperty,
  createResident,
  createRoom,
  moveOutResident,
  renameRoom,
  restoreSampleRecords,
  updateComplaintStatus,
  updateProperty,
  updateResident,
} from "@/services/mutations";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

async function requireManager(): Promise<string | null> {
  const role = await getPrototypeRole();
  if (role !== "manager") {
    return "Switch to the property manager role before saving. This menu is not sign-in.";
  }
  return null;
}

function refreshSession() {
  revalidatePath("/", "layout");
}

export async function createPropertyAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const denied = await requireManager();
  if (denied) return actionFailure(denied);
  const result = createProperty({
    name: text(formData, "name"),
    address: text(formData, "address"),
    city: text(formData, "city"),
  });
  if (!result.ok) return actionFailure(result.error);
  refreshSession();
  return actionSuccess("Property added for this session.", nowStamp());
}

export async function updatePropertyAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const denied = await requireManager();
  if (denied) return actionFailure(denied);
  const result = updateProperty({
    id: text(formData, "id"),
    name: text(formData, "name"),
    address: text(formData, "address"),
    city: text(formData, "city"),
  });
  if (!result.ok) return actionFailure(result.error);
  refreshSession();
  return actionSuccess("Property updated for this session.", nowStamp());
}

export async function createFloorAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const denied = await requireManager();
  if (denied) return actionFailure(denied);
  const result = createFloor({
    propertyId: text(formData, "propertyId"),
    name: text(formData, "name"),
  });
  if (!result.ok) return actionFailure(result.error);
  refreshSession();
  return actionSuccess("Floor added for this session.", nowStamp());
}

export async function createRoomAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const denied = await requireManager();
  if (denied) return actionFailure(denied);
  const result = createRoom({
    propertyId: text(formData, "propertyId"),
    floorId: text(formData, "floorId"),
    number: text(formData, "number"),
    bedCount: Number(text(formData, "bedCount")),
  });
  if (!result.ok) return actionFailure(result.error);
  refreshSession();
  return actionSuccess("Room added for this session. It does not have a QR code yet.", nowStamp());
}

export async function renameRoomAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const denied = await requireManager();
  if (denied) return actionFailure(denied);
  const result = renameRoom({
    id: text(formData, "id"),
    number: text(formData, "number"),
  });
  if (!result.ok) return actionFailure(result.error);
  refreshSession();
  return actionSuccess("Room number updated for this session.", nowStamp());
}

export async function createResidentAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const denied = await requireManager();
  if (denied) return actionFailure(denied);
  const result = createResident({
    name: text(formData, "name"),
    phone: text(formData, "phone"),
    bedId: text(formData, "bedId"),
    moveIn: text(formData, "moveIn"),
  });
  if (!result.ok) return actionFailure(result.error);
  refreshSession();
  return actionSuccess("Resident added for this session.", nowStamp());
}

export async function updateResidentAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const denied = await requireManager();
  if (denied) return actionFailure(denied);
  const result = updateResident({
    id: text(formData, "id"),
    name: text(formData, "name"),
    phone: text(formData, "phone"),
    bedId: text(formData, "bedId"),
  });
  if (!result.ok) return actionFailure(result.error);
  refreshSession();
  return actionSuccess("Resident updated for this session.", nowStamp());
}

export async function moveOutResidentAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const denied = await requireManager();
  if (denied) return actionFailure(denied);
  const result = moveOutResident(text(formData, "id"));
  if (!result.ok) return actionFailure(result.error);
  refreshSession();
  return actionSuccess("Move-out recorded for this session. The bed is vacant again.", nowStamp());
}

export async function createManagerComplaintAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const denied = await requireManager();
  if (denied) return actionFailure(denied);
  const result = createComplaintForResident({
    residentId: text(formData, "residentId"),
    category: text(formData, "category"),
    priority: text(formData, "priority"),
    title: text(formData, "title"),
    description: text(formData, "description"),
  });
  if (!result.ok) return actionFailure(result.error);
  if (!result.id) return actionFailure("Could not save the complaint.");
  refreshSession();
  redirect(`/complaints/${result.id}`);
}

export async function createResidentComplaintAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const role = await getPrototypeRole();
  if (role !== "resident") {
    return actionFailure("Switch to the resident role before reporting an issue. This menu is not sign-in.");
  }
  const result = createComplaintForResident({
    residentId: sampleResidentId,
    category: text(formData, "category"),
    priority: text(formData, "priority"),
    title: text(formData, "title"),
    description: text(formData, "description"),
  });
  if (!result.ok) return actionFailure(result.error);
  if (!result.id) return actionFailure("Could not save the complaint.");
  refreshSession();
  redirect(`/resident/complaints/${result.id}`);
}

export async function updateComplaintStatusAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const denied = await requireManager();
  if (denied) return actionFailure(denied);
  const result = updateComplaintStatus({
    id: text(formData, "id"),
    status: text(formData, "status"),
    staffId: text(formData, "staffId"),
    expectedResolution: text(formData, "expectedResolution"),
    note: text(formData, "note"),
  });
  if (!result.ok) return actionFailure(result.error);
  refreshSession();
  return actionSuccess("Status saved for this session.", nowStamp());
}

export async function restoreSampleAction(): Promise<ActionState> {
  const denied = await requireManager();
  if (denied) return actionFailure(denied);
  restoreSampleRecords();
  refreshSession();
  return actionSuccess("Sample records restored. Session changes were cleared.", nowStamp());
}
