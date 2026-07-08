import { useEffect, useMemo, useState } from "react";
import { useGetFleetTrips } from "@/api/fleet/trips/useTrips";
import {
  parseFleetTripsListMeta,
  parseFleetTripsListPayload,
  type FleetTripStatus,
  type GetFleetTripsParams,
} from "@/api/fleet/trips/tripsApi";
import PageHeader from "@/components/admin/PageHeader";
import BackendCursorPagination from "@/components/admin/BackendCursorPagination";
import { DataTable } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  columns,
  type TripData,
} from "@/components/utilities/Fleet/TripsTable";
import Loader from "@/components/utilities/Loader";

const DEFAULT_LIMIT = 20;

const TRIP_STATUSES: { value: FleetTripStatus; label: string }[] = [
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

function mapTripToRow(trip: Record<string, unknown>): TripData {
  const id = String(trip.id ?? "").trim();

  const createdAt =
    trip.createdAt != null ? String(trip.createdAt) : undefined;
  const dateRaw = trip.date != null ? String(trip.date) : "";
  const formattedDate =
    dateRaw && dateRaw !== "string"
      ? dateRaw
      : createdAt
        ? new Date(createdAt).toLocaleDateString("en-NG", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "—";

  const amount =
    typeof trip.amount === "number" ? trip.amount : Number(trip.amount) || 0;

  return {
    id,
    refNo: id,
    date: formattedDate,
    startTime: trip.startTime != null ? String(trip.startTime) : "—",
    endTime: trip.endTime != null ? String(trip.endTime) : "—",
    driver: trip.driver != null ? String(trip.driver) : "—",
    amount: amount.toString(),
  };
}

function Trips() {
  const [status, setStatus] = useState<"" | FleetTripStatus>("");
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [cursorStack, setCursorStack] = useState<
    (number | string | undefined)[]
  >([undefined]);

  useEffect(() => {
    setCursorStack([undefined]);
  }, [status]);

  const currentCursor = cursorStack[cursorStack.length - 1];

  const queryParams = useMemo<GetFleetTripsParams>(() => {
    const params: GetFleetTripsParams = { limit };
    if (status) params.status = status;
    if (currentCursor != null && currentCursor !== "") {
      params.cursor = currentCursor;
    }
    return params;
  }, [currentCursor, limit, status]);

  const { data, isLoading, isFetching, error } = useGetFleetTrips(queryParams);

  const trips = useMemo(() => parseFleetTripsListPayload(data), [data]);
  const meta = useMemo(() => parseFleetTripsListMeta(data), [data]);

  const tableData: TripData[] = useMemo(
    () => trips.map(mapTripToRow).filter((row) => row.id !== ""),
    [trips],
  );

  const pageIndex = cursorStack.length - 1;
  const hasPrevious = pageIndex > 0;
  const hasNext =
    meta?.lastCursor != null &&
    meta.lastCursor !== "" &&
    trips.length >= limit;

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
        <PageHeader title="Trips" subtitle="Unable to load trips." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Trips"
        subtitle={
          meta?.count != null
            ? `View all trips · ${meta.count.toLocaleString("en-NG")} total`
            : "View all trips here"
        }
      />

      <DataTable
        adminVariant
        hidePagination
        searchPlaceholder="Search this page..."
        columns={columns}
        data={tableData}
        toolbarExtra={
          <Select
            value={status || "all"}
            onValueChange={(next) =>
              setStatus(next === "all" ? "" : (next as FleetTripStatus))
            }
          >
            <SelectTrigger className="h-10 w-[180px] shrink-0">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="fleet-select-menu">
              <SelectItem value="all">All</SelectItem>
              {TRIP_STATUSES.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
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

export default Trips;
