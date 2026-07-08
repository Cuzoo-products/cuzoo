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
  GetVendorsParams,
  VendorApprovalStatus,
} from "@/api/admin/vendors/vendorsApi";

const BUSINESS_TYPES = [
  "Logistics",
  "E-commerce",
  "Retail",
  "Wholesale",
  "Manufacturing",
  "Services",
  "Other",
] as const;

const APPROVAL_STATUSES: VendorApprovalStatus[] = [
  "pending",
  "approved",
  "declined",
];

export type VendorsFilterFormValues = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  businessName: string;
  registrationNumber: string;
  businessType: string;
  approvalStatus: "" | VendorApprovalStatus;
  from: string;
  to: string;
};

export const emptyVendorsFilterForm: VendorsFilterFormValues = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  businessName: "",
  registrationNumber: "",
  businessType: "",
  approvalStatus: "",
  from: "",
  to: "",
};

function toIsoDateTime(value: string): string | undefined {
  if (!value.trim()) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function vendorsFilterFormToParams(
  form: VendorsFilterFormValues,
): GetVendorsParams {
  const params: GetVendorsParams = {};

  if (form.firstName.trim()) params.firstName = form.firstName.trim();
  if (form.lastName.trim()) params.lastName = form.lastName.trim();
  if (form.phoneNumber.trim()) params.phoneNumber = form.phoneNumber.trim();
  if (form.email.trim()) params.email = form.email.trim();
  if (form.businessName.trim()) params.businessName = form.businessName.trim();
  if (form.registrationNumber.trim()) {
    params.registrationNumber = form.registrationNumber.trim();
  }
  if (form.businessType) params.businessType = form.businessType;
  if (form.approvalStatus) params.approvalStatus = form.approvalStatus;

  const from = toIsoDateTime(form.from);
  if (from) params.from = from;

  const to = toIsoDateTime(form.to);
  if (to) params.to = to;

  return params;
}

export function vendorsSearchParamsToForm(
  searchParams: URLSearchParams,
): VendorsFilterFormValues {
  const approvalStatus = searchParams.get("approvalStatus");
  const validStatus = APPROVAL_STATUSES.includes(
    approvalStatus as VendorApprovalStatus,
  )
    ? (approvalStatus as VendorApprovalStatus)
    : "";

  return {
    firstName: searchParams.get("firstName") ?? "",
    lastName: searchParams.get("lastName") ?? "",
    phoneNumber: searchParams.get("phoneNumber") ?? "",
    email: searchParams.get("email") ?? "",
    businessName: searchParams.get("businessName") ?? "",
    registrationNumber: searchParams.get("registrationNumber") ?? "",
    businessType: searchParams.get("businessType") ?? "",
    approvalStatus: validStatus,
    from: searchParams.get("from") ?? "",
    to: searchParams.get("to") ?? "",
  };
}

export function vendorsSearchParamsToParams(
  searchParams: URLSearchParams,
): GetVendorsParams {
  return vendorsFilterFormToParams(vendorsSearchParamsToForm(searchParams));
}

export function vendorsParamsToSearchParams(
  params: GetVendorsParams,
): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (params.firstName) searchParams.set("firstName", params.firstName);
  if (params.lastName) searchParams.set("lastName", params.lastName);
  if (params.phoneNumber) searchParams.set("phoneNumber", params.phoneNumber);
  if (params.email) searchParams.set("email", params.email);
  if (params.businessName) searchParams.set("businessName", params.businessName);
  if (params.registrationNumber) {
    searchParams.set("registrationNumber", params.registrationNumber);
  }
  if (params.businessType) searchParams.set("businessType", params.businessType);
  if (params.approvalStatus) {
    searchParams.set("approvalStatus", params.approvalStatus);
  }
  if (params.from) searchParams.set("from", params.from);
  if (params.to) searchParams.set("to", params.to);

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

type AdminVendorsFiltersProps = {
  initialValues?: VendorsFilterFormValues;
  onApply: (params: GetVendorsParams) => void;
};

export default function AdminVendorsFilters({
  initialValues = emptyVendorsFilterForm,
  onApply,
}: AdminVendorsFiltersProps) {
  const [form, setForm] = useState<VendorsFilterFormValues>(initialValues);

  const update = <K extends keyof VendorsFilterFormValues>(
    key: K,
    value: VendorsFilterFormValues[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(vendorsFilterFormToParams(form));
  };

  const handleClear = () => {
    setForm(emptyVendorsFilterForm);
    onApply({});
  };

  return (
    <Card className="border-[var(--admin-border)] bg-[var(--admin-bg-card)] py-3 shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FilterField label="First name">
            <Input
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              placeholder="First name"
              className="h-10"
            />
          </FilterField>

          <FilterField label="Last name">
            <Input
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              placeholder="Last name"
              className="h-10"
            />
          </FilterField>

          <FilterField label="Phone number">
            <Input
              value={form.phoneNumber}
              onChange={(e) => update("phoneNumber", e.target.value)}
              placeholder="Phone number"
              className="h-10"
            />
          </FilterField>

          <FilterField label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="Email address"
              className="h-10"
            />
          </FilterField>

          <FilterField label="Business name">
            <Input
              value={form.businessName}
              onChange={(e) => update("businessName", e.target.value)}
              placeholder="Business name"
              className="h-10"
            />
          </FilterField>

          <FilterField label="Registration number">
            <Input
              value={form.registrationNumber}
              onChange={(e) => update("registrationNumber", e.target.value)}
              placeholder="Registration number"
              className="h-10"
            />
          </FilterField>

          <FilterField label="Approval status">
            <Select
              value={form.approvalStatus || "all"}
              onValueChange={(value) =>
                update(
                  "approvalStatus",
                  value === "all" ? "" : (value as VendorApprovalStatus),
                )
              }
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="admin-select-menu">
                <SelectItem value="all">All</SelectItem>
                {APPROVAL_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Business type">
            <Select
              value={form.businessType || "all"}
              onValueChange={(value) =>
                update("businessType", value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {BUSINESS_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Created from">
            <Input
              type="datetime-local"
              value={form.from}
              onChange={(e) => update("from", e.target.value)}
              className="h-10"
            />
          </FilterField>

          <FilterField label="Created to">
            <Input
              type="datetime-local"
              value={form.to}
              onChange={(e) => update("to", e.target.value)}
              className="h-10"
            />
          </FilterField>
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
