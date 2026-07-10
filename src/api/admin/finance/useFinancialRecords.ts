import { useQuery } from "@tanstack/react-query";
import {
  getFinancialRecords,
  type GetFinancialRecordsParams,
} from "./financialRecords";

export const useFinancialRecords = (params?: GetFinancialRecordsParams) => {
  return useQuery({
    queryKey: ["admin-financial-records", params],
    queryFn: () => getFinancialRecords(params),
  });
};
