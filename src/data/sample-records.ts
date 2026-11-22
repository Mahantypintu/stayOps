import type {
  BedRecord,
  ComplaintEventRecord,
  ComplaintRecord,
  FloorRecord,
  PropertyRecord,
  QrTargetRecord,
  ResidentRecord,
  RoomRecord,
  StaffRecord,
} from "@/types/operations";

export const properties: PropertyRecord[] = [];

export const floors: FloorRecord[] = [];

export const rooms: RoomRecord[] = [];

export const beds: BedRecord[] = [];

export const residents: ResidentRecord[] = [];

export const staff: StaffRecord[] = [
  {
    id: "staff_ravi",
    name: "Ravi Kumar",
    phone: "90000 10001",
    skills: ["Plumbing", "Electrical"],
  },
  {
    id: "staff_anita",
    name: "Anita Joseph",
    phone: "90000 10002",
    skills: ["Housekeeping", "Common areas"],
  },
  {
    id: "staff_imran",
    name: "Imran Qureshi",
    phone: "90000 10003",
    skills: ["AC and ventilation", "Appliances"],
  },
  {
    id: "staff_leela",
    name: "Leela Thomas",
    phone: "90000 10004",
    skills: ["Wi-Fi and internet", "Security"],
  },
];

export const qrTargets: QrTargetRecord[] = [];

export const complaints: ComplaintRecord[] = [];

export const complaintEvents: ComplaintEventRecord[] = [];
