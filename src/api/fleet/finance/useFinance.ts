import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getWalletDetails,
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addBankAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["walletDetails"] });
      toast.success("Bank account added successfully");
    },
    onError: () => {
      toast.error("Failed to add bank account");
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
    onError: () => {
      toast.error("Failed to delete bank account");
    },
  });
};

export const useWalletDetails = () => {
  return useQuery({
    queryKey: ["walletDetails"],
    queryFn: getWalletDetails,
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
