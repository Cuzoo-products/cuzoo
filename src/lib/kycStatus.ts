export function hasSubmittedKyc(
  registrationNumber?: string | null,
): boolean {
  return Boolean(registrationNumber?.trim());
}
