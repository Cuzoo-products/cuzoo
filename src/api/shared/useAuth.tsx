import { useQuery } from "@tanstack/react-query";
import { getUserDetails } from "./auth";
import type { User } from "firebase/auth";

export const useGetUserDetails = (user: User | null) => {
  return useQuery({
    queryKey: ["getUserDetails", user?.uid],
    queryFn: () => getUserDetails(),
    enabled: !!user,
  });
};
