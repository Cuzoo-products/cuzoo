import PageHeader from "@/components/admin/PageHeader";
import { useGetPayouts } from "@/api/fleet/finance/useFinance";
import { DataTable } from "@/components/ui/data-table";
import {
  columns,
  type PayoutData,
} from "@/components/utilities/Fleet/PayoutsDataTable";
import Loader from "@/components/utilities/Loader";
import { payoutRecordId } from "@/lib/payoutId";

export type PayoutsListResponse = {
  success: boolean;
  statusCode: number;
  data: {
    count: number;
    lastCursor: number;
    limit: number;
    data: {
      Id?: string;
      id?: string;
      amount: number;
      recipient: string;
      reference: string;
      resolved: boolean;
      ownerId: string;
      transactionId: string;
      details: {
        accountName: string;
        accountNumber: string;
        bankName: string;
      };
      reason: string;
      status: string;
      attendedBy?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
      };
      createdAt: string;
      updatedAt: string;
      type: string;
      vendorId?: string;
      companyId?: string;
      riderId?: string;
    }[];
  };
};

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

const formatBankAccount = (
  details: { bankName: string; accountNumber: string } | undefined,
) => {
  if (!details) return "—";
  const last4 = details.accountNumber?.slice(-4) ?? "****";
  return `${details.bankName} ****${last4}`;
};

function FleetPayouts() {
  const { data, isLoading, error } = useGetPayouts() as {
    data?: PayoutsListResponse;
    isLoading: boolean;
    error: unknown;
  };

  const apiPayouts = data?.data?.data ?? [];
  const tableData: PayoutData[] = apiPayouts.map((p) => ({
    id: payoutRecordId(p),
    referenceNo: p.reference,
    amount: `₦${p.amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    status: p.status,
    requestedAt: formatRequestedAt(p.createdAt),
    bankAccount: formatBankAccount(p.details),
  }));

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="space-y-5">
        <PageHeader title="Payouts" subtitle="Failed to load payouts." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Payouts"
        subtitle="View your payout requests and status"
      />
      <DataTable
        adminVariant
        searchPlaceholder="Search payouts..."
        columns={columns}
        data={tableData}
      />
    </div>
  );
}

export default FleetPayouts;
