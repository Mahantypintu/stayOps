import { getSessionRecords, resetSessionRecords } from "@/data/session-store";
import { prototypePeople } from "@/data/sample-clock";
import { nowStamp, todayKey } from "@/lib/session-time";
import {
  complaintCategories,
  complaintPriorities,
  complaintStatuses,
  type ComplaintCategory,
  type ComplaintPriority,
  type ComplaintStatus,
} from "@/types/operations";

type Result = { ok: true; id?: string } | { ok: false; error: string };

function createId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

function isDateKey(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 10) {
    return null;
  }
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

function nextComplaintId(ids: string[]) {
  const max = ids.reduce((highest, id) => {
    const match = /^CMP-(\d+)$/.exec(id);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 1000);
  return `CMP-${String(max + 1).padStart(4, "0")}`;
}

const bedLabels = ["A", "B", "C", "D", "E", "F"] as const;

export function createProperty(input: { name: string; address: string; city: string }): Result {
  const name = input.name.trim();
  const address = input.address.trim();
  const city = input.city.trim();
  if (name.length < 2 || name.length > 80) {
    return { ok: false, error: "Enter a property name between 2 and 80 characters." };
  }
  if (address.length < 3 || address.length > 120) {
    return { ok: false, error: "Enter an address between 3 and 120 characters." };
  }
  if (city.length < 2 || city.length > 60) {
    return { ok: false, error: "Enter a city between 2 and 60 characters." };
  }

  const store = getSessionRecords();
  if (store.properties.some((property) => property.name.toLowerCase() === name.toLowerCase())) {
    return { ok: false, error: "A property with this name is already in the session." };
  }

  const id = createId("prop");
  store.properties.push({ id, name, address, city });
  return { ok: true, id };
}

export function updateProperty(input: {
  id: string;
  name: string;
  address: string;
  city: string;
}): Result {
  const name = input.name.trim();
  const address = input.address.trim();
  const city = input.city.trim();
  if (name.length < 2 || name.length > 80) {
    return { ok: false, error: "Enter a property name between 2 and 80 characters." };
  }
  if (address.length < 3 || address.length > 120) {
    return { ok: false, error: "Enter an address between 3 and 120 characters." };
  }
  if (city.length < 2 || city.length > 60) {
    return { ok: false, error: "Enter a city between 2 and 60 characters." };
  }

  const store = getSessionRecords();
  const property = store.properties.find((item) => item.id === input.id);
  if (!property) {
    return { ok: false, error: "That property is not in this session." };
  }
  const duplicate = store.properties.some(
    (item) => item.id !== property.id && item.name.toLowerCase() === name.toLowerCase(),
  );
  if (duplicate) {
    return { ok: false, error: "A property with this name is already in the session." };
  }

  property.name = name;
  property.address = address;
  property.city = city;
  return { ok: true, id: property.id };
}

export function createFloor(input: { propertyId: string; name: string }): Result {
  const name = input.name.trim();
  if (name.length < 2 || name.length > 40) {
    return { ok: false, error: "Enter a floor name between 2 and 40 characters." };
  }

  const store = getSessionRecords();
  if (!store.properties.some((property) => property.id === input.propertyId)) {
    return { ok: false, error: "Choose a property from the list." };
  }
  const duplicate = store.floors.some(
    (floor) =>
      floor.propertyId === input.propertyId && floor.name.toLowerCase() === name.toLowerCase(),
  );
  if (duplicate) {
    return { ok: false, error: "That floor name is already used in this property." };
  }

  const id = createId("fl");
  store.floors.push({ id, propertyId: input.propertyId, name });
  return { ok: true, id };
}

export function createRoom(input: {
  propertyId: string;
  floorId: string;
  number: string;
  bedCount: number;
}): Result {
  const number = input.number.trim();
  if (number.length < 1 || number.length > 12) {
    return { ok: false, error: "Enter a room number up to 12 characters." };
  }
  if (!Number.isInteger(input.bedCount) || input.bedCount < 1 || input.bedCount > bedLabels.length) {
    return { ok: false, error: "Choose between 1 and 6 beds." };
  }

  const store = getSessionRecords();
  const floor = store.floors.find((item) => item.id === input.floorId);
  if (!floor || floor.propertyId !== input.propertyId) {
    return { ok: false, error: "Choose a floor that belongs to the selected property." };
  }
  const duplicate = store.rooms.some(
    (room) =>
      room.propertyId === input.propertyId && room.number.toLowerCase() === number.toLowerCase(),
  );
  if (duplicate) {
    return { ok: false, error: "That room number is already used in this property." };
  }

  const roomId = createId("room");
  store.rooms.push({
    id: roomId,
    propertyId: input.propertyId,
    floorId: floor.id,
    number,
  });
  for (let index = 0; index < input.bedCount; index += 1) {
    store.beds.push({
      id: createId("bed"),
      roomId,
      label: bedLabels[index],
    });
  }
  return { ok: true, id: roomId };
}

export function renameRoom(input: { id: string; number: string }): Result {
  const number = input.number.trim();
  if (number.length < 1 || number.length > 12) {
    return { ok: false, error: "Enter a room number up to 12 characters." };
  }

  const store = getSessionRecords();
  const room = store.rooms.find((item) => item.id === input.id);
  if (!room) {
    return { ok: false, error: "That room is not in this session." };
  }
  const duplicate = store.rooms.some(
    (item) =>
      item.id !== room.id &&
      item.propertyId === room.propertyId &&
      item.number.toLowerCase() === number.toLowerCase(),
  );
  if (duplicate) {
    return { ok: false, error: "That room number is already used in this property." };
  }

  room.number = number;
  for (const complaint of store.complaints) {
    if (complaint.roomId !== room.id || !complaint.bedId) {
      continue;
    }
    const bed = store.beds.find((item) => item.id === complaint.bedId);
    if (bed) {
      complaint.locationLabel = `Room ${room.number}, bed ${bed.label}`;
    }
  }
  return { ok: true, id: room.id };
}

export function createResident(input: {
  name: string;
  phone: string;
  bedId: string;
  moveIn: string;
}): Result {
  const name = input.name.trim();
  const phone = formatPhone(input.phone);
  if (name.length < 2 || name.length > 80) {
    return { ok: false, error: "Enter a resident name between 2 and 80 characters." };
  }
  if (!phone) {
    return { ok: false, error: "Enter a 10-digit phone number." };
  }
  if (!isDateKey(input.moveIn)) {
    return { ok: false, error: "Choose a valid move-in date." };
  }

  const store = getSessionRecords();
  const bed = store.beds.find((item) => item.id === input.bedId);
  if (!bed) {
    return { ok: false, error: "Choose a vacant bed." };
  }
  const occupied = store.residents.some(
    (resident) => resident.bedId === bed.id && resident.moveOut === null,
  );
  if (occupied) {
    return { ok: false, error: "That bed already has a resident. Choose another bed." };
  }
  const room = store.rooms.find((item) => item.id === bed.roomId);
  if (!room) {
    return { ok: false, error: "That bed is not linked to a room." };
  }

  const id = createId("res");
  store.residents.push({
    id,
    name,
    phone,
    propertyId: room.propertyId,
    roomId: room.id,
    bedId: bed.id,
    moveIn: input.moveIn,
    moveOut: null,
  });
  return { ok: true, id };
}

export function updateResident(input: {
  id: string;
  name: string;
  phone: string;
  bedId: string;
}): Result {
  const name = input.name.trim();
  const phone = formatPhone(input.phone);
  if (name.length < 2 || name.length > 80) {
    return { ok: false, error: "Enter a resident name between 2 and 80 characters." };
  }
  if (!phone) {
    return { ok: false, error: "Enter a 10-digit phone number." };
  }

  const store = getSessionRecords();
  const resident = store.residents.find((item) => item.id === input.id);
  if (!resident) {
    return { ok: false, error: "That resident is not in this session." };
  }
  const bed = store.beds.find((item) => item.id === input.bedId);
  if (!bed) {
    return { ok: false, error: "Choose a bed." };
  }
  const occupied = store.residents.some(
    (item) => item.id !== resident.id && item.bedId === bed.id && item.moveOut === null,
  );
  if (occupied) {
    return { ok: false, error: "That bed already has a resident. Choose another bed." };
  }
  const room = store.rooms.find((item) => item.id === bed.roomId);
  if (!room) {
    return { ok: false, error: "That bed is not linked to a room." };
  }

  resident.name = name;
  resident.phone = phone;
  resident.propertyId = room.propertyId;
  resident.roomId = room.id;
  resident.bedId = bed.id;
  resident.moveOut = null;
  return { ok: true, id: resident.id };
}

export function moveOutResident(id: string): Result {
  const store = getSessionRecords();
  const resident = store.residents.find((item) => item.id === id);
  if (!resident) {
    return { ok: false, error: "That resident is not in this session." };
  }
  if (resident.moveOut !== null) {
    return { ok: false, error: "This resident is already moved out." };
  }
  resident.moveOut = todayKey();
  return { ok: true, id: resident.id };
}

function complaintDraft(input: {
  category: string;
  priority: string;
  title: string;
  description: string;
}) {
  const title = input.title.trim();
  const description = input.description.trim();
  if (!complaintCategories.includes(input.category as ComplaintCategory)) {
    return { ok: false as const, error: "Choose a complaint category." };
  }
  if (!complaintPriorities.includes(input.priority as ComplaintPriority)) {
    return { ok: false as const, error: "Choose a priority." };
  }
  if (title.length < 3 || title.length > 80) {
    return { ok: false as const, error: "Enter a title between 3 and 80 characters." };
  }
  if (description.length < 10 || description.length > 1000) {
    return { ok: false as const, error: "Enter a description between 10 and 1000 characters." };
  }
  return {
    ok: true as const,
    category: input.category as ComplaintCategory,
    priority: input.priority as ComplaintPriority,
    title,
    description,
  };
}

export function createComplaintForResident(input: {
  residentId: string;
  category: string;
  priority: string;
  title: string;
  description: string;
}): Result {
  const draft = complaintDraft(input);
  if (!draft.ok) {
    return draft;
  }

  const store = getSessionRecords();
  const resident = store.residents.find((item) => item.id === input.residentId);
  if (!resident || resident.moveOut !== null) {
    return { ok: false, error: "This resident does not have an active bed, so a complaint cannot be filed." };
  }
  const room = store.rooms.find((item) => item.id === resident.roomId);
  const floor = room ? store.floors.find((item) => item.id === room.floorId) : undefined;
  const bed = store.beds.find((item) => item.id === resident.bedId);
  if (!room || !floor || !bed) {
    return { ok: false, error: "The resident's room could not be found." };
  }

  const at = nowStamp();
  const id = nextComplaintId(store.complaints.map((item) => item.id));
  store.complaints.push({
    id,
    propertyId: resident.propertyId,
    floorId: floor.id,
    roomId: room.id,
    bedId: bed.id,
    residentId: resident.id,
    locationLabel: `Room ${room.number}, bed ${bed.label}`,
    category: draft.category,
    title: draft.title,
    description: draft.description,
    priority: draft.priority,
    status: "New",
    staffId: null,
    reportedAt: at,
    expectedResolution: null,
    resolvedAt: null,
    resolutionRemarks: null,
    managerNote: null,
    hasReportPhotos: false,
    hasCompletionPhotos: false,
  });
  store.events.push({
    id: createId("evt"),
    complaintId: id,
    at,
    actor: resident.name,
    summary: "Reported this complaint.",
  });
  return { ok: true, id };
}

const staffRequired: ComplaintStatus[] = ["Assigned", "Accepted", "In Progress"];

export function updateComplaintStatus(input: {
  id: string;
  status: string;
  staffId: string;
  expectedResolution: string;
  note: string;
}): Result {
  if (!complaintStatuses.includes(input.status as ComplaintStatus)) {
    return { ok: false, error: "Choose a status." };
  }
  const status = input.status as ComplaintStatus;
  const note = input.note.trim();
  if (note.length < 3 || note.length > 500) {
    return { ok: false, error: "Enter a note between 3 and 500 characters." };
  }
  const expected = input.expectedResolution.trim();
  if (expected && !isDateKey(expected)) {
    return { ok: false, error: "Choose a valid expected resolution date, or leave it blank." };
  }

  const store = getSessionRecords();
  const complaint = store.complaints.find((item) => item.id === input.id);
  if (!complaint) {
    return { ok: false, error: "That complaint is not in this session." };
  }

  const staffId = input.staffId.trim();
  const staffMember = staffId ? store.staff.find((item) => item.id === staffId) : undefined;
  if (staffId && !staffMember) {
    return { ok: false, error: "Choose a staff member from the list." };
  }
  if (status === "New" && staffMember) {
    return { ok: false, error: "A new complaint stays unassigned. Clear the staff member or choose another status." };
  }
  if (staffRequired.includes(status) && !staffMember) {
    return { ok: false, error: "Choose a staff member for this status." };
  }

  const at = nowStamp();
  complaint.status = status;
  complaint.staffId = status === "New" ? null : (staffMember?.id ?? null);
  complaint.expectedResolution = expected || null;
  complaint.managerNote = note;
  if (status === "Resolved") {
    complaint.resolvedAt = at;
    complaint.resolutionRemarks = note;
  } else {
    complaint.resolvedAt = null;
    complaint.resolutionRemarks = null;
  }

  store.events.push({
    id: createId("evt"),
    complaintId: complaint.id,
    at,
    actor: prototypePeople.manager.name,
    summary: staffMember
      ? `Set status to ${status} and assigned ${staffMember.name}. ${note}`
      : `Set status to ${status}. ${note}`,
  });
  return { ok: true, id: complaint.id };
}

export function createStaff(input: { name: string; phone: string; skills: string[] }): Result {
  const name = input.name.trim();
  const phone = formatPhone(input.phone);
  if (name.length < 2 || name.length > 80) {
    return { ok: false, error: "Enter a staff name between 2 and 80 characters." };
  }
  if (!phone) {
    return { ok: false, error: "Enter a 10-digit phone number." };
  }
  const skills = input.skills.filter((skill): skill is ComplaintCategory =>
    complaintCategories.includes(skill as ComplaintCategory),
  );
  if (skills.length === 0) {
    return { ok: false, error: "Choose at least one skill." };
  }

  const store = getSessionRecords();
  const id = createId("staff");
  store.staff.push({ id, name, phone, skills });
  return { ok: true, id };
}

export function restoreSampleRecords() {
  resetSessionRecords();
}
