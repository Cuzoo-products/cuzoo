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

declare type ChartData = { month: string; revenue: number; sales: number }[];

type VendorChartProps = {
  chartData: ChartData;
};

function VendorChartTooltip({
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
    <div className="vendor-chart-tooltip">
      <p className="vendor-chart-tooltip__label">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="vendor-chart-tooltip__row">
          <span className="vendor-chart-tooltip__name">
            <span
              className="vendor-chart-tooltip__dot"
              style={{ backgroundColor: entry.color }}
            />
            {entry.name}
          </span>
          <span className="vendor-chart-tooltip__value">
            {entry.dataKey === "sales"
              ? entry.value.toLocaleString("en-NG")
              : formatVendorCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function VendorChart({ chartData }: VendorChartProps) {
  const maxValue = useMemo(() => {
    const peak = chartData.reduce(
      (max, row) => Math.max(max, row.revenue, row.sales),
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
    <div className="vendor-dashboard-chart">
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={chartData}>
          <defs>
            <linearGradient id="vendorRevenueGradient" x1="0" y1="0" x2="0" y2="1">
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
          <Tooltip content={<VendorChartTooltip />} />
          <Bar
            dataKey="revenue"
            name="Revenue"
            fill="url(#vendorRevenueGradient)"
            radius={[6, 6, 0, 0]}
            maxBarSize={50}
          />
          <Line
            type="monotone"
            dataKey="sales"
            name="Sales"
            stroke="#7C66DC"
            strokeWidth={2}
            dot={{ fill: "#7C66DC", r: 4 }}
            activeDot={{ r: 6, fill: "#7C66DC", strokeWidth: 2, stroke: "#fff" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="vendor-chart-legend">
        <span className="vendor-chart-legend__item">
          <span className="vendor-chart-legend__dot vendor-chart-legend__dot--revenue" />
          Revenue
        </span>
        <span className="vendor-chart-legend__item">
          <span className="vendor-chart-legend__dot vendor-chart-legend__dot--sales" />
          Sales
        </span>
      </div>
    </div>
  );
}

export default VendorChart;
