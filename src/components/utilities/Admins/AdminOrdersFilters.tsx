import { useState, type ReactNode } from "react";

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
  AdminOrderStatus,
  GetAdminOrdersParams,
} from "@/api/admin/orders/orders";

const ORDER_STATUSES: { value: AdminOrderStatus; label: string }[] = [
  { value: "queued", label: "Queued" },
  { value: "pre-payment", label: "Pre-payment" },
  { value: "pre-packaged", label: "Pre-packaged" },
  { value: "packaged", label: "Packaged" },
  { value: "pending", label: "Pending" },
  { value: "pre-pickup", label: "Pre-pickup" },
  { value: "delivery", label: "Delivery" },
  { value: "failed", label: "Failed" },
  { value: "success", label: "Success" },
];

export type AdminOrdersFilterFormValues = {
  status: "" | AdminOrderStatus;
  vendorId: string;
  userId: string;
  companyId: string;
  riderId: string;
};

export const emptyAdminOrdersFilterForm: AdminOrdersFilterFormValues = {
  status: "",
  vendorId: "",
  userId: "",
  companyId: "",
  riderId: "",
};

export function adminOrdersFilterFormToParams(
  form: AdminOrdersFilterFormValues,
): GetAdminOrdersParams {
  const params: GetAdminOrdersParams = {};

  if (form.status) params.status = form.status;
  if (form.vendorId.trim()) params.vendorId = form.vendorId.trim();
  if (form.userId.trim()) params.userId = form.userId.trim();
  if (form.companyId.trim()) params.companyId = form.companyId.trim();
  if (form.riderId.trim()) params.riderId = form.riderId.trim();

  return params;
}

export function adminOrdersSearchParamsToForm(
  searchParams: URLSearchParams,
): AdminOrdersFilterFormValues {
  const status = searchParams.get("status");
  const validStatus = ORDER_STATUSES.some((item) => item.value === status)
    ? (status as AdminOrderStatus)
    : "";

  return {
    status: validStatus,
    vendorId: searchParams.get("vendorId") ?? "",
    userId: searchParams.get("userId") ?? "",
    companyId: searchParams.get("companyId") ?? "",
    riderId: searchParams.get("riderId") ?? "",
  };
}

export function adminOrdersSearchParamsToParams(
  searchParams: URLSearchParams,
): GetAdminOrdersParams {
  return adminOrdersFilterFormToParams(
    adminOrdersSearchParamsToForm(searchParams),
  );
}

export function adminOrdersParamsToSearchParams(
  params: GetAdminOrdersParams,
): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (params.status) searchParams.set("status", params.status);
  if (params.vendorId) searchParams.set("vendorId", params.vendorId);
  if (params.userId) searchParams.set("userId", params.userId);
  if (params.companyId) searchParams.set("companyId", params.companyId);
  if (params.riderId) searchParams.set("riderId", params.riderId);

  return searchParams;
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

type AdminOrdersFiltersProps = {
  initialValues?: AdminOrdersFilterFormValues;
  onApply: (params: GetAdminOrdersParams) => void;
  hiddenFields?: Array<keyof AdminOrdersFilterFormValues>;
};

export default function AdminOrdersFilters({
  initialValues = emptyAdminOrdersFilterForm,
  onApply,
  hiddenFields = [],
}: AdminOrdersFiltersProps) {
  const [form, setForm] = useState<AdminOrdersFilterFormValues>(initialValues);
  const hide = (field: keyof AdminOrdersFilterFormValues) =>
    hiddenFields.includes(field);

  const update = <K extends keyof AdminOrdersFilterFormValues>(
    key: K,
    value: AdminOrdersFilterFormValues[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(adminOrdersFilterFormToParams(form));
  };

  const handleClear = () => {
    setForm(emptyAdminOrdersFilterForm);
    onApply({});
  };

  return (
    <Card className="border-[var(--admin-border)] bg-[var(--admin-bg-card)] py-3 shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FilterField label="Status">
            <Select
              value={form.status || "all"}
              onValueChange={(value) =>
                update(
                  "status",
                  value === "all" ? "" : (value as AdminOrderStatus),
                )
              }
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="admin-select-menu">
                <SelectItem value="all">All</SelectItem>
                {ORDER_STATUSES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Vendor ID">
            <Input
              value={form.vendorId}
              onChange={(e) => update("vendorId", e.target.value)}
              placeholder="Vendor ID"
              className="h-10"
            />
          </FilterField>

          {!hide("userId") && (
          <FilterField label="User ID">
            <Input
              value={form.userId}
              onChange={(e) => update("userId", e.target.value)}
              placeholder="User ID"
              className="h-10"
            />
          </FilterField>
          )}

          {!hide("companyId") && (
          <FilterField label="Company ID">
            <Input
              value={form.companyId}
              onChange={(e) => update("companyId", e.target.value)}
              placeholder="Fleet / company ID"
              className="h-10"
            />
          </FilterField>
          )}

          {!hide("riderId") && (
          <FilterField label="Rider ID">
            <Input
              value={form.riderId}
              onChange={(e) => update("riderId", e.target.value)}
              placeholder="Rider ID"
              className="h-10"
            />
          </FilterField>
          )}
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
