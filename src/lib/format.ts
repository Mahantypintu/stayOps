const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatSampleDate(iso: string) {
  const [date] = iso.split("T");
  const [year, month, day] = date.split("-");
  return `${Number(day)} ${months[Number(month) - 1]} ${year}`;
}

export function formatSampleDateTime(iso: string) {
  const time = iso.split("T")[1]?.slice(0, 5) ?? "";
  return `${formatSampleDate(iso)}, ${time}`;
}

export function dateKey(iso: string) {
  return iso.slice(0, 10);
}
