import {
  beds,
  complaintEvents,
  complaints,
  floors,
  properties,
  qrTargets,
  residents,
  rooms,
  staff,
} from "@/data/sample-records";
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
    throw new Error(`Missing sample record ${id}`);
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

function propertyName(id: string) {
  return byId(properties, id).name;
}

function floorName(id: string | null) {
  return id ? byId(floors, id).name : "—";
}

function roomNumber(id: string | null) {
  return id ? byId(rooms, id).number : "—";
}

function bedLabel(id: string | null) {
  return id ? byId(beds, id).label : "—";
}

function residentName(id: string) {
  return byId(residents, id).name;
}

function staffName(id: string | null) {
  return id ? byId(staff, id).name : "Unassigned";
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

function toListItem(complaint: ComplaintRecord): ComplaintListItem {
  return {
    id: complaint.id,
    title: complaint.title,
    category: complaint.category,
    priority: complaint.priority,
    status: complaint.status,
    propertyName: propertyName(complaint.propertyId),
    locationLabel: complaint.locationLabel,
    residentName: residentName(complaint.residentId),
    staffName: staffName(complaint.staffId),
    reportedAt: complaint.reportedAt,
    overdue: isOverdue(complaint),
  };
}

export async function listComplaints(): Promise<ComplaintListItem[]> {
  return complaints
    .map(toListItem)
    .sort((a, b) => (a.reportedAt < b.reportedAt ? 1 : -1));
}

export async function getComplaint(id: string): Promise<ComplaintDetail | null> {
  const complaint = complaints.find((item) => item.id === id);
  if (!complaint) {
    return null;
  }

  return {
    ...toListItem(complaint),
    residentId: complaint.residentId,
    staffId: complaint.staffId,
    description: complaint.description,
    floorName: floorName(complaint.floorId),
    roomNumber: roomNumber(complaint.roomId),
    bedLabel: bedLabel(complaint.bedId),
    expectedResolution: complaint.expectedResolution,
    resolvedAt: complaint.resolvedAt,
    resolutionRemarks: complaint.resolutionRemarks,
    managerNote: complaint.managerNote,
    hasReportPhotos: complaint.hasReportPhotos,
    hasCompletionPhotos: complaint.hasCompletionPhotos,
    events: complaintEvents
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
  const items = await listComplaints();
  const residentComplaintIds = new Set(
    complaints.filter((item) => item.residentId === residentId).map((item) => item.id),
  );
  return items.filter((item) => residentComplaintIds.has(item.id));
}

export async function listComplaintsForStaff(staffId: string) {
  const assigned = new Set(
    complaints.filter((item) => item.staffId === staffId).map((item) => item.id),
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
  return properties.map((property) => {
    const propertyRooms = rooms.filter((room) => room.propertyId === property.id);
    const roomIds = new Set(propertyRooms.map((room) => room.id));
    const propertyBeds = beds.filter((bed) => roomIds.has(bed.roomId));
    const occupied = residents.filter(
      (resident) => resident.propertyId === property.id && resident.moveOut === null,
    ).length;

    return {
      id: property.id,
      name: property.name,
      address: property.address,
      city: property.city,
      floors: floors.filter((floor) => floor.propertyId === property.id).length,
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
  return rooms.map((room) => {
    const roomBeds = beds.filter((bed) => bed.roomId === room.id);
    const occupied = residents.filter(
      (resident) => resident.roomId === room.id && resident.moveOut === null,
    ).length;

    return {
      id: room.id,
      number: room.number,
      propertyName: propertyName(room.propertyId),
      floorName: floorName(room.floorId),
      beds: roomBeds.length,
      occupied,
      available: roomBeds.length - occupied,
    };
  });
}

export type ResidentSummary = {
  id: string;
  name: string;
  phone: string;
  propertyName: string;
  floorName: string;
  roomNumber: string;
  bedLabel: string;
  moveIn: string;
  openComplaints: number;
};

export async function listResidents(): Promise<ResidentSummary[]> {
  return residents
    .filter((resident) => resident.moveOut === null)
    .map((resident) => {
      const room = byId(rooms, resident.roomId);
      return {
        id: resident.id,
        name: resident.name,
        phone: resident.phone,
        propertyName: propertyName(resident.propertyId),
        floorName: floorName(room.floorId),
        roomNumber: room.number,
        bedLabel: bedLabel(resident.bedId),
        moveIn: resident.moveIn,
        openComplaints: complaints.filter(
          (complaint) =>
            complaint.residentId === resident.id && isOpenComplaint(complaint.status),
        ).length,
      };
    });
}

export type StaffSummary = {
  id: string;
  name: string;
  phone: string;
  skills: string;
  openAssignments: number;
};

export async function listStaff(): Promise<StaffSummary[]> {
  return staff.map((person) => ({
    id: person.id,
    name: person.name,
    phone: person.phone,
    skills: person.skills.join(", "),
    openAssignments: complaints.filter(
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
  return qrTargets.map((target) => ({
    id: target.id,
    propertyName: propertyName(target.propertyId),
    floorName: floorName(target.floorId),
    label: target.label,
    kind: target.kind,
  }));
}

export async function getDashboard() {
  const propertySummaries = await listProperties();
  const complaintItems = complaints;
  const open = complaintItems.filter((item) => isOpenComplaint(item.status));
  const occupied = propertySummaries.reduce((sum, item) => sum + item.occupied, 0);
  const bedCount = beds.length;

  const categories = complaintItems.reduce<Record<string, number>>((counts, complaint) => {
    counts[complaint.category] = (counts[complaint.category] ?? 0) + 1;
    return counts;
  }, {});

  const months = ["2026-06", "2026-07", "2026-08", "2026-09", "2026-10", "2026-11"];
  const resolutionTrend = months.map((month) => ({
    month,
    resolved: complaintItems.filter((item) => item.resolvedAt?.startsWith(month)).length,
  }));

  const events = [...complaintEvents].sort((a, b) => (a.at < b.at ? 1 : -1));

  return {
    asOf: sampleAsOf,
    occupancy: {
      properties: properties.length,
      rooms: rooms.length,
      beds: bedCount,
      occupied,
      available: bedCount - occupied,
      residents: residents.filter((resident) => resident.moveOut === null).length,
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
      .filter((event) => staff.some((person) => person.name === event.actor))
      .slice(0, 4),
  };
}
