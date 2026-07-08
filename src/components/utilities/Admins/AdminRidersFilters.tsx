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
import type { GetRidersParams, RiderGender } from "@/api/admin/riders/riders";

type TriState = "" | "true" | "false";

export type RidersFilterFormValues = {
  approved: TriState;
  suspended: TriState;
  regComplete: TriState;
  gender: "" | RiderGender;
  companyId: string;
  country: string;
  state: string;
  referralCode: string;
  from: string;
  to: string;
};

export const emptyRidersFilterForm: RidersFilterFormValues = {
  approved: "",
  suspended: "",
  regComplete: "",
  gender: "",
  companyId: "",
  country: "",
  state: "",
  referralCode: "",
  from: "",
  to: "",
};

function toIsoDateTime(value: string): string | undefined {
  if (!value.trim()) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function triStateToBoolean(value: TriState): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

export function ridersFilterFormToParams(
  form: RidersFilterFormValues,
): GetRidersParams {
  const params: GetRidersParams = {};

  const approved = triStateToBoolean(form.approved);
  if (approved !== undefined) params.approved = approved;

  const suspended = triStateToBoolean(form.suspended);
  if (suspended !== undefined) params.suspended = suspended;

  const regComplete = triStateToBoolean(form.regComplete);
  if (regComplete !== undefined) params.regComplete = regComplete;

  if (form.gender) params.gender = form.gender;
  if (form.companyId.trim()) params.companyId = form.companyId.trim();
  if (form.country.trim()) params.country = form.country.trim();
  if (form.state.trim()) params.state = form.state.trim();
  if (form.referralCode.trim()) params.referralCode = form.referralCode.trim();

  const from = toIsoDateTime(form.from);
  if (from) params.from = from;

  const to = toIsoDateTime(form.to);
  if (to) params.to = to;

  return params;
}

function parseTriState(value: string | null): TriState {
  if (value === "true") return "true";
  if (value === "false") return "false";
  return "";
}

export function ridersSearchParamsToForm(
  searchParams: URLSearchParams,
): RidersFilterFormValues {
  const gender = searchParams.get("gender");
  const validGender =
    gender === "Male" || gender === "Female" || gender === "Others"
      ? gender
      : "";

  return {
    approved: parseTriState(searchParams.get("approved")),
    suspended: parseTriState(searchParams.get("suspended")),
    regComplete: parseTriState(searchParams.get("regComplete")),
    gender: validGender,
    companyId: searchParams.get("companyId") ?? "",
    country: searchParams.get("country") ?? "",
    state: searchParams.get("state") ?? "",
    referralCode: searchParams.get("referralCode") ?? "",
    from: searchParams.get("from") ?? "",
    to: searchParams.get("to") ?? "",
  };
}

export function ridersSearchParamsToParams(
  searchParams: URLSearchParams,
): GetRidersParams {
  return ridersFilterFormToParams(ridersSearchParamsToForm(searchParams));
}

export function ridersParamsToSearchParams(
  params: GetRidersParams,
): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (params.approved !== undefined) {
    searchParams.set("approved", String(params.approved));
  }
  if (params.suspended !== undefined) {
    searchParams.set("suspended", String(params.suspended));
  }
  if (params.regComplete !== undefined) {
    searchParams.set("regComplete", String(params.regComplete));
  }
  if (params.gender) searchParams.set("gender", params.gender);
  if (params.companyId) searchParams.set("companyId", params.companyId);
  if (params.country) searchParams.set("country", params.country);
  if (params.state) searchParams.set("state", params.state);
  if (params.referralCode) searchParams.set("referralCode", params.referralCode);
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

function TriStateSelect({
  value,
  onChange,
}: {
  value: TriState;
  onChange: (value: TriState) => void;
}) {
  return (
    <Select value={value || "all"} onValueChange={(next) => onChange(next === "all" ? "" : (next as TriState))}>
      <SelectTrigger className="h-10 w-full">
        <SelectValue placeholder="All" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="true">Yes</SelectItem>
        <SelectItem value="false">No</SelectItem>
      </SelectContent>
    </Select>
  );
}

type AdminRidersFiltersProps = {
  initialValues?: RidersFilterFormValues;
  onApply: (params: GetRidersParams) => void;
};

export default function AdminRidersFilters({
  initialValues = emptyRidersFilterForm,
  onApply,
}: AdminRidersFiltersProps) {
  const [form, setForm] = useState<RidersFilterFormValues>(initialValues);

  const update = <K extends keyof RidersFilterFormValues>(
    key: K,
    value: RidersFilterFormValues[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(ridersFilterFormToParams(form));
  };

  const handleClear = () => {
    setForm(emptyRidersFilterForm);
    onApply({});
  };

  return (
    <Card className="border-[var(--admin-border)] bg-[var(--admin-bg-card)] py-3 shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FilterField label="Approved">
            <TriStateSelect
              value={form.approved}
              onChange={(value) => update("approved", value)}
            />
          </FilterField>

          <FilterField label="Suspended">
            <TriStateSelect
              value={form.suspended}
              onChange={(value) => update("suspended", value)}
            />
          </FilterField>

          <FilterField label="Registration complete">
            <TriStateSelect
              value={form.regComplete}
              onChange={(value) => update("regComplete", value)}
            />
          </FilterField>

          <FilterField label="Gender">
            <Select
              value={form.gender || "all"}
              onValueChange={(value) =>
                update("gender", value === "all" ? "" : (value as RiderGender))
              }
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Company ID">
            <Input
              value={form.companyId}
              onChange={(e) => update("companyId", e.target.value)}
              placeholder="Fleet / company ID"
              className="h-10"
            />
          </FilterField>

          <FilterField label="Country">
            <Input
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              placeholder="Country"
              className="h-10"
            />
          </FilterField>

          <FilterField label="State">
            <Input
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
              placeholder="State"
              className="h-10"
            />
          </FilterField>

          <FilterField label="Referral code">
            <Input
              value={form.referralCode}
              onChange={(e) => update("referralCode", e.target.value)}
              placeholder="Referral code"
              className="h-10"
            />
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
