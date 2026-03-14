import { useGetPayouts } from "@/api/fleet/finance/useFinance";
import { DataTable } from "@/components/ui/data-table";
import {
  columns,
  type PayoutData,
} from "@/components/utilities/Fleet/PayoutsDataTable";

export type PayoutsListResponse = {
  success: boolean;
  statusCode: number;
  data: {
    count: number;
    lastCursor: number;
    limit: number;
    data: {
      Id: string;
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

const formatBankAccount = (details: { bankName: string; accountNumber: string } | undefined) => {
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
    id: p.Id,
    referenceNo: p.reference,
    amount: `₦${p.amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    status: p.status,
    requestedAt: formatRequestedAt(p.createdAt),
    bankAccount: formatBankAccount(p.details),
  }));

  if (isLoading) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Payouts</h3>
          <p className="text-muted-foreground">Loading payouts…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Payouts</h3>
          <p className="text-red-500">Failed to load payouts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Payouts</h3>
        <p className="text-muted-foreground">View your payout requests and status</p>
      </div>

      <DataTable columns={columns} data={tableData} />
    </div>
  );
}

export default FleetPayouts;
