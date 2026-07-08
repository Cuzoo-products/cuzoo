import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

/** Drop all cached API data so the next login never sees the previous user's data. */
export function clearQueryCache() {
  queryClient.cancelQueries();
  queryClient.clear();
}
