import { useMemo } from "react";

import { useGetRiders } from "@/api/admin/riders/useRiders";
import { parseRidersListMeta } from "@/api/admin/riders/riders";
import {
  useFleetsPayouts,
  useRidersPayouts,
  useVendorsPayouts,
} from "@/api/admin/payouts/usePayouts";
import { parsePayoutsListMeta } from "@/api/admin/payouts/payoutsApi";
import { useVendors } from "@/api/admin/vendors/useVendors";
import { parseVendorsListMeta } from "@/api/admin/vendors/vendorsApi";
import { useGetAllFleets } from "@/api/admin/fleet/useFleet";
import { parseFleetManagersListMeta } from "@/api/admin/fleet/fleetApi";

export type AdminActionItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  count: number;
  isLoading: boolean;
};

export function useAdminActionItems(): AdminActionItem[] {
  const pendingRiderApproval = useGetRiders({
    regComplete: true,
    approved: false,
    limit: 1,
  });

  const pendingVendors = useVendors({
    approvalStatus: "pending",
    limit: 1,
  });

  const pendingFleets = useGetAllFleets({
    approvalStatus: "pending",
    limit: 1,
  });

  const pendingVendorPayouts = useVendorsPayouts({
    status: "pending",
    limit: 1,
  });

  const pendingFleetPayouts = useFleetsPayouts({
    status: "pending",
    limit: 1,
  });

  const pendingRiderPayouts = useRidersPayouts({
    status: "pending",
    limit: 1,
  });

  return useMemo(() => {
    const items: AdminActionItem[] = [];

    const pendingRiderCount =
      parseRidersListMeta(pendingRiderApproval.data)?.count ?? 0;

    if (pendingRiderApproval.isLoading || pendingRiderCount > 0) {
      items.push({
        id: "riders-pending-approval",
        title: "Riders pending approval",
        description:
          "Riders who completed registration but have not been approved yet.",
        href: "/admins/drivers?regComplete=true&approved=false",
        count: pendingRiderCount,
        isLoading: pendingRiderApproval.isLoading,
      });
    }

    const pendingVendorCount =
      parseVendorsListMeta(pendingVendors.data)?.count ?? 0;

    if (pendingVendors.isLoading || pendingVendorCount > 0) {
      items.push({
        id: "vendors-pending-approval",
        title: "Vendors pending approval",
        description: "Vendor accounts awaiting review or approval.",
        href: "/admins/vendors?approvalStatus=pending",
        count: pendingVendorCount,
        isLoading: pendingVendors.isLoading,
      });
    }

    const pendingFleetCount =
      parseFleetManagersListMeta(pendingFleets.data)?.count ?? 0;

    if (pendingFleets.isLoading || pendingFleetCount > 0) {
      items.push({
        id: "fleets-pending-approval",
        title: "Fleet managers pending approval",
        description: "Fleet manager accounts awaiting review or approval.",
        href: "/admins/fleet_managers?approvalStatus=pending",
        count: pendingFleetCount,
        isLoading: pendingFleets.isLoading,
      });
    }

    const pendingVendorPayoutCount =
      parsePayoutsListMeta(pendingVendorPayouts.data)?.count ?? 0;

    if (pendingVendorPayouts.isLoading || pendingVendorPayoutCount > 0) {
      items.push({
        id: "vendor-payouts-pending",
        title: "Vendor payouts pending",
        description: "Vendor payout requests awaiting review or approval.",
        href: "/admins/payouts/vendors?status=pending",
        count: pendingVendorPayoutCount,
        isLoading: pendingVendorPayouts.isLoading,
      });
    }

    const pendingFleetPayoutCount =
      parsePayoutsListMeta(pendingFleetPayouts.data)?.count ?? 0;

    if (pendingFleetPayouts.isLoading || pendingFleetPayoutCount > 0) {
      items.push({
        id: "fleet-payouts-pending",
        title: "Fleet payouts pending",
        description: "Fleet payout requests awaiting review or approval.",
        href: "/admins/payouts/fleets?status=pending",
        count: pendingFleetPayoutCount,
        isLoading: pendingFleetPayouts.isLoading,
      });
    }

    const pendingRiderPayoutCount =
      parsePayoutsListMeta(pendingRiderPayouts.data)?.count ?? 0;

    if (pendingRiderPayouts.isLoading || pendingRiderPayoutCount > 0) {
      items.push({
        id: "rider-payouts-pending",
        title: "Rider payouts pending",
        description: "Rider payout requests awaiting review or approval.",
        href: "/admins/payouts/riders?status=pending",
        count: pendingRiderPayoutCount,
        isLoading: pendingRiderPayouts.isLoading,
      });
    }

    return items;
  }, [
    pendingRiderApproval.data,
    pendingRiderApproval.isLoading,
    pendingVendors.data,
    pendingVendors.isLoading,
    pendingFleets.data,
    pendingFleets.isLoading,
    pendingVendorPayouts.data,
    pendingVendorPayouts.isLoading,
    pendingFleetPayouts.data,
    pendingFleetPayouts.isLoading,
    pendingRiderPayouts.data,
    pendingRiderPayouts.isLoading,
  ]);
}
