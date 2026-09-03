export const numberWithCommas = (num: string | number | undefined) => {
  if (num === undefined || num === null || num === "unknown") return "Unknown";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export function geoToLatLng(coordinates: number[]): [number, number] {
  const [lng, lat] = coordinates;
  return [lat, lng];
}

export function matchesQuery(haystack: string, query: string): number {
  const h = haystack.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  if (h === q) return 1000;
  if (h.startsWith(q)) return 500;
  if (h.includes(q)) return 100;
  return 0;
}
