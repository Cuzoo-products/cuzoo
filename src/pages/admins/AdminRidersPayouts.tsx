import { useRidersPayouts } from "@/api/admin/payouts/usePayouts";
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

export default function AdminRidersPayouts() {
  const { data, isLoading, error } = useRidersPayouts() as {
    data?: any;
    isLoading: boolean;
    error: unknown;
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="text-red-500">Failed to load rider payouts.</div>;

  const tableData: PayoutData[] = (data?.data?.data ?? []).map((p: any) => ({
    id: payoutRecordId(p),
    referenceNo: p.reference,
    amount: `₦${Number(p.amount ?? 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    status: p.status ?? "—",
    requestedAt: formatRequestedAt(p.createdAt ?? ""),
    bankAccount: formatBankAccount(p.details),
  }));

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Rider payouts</h3>
        <p className="text-muted-foreground">Review rider payout requests and status</p>
      </div>
      <DataTable columns={columns} data={tableData} />
    </div>
  );
}
