import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createProduct,
  getProducts,
  updateProduct,
  getOneProduct,
} from "./productApi";

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success("Product created successfully");
    },
    onError: () => {
      toast.error("Failed to create product");
    },
  });
};

export const useGetProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
};

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      toast.success("Product updated successfully");
    },
    onError: () => {
      toast.error("Failed to update product");
    },
  });
};

export const useGetOneProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getOneProduct(id),
  });
};
