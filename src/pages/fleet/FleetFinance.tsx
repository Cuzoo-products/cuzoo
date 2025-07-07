import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { name: "Mon", inflow: 400, outflow: 240 },
  { name: "Tue", inflow: 300, outflow: 139 },
  { name: "Wed", inflow: 200, outflow: 980 },
  { name: "Thu", inflow: 278, outflow: 390 },
  { name: "Fri", inflow: 189, outflow: 480 },
  { name: "Sat", inflow: 239, outflow: 380 },
  { name: "Sun", inflow: 349, outflow: 430 },
];

export default function FleetFinance() {
  return (
    <div className="p-4 space-y-4">
      <Card className="py-2 bg-secondary">
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle>Wallet Balance</CardTitle>
          <Button>Withdraw</Button>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">₦150,000</p>
        </CardContent>
      </Card>

      <Card className="py-2 bg-secondary">
        <CardHeader>
          <CardTitle>Finance Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
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
                <tr>
                  <td>2025-07-01</td>
                  <td className="text-right">₦5,000</td>
                </tr>
                <tr>
                  <td>2025-07-03</td>
                  <td className="text-right">₦10,000</td>
                </tr>
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
                <tr>
                  <td>2025-07-02</td>
                  <td className="text-right">₦2,000</td>
                </tr>
                <tr>
                  <td>2025-07-04</td>
                  <td className="text-right">₦7,000</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
