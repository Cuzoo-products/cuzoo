import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getWalletDetails,
  addBankAccount,
  deleteBankAccount,
  getBankList,
  getFinanceOverview,
  getPayout,
  getPayouts,
  getVerifyAccount,
  inflowHistory,
  outflowHistory,
  requestWithdrawal,
  type GetFleetFinanceHistoryParams,
  type GetFleetPayoutsParams,
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

export const useWalletDetails = () => {
  return useQuery({
    queryKey: ["walletDetails"],
    queryFn: getWalletDetails,
  });
};

export const useFinanceOverview = () => {
  return useQuery({
    queryKey: ["fleet-finance-overview"],
    queryFn: getFinanceOverview,
  });
};

export const useInflow = (params?: GetFleetFinanceHistoryParams) => {
  return useQuery({
    queryKey: ["fleet-inflow", params],
    queryFn: () => inflowHistory(params),
  });
};

export const useOutflow = (params?: GetFleetFinanceHistoryParams) => {
  return useQuery({
    queryKey: ["fleet-outflow", params],
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

export const useGetPayouts = (params?: GetFleetPayoutsParams) => {
  return useQuery({
    queryKey: ["fleet-payouts", params],
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
