/** Public store URL pattern — update base when the live domain is confirmed. */
export const STORE_PUBLIC_URL_BASE = "https://www.cuzoo.com/store";

export function buildStoreUrl(storeCode: string): string {
  const code = storeCode.trim();
  if (!code) return STORE_PUBLIC_URL_BASE;
  return `${STORE_PUBLIC_URL_BASE}/${encodeURIComponent(code)}`;
}
