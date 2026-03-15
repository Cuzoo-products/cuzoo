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
  const response = await axiosInstance.post("/vendors/wallet", data);
  return response.data;
};

export const deleteBankAccount = async (data: any) => {
  const response = await axiosInstance.put("/vendors/wallet", data);
  return response.data;
};

export const accountBalance = async () => {
  const response = await axiosInstance.get("/vendors/wallet");
  return response.data;
};

export const inflowHistory = async () => {
  const response = await axiosInstance.get("/vendors/finance/inflow-history");
  return response.data;
};

export const outflowHistory = async () => {
  const response = await axiosInstance.get("/vendors/finance/outflow-history");
  return response.data;
};

export const requestWithdrawal = async (data: {
  accountNumber: string;
  amount: number;
}) => {
  const response = await axiosInstance.post(
    "/vendors/wallet/request-withdrawal",
    data,
  );
  return response.data;
};

export const getPayouts = async () => {
  const response = await axiosInstance.get("/vendors/payouts");
  return response.data;
};

export const getPayout = async (id: string) => {
  const response = await axiosInstance.get(`/vendors/payouts/${id}`);
  return response.data;
};
