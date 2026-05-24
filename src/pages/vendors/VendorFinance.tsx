import PageHeader from "@/components/admin/PageHeader";
import { Link } from "react-router";
import { useState } from "react";
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
} from "@/api/vendor/finance/useFinance";

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

type HistoryResponse = {
  success: boolean;
  statusCode: number;
  data: {
    count: number;
    lastCursor: number;
    limit: number;
    data: {
      amount: number;
      date: string;
    }[];
  };
};

const amountOrZero = (amount?: number) =>
  typeof amount === "number" ? amount : 0;

const TIME_FILTERS = ["7D", "30D", "3M", "1Y"] as const;

export default function VendorFinance() {
  const [timeFilter, setTimeFilter] =
    useState<(typeof TIME_FILTERS)[number]>("30D");

  const { mutateAsync: requestWithdrawal, isPending: isWithdrawing } =
    useRequestWithdrawal();
  const { data, isLoading, error } = useWalletDetails() as {
    data?: WalletDetailsResponse;
    isLoading: boolean;
    error: unknown;
  };

  const { data: inflow } = useInflow() as { data?: HistoryResponse };
  const { data: outflow } = useOutflow() as { data?: HistoryResponse };

  const inflowRows = inflow?.data?.data ?? [];
  const outflowRows = outflow?.data?.data ?? [];

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

  const chartData = Array.from(chartMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

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
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--admin-text-primary)]">
              Finance Overview
            </h2>
            <p className="text-sm text-[var(--admin-text-muted)]">
              Track your cash inflow and outflow
            </p>
          </div>
          <div className="vendor-finance-filter">
            {TIME_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                data-active={timeFilter === filter}
                onClick={() => setTimeFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
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
                <div key={index} className="vendor-flow-item">
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
                <div key={index} className="vendor-flow-item">
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
        </div>
      </div>
    </div>
  );
}
