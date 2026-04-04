import { useQuery } from "@tanstack/react-query";
import { getVehicle, getVehicles } from "./vehicle";

export const useGetVehicles = () => {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: () => getVehicles(),
  });
};

export const useGetVehicle = (id: string | undefined) => {
  const safe =
    id && id !== "" && id !== "undefined" && id !== "null" ? id : undefined;
  return useQuery({
    queryKey: ["vehicle", safe],
    queryFn: () => getVehicle(safe as string),
    enabled: Boolean(safe),
  });
};
