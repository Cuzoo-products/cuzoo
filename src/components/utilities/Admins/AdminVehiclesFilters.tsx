import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { GetVehiclesParams } from "@/api/admin/vehicle/vehicle";

export type VehiclesFilterFormValues = {
  companyId: string;
};

export const emptyVehiclesFilterForm: VehiclesFilterFormValues = {
  companyId: "",
};

export function vehiclesFilterFormToParams(
  form: VehiclesFilterFormValues,
): GetVehiclesParams {
  const params: GetVehiclesParams = {};

  if (form.companyId.trim()) params.companyId = form.companyId.trim();

  return params;
}

export function vehiclesSearchParamsToForm(
  searchParams: URLSearchParams,
): VehiclesFilterFormValues {
  return {
    companyId: searchParams.get("companyId") ?? "",
  };
}

export function vehiclesSearchParamsToParams(
  searchParams: URLSearchParams,
): GetVehiclesParams {
  return vehiclesFilterFormToParams(vehiclesSearchParamsToForm(searchParams));
}

export function vehiclesParamsToSearchParams(
  params: GetVehiclesParams,
): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (params.companyId) searchParams.set("companyId", params.companyId);

  return searchParams;
}

type AdminVehiclesFiltersProps = {
  initialValues?: VehiclesFilterFormValues;
  onApply: (params: GetVehiclesParams) => void;
};

export default function AdminVehiclesFilters({
  initialValues = emptyVehiclesFilterForm,
  onApply,
}: AdminVehiclesFiltersProps) {
  const [form, setForm] = useState<VehiclesFilterFormValues>(initialValues);

  const handleApply = () => {
    onApply(vehiclesFilterFormToParams(form));
  };

  const handleClear = () => {
    setForm(emptyVehiclesFilterForm);
    onApply({});
  };

  return (
    <Card className="border-[var(--admin-border)] bg-[var(--admin-bg-card)] py-3 shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Company ID</label>
            <Input
              value={form.companyId}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, companyId: e.target.value }))
              }
              placeholder="Fleet / company ID"
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
