import { useQuery } from "@tanstack/react-query";
import { getVendors, getVendor } from "./vendorsApi";

export const useVendors = () => {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: () => getVendors(),
  });
};

export const useGetVendor = (vendorId: string) => {
  return useQuery({
    queryKey: ["vendor", vendorId],
    queryFn: () => getVendor(vendorId),
  });
};
