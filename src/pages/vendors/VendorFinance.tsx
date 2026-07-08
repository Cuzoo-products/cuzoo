import PageHeader from "@/components/admin/PageHeader";
import BackendCursorPagination from "@/components/admin/BackendCursorPagination";
import { Link } from "react-router";
import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { WithdrawDialog } from "@/components/utilities/WithdrawDialog";
import {
  useWalletDetails,
  useInflow,
  useOutflow,
  useRequestWithdrawal,
  useFinanceOverview,
} from "@/api/vendor/finance/useFinance";
import {
  parseVendorFinanceHistoryMeta,
  parseVendorFinanceHistoryPayload,
  type GetVendorFinanceHistoryParams,
} from "@/api/vendor/finance/finance";

type WalletDetailsResponse = {
  success: boolean;
  statusCode: number;
  data: {
    amount: number;
    currency: string;
    suspended: boolean;
    accounts: {
      accountName: string;
      accountNumber: string;
      bankName: string;
    }[];
  };
};

const DEFAULT_LIMIT = 20;

const amountOrZero = (amount?: number) =>
  typeof amount === "number" ? amount : 0;

function useHistoryPagination() {
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [cursorStack, setCursorStack] = useState<
    (number | string | undefined)[]
  >([undefined]);

  const currentCursor = cursorStack[cursorStack.length - 1];
  const pageIndex = cursorStack.length - 1;
  const hasPrevious = pageIndex > 0;

  const params = useMemo<GetVendorFinanceHistoryParams>(() => {
    const next: GetVendorFinanceHistoryParams = { limit };
    if (currentCursor != null && currentCursor !== "") {
      next.cursor = currentCursor;
    }
    return next;
  }, [currentCursor, limit]);

  const handleLimitChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setCursorStack([undefined]);
  };

  const handlePrevious = () => {
    if (!hasPrevious) return;
    setCursorStack((prev) => prev.slice(0, -1));
  };

  const goNext = (lastCursor: number | string | null | undefined) => {
    if (lastCursor == null || lastCursor === "") return;
    setCursorStack((prev) => [...prev, lastCursor]);
  };

  return {
    limit,
    params,
    pageIndex,
    hasPrevious,
    handleLimitChange,
    handlePrevious,
    goNext,
  };
}

export default function VendorFinance() {
  const inflowPager = useHistoryPagination();
  const outflowPager = useHistoryPagination();

  const { mutateAsync: requestWithdrawal, isPending: isWithdrawing } =
    useRequestWithdrawal();
  const { data, isLoading, error } = useWalletDetails() as {
    data?: WalletDetailsResponse;
    isLoading: boolean;
    error: unknown;
  };

  const { data: overviewPayload } = useFinanceOverview();
  const {
    data: inflowPayload,
    isFetching: isInflowFetching,
  } = useInflow(inflowPager.params);
  const {
    data: outflowPayload,
    isFetching: isOutflowFetching,
  } = useOutflow(outflowPager.params);

  const inflowRows = useMemo(
    () => parseVendorFinanceHistoryPayload(inflowPayload),
    [inflowPayload],
  );
  const outflowRows = useMemo(
    () => parseVendorFinanceHistoryPayload(outflowPayload),
    [outflowPayload],
  );
  const inflowMeta = useMemo(
    () => parseVendorFinanceHistoryMeta(inflowPayload),
    [inflowPayload],
  );
  const outflowMeta = useMemo(
    () => parseVendorFinanceHistoryMeta(outflowPayload),
    [outflowPayload],
  );

  const inflowHasNext =
    inflowMeta?.lastCursor != null &&
    inflowMeta.lastCursor !== "" &&
    inflowRows.length >= inflowPager.limit;
  const outflowHasNext =
    outflowMeta?.lastCursor != null &&
    outflowMeta.lastCursor !== "" &&
    outflowRows.length >= outflowPager.limit;

  const chartData = useMemo(() => {
    const overview = (overviewPayload as { data?: unknown } | undefined)?.data;
    if (overview && typeof overview === "object" && !Array.isArray(overview)) {
      const series = (overview as { series?: unknown; chart?: unknown }).series
        ?? (overview as { chart?: unknown }).chart;
      if (Array.isArray(series)) {
        return series
          .map((point) => {
            const p = point as Record<string, unknown>;
            const name = String(p.name ?? p.date ?? "");
            if (!name) return null;
            return {
              name,
              inflow: amountOrZero(
                typeof p.inflow === "number" ? p.inflow : Number(p.inflow),
              ),
              outflow: amountOrZero(
                typeof p.outflow === "number" ? p.outflow : Number(p.outflow),
              ),
            };
          })
          .filter(Boolean) as Array<{
          name: string;
          inflow: number;
          outflow: number;
        }>;
      }
    }

    const chartMap = new Map<
      string,
      { name: string; inflow: number; outflow: number }
    >();

    inflowRows.forEach((row) => {
      const existing = chartMap.get(row.date) ?? {
        name: row.date,
        inflow: 0,
        outflow: 0,
      };
      existing.inflow += amountOrZero(row.amount);
      chartMap.set(row.date, existing);
    });

    outflowRows.forEach((row) => {
      const existing = chartMap.get(row.date) ?? {
        name: row.date,
        inflow: 0,
        outflow: 0,
      };
      existing.outflow += amountOrZero(row.amount);
      chartMap.set(row.date, existing);
    });

    return Array.from(chartMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [inflowRows, outflowPayload, outflowRows, overviewPayload]);

  const wallet = data?.data;
  const walletBalance = amountOrZero(wallet?.amount);
  const currency = wallet?.currency ?? "NGN";
  const formattedAmount =
    wallet && typeof wallet.amount === "number"
      ? walletBalance.toLocaleString("en-NG", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      : "0";

  const formatMoney = (amount: number) => {
    const prefix = currency === "NGN" || currency === "₦" ? "₦" : `${currency} `;
    return `${prefix}${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Finance" subtitle="Manage your finances" />

      <div className="vendor-wallet-card">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-white/80">Wallet Balance</p>
            <p className="text-3xl font-semibold text-white">
              {isLoading
                ? "Loading..."
                : error
                  ? `${currency} 0`
                  : `${currency} ${formattedAmount}`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/vendor/banks"
            className="rounded-lg bg-white px-6 py-2.5 text-sm font-medium text-[var(--vendor-sidebar-primary)] transition-colors hover:bg-white/90"
          >
            Manage Banks
          </Link>
          <WithdrawDialog
            balance={walletBalance}
            onSubmit={async (payload) => {
              try {
                await requestWithdrawal(payload);
                return true;
              } catch {
                return false;
              }
            }}
            isPending={isWithdrawing}
            accounts={wallet?.accounts ?? []}
            disabled={Boolean(wallet?.suspended)}
            triggerClassName="rounded-lg bg-white/20 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/30 border-0 shadow-none h-auto"
            contentClassName="vendor-portal-dialog"
          />
        </div>

        {wallet?.suspended && (
          <p className="mt-3 text-xs text-white/80">
            Withdrawals are currently suspended on this wallet.
          </p>
        )}
      </div>

      <div className="vendor-finance-card">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[var(--admin-text-primary)]">
            Finance Overview
          </h2>
          <p className="text-sm text-[var(--admin-text-muted)]">
            Track your cash inflow and outflow
          </p>
        </div>

        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--admin-border)"
                opacity={0.3}
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--admin-text-muted)", fontSize: 12 }}
                axisLine={{ stroke: "var(--admin-border)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--admin-text-muted)", fontSize: 12 }}
                axisLine={{ stroke: "var(--admin-border)" }}
                tickLine={false}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="inflow"
                stroke="#3fb950"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="outflow"
                stroke="#f85149"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <span className="inline-flex items-center gap-2 text-[var(--admin-text-muted)]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#3fb950]" />
            Inflow
          </span>
          <span className="inline-flex items-center gap-2 text-[var(--admin-text-muted)]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f85149]" />
            Outflow
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="vendor-flow-card">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--admin-success)]/10">
              <ArrowDownRight className="h-5 w-5 text-[var(--admin-success)]" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--admin-text-primary)]">
              Inflow
            </h2>
          </div>
          <div className="space-y-3">
            {inflowRows.length === 0 ? (
              <p className="text-sm text-[var(--admin-text-muted)]">
                No inflow records yet.
              </p>
            ) : (
              inflowRows.map((row, index) => (
                <div key={`${row.date}-${index}`} className="vendor-flow-item">
                  <div>
                    <p className="text-sm text-[var(--admin-text-primary)]">
                      {row.date}
                    </p>
                    <p className="text-xs text-[var(--admin-text-muted)]">
                      Inflow transaction
                    </p>
                  </div>
                  <p className="text-sm font-medium text-[var(--admin-success)]">
                    +{formatMoney(amountOrZero(row.amount))}
                  </p>
                </div>
              ))
            )}
          </div>
          <BackendCursorPagination
            count={inflowMeta?.count}
            limit={inflowPager.limit}
            pageIndex={inflowPager.pageIndex}
            hasPrevious={inflowPager.hasPrevious}
            hasNext={inflowHasNext}
            isLoading={isInflowFetching}
            onPrevious={inflowPager.handlePrevious}
            onNext={() => inflowPager.goNext(inflowMeta?.lastCursor)}
            onLimitChange={inflowPager.handleLimitChange}
          />
        </div>

        <div className="vendor-flow-card">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--admin-danger)]/10">
              <ArrowUpRight className="h-5 w-5 text-[var(--admin-danger)]" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--admin-text-primary)]">
              Outflow
            </h2>
          </div>
          <div className="space-y-3">
            {outflowRows.length === 0 ? (
              <p className="text-sm text-[var(--admin-text-muted)]">
                No outflow records yet.
              </p>
            ) : (
              outflowRows.map((row, index) => (
                <div key={`${row.date}-${index}`} className="vendor-flow-item">
                  <div>
                    <p className="text-sm text-[var(--admin-text-primary)]">
                      {row.date}
                    </p>
                    <p className="text-xs text-[var(--admin-text-muted)]">
                      Outflow transaction
                    </p>
                  </div>
                  <p className="text-sm font-medium text-[var(--admin-danger)]">
                    -{formatMoney(amountOrZero(row.amount))}
                  </p>
                </div>
              ))
            )}
          </div>
          <BackendCursorPagination
            count={outflowMeta?.count}
            limit={outflowPager.limit}
            pageIndex={outflowPager.pageIndex}
            hasPrevious={outflowPager.hasPrevious}
            hasNext={outflowHasNext}
            isLoading={isOutflowFetching}
            onPrevious={outflowPager.handlePrevious}
            onNext={() => outflowPager.goNext(outflowMeta?.lastCursor)}
            onLimitChange={outflowPager.handleLimitChange}
          />
        </div>
      </div>
    </div>
  );
}
