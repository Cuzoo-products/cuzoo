import { useEffect, useMemo, useState } from "react";
import { useGetPayouts } from "@/api/fleet/finance/useFinance";
import {
  parseFleetPayoutsListMeta,
  parseFleetPayoutsListPayload,
  type FleetPayoutStatus,
  type GetFleetPayoutsParams,
} from "@/api/fleet/finance/finance";
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
  type PayoutData,
} from "@/components/utilities/Fleet/PayoutsDataTable";
import Loader from "@/components/utilities/Loader";
import { payoutRecordId } from "@/lib/payoutId";

const DEFAULT_LIMIT = 20;

const PAYOUT_STATUSES: FleetPayoutStatus[] = [
  "pending",
  "approved",
  "rejected",
  "failed",
  "success",
];

const formatRequestedAt = (value: unknown) => {
  if (value == null || value === "") return "—";
  try {
    return new Date(String(value)).toLocaleString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(value);
  }
};

const formatBankAccount = (details: unknown) => {
  if (!details || typeof details !== "object") return "—";
  const d = details as { bankName?: string; accountNumber?: string };
  if (!d.bankName && !d.accountNumber) return "—";
  const last4 = d.accountNumber?.slice(-4) ?? "****";
  return `${d.bankName ?? "—"} ****${last4}`;
};

function mapPayoutToRow(p: Record<string, unknown>): PayoutData {
  const amount =
    typeof p.amount === "number" ? p.amount : Number(p.amount) || 0;

  return {
    id: payoutRecordId(p),
    amount: `₦${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    status: p.status != null ? String(p.status) : "—",
    requestedAt: formatRequestedAt(p.createdAt),
    bankAccount: formatBankAccount(p.details),
  };
}

function FleetPayouts() {
  const [status, setStatus] = useState<"" | FleetPayoutStatus>("");
  const [referenceInput, setReferenceInput] = useState("");
  const [appliedReference, setAppliedReference] = useState("");
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [cursorStack, setCursorStack] = useState<
    (number | string | undefined)[]
  >([undefined]);

  useEffect(() => {
    setCursorStack([undefined]);
  }, [status, appliedReference]);

  const currentCursor = cursorStack[cursorStack.length - 1];

  const queryParams = useMemo<GetFleetPayoutsParams>(() => {
    const params: GetFleetPayoutsParams = { limit };
    if (status) params.status = status;
    if (appliedReference.trim()) params.reference = appliedReference.trim();
    if (currentCursor != null && currentCursor !== "") {
      params.cursor = currentCursor;
    }
    return params;
  }, [appliedReference, currentCursor, limit, status]);

  const { data, isLoading, isFetching, error } = useGetPayouts(queryParams);

  const payouts = useMemo(() => parseFleetPayoutsListPayload(data), [data]);
  const meta = useMemo(() => parseFleetPayoutsListMeta(data), [data]);

  const tableData: PayoutData[] = useMemo(
    () => payouts.map(mapPayoutToRow).filter((row) => row.id !== ""),
    [payouts],
  );

  const pageIndex = cursorStack.length - 1;
  const hasPrevious = pageIndex > 0;
  const hasNext =
    meta?.lastCursor != null &&
    meta.lastCursor !== "" &&
    payouts.length >= limit;

  const handleApplyReference = () => {
    setAppliedReference(referenceInput.trim());
  };

  const handleClearFilters = () => {
    setStatus("");
    setReferenceInput("");
    setAppliedReference("");
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
        <PageHeader title="Payouts" subtitle="Failed to load payouts." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Payouts"
        subtitle={
          meta?.count != null
            ? `View payout requests · ${meta.count.toLocaleString("en-NG")} total`
            : "View your payout requests and status"
        }
      />

      <div className="flex flex-col gap-3 rounded-xl border border-line-1 bg-background p-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="space-y-2 min-w-[160px]">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={status || "all"}
            onValueChange={(next) =>
              setStatus(next === "all" ? "" : (next as FleetPayoutStatus))
            }
          >
            <SelectTrigger className="h-10 w-full sm:w-[180px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className="fleet-select-menu">
              <SelectItem value="all">All</SelectItem>
              {PAYOUT_STATUSES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 min-w-[200px] flex-1">
          <label className="text-sm font-medium">Reference</label>
          <Input
            value={referenceInput}
            onChange={(e) => setReferenceInput(e.target.value)}
            placeholder="Reference"
            className="h-10"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleApplyReference();
            }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={handleApplyReference}>
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

export default FleetPayouts;
