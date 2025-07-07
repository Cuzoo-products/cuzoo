import {
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#2563eb",
  },
  sales: {
    label: "Sales",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

declare type ChartData = { month: string; revenue: number; sales: number }[];

function VendorChart({ chartData }: { chartData: ChartData }) {
  return (
    <div>
      <ChartContainer config={chartConfig} className="max-h-[340px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
          <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

export default VendorChart;
