import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  GetFleetPayoutsParams,
  PayoutStatus,
} from "@/api/admin/payouts/payoutsApi";

const FLEET_PAYOUT_STATUSES: PayoutStatus[] = [
  "pending",
  "approved",
  "rejected",
  "failed",
  "success",
];

export type FleetPayoutsFilterFormValues = {
  status: "" | PayoutStatus;
  reference: string;
  ownerId: string;
};

export const emptyFleetPayoutsFilterForm: FleetPayoutsFilterFormValues = {
  status: "",
  reference: "",
  ownerId: "",
};

export function fleetPayoutsFilterFormToParams(
  form: FleetPayoutsFilterFormValues,
): GetFleetPayoutsParams {
  const params: GetFleetPayoutsParams = {};
  if (form.status) params.status = form.status;
  if (form.reference.trim()) params.reference = form.reference.trim();
  if (form.ownerId.trim()) params.ownerId = form.ownerId.trim();
  return params;
}

export function fleetPayoutsSearchParamsToForm(
  searchParams: URLSearchParams,
): FleetPayoutsFilterFormValues {
  const status = searchParams.get("status");
  const validStatus = FLEET_PAYOUT_STATUSES.includes(status as PayoutStatus)
    ? (status as PayoutStatus)
    : "";

  return {
    status: validStatus,
    reference: searchParams.get("reference") ?? "",
    ownerId: searchParams.get("ownerId") ?? "",
  };
}

export function fleetPayoutsSearchParamsToParams(
  searchParams: URLSearchParams,
): GetFleetPayoutsParams {
  return fleetPayoutsFilterFormToParams(
    fleetPayoutsSearchParamsToForm(searchParams),
  );
}

export function fleetPayoutsParamsToSearchParams(
  params: GetFleetPayoutsParams,
): URLSearchParams {
  const searchParams = new URLSearchParams();
  if (params.status) searchParams.set("status", params.status);
  if (params.reference) searchParams.set("reference", params.reference);
  if (params.ownerId) searchParams.set("ownerId", params.ownerId);
  return searchParams;
}

type AdminFleetPayoutsFiltersProps = {
  initialValues?: FleetPayoutsFilterFormValues;
  onApply: (filters: FleetPayoutsFilterFormValues) => void;
};

export default function AdminFleetPayoutsFilters({
  initialValues = emptyFleetPayoutsFilterForm,
  onApply,
}: AdminFleetPayoutsFiltersProps) {
  const [form, setForm] = useState<FleetPayoutsFilterFormValues>(initialValues);

  const handleApply = () => {
    onApply(form);
  };

  const handleClear = () => {
    setForm(emptyFleetPayoutsFilterForm);
    onApply(emptyFleetPayoutsFilterForm);
  };

  return (
    <Card className="border-[var(--admin-border)] bg-[var(--admin-bg-card)] py-3 shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={form.status || "all"}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  status: value === "all" ? "" : (value as PayoutStatus),
                }))
              }
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="admin-select-menu">
                <SelectItem value="all">All</SelectItem>
                {FLEET_PAYOUT_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Reference</label>
            <Input
              value={form.reference}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, reference: e.target.value }))
              }
              placeholder="Reference"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Owner ID</label>
            <Input
              value={form.ownerId}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, ownerId: e.target.value }))
              }
              placeholder="Owner ID"
              className="h-10"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={handleApply}>
            Apply filters
          </Button>
          <Button type="button" variant="outline" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
