import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/utilities/Loader";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { DetailShell, GridItem, Section } from "@/components/admin/DetailShell";
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
import { sanitizePayoutRouteId } from "@/lib/payoutId";
import { displayRecipientLine } from "@/lib/payoutDetailsHelpers";

const normalizeType = (value?: string) =>
  value === "riders" || value === "vendors" || value === "fleets"
    ? value
    : null;

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

  const status = String(payout.status ?? "").toLowerCase();
  const isSuccess = status === "success";
  const canResolve = payout.resolved === false && !isSuccess;
  const details = payout.details;
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
    <DetailShell
      backHref={`/admins/payouts/${payoutType}`}
      backLabel="Payouts"
      crumbs={[
        { label: "Dashboard", href: "/admins/dashboard" },
        { label: "Payouts", href: `/admins/payouts/${payoutType}` },
        { label: "Details" },
      ]}
    >
      <PageHeader
        title="Payout details"
        subtitle="Admin review"
        actions={
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={payout.status ?? "pending"} />
            {payout.resolved ? <StatusBadge status="completed" /> : null}
          </div>
        }
      />

      <div className="mx-auto max-w-3xl space-y-4">
        <Section title="Payout information">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <GridItem
              label="Amount"
              value={`₦${Number(payout.amount ?? 0).toLocaleString("en-NG", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
            />
            <GridItem label="Type" value={payout.type || "—"} />
            <GridItem label="Owner ID" value={payout.ownerId || "—"} />
            {payout.vendorId ? (
              <GridItem label="Vendor ID" value={payout.vendorId} />
            ) : null}
            {payout.companyId ? (
              <GridItem label="Company ID" value={payout.companyId} />
            ) : null}
            {payout.riderId ? (
              <GridItem label="Rider ID" value={payout.riderId} />
            ) : null}
            <GridItem label="Recipient" value={recipientLine || "—"} />
            {!isSuccess ? (
              <GridItem label="Resolved" value={payout.resolved ? "Yes" : "No"} />
            ) : null}
            <GridItem label="Created at" value={formatDate(payout.createdAt)} />
            <GridItem label="Updated at" value={formatDate(payout.updatedAt)} />
          </div>
        </Section>

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
    </DetailShell>
  );
}
