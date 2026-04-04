import { useQuery } from "@tanstack/react-query";
import {
  getOrderForAdmin,
  getOrderForAdminByFleetId,
  getOrdersForAdmin,
  getOrdersForAdminByRiderId,
  getOrdersForAdminByUserId,
  getOrdersForAdminByVendorId,
} from "./orders";


export const useGetOrdersForAdmin = (orderType: string) => {
  return useQuery({
    queryKey: ["orders", orderType],
    queryFn: () => getOrdersForAdmin(orderType),
  });
};

export const useGetOrderForAdmin = (id: string | undefined) => {
  const safe =
    id && id !== "" && id !== "undefined" && id !== "null" ? id : undefined;
  return useQuery({
    queryKey: ["admin-order", safe],
    queryFn: () => getOrderForAdmin(safe as string),
    enabled: Boolean(safe),
  });
};

/** Pass `orderType` only if the API requires it (e.g. `"Shopping"`); omit for mixed lists. */
export const useGetOrdersForAdminByUserId = (
  userId: string | undefined,
  orderType?: string,
) => {
  const safe =
    userId && userId !== "" && userId !== "undefined" && userId !== "null"
      ? userId
      : undefined;
  return useQuery({
    queryKey: ["admin-orders-by-user", safe, orderType ?? "all"],
    queryFn: () => getOrdersForAdminByUserId(safe as string, orderType),
    enabled: Boolean(safe),
  });
};

export const useGetOrdersForAdminByCompanyId = (
  orderType: string,
  companyId: string | undefined,
) => {
  const safe =
    companyId && companyId !== "" && companyId !== "undefined" && companyId !== "null"
      ? companyId
      : undefined;
  return useQuery({
    queryKey: ["admin-orders-by-company", orderType, safe],
    queryFn: () => getOrderForAdminByFleetId(orderType, safe as string),
    enabled: Boolean(safe && orderType),
  });
};

export const useGetOrdersForAdminByRiderId = (
  orderType: string,
  riderId: string | undefined,
) => {
  const safe =
    riderId && riderId !== "" && riderId !== "undefined" && riderId !== "null"
      ? riderId
      : undefined;
  return useQuery({
    queryKey: ["admin-orders-by-rider", orderType, safe],
    queryFn: () => getOrdersForAdminByRiderId(orderType, safe as string),
    enabled: Boolean(safe && orderType),
  });
};

export const useGetOrdersForAdminByVendorId = (
  orderType: string,
  vendorId: string | undefined,
) => {
  const safe =
    vendorId && vendorId !== "" && vendorId !== "undefined" && vendorId !== "null"
      ? vendorId
      : undefined;
  return useQuery({
    queryKey: ["admin-orders-by-vendor", orderType, safe],
    queryFn: () => getOrdersForAdminByVendorId(orderType, safe as string),
    enabled: Boolean(safe && orderType),
  });
};

