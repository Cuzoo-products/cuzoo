import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

const periods = [
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "3M", value: "3m" },
  { label: "1Y", value: "1y" },
] as const;

export type RevenueChartPoint = {
  month: string;
  revenue: number;
  trips: number;
};

export default function AdminRevenueChart({
  data,
}: {
  data: RevenueChartPoint[];
}) {
  const [period, setPeriod] = useState("3m");

  return (
    <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg-card)] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-[var(--admin-text-primary)]">
            Revenue & Trips
          </h3>
          <p className="text-xs text-[var(--admin-text-muted)]">
            Monthly performance overview
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg-card-alt)] p-1">
          {periods.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPeriod(p.value)}
              className={cn(
                "rounded px-2.5 py-1 text-xs font-medium transition-colors",
                period === p.value
                  ? "bg-[var(--admin-accent)] text-white"
                  : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text-primary)]",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="adminRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2F81F7" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#2F81F7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="adminTripsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6E56CF" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#6E56CF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" />
            <XAxis
              dataKey="month"
              stroke="var(--admin-text-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "var(--admin-border)" }}
            />
            <YAxis
              stroke="var(--admin-text-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "var(--admin-border)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--admin-bg-card)",
                border: "1px solid var(--admin-border)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "var(--admin-text-primary)",
              }}
              labelStyle={{ color: "var(--admin-text-muted)" }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: "12px", color: "var(--admin-text-muted)" }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#2F81F7"
              strokeWidth={2}
              fill="url(#adminRevenueGradient)"
            />
            <Area
              type="monotone"
              dataKey="trips"
              name="Trips"
              stroke="#6E56CF"
              strokeWidth={2}
              fill="url(#adminTripsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
