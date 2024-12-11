export function openGoogleMap(lat: string, lng: string): void {
  const url = `https://www.google.com/maps?q=${lat},${lng}`;
  window.open(url, "_blank"); // Opens in a new tab
}
