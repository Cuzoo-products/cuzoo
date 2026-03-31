import { useQuery } from "@tanstack/react-query";
import { getOrderForAdmin, getOrdersForAdmin } from "./orders";

export const useGetOrdersForAdmin = (orderType: string) => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrdersForAdmin(orderType),
  });
};

export const useGetOrder = (id: string) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderForAdmin(id),
  });
};
