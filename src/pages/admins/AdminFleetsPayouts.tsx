import { useFleetsPayouts } from "@/api/admin/payouts/usePayouts";
import { DataTable } from "@/components/ui/data-table";
import Loader from "@/components/utilities/Loader";
import { columns, type PayoutData } from "@/components/utilities/Vendors/PayoutsDataTable";

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

export default function AdminFleetsPayouts() {
  const { data, isLoading, error } = useFleetsPayouts() as {
    data?: any;
    isLoading: boolean;
    error: unknown;
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="text-red-500">Failed to load fleet payouts.</div>;

  const tableData: PayoutData[] = (data?.data?.data ?? []).map((p: any) => ({
    id: p.Id,
    referenceNo: p.reference,
    amount: `₦${Number(p.amount ?? 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    status: p.status ?? "—",
    requestedAt: formatRequestedAt(p.createdAt ?? ""),
    bankAccount: formatBankAccount(p.details),
  }));

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Fleet payouts</h3>
        <p className="text-muted-foreground">Review fleet payout requests and status</p>
      </div>
      <DataTable columns={columns} data={tableData} />
    </div>
  );
}
