export function generateTrackingId() {
  const date = new Date();
  const dateStr = date.toISOString().split("T")[0].replace(/-/g, "");
  const randomPart = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  return `TRK-${dateStr}-${randomPart}`;
}
