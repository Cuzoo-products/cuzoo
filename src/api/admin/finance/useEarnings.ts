import { useQuery } from "@tanstack/react-query";
import { getAdminEarnings } from "./earnings";

export const useAdminEarnings = () =>
  useQuery({
    queryKey: ["admin-earnings"],
    queryFn: getAdminEarnings,
  });
