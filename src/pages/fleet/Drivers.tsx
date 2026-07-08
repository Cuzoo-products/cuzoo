import { useEffect, useMemo, useState } from "react";
import { useGetRiders } from "@/api/fleet/rider/useRiderQuery";
import {
  parseFleetRidersListMeta,
  parseFleetRidersListPayload,
  type FleetRiderGender,
  type GetFleetRidersParams,
} from "@/api/fleet/rider/riderApi";
import PageHeader from "@/components/admin/PageHeader";
import BackendCursorPagination from "@/components/admin/BackendCursorPagination";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  columns,
  type DriverData,
} from "@/components/utilities/Fleet/DriverTableFormate";
import Loader from "@/components/utilities/Loader";

const DEFAULT_LIMIT = 20;

type TriState = "" | "true" | "false";

const GENDERS: FleetRiderGender[] = ["Male", "Female", "Others"];

function toIsoDateTime(value: string): string | undefined {
  if (!value.trim()) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function mapRiderToRow(r: Record<string, unknown>): DriverData {
  const id = String(r.Id ?? r.id ?? r._id ?? "").trim();
  return {
    id,
    firstName: r.firstName != null ? String(r.firstName) : "",
    lastName: r.lastName != null ? String(r.lastName) : "",
    email: r.email != null ? String(r.email) : "—",
  };
}

function Drivers() {
  const [suspended, setSuspended] = useState<TriState>("");
  const [gender, setGender] = useState<"" | FleetRiderGender>("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<GetFleetRidersParams>(
    {},
  );
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [cursorStack, setCursorStack] = useState<
    (number | string | undefined)[]
  >([undefined]);

  useEffect(() => {
    setCursorStack([undefined]);
  }, [appliedFilters]);

  const currentCursor = cursorStack[cursorStack.length - 1];

  const queryParams = useMemo<GetFleetRidersParams>(() => {
    const params: GetFleetRidersParams = {
      ...appliedFilters,
      limit,
    };
    if (currentCursor != null && currentCursor !== "") {
      params.cursor = currentCursor;
    }
    return params;
  }, [appliedFilters, currentCursor, limit]);

  const { data, isLoading, isFetching, error } = useGetRiders(queryParams);

  const riders = useMemo(() => parseFleetRidersListPayload(data), [data]);
  const meta = useMemo(() => parseFleetRidersListMeta(data), [data]);

  const tableData: DriverData[] = useMemo(
    () => riders.map(mapRiderToRow).filter((row) => row.id !== ""),
    [riders],
  );

  const pageIndex = cursorStack.length - 1;
  const hasPrevious = pageIndex > 0;
  const hasNext =
    meta?.lastCursor != null &&
    meta.lastCursor !== "" &&
    riders.length >= limit;

  const handleApplyFilters = () => {
    const params: GetFleetRidersParams = {};
    if (suspended === "true") params.suspended = true;
    if (suspended === "false") params.suspended = false;
    if (gender) params.gender = gender;
    const fromIso = toIsoDateTime(from);
    if (fromIso) params.from = fromIso;
    const toIso = toIsoDateTime(to);
    if (toIso) params.to = toIso;
    setAppliedFilters(params);
    setCursorStack([undefined]);
  };

  const handleClearFilters = () => {
    setSuspended("");
    setGender("");
    setFrom("");
    setTo("");
    setAppliedFilters({});
    setCursorStack([undefined]);
  };

  const handleLimitChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setCursorStack([undefined]);
  };

  const handlePrevious = () => {
    if (!hasPrevious) return;
    setCursorStack((prev) => prev.slice(0, -1));
  };

  const handleNext = () => {
    if (!hasNext || meta?.lastCursor == null) return;
    setCursorStack((prev) => [...prev, meta.lastCursor as number | string]);
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="space-y-5">
        <PageHeader title="Drivers" subtitle="Failed to load drivers." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Drivers"
        subtitle={
          meta?.count != null
            ? `Manage drivers · ${meta.count.toLocaleString("en-NG")} total`
            : "Manage all drivers data and information"
        }
      />

      <div className="flex flex-col gap-3 rounded-xl border border-line-1 bg-background p-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="space-y-2 min-w-[140px]">
          <label className="text-sm font-medium">Suspended</label>
          <Select
            value={suspended || "all"}
            onValueChange={(next) =>
              setSuspended(next === "all" ? "" : (next as TriState))
            }
          >
            <SelectTrigger className="h-10 w-full sm:w-[150px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className="fleet-select-menu">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 min-w-[140px]">
          <label className="text-sm font-medium">Gender</label>
          <Select
            value={gender || "all"}
            onValueChange={(next) =>
              setGender(next === "all" ? "" : (next as FleetRiderGender))
            }
          >
            <SelectTrigger className="h-10 w-full sm:w-[150px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className="fleet-select-menu">
              <SelectItem value="all">All</SelectItem>
              {GENDERS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 min-w-[180px]">
          <label className="text-sm font-medium">From</label>
          <Input
            type="datetime-local"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="h-10"
          />
        </div>

        <div className="space-y-2 min-w-[180px]">
          <label className="text-sm font-medium">To</label>
          <Input
            type="datetime-local"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="h-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={handleApplyFilters}>
            Apply
          </Button>
          <Button type="button" variant="outline" onClick={handleClearFilters}>
            Clear
          </Button>
        </div>
      </div>

      <DataTable
        adminVariant
        hidePagination
        searchPlaceholder="Search this page..."
        columns={columns}
        data={tableData}
      />

      <BackendCursorPagination
        count={meta?.count}
        limit={limit}
        pageIndex={pageIndex}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        isLoading={isFetching}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
}

export default Drivers;
