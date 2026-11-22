export const complaintCategories = [
  "Plumbing",
  "Electrical",
  "AC and ventilation",
  "Wi-Fi and internet",
  "Housekeeping",
  "Furniture",
  "Appliances",
  "Security",
  "Common areas",
  "Other",
] as const;

export const complaintPriorities = ["Low", "Medium", "High", "Emergency"] as const;

export const complaintStatuses = [
  "New",
  "Assigned",
  "Accepted",
  "In Progress",
  "On Hold",
  "Resolved",
  "Reopened",
] as const;

export type ComplaintCategory = (typeof complaintCategories)[number];
export type ComplaintPriority = (typeof complaintPriorities)[number];
export type ComplaintStatus = (typeof complaintStatuses)[number];

export type PropertyRecord = {
  id: string;
  name: string;
  address: string;
  city: string;
};

export type FloorRecord = {
  id: string;
  propertyId: string;
  name: string;
};

export type RoomRecord = {
  id: string;
  propertyId: string;
  floorId: string;
  number: string;
};

export type BedRecord = {
  id: string;
  roomId: string;
  label: string;
};

export type ResidentRecord = {
  id: string;
  name: string;
  phone: string;
  propertyId: string;
  roomId: string;
  bedId: string;
  moveIn: string;
  moveOut: string | null;
};

export type StaffRecord = {
  id: string;
  name: string;
  phone: string;
  skills: ComplaintCategory[];
};

export type QrTargetRecord = {
  id: string;
  propertyId: string;
  floorId: string | null;
  roomId: string | null;
  label: string;
  kind: "Room" | "Common area";
};

export type ComplaintRecord = {
  id: string;
  propertyId: string;
  floorId: string | null;
  roomId: string | null;
  bedId: string | null;
  residentId: string;
  locationLabel: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  staffId: string | null;
  reportedAt: string;
  expectedResolution: string | null;
  resolvedAt: string | null;
  resolutionRemarks: string | null;
  managerNote: string | null;
  hasReportPhotos: boolean;
  hasCompletionPhotos: boolean;
};

export type ComplaintEventRecord = {
  id: string;
  complaintId: string;
  at: string;
  actor: string;
  summary: string;
};
