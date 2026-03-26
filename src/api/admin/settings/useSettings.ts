import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type GeneralSetting,
  getGeneralSetting,
  updateGeneralSetting,
} from "./settings";
import { toast } from "sonner";

export const useGeneralSetting = () =>
  useQuery({
    queryKey: ["general-setting"],
    queryFn: () => getGeneralSetting(),
  });

export const useUpdateGeneralSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GeneralSetting) => updateGeneralSetting(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["general-setting"] });
      toast.success("Settings saved successfully!");
    },
    onError: (error) => {
      toast.error(error?.message ?? "Failed to update settings.");
    },
  });
};
