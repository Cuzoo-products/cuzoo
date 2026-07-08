import { useQuery } from "@tanstack/react-query";
import {
  getOrderForAdmin,
  getOrdersForAdmin,
  getOrdersForAdminByCompanyId,
  getOrdersForAdminByRiderId,
  getOrdersForAdminByUserId,
  getOrdersForAdminByVendorId,
  type GetAdminOrdersParams,
} from "./orders";

export const useGetOrdersForAdmin = (params?: GetAdminOrdersParams) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => getOrdersForAdmin(params),
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
  companyId: string | undefined,
  params?: Omit<GetAdminOrdersParams, "companyId">,
) => {
  const safe =
    companyId && companyId !== "" && companyId !== "undefined" && companyId !== "null"
      ? companyId
      : undefined;
  return useQuery({
    queryKey: ["admin-orders-by-company", safe, params],
    queryFn: () => getOrdersForAdminByCompanyId(safe as string, params),
    enabled: Boolean(safe),
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

