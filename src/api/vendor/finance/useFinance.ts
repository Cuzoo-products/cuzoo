import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  accountBalance,
  addBankAccount,
  deleteBankAccount,
  getBankList,
  getFinanceOverview,
  getPayout,
  getPayouts,
  getVerifyAccount,
  getWalletDetails,
  inflowHistory,
  outflowHistory,
  requestWithdrawal,
  type GetVendorFinanceHistoryParams,
  type GetVendorPayoutsParams,
} from "./finance";
import { toast } from "sonner";

export const useGetBankList = () => {
  return useQuery({
    queryKey: ["getBankList"],
    queryFn: getBankList,
  });
};

export const useGetVerifyAccount = (
  accountNumber: string,
  bankCode: string,
) => {
  const canVerify = /^\d{10}$/.test(accountNumber) && !!bankCode;

  return useQuery({
    queryKey: ["getVerifyAccount", accountNumber, bankCode],
    queryFn: () => getVerifyAccount(accountNumber, bankCode),
    enabled: canVerify,
  });
};

export const useAddBankAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addBankAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["walletDetails"] });
      toast.success("Bank account added successfully");
    },
    onError: (e) => {
      toast.error(e.message || "Failed to add bank account");
    },
  });
};

export const useDeleteBankAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBankAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["walletDetails"] });
      toast.success("Bank account deleted successfully");
    },
    onError: (e) => {
      toast.error(e.message || "Failed to delete bank account");
    },
  });
};

export const useAccountBalance = () => {
  return useQuery({
    queryKey: ["accountBalance"],
    queryFn: accountBalance,
  });
};

export const useWalletDetails = () => {
  return useQuery({
    queryKey: ["walletDetails"],
    queryFn: getWalletDetails,
  });
};

export const useFinanceOverview = () => {
  return useQuery({
    queryKey: ["vendor-finance-overview"],
    queryFn: getFinanceOverview,
  });
};

export const useInflow = (params?: GetVendorFinanceHistoryParams) => {
  return useQuery({
    queryKey: ["inflow", params],
    queryFn: () => inflowHistory(params),
  });
};

export const useOutflow = (params?: GetVendorFinanceHistoryParams) => {
  return useQuery({
    queryKey: ["outflow", params],
    queryFn: () => outflowHistory(params),
  });
};

export const useRequestWithdrawal = () => {
  return useMutation({
    mutationFn: requestWithdrawal,
    onSuccess: () => {
      toast.success("Withdrawal request submitted successfully");
    },
    onError: (e) => {
      toast.error(e.message || "Failed to submit withdrawal request");
    },
  });
};

export const useGetPayouts = (params?: GetVendorPayoutsParams) => {
  return useQuery({
    queryKey: ["payouts", params],
    queryFn: () => getPayouts(params),
  });
};

export const useGetPayout = (id: string) => {
  return useQuery({
    queryKey: ["payout", id],
    queryFn: () => getPayout(id),
    enabled: !!id,
  });
};
