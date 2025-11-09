import { toast } from "sonner";
import {
  createAdmin,
  getAdmin,
  getAllAdmins,
  toggleReleaseAdmin,
} from "./adminApi";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateAdmin = () => {
  return useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      toast.success("Admin created successfully");
    },
    onError: () => {
      toast.error("Failed to create admin");
    },
  });
};

export const useGetAdmin = (id: string) => {
  return useQuery({
    queryKey: ["admin", id],
    queryFn: () => getAdmin(id),
  });
};

export const useToggleReleaseAdmin = () => {
  return useMutation({
    mutationFn: toggleReleaseAdmin,
    onSuccess: () => {
      toast.success("Admin status changed successfully");
    },
    onError: () => {
      toast.error("Failed to change admin status");
    },
  });
};

export const useGetAllAdmins = () => {
  return useQuery({
    queryKey: ["admins"],
    queryFn: () => getAllAdmins(),
  });
};
