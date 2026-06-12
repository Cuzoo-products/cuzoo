export function buildRiderUsername(
  firstName: string,
  lastName: string,
  businessName: string,
): string {
  const part = (value: string) =>
    value.trim().toLowerCase().replace(/\s+/g, "");

  return `${part(firstName)}.${part(lastName)}@${part(businessName)}.cuzoo`;
}
