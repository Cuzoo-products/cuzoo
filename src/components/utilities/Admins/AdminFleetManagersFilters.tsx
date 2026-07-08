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
  FleetApprovalStatus,
  GetFleetManagersParams,
} from "@/api/admin/fleet/fleetApi";

const COMPANY_TYPES = [
  "Private Limited Company",
  "Public Limited Company",
  "LLC",
  "Incorporated Trustee",
] as const;

const APPROVAL_STATUSES: FleetApprovalStatus[] = [
  "pending",
  "approved",
  "declined",
];

export type FleetManagersFilterFormValues = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  businessName: string;
  registrationNumber: string;
  tinNumber: string;
  companyType: string;
  approvalStatus: "" | FleetApprovalStatus;
  from: string;
  to: string;
};

export const emptyFleetManagersFilterForm: FleetManagersFilterFormValues = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  businessName: "",
  registrationNumber: "",
  tinNumber: "",
  companyType: "",
  approvalStatus: "",
  from: "",
  to: "",
};

function toIsoDateTime(value: string): string | undefined {
  if (!value.trim()) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function fleetManagersFilterFormToParams(
  form: FleetManagersFilterFormValues,
): GetFleetManagersParams {
  const params: GetFleetManagersParams = {};

  if (form.firstName.trim()) params.firstName = form.firstName.trim();
  if (form.lastName.trim()) params.lastName = form.lastName.trim();
  if (form.phoneNumber.trim()) params.phoneNumber = form.phoneNumber.trim();
  if (form.email.trim()) params.email = form.email.trim();
  if (form.businessName.trim()) params.businessName = form.businessName.trim();
  if (form.registrationNumber.trim()) {
    params.registrationNumber = form.registrationNumber.trim();
  }
  if (form.tinNumber.trim()) params.tinNumber = form.tinNumber.trim();
  if (form.companyType) params.companyType = form.companyType;
  if (form.approvalStatus) params.approvalStatus = form.approvalStatus;

  const from = toIsoDateTime(form.from);
  if (from) params.from = from;

  const to = toIsoDateTime(form.to);
  if (to) params.to = to;

  return params;
}

export function fleetManagersSearchParamsToForm(
  searchParams: URLSearchParams,
): FleetManagersFilterFormValues {
  const approvalStatus = searchParams.get("approvalStatus");
  const validStatus = APPROVAL_STATUSES.includes(
    approvalStatus as FleetApprovalStatus,
  )
    ? (approvalStatus as FleetApprovalStatus)
    : "";

  return {
    firstName: searchParams.get("firstName") ?? "",
    lastName: searchParams.get("lastName") ?? "",
    phoneNumber: searchParams.get("phoneNumber") ?? "",
    email: searchParams.get("email") ?? "",
    businessName: searchParams.get("businessName") ?? "",
    registrationNumber: searchParams.get("registrationNumber") ?? "",
    tinNumber: searchParams.get("tinNumber") ?? "",
    companyType: searchParams.get("companyType") ?? "",
    approvalStatus: validStatus,
    from: searchParams.get("from") ?? "",
    to: searchParams.get("to") ?? "",
  };
}

export function fleetManagersSearchParamsToParams(
  searchParams: URLSearchParams,
): GetFleetManagersParams {
  return fleetManagersFilterFormToParams(
    fleetManagersSearchParamsToForm(searchParams),
  );
}

export function fleetManagersParamsToSearchParams(
  params: GetFleetManagersParams,
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
  if (params.tinNumber) searchParams.set("tinNumber", params.tinNumber);
  if (params.companyType) searchParams.set("companyType", params.companyType);
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

type AdminFleetManagersFiltersProps = {
  initialValues?: FleetManagersFilterFormValues;
  onApply: (params: GetFleetManagersParams) => void;
};

export default function AdminFleetManagersFilters({
  initialValues = emptyFleetManagersFilterForm,
  onApply,
}: AdminFleetManagersFiltersProps) {
  const [form, setForm] = useState<FleetManagersFilterFormValues>(initialValues);

  const update = <K extends keyof FleetManagersFilterFormValues>(
    key: K,
    value: FleetManagersFilterFormValues[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(fleetManagersFilterFormToParams(form));
  };

  const handleClear = () => {
    setForm(emptyFleetManagersFilterForm);
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

          <FilterField label="TIN number">
            <Input
              value={form.tinNumber}
              onChange={(e) => update("tinNumber", e.target.value)}
              placeholder="TIN number"
              className="h-10"
            />
          </FilterField>

          <FilterField label="Approval status">
            <Select
              value={form.approvalStatus || "all"}
              onValueChange={(value) =>
                update(
                  "approvalStatus",
                  value === "all" ? "" : (value as FleetApprovalStatus),
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

          <FilterField label="Company type">
            <Select
              value={form.companyType || "all"}
              onValueChange={(value) =>
                update("companyType", value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {COMPANY_TYPES.map((type) => (
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
