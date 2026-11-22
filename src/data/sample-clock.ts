/** Fixed clock for the sample PG so overdue counts do not change between visits. */
export const sampleAsOf = "2026-11-22T09:00:00+05:30";

export const sampleResidentId = "res_meera";
export const sampleStaffId = "staff_ravi";

export const prototypePeople = {
  manager: { name: "Sample manager", label: "Property manager" },
  resident: { name: "Meera Iyer", label: "Resident" },
  staff: { name: "Ravi Kumar", label: "Maintenance staff" },
} as const;
