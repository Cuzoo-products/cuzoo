export function formatDisplayId(
  id: string | undefined | null,
  len = 5,
): string {
  const s = (id ?? "").trim();
  if (!s) return "—";
  if (s.length <= len) return s;
  return s.slice(-len);
}
