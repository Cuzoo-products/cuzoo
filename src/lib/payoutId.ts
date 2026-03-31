/** Backend may return `Id` (PascalCase) or `id` (camelCase). */
export function payoutRecordId(row: {
  Id?: string;
  id?: string;
}): string {
  const v = row.Id ?? row.id;
  return v != null && String(v) !== "" ? String(v) : "";
}

/** Route param is invalid if missing or the literal strings from bad links. */
export function sanitizePayoutRouteId(
  param: string | undefined,
): string | undefined {
  if (param == null || param === "") return undefined;
  if (param === "undefined" || param === "null") return undefined;
  return param;
}
