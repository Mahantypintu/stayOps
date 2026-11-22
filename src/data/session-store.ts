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

export type SessionRecords = {
  properties: PropertyRecord[];
  floors: FloorRecord[];
  rooms: RoomRecord[];
  beds: BedRecord[];
  residents: ResidentRecord[];
  staff: StaffRecord[];
  qrTargets: QrTargetRecord[];
  complaints: ComplaintRecord[];
  events: ComplaintEventRecord[];
};

const globalStore = globalThis as typeof globalThis & {
  __stayopsRecords?: SessionRecords;
};

function cloneSample(): SessionRecords {
  return {
    properties: structuredClone(properties),
    floors: structuredClone(floors),
    rooms: structuredClone(rooms),
    beds: structuredClone(beds),
    residents: structuredClone(residents),
    staff: structuredClone(staff),
    qrTargets: structuredClone(qrTargets),
    complaints: structuredClone(complaints),
    events: structuredClone(complaintEvents),
  };
}

/** In-memory copy of the sample records for this server process. Not a database. */
export function getSessionRecords(): SessionRecords {
  if (!globalStore.__stayopsRecords) {
    globalStore.__stayopsRecords = cloneSample();
  }
  return globalStore.__stayopsRecords;
}

export function resetSessionRecords() {
  globalStore.__stayopsRecords = cloneSample();
}
