/** Prefer explicit recipient; otherwise use account name from bank details. */
export function displayRecipientLine(
  recipient: string | undefined,
  accountName: string | undefined,
): string {
  const r = (recipient ?? "").trim();
  const a = (accountName ?? "").trim();
  if (r) return r;
  if (a) return a;
  return "";
}
