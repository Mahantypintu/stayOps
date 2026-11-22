import { getSessionRecords, type SessionRecords } from "@/data/session-store";
import { sampleAsOf } from "@/data/sample-clock";
import { dateKey } from "@/lib/format";
import type {
  ComplaintCategory,
  ComplaintPriority,
  ComplaintRecord,
  ComplaintStatus,
} from "@/types/operations";

const asOfDate = dateKey(sampleAsOf);

function byId<T extends { id: string }>(records: T[], id: string) {
  const record = records.find((item) => item.id === id);
  if (!record) {
    throw new Error(`Missing session record ${id}`);
  }
  return record;
}

export function isOpenComplaint(status: ComplaintStatus) {
  return status !== "Resolved";
}

export function isOverdue(complaint: Pick<ComplaintRecord, "status" | "expectedResolution">) {
  return (
    isOpenComplaint(complaint.status) &&
    complaint.expectedResolution !== null &&
    complaint.expectedResolution < asOfDate
  );
}

function labels(store: SessionRecords) {
  return {
    propertyName(id: string) {
      return byId(store.properties, id).name;
    },
    floorName(id: string | null) {
      return id ? byId(store.floors, id).name : "—";
    },
    roomNumber(id: string | null) {
      return id ? byId(store.rooms, id).number : "—";
    },
    bedLabel(id: string | null) {
      return id ? byId(store.beds, id).label : "—";
    },
    residentName(id: string) {
      return byId(store.residents, id).name;
    },
    staffName(id: string | null) {
      return id ? byId(store.staff, id).name : "Unassigned";
    },
  };
}

export type ComplaintListItem = {
  id: string;
  title: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  propertyName: string;
  locationLabel: string;
  residentName: string;
  staffName: string;
  reportedAt: string;
  overdue: boolean;
};

export type ComplaintDetail = ComplaintListItem & {
  residentId: string;
  staffId: string | null;
  description: string;
  floorName: string;
  roomNumber: string;
  bedLabel: string;
  expectedResolution: string | null;
  resolvedAt: string | null;
  resolutionRemarks: string | null;
  managerNote: string | null;
  hasReportPhotos: boolean;
  hasCompletionPhotos: boolean;
  events: { id: string; at: string; actor: string; summary: string }[];
};

function toListItem(store: SessionRecords, complaint: ComplaintRecord): ComplaintListItem {
  const name = labels(store);
  return {
    id: complaint.id,
    title: complaint.title,
    category: complaint.category,
    priority: complaint.priority,
    status: complaint.status,
    propertyName: name.propertyName(complaint.propertyId),
    locationLabel: complaint.locationLabel,
    residentName: name.residentName(complaint.residentId),
    staffName: name.staffName(complaint.staffId),
    reportedAt: complaint.reportedAt,
    overdue: isOverdue(complaint),
  };
}

export async function listComplaints(): Promise<ComplaintListItem[]> {
  const store = getSessionRecords();
  return store.complaints
    .map((complaint) => toListItem(store, complaint))
    .sort((a, b) => (a.reportedAt < b.reportedAt ? 1 : -1));
}

export async function getComplaint(id: string): Promise<ComplaintDetail | null> {
  const store = getSessionRecords();
  const complaint = store.complaints.find((item) => item.id === id);
  if (!complaint) {
    return null;
  }
  const name = labels(store);

  return {
    ...toListItem(store, complaint),
    residentId: complaint.residentId,
    staffId: complaint.staffId,
    description: complaint.description,
    floorName: name.floorName(complaint.floorId),
    roomNumber: name.roomNumber(complaint.roomId),
    bedLabel: name.bedLabel(complaint.bedId),
    expectedResolution: complaint.expectedResolution,
    resolvedAt: complaint.resolvedAt,
    resolutionRemarks: complaint.resolutionRemarks,
    managerNote: complaint.managerNote,
    hasReportPhotos: complaint.hasReportPhotos,
    hasCompletionPhotos: complaint.hasCompletionPhotos,
    events: store.events
      .filter((event) => event.complaintId === id)
      .sort((a, b) => (a.at < b.at ? -1 : 1))
      .map((event) => ({
        id: event.id,
        at: event.at,
        actor: event.actor,
        summary: event.summary,
      })),
  };
}

export async function listComplaintsForResident(residentId: string) {
  const store = getSessionRecords();
  const items = await listComplaints();
  const residentComplaintIds = new Set(
    store.complaints.filter((item) => item.residentId === residentId).map((item) => item.id),
  );
  return items.filter((item) => residentComplaintIds.has(item.id));
}

export async function listComplaintsForStaff(staffId: string) {
  const store = getSessionRecords();
  const assigned = new Set(
    store.complaints.filter((item) => item.staffId === staffId).map((item) => item.id),
  );
  const items = await listComplaints();
  return items.filter((item) => assigned.has(item.id));
}

export type PropertySummary = {
  id: string;
  name: string;
  address: string;
  city: string;
  floors: number;
  rooms: number;
  beds: number;
  occupied: number;
  available: number;
};

export async function listProperties(): Promise<PropertySummary[]> {
  const store = getSessionRecords();
  return store.properties.map((property) => {
    const propertyRooms = store.rooms.filter((room) => room.propertyId === property.id);
    const roomIds = new Set(propertyRooms.map((room) => room.id));
    const propertyBeds = store.beds.filter((bed) => roomIds.has(bed.roomId));
    const occupied = store.residents.filter(
      (resident) => resident.propertyId === property.id && resident.moveOut === null,
    ).length;

    return {
      id: property.id,
      name: property.name,
      address: property.address,
      city: property.city,
      floors: store.floors.filter((floor) => floor.propertyId === property.id).length,
      rooms: propertyRooms.length,
      beds: propertyBeds.length,
      occupied,
      available: propertyBeds.length - occupied,
    };
  });
}

export type RoomSummary = {
  id: string;
  number: string;
  propertyName: string;
  floorName: string;
  beds: number;
  occupied: number;
  available: number;
};

export async function listRooms(): Promise<RoomSummary[]> {
  const store = getSessionRecords();
  const name = labels(store);
  return store.rooms.map((room) => {
    const roomBeds = store.beds.filter((bed) => bed.roomId === room.id);
    const occupied = store.residents.filter(
      (resident) => resident.roomId === room.id && resident.moveOut === null,
    ).length;

    return {
      id: room.id,
      number: room.number,
      propertyName: name.propertyName(room.propertyId),
      floorName: name.floorName(room.floorId),
      beds: roomBeds.length,
      occupied,
      available: roomBeds.length - occupied,
    };
  });
}

export type FloorSummary = {
  id: string;
  propertyId: string;
  name: string;
  propertyName: string;
};

export async function listFloors(): Promise<FloorSummary[]> {
  const store = getSessionRecords();
  const name = labels(store);
  return store.floors.map((floor) => ({
    id: floor.id,
    propertyId: floor.propertyId,
    name: floor.name,
    propertyName: name.propertyName(floor.propertyId),
  }));
}

export type ResidentSummary = {
  id: string;
  name: string;
  phone: string;
  propertyName: string;
  floorName: string;
  roomNumber: string;
  bedLabel: string;
  bedId: string;
  moveIn: string;
  moveOut: string | null;
  openComplaints: number;
};

export async function listResidents(): Promise<ResidentSummary[]> {
  const store = getSessionRecords();
  const name = labels(store);
  return store.residents
    .filter((resident) => resident.moveOut === null)
    .map((resident) => {
      const room = byId(store.rooms, resident.roomId);
      return {
        id: resident.id,
        name: resident.name,
        phone: resident.phone,
        propertyName: name.propertyName(resident.propertyId),
        floorName: name.floorName(room.floorId),
        roomNumber: room.number,
        bedLabel: name.bedLabel(resident.bedId),
        bedId: resident.bedId,
        moveIn: resident.moveIn,
        moveOut: resident.moveOut,
        openComplaints: store.complaints.filter(
          (complaint) =>
            complaint.residentId === resident.id && isOpenComplaint(complaint.status),
        ).length,
      };
    });
}

export type ResidentChoice = ResidentSummary & { staying: boolean };

export async function listResidentChoices(): Promise<ResidentChoice[]> {
  const store = getSessionRecords();
  const name = labels(store);
  return store.residents.map((resident) => {
    const room = byId(store.rooms, resident.roomId);
    return {
      id: resident.id,
      name: resident.name,
      phone: resident.phone,
      propertyName: name.propertyName(resident.propertyId),
      floorName: name.floorName(room.floorId),
      roomNumber: room.number,
      bedLabel: name.bedLabel(resident.bedId),
      bedId: resident.bedId,
      moveIn: resident.moveIn,
      moveOut: resident.moveOut,
      staying: resident.moveOut === null,
      openComplaints: store.complaints.filter(
        (complaint) => complaint.residentId === resident.id && isOpenComplaint(complaint.status),
      ).length,
    };
  });
}

export type BedChoice = {
  id: string;
  label: string;
};

function bedChoiceLabel(store: SessionRecords, bedId: string) {
  const name = labels(store);
  const bed = byId(store.beds, bedId);
  const room = byId(store.rooms, bed.roomId);
  return `${name.propertyName(room.propertyId)} · ${name.floorName(room.floorId)} · Room ${room.number} · Bed ${bed.label}`;
}

export async function listVacantBeds(): Promise<BedChoice[]> {
  const store = getSessionRecords();
  const taken = new Set(
    store.residents.filter((resident) => resident.moveOut === null).map((resident) => resident.bedId),
  );
  return store.beds
    .filter((bed) => !taken.has(bed.id))
    .map((bed) => ({
      id: bed.id,
      label: bedChoiceLabel(store, bed.id),
    }));
}

export type BedAssignment = BedChoice & { residentId: string | null };

export async function listBedAssignments(): Promise<BedAssignment[]> {
  const store = getSessionRecords();
  return store.beds.map((bed) => {
    const occupant = store.residents.find(
      (resident) => resident.bedId === bed.id && resident.moveOut === null,
    );
    return {
      id: bed.id,
      label: bedChoiceLabel(store, bed.id),
      residentId: occupant?.id ?? null,
    };
  });
}

export type ResidentStay = {
  id: string;
  name: string;
  staying: boolean;
  propertyName: string;
  locationLabel: string;
};

/** The resident role follows the first person added in this session. */
export async function getPrototypeResident(): Promise<ResidentStay | null> {
  const store = getSessionRecords();
  const resident = store.residents[0];
  if (!resident) {
    return null;
  }
  return getResidentStay(resident.id);
}

export async function getResidentStay(residentId: string): Promise<ResidentStay | null> {
  const store = getSessionRecords();
  const resident = store.residents.find((item) => item.id === residentId);
  if (!resident) {
    return null;
  }
  const name = labels(store);
  const room = byId(store.rooms, resident.roomId);
  return {
    id: resident.id,
    name: resident.name,
    staying: resident.moveOut === null,
    propertyName: name.propertyName(resident.propertyId),
    locationLabel: `Room ${room.number}, bed ${name.bedLabel(resident.bedId)}`,
  };
}

export type StaffSummary = {
  id: string;
  name: string;
  phone: string;
  skills: string;
  openAssignments: number;
};

export async function listStaff(): Promise<StaffSummary[]> {
  const store = getSessionRecords();
  return store.staff.map((person) => ({
    id: person.id,
    name: person.name,
    phone: person.phone,
    skills: person.skills.join(", "),
    openAssignments: store.complaints.filter(
      (complaint) => complaint.staffId === person.id && isOpenComplaint(complaint.status),
    ).length,
  }));
}

export type QrSummary = {
  id: string;
  propertyName: string;
  floorName: string;
  label: string;
  kind: "Room" | "Common area";
};

export async function listQrTargets(): Promise<QrSummary[]> {
  const store = getSessionRecords();
  const name = labels(store);
  return store.qrTargets.map((target) => ({
    id: target.id,
    propertyName: name.propertyName(target.propertyId),
    floorName: name.floorName(target.floorId),
    label: target.label,
    kind: target.kind,
  }));
}

export async function getDashboard() {
  const store = getSessionRecords();
  const propertySummaries = await listProperties();
  const complaintItems = store.complaints;
  const open = complaintItems.filter((item) => isOpenComplaint(item.status));
  const occupied = propertySummaries.reduce((sum, item) => sum + item.occupied, 0);
  const bedCount = store.beds.length;

  const categories = complaintItems.reduce<Record<string, number>>((counts, complaint) => {
    counts[complaint.category] = (counts[complaint.category] ?? 0) + 1;
    return counts;
  }, {});

  const months = ["2026-06", "2026-07", "2026-08", "2026-09", "2026-10", "2026-11"];
  const resolutionTrend = months.map((month) => ({
    month,
    resolved: complaintItems.filter((item) => item.resolvedAt?.startsWith(month)).length,
  }));

  const events = [...store.events].sort((a, b) => (a.at < b.at ? 1 : -1));

  return {
    asOf: sampleAsOf,
    occupancy: {
      properties: store.properties.length,
      rooms: store.rooms.length,
      beds: bedCount,
      occupied,
      available: bedCount - occupied,
      residents: store.residents.filter((resident) => resident.moveOut === null).length,
    },
    complaints: {
      new: open.filter((item) => item.status === "New").length,
      pending: open.filter((item) =>
        ["Assigned", "Accepted", "On Hold", "Reopened"].includes(item.status),
      ).length,
      inProgress: open.filter((item) => item.status === "In Progress").length,
      overdue: open.filter((item) => isOverdue(item)).length,
      resolved: complaintItems.filter((item) => item.status === "Resolved").length,
    },
    categories: Object.entries(categories)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count),
    resolutionTrend,
    recentComplaints: events.slice(0, 5),
    recentStaffActivity: events
      .filter((event) => store.staff.some((person) => person.name === event.actor))
      .slice(0, 4),
  };
}
