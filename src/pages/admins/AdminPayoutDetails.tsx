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

const normalizeType = (value?: string) =>
  value === "riders" || value === "vendors" || value === "fleets" ? value : null;

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
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

export default function AdminPayoutDetails() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const payoutType = useMemo(() => normalizeType(type), [type]);
  const payoutId = id ?? "";
  const navigate = useNavigate();
  const [reason, setReason] = useState("");

  const riderQuery = useRiderPayout(payoutId, payoutType === "riders");
  const vendorQuery = useVendorPayout(payoutId, payoutType === "vendors");
  const fleetQuery = useFleetPayout(payoutId, payoutType === "fleets");

  const payout =
    payoutType === "riders"
      ? riderQuery.data?.data
      : payoutType === "vendors"
        ? vendorQuery.data?.data
        : fleetQuery.data?.data;

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

  if (isLoading) return <Loader />;
  if (hasError || !payout) return <div className="text-red-500">Failed to load payout details.</div>;

  const canResolve = payout.resolved === false;

  const onApprove = () => {
    if (payoutType === "riders") approveRider.mutate(undefined, { onSuccess: () => navigate(`/admins/payouts/${payoutType}`) });
    if (payoutType === "vendors") approveVendor.mutate(undefined, { onSuccess: () => navigate(`/admins/payouts/${payoutType}`) });
    if (payoutType === "fleets") approveFleet.mutate(undefined, { onSuccess: () => navigate(`/admins/payouts/${payoutType}`) });
  };

  const onReject = () => {
    if (!reason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    if (payoutType === "riders") rejectRider.mutate(undefined, { onSuccess: () => navigate(`/admins/payouts/${payoutType}`) });
    if (payoutType === "vendors") rejectVendor.mutate(undefined, { onSuccess: () => navigate(`/admins/payouts/${payoutType}`) });
    if (payoutType === "fleets") rejectFleet.mutate(undefined, { onSuccess: () => navigate(`/admins/payouts/${payoutType}`) });
  };

  return (
    <div className="@container/main">
      <div className="my-6 flex items-center justify-between">
        <h3 className="!font-bold text-3xl">Payout details</h3>
        <Button asChild variant="outline" size="sm">
          <Link to={`/admins/payouts/${payoutType}`}>Back to payouts</Link>
        </Button>
      </div>

      <div className="bg-secondary max-w-3xl mx-auto mb-10 p-6 rounded-lg space-y-6">
        <div className="flex items-center gap-2">
          <Badge variant={statusVariant[payout.status] ?? "outline"}>{payout.status}</Badge>
          {payout.resolved && <Badge variant="default">Resolved</Badge>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><h4 className="font-semibold mb-1">Reference</h4><p>{payout.reference || "—"}</p></div>
          <div><h4 className="font-semibold mb-1">Amount</h4><p>₦{Number(payout.amount ?? 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></div>
          <div><h4 className="font-semibold mb-1">Recipient</h4><p>{payout.recipient || "—"}</p></div>
          <div><h4 className="font-semibold mb-1">Created</h4><p>{formatDate(payout.createdAt)}</p></div>
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
                <Button variant="destructive" onClick={onReject}>Reject payout</Button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
