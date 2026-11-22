import type { ComplaintPriority, ComplaintStatus } from "@/types/operations";
import type { StatusTone } from "@/types/status";

export function complaintStatusTone(status: ComplaintStatus): StatusTone {
  if (status === "Resolved") return "success";
  if (status === "In Progress" || status === "On Hold") return "warning";
  if (status === "Reopened") return "danger";
  return "info";
}

export function complaintPriorityTone(priority: ComplaintPriority): StatusTone {
  if (priority === "Emergency") return "danger";
  if (priority === "High") return "warning";
  if (priority === "Medium") return "info";
  return "neutral";
}
