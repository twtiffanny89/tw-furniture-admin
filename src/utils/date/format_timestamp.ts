export function formatTimestamp(timestamp: string | null | undefined): string {
  if (timestamp) {
    const date = new Date(timestamp);

    // Adjust to Cambodia time zone (+07:00)
    date.setTime(date.getTime() + 7 * 60 * 60 * 1000);

    // Format the date (yyyy-MM-dd)
    const formattedDate = date.toISOString().split("T")[0];

    // Format the time with AM/PM (hh:mm:ss a)
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const period = hours >= 12 ? "PM" : "AM";
    const formattedTime = `${hours % 12 || 12}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${period}`;

    // Return the combined string
    return `${formattedDate} - ${formattedTime}`;
  }
  return "";
}
