import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  approveFleetPayout,
  approveRiderPayout,
  approveVendorPayout,
  getFleetPayout,
  getFleetsPayouts,
  getRiderPayout,
  getRidersPayouts,
  getVendorPayout,
  getVendorsPayouts,
  rejectFleetPayout,
  rejectRiderPayout,
  rejectVendorPayout,
} from "./payoutsApi";

export const useVendorsPayouts = () =>
  useQuery({
    queryKey: ["vendors-payouts"],
    queryFn: getVendorsPayouts,
  });

export const useVendorPayout = (id: string, enabled = true) =>
  useQuery({
    queryKey: ["vendor-payout", id],
    queryFn: () => getVendorPayout(id),
    enabled: enabled && !!id,
  });

export const useApproveVendorPayout = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => approveVendorPayout(id),
    onSuccess: () => {
      toast.success("Payout approved successfully");
      queryClient.invalidateQueries({ queryKey: ["vendors-payouts"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-payout", id] });
    },
    onError: (error: any) => toast.error(error?.message ?? "Failed to approve payout"),
  });
};

export const useRejectVendorPayout = (id: string, reason: { reason: string }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => rejectVendorPayout(id, reason),
    onSuccess: () => {
      toast.success("Payout rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["vendors-payouts"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-payout", id] });
    },
    onError: (error: any) => toast.error(error?.message ?? "Failed to reject payout"),
  });
};

export const useFleetsPayouts = () =>
  useQuery({
    queryKey: ["fleets-payouts"],
    queryFn: getFleetsPayouts,
  });

export const useFleetPayout = (id: string, enabled = true) =>
  useQuery({
    queryKey: ["fleet-payout", id],
    queryFn: () => getFleetPayout(id),
    enabled: enabled && !!id,
  });

export const useApproveFleetPayout = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => approveFleetPayout(id),
    onSuccess: () => {
      toast.success("Payout approved successfully");
      queryClient.invalidateQueries({ queryKey: ["fleets-payouts"] });
      queryClient.invalidateQueries({ queryKey: ["fleet-payout", id] });
    },
    onError: (error: any) => toast.error(error?.message ?? "Failed to approve payout"),
  });
};

export const useRejectFleetPayout = (id: string, reason: { reason: string }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => rejectFleetPayout(id, reason),
    onSuccess: () => {
      toast.success("Payout rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["fleets-payouts"] });
      queryClient.invalidateQueries({ queryKey: ["fleet-payout", id] });
    },
    onError: (error: any) => toast.error(error?.message ?? "Failed to reject payout"),
  });
};

export const useRidersPayouts = () =>
  useQuery({
    queryKey: ["riders-payouts"],
    queryFn: getRidersPayouts,
  });

export const useRiderPayout = (id: string, enabled = true) =>
  useQuery({
    queryKey: ["rider-payout", id],
    queryFn: () => getRiderPayout(id),
    enabled: enabled && !!id,
  });

export const useApproveRiderPayout = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => approveRiderPayout(id),
    onSuccess: () => {
      toast.success("Payout approved successfully");
      queryClient.invalidateQueries({ queryKey: ["riders-payouts"] });
      queryClient.invalidateQueries({ queryKey: ["rider-payout", id] });
    },
    onError: (error: any) => toast.error(error?.message ?? "Failed to approve payout"),
  });
};

export const useRejectRiderPayout = (id: string, reason: { reason: string }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => rejectRiderPayout(id, reason),
    onSuccess: () => {
      toast.success("Payout rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["riders-payouts"] });
      queryClient.invalidateQueries({ queryKey: ["rider-payout", id] });
    },
    onError: (error: any) => toast.error(error?.message ?? "Failed to reject payout"),
  });
};
