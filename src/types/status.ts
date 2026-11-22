export const statusTones = [
  "neutral",
  "info",
  "success",
  "warning",
  "danger",
] as const;

export type StatusTone = (typeof statusTones)[number];
