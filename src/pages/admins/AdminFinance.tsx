import { useMemo, useState } from "react";
import { ArrowDownRight, CreditCard, DollarSign, TrendingUp, Users, Wallet } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import BackendCursorPagination from "@/components/admin/BackendCursorPagination";
import KpiCard from "@/components/admin/KpiCard";
import Loader from "@/components/utilities/Loader";
import { useAdminEarnings } from "@/api/admin/finance/useEarnings";
import { parseAdminEarnings } from "@/api/admin/finance/earnings";
import { useFinancialRecords } from "@/api/admin/finance/useFinancialRecords";
import {
  parseFinancialRecordsMeta,
  parseFinancialRecordsPayload,
  type GetFinancialRecordsParams,
} from "@/api/admin/finance/financialRecords";

const DEFAULT_LIMIT = 20;

function formatDate(date: string): string {
  if (!date || date === "—") return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatMoney(amount: number): string {
  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function AdminFinance() {
  const { data: earningsData, isLoading: earningsLoading, error: earningsError } =
    useAdminEarnings();
  const earnings = parseAdminEarnings(earningsData);

  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [cursorStack, setCursorStack] = useState<
    (number | string | undefined)[]
  >([undefined]);

  const currentCursor = cursorStack[cursorStack.length - 1];

  const recordsParams = useMemo<GetFinancialRecordsParams>(() => {
    const params: GetFinancialRecordsParams = { limit };
    if (currentCursor != null && currentCursor !== "") {
      params.cursor = currentCursor;
    }
    return params;
  }, [currentCursor, limit]);

  const {
    data: recordsData,
    isLoading: recordsLoading,
    isFetching: recordsFetching,
    error: recordsError,
  } = useFinancialRecords(recordsParams);

  const records = useMemo(
    () => parseFinancialRecordsPayload(recordsData),
    [recordsData],
  );
  const recordsMeta = useMemo(
    () => parseFinancialRecordsMeta(recordsData),
    [recordsData],
  );

  const pageIndex = cursorStack.length - 1;
  const hasPrevious = pageIndex > 0;
  const hasNext =
    recordsMeta?.lastCursor != null &&
    recordsMeta.lastCursor !== "" &&
    records.length >= limit;

  const handleLimitChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setCursorStack([undefined]);
  };

  const handlePrevious = () => {
    if (!hasPrevious) return;
    setCursorStack((prev) => prev.slice(0, -1));
  };

  const handleNext = () => {
    if (!hasNext || recordsMeta?.lastCursor == null) return;
    setCursorStack((prev) => [...prev, recordsMeta.lastCursor as number | string]);
  };

  if (earningsLoading) return <Loader />;

  if (earningsError || !earnings) {
    return (
      <div className="space-y-6">
        <PageHeader title="Finance" subtitle="Failed to load earnings." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finance"
        subtitle={
          recordsMeta?.count != null
            ? `Overview of platform financials · ${recordsMeta.count.toLocaleString("en-NG")} daily commission records`
            : "Overview of platform financials"
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          icon={<DollarSign className="h-5 w-5 text-[var(--admin-accent)]" />}
          label="Total Revenue"
          value={earnings.totalRevenue}
          prefix="₦"
          decimals={2}
        />
        <KpiCard
          icon={<Wallet className="h-5 w-5 text-[var(--admin-accent)]" />}
          label="Platform Earnings"
          value={earnings.platformEarnings}
          prefix="₦"
          decimals={2}
        />
        <KpiCard
          icon={<Users className="h-5 w-5 text-[var(--admin-accent)]" />}
          label="Rider Earnings"
          value={earnings.riderEarnings}
          prefix="₦"
          decimals={2}
        />
        <KpiCard
          icon={<CreditCard className="h-5 w-5 text-[var(--admin-accent)]" />}
          label="Vendor Earnings"
          value={earnings.vendorEarnings}
          prefix="₦"
          decimals={2}
        />
        <KpiCard
          icon={<TrendingUp className="h-5 w-5 text-[var(--admin-accent)]" />}
          label="Fleet Earnings"
          value={earnings.fleetEarnings}
          prefix="₦"
          decimals={2}
        />
      </div>

      <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg-card)] p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--admin-success)]/10">
            <ArrowDownRight className="h-5 w-5 text-[var(--admin-success)]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--admin-text-primary)]">
              Commission inflow history
            </h2>
            <p className="text-sm text-[var(--admin-text-muted)]">
              Daily platform commission earnings
            </p>
          </div>
        </div>

        {recordsLoading ? (
          <Loader />
        ) : recordsError ? (
          <p className="text-sm text-[var(--admin-text-muted)]">
            Failed to load financial records.
          </p>
        ) : records.length === 0 ? (
          <p className="text-sm text-[var(--admin-text-muted)]">
            No commission records yet.
          </p>
        ) : (
          <div className="space-y-3">
            {records.map((row, index) => (
              <div
                key={`${row.date}-${index}`}
                className="flex items-center justify-between rounded-lg border border-[var(--admin-border)] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--admin-text-primary)]">
                    {formatDate(row.date)}
                  </p>
                  <p className="text-xs text-[var(--admin-text-muted)]">
                    Commission earnings
                  </p>
                </div>
                <p className="text-sm font-semibold text-[var(--admin-success)]">
                  +{formatMoney(row.amount)}
                </p>
              </div>
            ))}
          </div>
        )}

        <BackendCursorPagination
          count={recordsMeta?.count}
          limit={limit}
          pageIndex={pageIndex}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          isLoading={recordsFetching}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onLimitChange={handleLimitChange}
        />
      </div>
    </div>
  );
}
