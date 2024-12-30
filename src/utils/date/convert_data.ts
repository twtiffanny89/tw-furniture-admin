export function convertDate(dateString: string) {
  const date = new Date(dateString);
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

export function convertToISOString(dateStr: string): string {
  const date = new Date(dateStr); // Convert string to Date object
  // Ensure the time is set to midnight if necessary
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
}
