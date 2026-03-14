import { useParams, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useGetPayout } from "@/api/fleet/finance/useFinance";

export type PayoutDetailResponse = {
  success: boolean;
  statusCode: number;
  data: {
    type: string;
    vendorId?: string;
    companyId?: string;
    riderId?: string;
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
  };
};

const formatDate = (value: string) => {
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

const maskAccount = (acc: string) => {
  if (!acc || acc.length < 4) return "****";
  return `****${acc.slice(-4)}`;
};

export default function FleetPayoutDetails() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetPayout(id ?? "") as {
    data?: PayoutDetailResponse;
    isLoading: boolean;
    error: unknown;
  };

  const payout = data?.data;

  if (!id) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Payout details</h3>
          <p className="text-red-500 text-sm">No payout ID provided.</p>
          <Button asChild variant="outline" className="mt-2">
            <Link to="/fleet/payouts">Back to Payouts</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Payout details</h3>
          <p className="text-muted-foreground">Loading payout…</p>
        </div>
      </div>
    );
  }

  if (error || !payout) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Payout details</h3>
          <p className="text-red-500">Failed to load payout details.</p>
          <Button asChild variant="outline" className="mt-2">
            <Link to="/fleet/payouts">Back to Payouts</Link>
          </Button>
        </div>
      </div>
    );
  }

  const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    completed: "default",
    pending: "secondary",
    processing: "outline",
    failed: "destructive",
    resolved: "default",
  };

  const details = payout.details;

  return (
    <div className="@container/main">
      <div className="my-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="!font-bold text-3xl">Payout details</h3>
          <p className="text-sm text-muted-foreground">
            Reference: {payout.reference}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusVariant[payout.status] ?? "outline"}>
            {payout.status}
          </Badge>
          {payout.resolved && (
            <Badge variant="default">Resolved</Badge>
          )}
          <Button asChild variant="outline" size="sm">
            <Link to="/fleet/payouts">Back to Payouts</Link>
          </Button>
        </div>
      </div>

      <div className="bg-secondary max-w-3xl mx-auto mb-10 p-6 rounded-lg space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-1">Amount</h4>
            <p>
              ₦{payout.amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Recipient</h4>
            <p>{payout.recipient || "—"}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Resolved</h4>
            <p>{payout.resolved ? "Yes" : "No"}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Transaction ID</h4>
            <p className="font-mono text-xs">{payout.transactionId || "—"}</p>
          </div>
        </div>

        {payout.reason ? (
          <>
            <Separator />
            <div className="text-sm">
              <h4 className="font-semibold mb-1">Reason</h4>
              <p>{payout.reason}</p>
            </div>
          </>
        ) : null}

        {details && (
          <>
            <Separator />
            <div className="space-y-2 text-sm">
              <h4 className="font-semibold mb-2">Bank account</h4>
              <p>{details.bankName}</p>
              <p>{details.accountName}</p>
              <p className="text-muted-foreground font-mono">
                {maskAccount(details.accountNumber)}
              </p>
            </div>
          </>
        )}

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-1">Created at</h4>
            <p>{formatDate(payout.createdAt)}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Updated at</h4>
            <p>{formatDate(payout.updatedAt)}</p>
          </div>
        </div>

        {payout.attendedBy && (
          <>
            <Separator />
            <div className="text-sm">
              <h4 className="font-semibold mb-2">Attended by</h4>
              <p>
                {payout.attendedBy.firstName} {payout.attendedBy.lastName}
              </p>
              <p className="text-muted-foreground">{payout.attendedBy.email}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
