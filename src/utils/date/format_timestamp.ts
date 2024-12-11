// utils.ts

export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  // Format the date (yyyy-MM-dd)
  const formattedDate = date.toISOString().split("T")[0];

  // Format the time (HH:mm:ss)
  const formattedTime = date.toISOString().split("T")[1].split(".")[0];

  // Return the combined string
  return `${formattedDate} - ${formattedTime}`;
}
