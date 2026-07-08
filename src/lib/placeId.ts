/** Place IDs are opaque tokens (no spaces/commas). Addresses always have spaces. */
export function isGooglePlaceId(value: string): boolean {
  const v = value.trim();
  if (v.length < 10) return false;
  if (/\s|,/.test(v)) return false;
  return /^[A-Za-z0-9_-]+$/.test(v);
}
