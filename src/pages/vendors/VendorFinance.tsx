import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { WithdrawDialog } from "@/components/utilities/WithdrawDialog";
import { Link } from "react-router";
import {
  useAccountBalance,
  useInflow,
  useOutflow,
} from "@/api/vendor/finance/useFinance";

type AccountBalanceResponse = {
  success: boolean;
  statusCode: number;
  data: {
    amount: number;
    currency: string;
    suspended: boolean;
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

export default function VendorFinance() {
  const { data, isLoading, error } = useAccountBalance() as {
    data?: AccountBalanceResponse;
    isLoading: boolean;
    error: unknown;
  };

  const { data: inflow } = useInflow() as { data?: HistoryResponse };
  const { data: outflow } = useOutflow() as { data?: HistoryResponse };

  const inflowRows = inflow?.data?.data ?? [];
  const outflowRows = outflow?.data?.data ?? [];

  const chartMap = new Map<
    string,
    {
      name: string;
      inflow: number;
      outflow: number;
    }
  >();

  inflowRows.forEach((row) => {
    const existing = chartMap.get(row.date) ?? {
      name: row.date,
      inflow: 0,
      outflow: 0,
    };
    existing.inflow += row.amount;
    chartMap.set(row.date, existing);
  });

  outflowRows.forEach((row) => {
    const existing = chartMap.get(row.date) ?? {
      name: row.date,
      inflow: 0,
      outflow: 0,
    };
    existing.outflow += row.amount;
    chartMap.set(row.date, existing);
  });

  const chartData = Array.from(chartMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const wallet = data?.data;
  const formattedAmount =
    wallet && typeof wallet.amount === "number"
      ? wallet.amount.toLocaleString("en-NG", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0.00";

  return (
    <div className="p-4 space-y-6">
      <Card className="py-2 bg-secondary">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between py-4">
          <CardTitle>Wallet Balance</CardTitle>
          <div className="flex items-center gap-3">
            <Link
              to="/vendor/banks"
              className="text-xs sm:text-sm text-primary hover:text-accent underline-offset-4 hover:underline"
            >
              Manage Banks
            </Link>
            <WithdrawDialog />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {wallet?.currency ?? "₦"}
            {isLoading ? "Loading..." : error ? "0.00" : formattedAmount}
          </p>
          {wallet?.suspended && (
            <p className="mt-1 text-xs text-red-500">
              Withdrawals are currently suspended on this wallet.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="py-2 bg-secondary">
        <CardHeader>
          <CardTitle>Finance Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="inflow" stroke="#4ade80" />
              <Line type="monotone" dataKey="outflow" stroke="#f87171" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="py-2 bg-secondary">
          <CardHeader>
            <CardTitle>Inflow History</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">Date</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {inflowRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="py-2 text-sm text-muted-foreground"
                    >
                      No inflow records yet.
                    </td>
                  </tr>
                ) : (
                  inflowRows.map((row, index) => (
                    <tr key={index}>
                      <td>{row.date}</td>
                      <td className="text-right">
                        {wallet?.currency ?? "₦"}
                        {row.amount.toLocaleString("en-NG", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="py-2 bg-secondary">
          <CardHeader>
            <CardTitle>Outflow History</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">Date</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {outflowRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="py-2 text-sm text-muted-foreground"
                    >
                      No outflow records yet.
                    </td>
                  </tr>
                ) : (
                  outflowRows.map((row, index) => (
                    <tr key={index}>
                      <td>{row.date}</td>
                      <td className="text-right">
                        {wallet?.currency ?? "₦"}
                        {row.amount.toLocaleString("en-NG", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
