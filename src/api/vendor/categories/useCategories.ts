import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createCategory,
  getCategories,
  getOneCategory,
  updateCategory,
} from "./catApi";
import { toast } from "sonner";

export const useCreateCategory = () => {
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Category created successfully");
    },
    onError: (e) => {
      toast.error(e.message || "Failed to create category");
    },
  });
};

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};

export const useUpdateCategory = () => {
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      toast.success("Category updated successfully");
    },
    onError: (e) => {
      console.log(e);
      toast.error(e.message || "Failed to update category");
    },
  });
};

export const useGetOneCategory = (id: string) => {
  return useQuery({
    queryKey: ["category"],
    queryFn: () => getOneCategory(id),
  });
};
