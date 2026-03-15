import axiosInstance from "@/api/axiosInstances";

export const getBankList = async () => {
  const response = await axiosInstance.get("payments/banks");
  return response.data;
};

export const getVerifyAccount = async (
  accountNumber: string,
  bankCode: string,
) => {
  const response = await axiosInstance.get(
    `/payments/verify-account?accountNumber=${accountNumber}&bankCode=${bankCode}`,
  );
  return response.data;
};

export const addBankAccount = async (data: any) => {
  const response = await axiosInstance.post("/fleets/wallet", data);
  return response.data;
};

export const deleteBankAccount = async (data: any) => {
  const response = await axiosInstance.put("/fleets/wallet", data);
  return response.data;
};

export const getWalletDetails = async () => {
  const response = await axiosInstance.get("/fleets/wallet");
  return response.data;
};

export const inflowHistory = async () => {
  const response = await axiosInstance.get("/fleets/finance/inflow-history");
  return response.data;
};

export const outflowHistory = async () => {
  const response = await axiosInstance.get("/fleets/finance/outflow-history");
  return response.data;
};

export const requestWithdrawal = async (data: {
  accountNumber: string;
  amount: number;
}) => {
  const response = await axiosInstance.post(
    "/fleets/wallet/request-withdrawal",
    data,
  );
  return response.data;
};

export const getPayouts = async () => {
  const response = await axiosInstance.get("/fleets/payouts");
  return response.data;
};

export const getPayout = async (id: string) => {
  const response = await axiosInstance.get(`/fleets/payouts/${id}`);
  return response.data;
};
