import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// MOCK DATA
const kpiData = [
  {
    title: "Total Revenue",
    value: "₦455,231.89",
    change: "+20.1% from last month",
    icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "From Riders",
    value: "₦9,235",
    change: "+180.1% from last month",
    icon: <Users className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "From Vendors",
    value: "₦12,234",
    change: "+19% from last month",
    icon: <CreditCard className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "From Fleets",
    value: "₦573",
    change: "+201 since last hour",
    icon: <Activity className="h-4 w-4 text-muted-foreground" />,
  },
];

const financialRecordsData = [
  {
    date: "24th, May 2025",
    type: "InFlow",
    amount: "$250.00",
  },
  {
    date: "24th, May 2025",
    type: "OutFlow",
    amount: "$250.00",
  },
];

export default function AdminFinance() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="py-3 bg-secondary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              {kpi.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="py-6 bg-secondary">
        <CardHeader>
          <CardTitle>Financial Records</CardTitle>
          <CardDescription>
            A list of recent financial transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialRecordsData.map((record) => (
                <TableRow key={record.date}>
                  <TableCell className="font-medium">{record.date}</TableCell>
                  <TableCell className="font-medium">{record.amount}</TableCell>
                  <TableCell className="font-medium text-right">
                    {record.type}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
