import { useMemo } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatVendorCurrency } from "@/lib/vendorChartUtils";

declare type ChartData = { month: string; revenue: number; trips: number }[];

function FleetChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string; dataKey: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg-card)] p-3 text-xs shadow-md">
      <p className="mb-2 font-semibold text-[var(--admin-text-primary)]">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4">
          <span className="text-[var(--admin-text-muted)]">{entry.name}</span>
          <span className="font-semibold text-[var(--admin-text-primary)]">
            {entry.dataKey === "trips"
              ? entry.value.toLocaleString("en-NG")
              : formatVendorCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function FleetChart({ chartData }: { chartData: ChartData }) {
  const maxValue = useMemo(() => {
    const peak = chartData.reduce(
      (max, row) => Math.max(max, row.revenue, row.trips),
      0,
    );
    return Math.max(peak, 1_000_000);
  }, [chartData]);

  const yTicks = useMemo(() => {
    const roundedMax = Math.ceil(maxValue / 250_000) * 250_000;
    const step = roundedMax / 4;
    return [0, step, step * 2, step * 3, roundedMax];
  }, [maxValue]);

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={chartData}>
          <defs>
            <linearGradient id="fleetRevenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6E56CF" stopOpacity={0.85} />
              <stop offset="100%" stopColor="#6E56CF" stopOpacity={0.65} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--admin-border)"
            opacity={0.35}
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fill: "var(--admin-text-muted)", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "var(--admin-border)" }}
          />
          <YAxis
            tick={{ fill: "var(--admin-text-muted)", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "var(--admin-border)" }}
            tickFormatter={formatVendorCurrency}
            domain={[0, yTicks[yTicks.length - 1]]}
            ticks={yTicks}
          />
          <Tooltip content={<FleetChartTooltip />} />
          <Bar
            dataKey="revenue"
            name="Revenue"
            fill="url(#fleetRevenueGradient)"
            radius={[6, 6, 0, 0]}
            maxBarSize={50}
          />
          <Line
            type="monotone"
            dataKey="trips"
            name="Trips"
            stroke="#7C66DC"
            strokeWidth={2}
            dot={{ fill: "#7C66DC", r: 4 }}
            activeDot={{ r: 6, fill: "#7C66DC", strokeWidth: 2, stroke: "#fff" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="fleet-chart-legend">
        <span className="fleet-chart-legend__item">
          <span className="fleet-chart-legend__dot fleet-chart-legend__dot--revenue" />
          Revenue
        </span>
        <span className="fleet-chart-legend__item">
          <span className="fleet-chart-legend__dot fleet-chart-legend__dot--trips" />
          Trips
        </span>
      </div>
    </div>
  );
}

export default FleetChart;
