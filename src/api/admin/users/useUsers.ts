import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getUser, getUsers, userWalletAction, userAccountAction } from "./usersApi";
import { toast } from "sonner";


export const useUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });
};

export const useUserWalletAction = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (action: string) => userWalletAction(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      toast.success(`Rider wallet updated successfully`);
    },
    onError: (error: any) => {
      toast.error(error?.message ?? "Failed to update rider wallet.");
    },
  });
};

export const useUserAccountAction = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (action: string) => userAccountAction(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      toast.success(`Rider account updated successfully`);
    },
    onError: (error: any) => {
      toast.error(error?.message ?? "Failed to update rider account.");
    },
  });
};
