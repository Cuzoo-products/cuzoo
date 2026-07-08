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
  GetVendorPayoutsParams,
  VendorPayoutStatus,
} from "@/api/admin/payouts/payoutsApi";

const VENDOR_PAYOUT_STATUSES: VendorPayoutStatus[] = [
  "pending",
  "approved",
  "rejected",
  "failed",
  "success",
];

export type VendorPayoutsFilterFormValues = {
  status: "" | VendorPayoutStatus;
  reference: string;
  ownerId: string;
};

export const emptyVendorPayoutsFilterForm: VendorPayoutsFilterFormValues = {
  status: "",
  reference: "",
  ownerId: "",
};

export function vendorPayoutsFilterFormToParams(
  form: VendorPayoutsFilterFormValues,
): GetVendorPayoutsParams {
  const params: GetVendorPayoutsParams = {};
  if (form.status) params.status = form.status;
  if (form.reference.trim()) params.reference = form.reference.trim();
  if (form.ownerId.trim()) params.ownerId = form.ownerId.trim();
  return params;
}

export function vendorPayoutsSearchParamsToForm(
  searchParams: URLSearchParams,
): VendorPayoutsFilterFormValues {
  const status = searchParams.get("status");
  const validStatus = VENDOR_PAYOUT_STATUSES.includes(
    status as VendorPayoutStatus,
  )
    ? (status as VendorPayoutStatus)
    : "";

  return {
    status: validStatus,
    reference: searchParams.get("reference") ?? "",
    ownerId: searchParams.get("ownerId") ?? "",
  };
}

export function vendorPayoutsSearchParamsToParams(
  searchParams: URLSearchParams,
): GetVendorPayoutsParams {
  return vendorPayoutsFilterFormToParams(
    vendorPayoutsSearchParamsToForm(searchParams),
  );
}

export function vendorPayoutsParamsToSearchParams(
  params: GetVendorPayoutsParams,
): URLSearchParams {
  const searchParams = new URLSearchParams();
  if (params.status) searchParams.set("status", params.status);
  if (params.reference) searchParams.set("reference", params.reference);
  if (params.ownerId) searchParams.set("ownerId", params.ownerId);
  return searchParams;
}

type AdminVendorPayoutsFiltersProps = {
  initialValues?: VendorPayoutsFilterFormValues;
  onApply: (filters: VendorPayoutsFilterFormValues) => void;
};

export default function AdminVendorPayoutsFilters({
  initialValues = emptyVendorPayoutsFilterForm,
  onApply,
}: AdminVendorPayoutsFiltersProps) {
  const [form, setForm] = useState<VendorPayoutsFilterFormValues>(initialValues);

  const handleApply = () => {
    onApply(form);
  };

  const handleClear = () => {
    setForm(emptyVendorPayoutsFilterForm);
    onApply(emptyVendorPayoutsFilterForm);
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
                  status: value === "all" ? "" : (value as VendorPayoutStatus),
                }))
              }
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="admin-select-menu">
                <SelectItem value="all">All</SelectItem>
                {VENDOR_PAYOUT_STATUSES.map((status) => (
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
