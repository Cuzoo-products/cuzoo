import PageHeader from "@/components/admin/PageHeader";
import { useVendorsPayouts } from "@/api/admin/payouts/usePayouts";
import { DataTable } from "@/components/ui/data-table";
import Loader from "@/components/utilities/Loader";
import { columns, type PayoutData } from "@/components/utilities/Vendors/PayoutsDataTable";
import { payoutRecordId } from "@/lib/payoutId";

const formatRequestedAt = (value: string) => {
  try {
    return new Date(value).toLocaleString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
};

const formatBankAccount = (details?: { bankName?: string; accountNumber?: string }) => {
  if (!details) return "—";
  const last4 = details.accountNumber?.slice(-4) ?? "****";
  return `${details.bankName ?? "Bank"} ****${last4}`;
};

export default function AdminVendorsPayouts() {
  const { data, isLoading, error } = useVendorsPayouts() as {
    data?: any;
    isLoading: boolean;
    error: unknown;
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="text-red-500">Failed to load vendor payouts.</div>;

  const tableData: PayoutData[] = (data?.data?.data ?? []).map((p: any) => ({
    id: payoutRecordId(p),
    amount: `₦${Number(p.amount ?? 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    status: p.status ?? "—",
    requestedAt: formatRequestedAt(p.createdAt ?? ""),
    bankAccount: formatBankAccount(p.details),
  }));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Vendor Payouts"
        subtitle="Review vendor payout requests and status"
      />
      <DataTable adminVariant searchPlaceholder="Search..." columns={columns} data={tableData} />
    </div>
  );
}
