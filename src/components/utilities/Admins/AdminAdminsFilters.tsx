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
  AdminGender,
  AdminPosition,
  GetAdminsParams,
} from "@/api/admin/admin/adminApi";

const ADMIN_GENDERS: AdminGender[] = ["Male", "Female", "Others"];

const ADMIN_POSITIONS: AdminPosition[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "INVESTOR",
];

export type AdminsFilterFormValues = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  gender: "" | AdminGender;
  position: "" | AdminPosition;
  country: string;
  state: string;
};

export const emptyAdminsFilterForm: AdminsFilterFormValues = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  gender: "",
  position: "",
  country: "",
  state: "",
};

export function adminsFilterFormToParams(
  form: AdminsFilterFormValues,
): GetAdminsParams {
  const params: GetAdminsParams = {};

  if (form.firstName.trim()) params.firstName = form.firstName.trim();
  if (form.lastName.trim()) params.lastName = form.lastName.trim();
  if (form.phoneNumber.trim()) params.phoneNumber = form.phoneNumber.trim();
  if (form.email.trim()) params.email = form.email.trim();
  if (form.gender) params.gender = form.gender;
  if (form.position) params.position = form.position;
  if (form.country.trim()) params.country = form.country.trim();
  if (form.state.trim()) params.state = form.state.trim();

  return params;
}

export function adminsSearchParamsToForm(
  searchParams: URLSearchParams,
): AdminsFilterFormValues {
  const gender = searchParams.get("gender");
  const validGender = ADMIN_GENDERS.includes(gender as AdminGender)
    ? (gender as AdminGender)
    : "";

  const position = searchParams.get("position");
  const validPosition = ADMIN_POSITIONS.includes(position as AdminPosition)
    ? (position as AdminPosition)
    : "";

  return {
    firstName: searchParams.get("firstName") ?? "",
    lastName: searchParams.get("lastName") ?? "",
    phoneNumber: searchParams.get("phoneNumber") ?? "",
    email: searchParams.get("email") ?? "",
    gender: validGender,
    position: validPosition,
    country: searchParams.get("country") ?? "",
    state: searchParams.get("state") ?? "",
  };
}

export function adminsSearchParamsToParams(
  searchParams: URLSearchParams,
): GetAdminsParams {
  return adminsFilterFormToParams(adminsSearchParamsToForm(searchParams));
}

export function adminsParamsToSearchParams(
  params: GetAdminsParams,
): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (params.firstName) searchParams.set("firstName", params.firstName);
  if (params.lastName) searchParams.set("lastName", params.lastName);
  if (params.phoneNumber) searchParams.set("phoneNumber", params.phoneNumber);
  if (params.email) searchParams.set("email", params.email);
  if (params.gender) searchParams.set("gender", params.gender);
  if (params.position) searchParams.set("position", params.position);
  if (params.country) searchParams.set("country", params.country);
  if (params.state) searchParams.set("state", params.state);

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

type AdminAdminsFiltersProps = {
  initialValues?: AdminsFilterFormValues;
  onApply: (params: GetAdminsParams) => void;
};

export default function AdminAdminsFilters({
  initialValues = emptyAdminsFilterForm,
  onApply,
}: AdminAdminsFiltersProps) {
  const [form, setForm] = useState<AdminsFilterFormValues>(initialValues);

  const update = <K extends keyof AdminsFilterFormValues>(
    key: K,
    value: AdminsFilterFormValues[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(adminsFilterFormToParams(form));
  };

  const handleClear = () => {
    setForm(emptyAdminsFilterForm);
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

          <FilterField label="Gender">
            <Select
              value={form.gender || "all"}
              onValueChange={(value) =>
                update("gender", value === "all" ? "" : (value as AdminGender))
              }
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="admin-select-menu">
                <SelectItem value="all">All</SelectItem>
                {ADMIN_GENDERS.map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {gender}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Position">
            <Select
              value={form.position || "all"}
              onValueChange={(value) =>
                update(
                  "position",
                  value === "all" ? "" : (value as AdminPosition),
                )
              }
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="admin-select-menu">
                <SelectItem value="all">All</SelectItem>
                {ADMIN_POSITIONS.map((position) => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Country (ISO2)">
            <Input
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              placeholder="e.g. NG"
              className="h-10"
              maxLength={2}
            />
          </FilterField>

          <FilterField label="State (ISO2)">
            <Input
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
              placeholder="e.g. LA"
              className="h-10"
              maxLength={2}
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
