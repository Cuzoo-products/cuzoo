import { useParams, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useGetPayout } from "@/api/fleet/finance/useFinance";
import Loader from "@/components/utilities/Loader";
import { sanitizePayoutRouteId, payoutRecordId } from "@/lib/payoutId";
import { displayRecipientLine } from "@/lib/payoutDetailsHelpers";

export type PayoutDetailResponse = {
  success: boolean;
  statusCode: number;
  data: {
    type?: string;
    vendorId?: string;
    companyId?: string;
    riderId?: string;
    Id?: string;
    id?: string;
    amount: number;
    recipient: string;
    reference: string;
    resolved: boolean;
    ownerId?: string;
    transactionId: string;
    details?: {
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
  const id = sanitizePayoutRouteId(useParams<{ id: string }>().id);
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
    return <Loader />;
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

  const statusVariant: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    completed: "default",
    pending: "secondary",
    processing: "outline",
    failed: "destructive",
    resolved: "default",
  };

  const details = payout.details;
  const payoutIdDisplay = payoutRecordId(payout);
  const recipientLine = displayRecipientLine(payout.recipient, details?.accountName);

  return (
    <div className="@container/main">
      <div className="my-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="!font-bold text-3xl">Payout details</h3>
          <p className="text-sm text-muted-foreground">
            {payout.reference ? `Reference · ${payout.reference}` : "Payout request"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={statusVariant[payout.status] ?? "outline"}>
            {payout.status}
          </Badge>
          {payout.resolved && <Badge variant="default">Resolved</Badge>}
          <Button asChild variant="outline" size="sm">
            <Link to="/fleet/payouts">Back to Payouts</Link>
          </Button>
        </div>
      </div>

      <div className="bg-secondary max-w-3xl mx-auto mb-10 p-6 rounded-lg space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-1">Amount</h4>
            <p>
              ₦
              {payout.amount.toLocaleString("en-NG", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Payout ID</h4>
            <p className="font-mono text-xs break-all">{payoutIdDisplay || "—"}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Company ID</h4>
            <p className="font-mono text-xs break-all">{payout.companyId || "—"}</p>
          </div>
          {payout.riderId ? (
            <div>
              <h4 className="font-semibold mb-1">Rider ID</h4>
              <p className="font-mono text-xs break-all">{payout.riderId}</p>
            </div>
          ) : null}
          <div>
            <h4 className="font-semibold mb-1">Reference</h4>
            <p className="font-mono text-xs break-all">{payout.reference || "—"}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Recipient</h4>
            <p>{recipientLine || "—"}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Resolved</h4>
            <p>{payout.resolved ? "Yes" : "No"}</p>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-semibold mb-1">Transaction ID</h4>
            <p className="font-mono text-xs break-all">{payout.transactionId || "—"}</p>
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

        {details &&
        (details.bankName?.trim() || details.accountNumber?.trim()) ? (
          <>
            <Separator />
            <div className="space-y-3 text-sm">
              <h4 className="font-semibold">Bank details</h4>
              <dl className="grid gap-3">
                {details.bankName?.trim() ? (
                  <div className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-1 sm:gap-3">
                    <dt className="text-muted-foreground">Bank</dt>
                    <dd>{details.bankName.trim()}</dd>
                  </div>
                ) : null}
                {details.accountNumber?.trim() ? (
                  <div className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-1 sm:gap-3">
                    <dt className="text-muted-foreground">Account number</dt>
                    <dd className="font-mono">
                      {maskAccount(details.accountNumber.trim())}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </>
        ) : null}

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
            <div className="text-sm space-y-1">
              <h4 className="font-semibold mb-2">Attended by</h4>
              <p>
                {payout.attendedBy.firstName} {payout.attendedBy.lastName}
              </p>
              <p className="text-muted-foreground">{payout.attendedBy.email}</p>
              {payout.attendedBy.id ? (
                <p className="font-mono text-xs text-muted-foreground break-all">
                  Staff ID: {payout.attendedBy.id}
                </p>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
