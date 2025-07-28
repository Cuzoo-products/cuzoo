import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

type FinancialMetric = {
  metric: string;
  value: string;
  isPositive?: boolean;
};

// --- Report Data for the Current Month (July 2025) ---
const reportData: FinancialMetric[] = [
  { metric: "Total Revenue", value: "₦5,500,000.00" },
  { metric: "Outflow", value: "₦1, 636,000.00" },
  { metric: "Cuzoo profit", value: "₦650,000.00" },
  { metric: "total Orders", value: "300" },
  { metric: "Profit Margin", value: "45.5%", isPositive: true },
];

const FinancialReport = () => {
  return (
    <Card className="py-6 bg-secondary">
      <CardHeader className="pb-4">
        <CardTitle>Financial Summary 📈</CardTitle>
        <CardDescription>Report for July 2025</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableBody>
            {reportData.map((item) => (
              <TableRow key={item.metric}>
                <TableCell className="font-medium">{item.metric}</TableCell>
                <TableCell
                  className={`text-right font-semibold ${
                    item.isPositive === true ? "text-green-600" : ""
                  }`}
                >
                  {item.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4">
        <p className="text-xs text-muted-foreground">Updated as of today.</p>
        {/* <Button size="sm" variant="ghost" className="gap-1">
          <Link to="financials">View Full Report</Link>
          <ArrowRight className="h-4 w-4" />
        </Button> */}
      </CardFooter>
    </Card>
  );
};

export default FinancialReport;
