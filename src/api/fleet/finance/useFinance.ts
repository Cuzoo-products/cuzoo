import { useMutation, useQuery } from "@tanstack/react-query";
import {
  accountBalance,
  addBankAccount,
  deleteBankAccount,
  getBankList,
  getPayout,
  getPayouts,
  getVerifyAccount,
  inflowHistory,
  outflowHistory,
  requestWithdrawal,
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
  return useQuery({
    queryKey: ["getVerifyAccount", accountNumber, bankCode],
    queryFn: () => getVerifyAccount(accountNumber, bankCode),
    enabled: !!accountNumber && !!bankCode,
  });
};

export const useAddBankAccount = () => {
  return useMutation({
    mutationFn: addBankAccount,
    onError: () => {
      toast.error("Failed to add bank account");
    },
  });
};

export const useDeleteBankAccount = () => {
  return useMutation({
    mutationFn: deleteBankAccount,
    onSuccess: () => {
      toast.success("Bank account deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete bank account");
    },
  });
};

export const useAccountBalance = () => {
  return useQuery({
    queryKey: ["accountBalance"],
    queryFn: accountBalance,
  });
};

export const useInflow = () => {
  return useQuery({
    queryKey: ["inflow"],
    queryFn: inflowHistory,
  });
};

export const useOutflow = () => {
  return useQuery({
    queryKey: ["outflow"],
    queryFn: outflowHistory,
  });
};

export const useRequestWithdrawal = () => {
  return useMutation({
    mutationFn: requestWithdrawal,
    onSuccess: () => {
      toast.success("Withdrawal request submitted successfully");
    },
    onError: () => {
      toast.error("Failed to submit withdrawal request");
    },
  });
};

export const useGetPayouts = () => {
  return useQuery({
    queryKey: ["payouts"],
    queryFn: getPayouts,
  });
};

export const useGetPayout = (id: string) => {
  return useQuery({
    queryKey: ["payout", id],
    queryFn: () => getPayout(id),
    enabled: !!id,
  });
};
