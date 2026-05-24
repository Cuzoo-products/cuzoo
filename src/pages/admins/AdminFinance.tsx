import type { ColumnDef } from "@tanstack/react-table";
import { CreditCard, DollarSign, TrendingUp, Users } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import KpiCard from "@/components/admin/KpiCard";
import StatusBadge from "@/components/admin/StatusBadge";
import { Section } from "@/components/admin/DetailShell";
import { DataTable } from "@/components/ui/data-table";

type FinancialRecord = {
  date: string;
  type: "InFlow" | "OutFlow";
  amount: string;
};

const financialRecordsData: FinancialRecord[] = [
  { date: "24th, May 2025", type: "InFlow", amount: "₦250.00" },
  { date: "24th, May 2025", type: "OutFlow", amount: "₦250.00" },
];

const columns: ColumnDef<FinancialRecord>[] = [
  { accessorKey: "date", header: "Date" },
  { accessorKey: "amount", header: "Amount" },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <StatusBadge status={row.original.type} />,
  },
];

export default function AdminFinance() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Finance"
        subtitle="Overview of platform financials"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<DollarSign className="h-5 w-5 text-[var(--admin-accent)]" />}
          label="Total Revenue"
          value={455231.89}
          prefix="₦"
          decimals={2}
          trend="+20.1% from last month"
          trendColor="success"
        />
        <KpiCard
          icon={<Users className="h-5 w-5 text-[var(--admin-accent)]" />}
          label="From Riders"
          value={9235}
          prefix="₦"
          trend="+180.1% from last month"
          trendColor="success"
        />
        <KpiCard
          icon={<CreditCard className="h-5 w-5 text-[var(--admin-accent)]" />}
          label="From Vendors"
          value={12234}
          prefix="₦"
          trend="+19% from last month"
          trendColor="success"
        />
        <KpiCard
          icon={<TrendingUp className="h-5 w-5 text-[var(--admin-accent)]" />}
          label="From Fleets"
          value={573}
          prefix="₦"
          trend="+201 since last hour"
          trendColor="success"
        />
      </div>

      <Section
        title="Financial Records"
        subtitle="A list of recent financial transactions."
      >
        <DataTable
          adminVariant
          searchPlaceholder="Search transactions..."
          columns={columns}
          data={financialRecordsData}
        />
      </Section>
    </div>
  );
}
