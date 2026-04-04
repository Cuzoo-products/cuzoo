import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/utilities/Loader";
import {
  useApproveFleetPayout,
  useApproveRiderPayout,
  useApproveVendorPayout,
  useFleetPayout,
  useRejectFleetPayout,
  useRejectRiderPayout,
  useRejectVendorPayout,
  useRiderPayout,
  useVendorPayout,
} from "@/api/admin/payouts/usePayouts";
import { sanitizePayoutRouteId, payoutRecordId } from "@/lib/payoutId";
import { displayRecipientLine } from "@/lib/payoutDetailsHelpers";

const normalizeType = (value?: string) =>
  value === "riders" || value === "vendors" || value === "fleets" ? value : null;

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  completed: "default",
  pending: "secondary",
  processing: "outline",
  failed: "destructive",
  resolved: "default",
  rejected: "destructive",
};

const formatDate = (value?: string) => {
  if (!value) return "—";
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

/** API payout object (admin detail); fields vary slightly by route. */
type AdminPayoutRow = {
  amount?: number;
  createdAt?: string;
  updatedAt?: string;
  details?: {
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
  };
  Id?: string;
  id?: string;
  ownerId?: string;
  recipient?: string;
  reference?: string;
  resolved?: boolean;
  status?: string;
  transactionId?: string;
  type?: string;
  vendorId?: string;
  companyId?: string;
  riderId?: string;
  reason?: string;
  attendedBy?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
};

export default function AdminPayoutDetails() {
  const { type, id: rawId } = useParams<{ type: string; id: string }>();
  const id = sanitizePayoutRouteId(rawId);
  const payoutType = useMemo(() => normalizeType(type), [type]);
  const payoutId = id ?? "";
  const navigate = useNavigate();
  const [reason, setReason] = useState("");

  const canFetch =
    Boolean(payoutId) &&
    (payoutType === "riders" ||
      payoutType === "vendors" ||
      payoutType === "fleets");

  const riderQuery = useRiderPayout(
    payoutId,
    canFetch && payoutType === "riders",
  );
  const vendorQuery = useVendorPayout(
    payoutId,
    canFetch && payoutType === "vendors",
  );
  const fleetQuery = useFleetPayout(
    payoutId,
    canFetch && payoutType === "fleets",
  );

  const payoutRaw =
    payoutType === "riders"
      ? riderQuery.data?.data
      : payoutType === "vendors"
        ? vendorQuery.data?.data
        : fleetQuery.data?.data;

  const payout = payoutRaw as AdminPayoutRow | undefined;

  const isLoading =
    (payoutType === "riders" && riderQuery.isLoading) ||
    (payoutType === "vendors" && vendorQuery.isLoading) ||
    (payoutType === "fleets" && fleetQuery.isLoading);

  const hasError =
    (payoutType === "riders" && riderQuery.error) ||
    (payoutType === "vendors" && vendorQuery.error) ||
    (payoutType === "fleets" && fleetQuery.error);

  const approveRider = useApproveRiderPayout(payoutId);
  const approveVendor = useApproveVendorPayout(payoutId);
  const approveFleet = useApproveFleetPayout(payoutId);

  const rejectRider = useRejectRiderPayout(payoutId, { reason });
  const rejectVendor = useRejectVendorPayout(payoutId, { reason });
  const rejectFleet = useRejectFleetPayout(payoutId, { reason });

  if (!payoutType) {
    return <div className="text-red-500">Invalid payout type.</div>;
  }

  if (!id) {
    return <div className="text-red-500">Invalid payout ID.</div>;
  }

  if (isLoading) return <Loader />;
  if (hasError || !payout) {
    return <div className="text-red-500">Failed to load payout details.</div>;
  }

  const canResolve = payout.resolved === false;
  const details = payout.details;
  const payoutIdDisplay = payoutRecordId(payout);
  const recipientLine = displayRecipientLine(
    payout.recipient,
    details?.accountName,
  );

  const onApprove = () => {
    if (payoutType === "riders")
      approveRider.mutate(undefined, {
        onSuccess: () => navigate(`/admins/payouts/${payoutType}`),
      });
    if (payoutType === "vendors")
      approveVendor.mutate(undefined, {
        onSuccess: () => navigate(`/admins/payouts/${payoutType}`),
      });
    if (payoutType === "fleets")
      approveFleet.mutate(undefined, {
        onSuccess: () => navigate(`/admins/payouts/${payoutType}`),
      });
  };

  const onReject = () => {
    if (!reason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    if (payoutType === "riders")
      rejectRider.mutate(undefined, {
        onSuccess: () => navigate(`/admins/payouts/${payoutType}`),
      });
    if (payoutType === "vendors")
      rejectVendor.mutate(undefined, {
        onSuccess: () => navigate(`/admins/payouts/${payoutType}`),
      });
    if (payoutType === "fleets")
      rejectFleet.mutate(undefined, {
        onSuccess: () => navigate(`/admins/payouts/${payoutType}`),
      });
  };

  const hasBankInfo =
    details &&
    (details.bankName?.trim() ||
      details.accountNumber?.trim() ||
      details.accountName?.trim());

  return (
    <div className="@container/main">
      <div className="my-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="!font-bold text-3xl">Payout details</h3>
          <p className="text-sm text-muted-foreground">
            {payout.reference
              ? `Reference · ${payout.reference}`
              : "Admin review"}
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to={`/admins/payouts/${payoutType}`}>Back to payouts</Link>
        </Button>
      </div>

      <div className="bg-secondary max-w-3xl mx-auto mb-10 p-6 rounded-lg space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={statusVariant[payout.status ?? ""] ?? "outline"}>
            {payout.status ?? "—"}
          </Badge>
          {payout.resolved ? <Badge variant="default">Resolved</Badge> : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-1">Amount</h4>
            <p>
              ₦
              {Number(payout.amount ?? 0).toLocaleString("en-NG", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Type</h4>
            <p className="capitalize">{payout.type || "—"}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Payout ID</h4>
            <p className="font-mono text-xs break-all">
              {payoutIdDisplay || "—"}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Reference</h4>
            <p className="font-mono text-xs break-all">
              {payout.reference || "—"}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Owner ID</h4>
            <p className="font-mono text-xs break-all">
              {payout.ownerId || "—"}
            </p>
          </div>
          {payout.vendorId ? (
            <div>
              <h4 className="font-semibold mb-1">Vendor ID</h4>
              <p className="font-mono text-xs break-all">{payout.vendorId}</p>
            </div>
          ) : null}
          {payout.companyId ? (
            <div>
              <h4 className="font-semibold mb-1">Company ID</h4>
              <p className="font-mono text-xs break-all">{payout.companyId}</p>
            </div>
          ) : null}
          {payout.riderId ? (
            <div>
              <h4 className="font-semibold mb-1">Rider ID</h4>
              <p className="font-mono text-xs break-all">{payout.riderId}</p>
            </div>
          ) : null}
          <div>
            <h4 className="font-semibold mb-1">Recipient</h4>
            <p className="font-mono text-xs break-all">
              {recipientLine || "—"}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Resolved</h4>
            <p>{payout.resolved ? "Yes" : "No"}</p>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-semibold mb-1">Transaction ID</h4>
            <p className="font-mono text-xs break-all">
              {payout.transactionId || "—"}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Created at</h4>
            <p>{formatDate(payout.createdAt)}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Updated at</h4>
            <p>{formatDate(payout.updatedAt)}</p>
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

        {hasBankInfo ? (
          <>
            <Separator />
            <div className="space-y-3 text-sm">
              <h4 className="font-semibold">Bank details</h4>
              <dl className="grid gap-3">
                {details?.bankName?.trim() ? (
                  <div className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-1 sm:gap-3">
                    <dt className="text-muted-foreground">Bank</dt>
                    <dd>{details.bankName.trim()}</dd>
                  </div>
                ) : null}
                {details?.accountNumber?.trim() ? (
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

        {payout.attendedBy ? (
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
        ) : null}

        {canResolve ? (
          <>
            <Separator />
            <div className="space-y-3">
              <Input
                placeholder="Reason (required for rejection)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <div className="flex gap-2 justify-end">
                <Button onClick={onApprove}>Accept payout</Button>
                <Button variant="destructive" onClick={onReject}>
                  Reject payout
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
