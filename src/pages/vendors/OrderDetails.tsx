import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, Link } from "react-router";
import {
  useConfirmPickup,
  useGetOrder,
  useProcessOrder,
} from "@/api/vendor/order/useOrder";

type OrderDetailsResponse = {
  success: boolean;
  statusCode: number;
  data: {
    pickup: {
      customerName: string;
      phoneNumber: string;
      email: string;
      pickupAddress: {
        formatted_address: string;
        description: string;
        landMark: string;
        country: string;
        state: string;
      };
    };
    pickUpTime: {
      pickUpType: string;
    };
    paymentMethod: {
      method: string;
    };
    paid: boolean;
    paidAt: string;
    status: string;
    pickedUp: boolean;
    country: string;
    pickedUpAt: string;
    completed: boolean;
    completedAt: string;
    otp: string;
    otpLength: number;
    userDetails?: {
      userId: string;
      email: string;
      phoneNumber: {
        countryCode: string;
        nationalFormat: string;
        number: string;
        internationalFormat: string;
        countryCallingCode: string;
      };
      fullName: string;
    };
    cardDetails: {
      authorizationCode: string;
      brand: string;
      last4Digit: string;
      expMonth: string;
      expYear: string;
      bank: string;
      countryCode: string;
      accountName: string;
    };
    chats: { message: string }[];
    cancelled: boolean;
    cancelledAt: string;
    cancelledBy: {
      role: string;
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    deliveryType: string;
    percentages: {
      cuzooVendorPercentage: number;
    };
    amount: {
      serviceCharge: number;
      totalAmount: number;
      vendorTotalAmount: number;
      cuzooVendorCommission: number;
    };
    orderType: string;
    vendor: {
      vendorId: string;
      businessName: string;
      phoneNumber: {
        countryCode: string;
        nationalFormat: string;
        number: string;
        internationalFormat: string;
        countryCallingCode: string;
      };
      email: string;
    };
    products: {
      amount: number;
      quantity: number;
      vendorId: string;
      name: string;
      price: number;
      discount: number;
      image1: {
        path: string;
        url: string;
        type: string;
      };
      id: string;
    }[];
    packagedAt: string;
  };
};

const formatDate = (value?: string) => {
  if (!value) return "-";
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

function OrderActions({
  status,
  otpLength = 6,
  processOrder,
  confirmPickup,
}: {
  status?: string;
  otpLength?: number;
  processOrder: { run: () => void; isPending: boolean };
  confirmPickup: {
    run: (payload: { otp: string }) => void;
    isPending: boolean;
  };
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const isPackaged = status?.toLowerCase() === "packaged";
  const isPickupConfirmed = status?.toLowerCase() === "success";

  if (isPickupConfirmed) return null;

  const handleConfirmSubmit = () => {
    const trimmed = otp.trim();
    if (!trimmed) return;
    confirmPickup.run({ otp: trimmed });
    setOtp("");
    setConfirmOpen(false);
  };

  return (
    <>
      {!isPackaged && (
        <Button
          variant="secondary"
          onClick={() => processOrder.run()}
          disabled={processOrder.isPending}
        >
          {processOrder.isPending ? "Processing…" : "Process order"}
        </Button>
      )}
      <Button
        variant="default"
        onClick={() => setConfirmOpen(true)}
        disabled={confirmPickup.isPending}
      >
        {confirmPickup.isPending ? "Confirming…" : "Confirm pick up"}
      </Button>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm pick up</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            <Label htmlFor="confirm-otp">OTP code</Label>
            <Input
              id="confirm-otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              maxLength={otpLength}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              disabled={!otp.trim() || confirmPickup.isPending}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetOrder(id as string) as {
    data?: OrderDetailsResponse;
    isLoading: boolean;
    error: unknown;
  };

  const { mutate: processOrder, isPending: processOrderPending } =
    useProcessOrder(id as string);
  const { mutate: confirmPickup, isPending: confirmPickupPending } =
    useConfirmPickup(id as string);

  if (!id) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Order Details</h3>
          <p className="text-red-500 text-sm">No order ID provided.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Order Details</h3>
          <p className="text-sm text-muted-foreground">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Order Details</h3>
          <p className="text-sm text-red-500">Unable to load order details.</p>
        </div>
      </div>
    );
  }

  const order = data.data;

  const statusColor: Record<
    string,
    "default" | "destructive" | "secondary" | "outline"
  > = {
    completed: "default",
    queued: "secondary",
    cancelled: "destructive",
  };

  const chats = order.chats ?? [];
  const products = order.products ?? [];

  return (
    <div className="@container/main">
      <div className="my-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="!font-bold text-3xl">Order Details</h3>
          <p className="text-sm text-muted-foreground">
            Order ID: {id} • Type: {order.orderType} • Delivery:{" "}
            {order.deliveryType}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={statusColor[order.status] ?? "outline"}>
            {order.status}
          </Badge>
          <Button asChild variant="outline" size="sm">
            <Link to={`/vendor/orders/${id}/invoice`}>View Invoice</Link>
          </Button>
        </div>
      </div>

      <div className="bg-secondary max-w-4xl mx-auto mb-10 p-6 rounded-lg space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-1">Status</h4>
            <p>
              {order.completed
                ? "Completed"
                : order.cancelled
                  ? "Cancelled"
                  : order.status}
            </p>
            <p className="text-xs text-muted-foreground">
              Created: {formatDate(order.pickedUpAt || order.completedAt)}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Payment</h4>
            <p>
              {order.paymentMethod.method} • {order.paid ? "Paid" : "Unpaid"}
            </p>
            {order.paidAt && (
              <p className="text-xs text-muted-foreground">
                Paid at: {formatDate(order.paidAt)}
              </p>
            )}
          </div>
          <div>
            <h4 className="font-semibold mb-1">Amount</h4>
            <p>
              Total: ₦
              {order.amount.totalAmount.toLocaleString("en-NG", {
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-muted-foreground">
              Service charge: ₦
              {order.amount.serviceCharge.toLocaleString("en-NG", {
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        <Separator />

        {/* Order Items */}
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold mb-1">Order Items</h4>
          {products.length === 0 ? (
            <p className="text-muted-foreground text-xs">
              No items in this order.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-md border border-line-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead className="text-right">Line Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        ₦{item.price.toLocaleString("en-NG")}
                      </TableCell>
                      <TableCell className="text-right">
                        ₦{(item.quantity * item.price).toLocaleString("en-NG")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <Separator />

        {/* Customer & Vendor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-1">Customer</h4>
            <p>
              {order.userDetails?.fullName ?? order.pickup?.customerName ?? "—"}
            </p>
            <p>{order.userDetails?.email ?? order.pickup?.email ?? "—"}</p>
            <p>
              {typeof order.userDetails?.phoneNumber === "object"
                ? (order.userDetails.phoneNumber?.internationalFormat ??
                  order.userDetails.phoneNumber?.number)
                : (order.pickup?.phoneNumber ?? "—")}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Vendor</h4>
            <p>{order.vendor?.businessName ?? "—"}</p>
            <p>{order.vendor?.email ?? "—"}</p>
            <p>{order.vendor?.phoneNumber?.internationalFormat ?? "—"}</p>
          </div>
        </div>

        <Separator />

        {/* Pickup Address */}
        <div className="text-sm space-y-1">
          <h4 className="font-semibold mb-1">Pickup Address</h4>
          <p>
            {(order.pickup?.pickupAddress?.formatted_address ||
              order.pickup?.pickupAddress?.description) ??
              "—"}
          </p>
          <p className="text-xs text-muted-foreground">
            {order.pickup?.pickupAddress?.state},{" "}
            {order.pickup?.pickupAddress?.country}
          </p>
        </div>

        <Separator />

        {/* Timeline & Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-1">Timeline</h4>
            <p>
              <span className="text-muted-foreground">Packaged at: </span>
              {formatDate(order.packagedAt)}
            </p>
            <p>
              <span className="text-muted-foreground">Completed at: </span>
              {formatDate(order.completedAt)}
            </p>
            {order.cancelled && (
              <p className="text-red-500">
                Cancelled at {formatDate(order.cancelledAt)}
                {order.cancelledBy
                  ? ` by ${order.cancelledBy.firstName} ${order.cancelledBy.lastName}`
                  : ""}
              </p>
            )}
          </div>

          {order.cardDetails && (
            <div>
              <h4 className="font-semibold mb-1">Card Details</h4>
              <p>
                {order.cardDetails.brand} • **** {order.cardDetails.last4Digit}
              </p>
              <p className="text-xs text-muted-foreground">
                {order.cardDetails.bank} • Exp {order.cardDetails.expMonth}/
                {order.cardDetails.expYear}
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Notes / Chats */}
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold mb-1">Order Notes</h4>
          {chats.length === 0 ? (
            <p className="text-muted-foreground text-xs">
              No messages for this order yet.
            </p>
          ) : (
            chats.map((chat, index) => (
              <div
                key={index}
                className="border border-line-1 rounded-md p-2 bg-muted/40"
              >
                {chat.message}
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-end gap-3 pt-4">
          {order.status?.toLowerCase() === "success" && (
            <Button variant="outline" asChild>
              <Link to={`/vendor/orders/${id}/invoice`}>View Invoice</Link>
            </Button>
          )}
          <OrderActions
            status={order.status}
            otpLength={order.otpLength}
            processOrder={{
              run: () => processOrder(),
              isPending: processOrderPending,
            }}
            confirmPickup={{
              run: confirmPickup,
              isPending: confirmPickupPending,
            }}
          />
        </div>
      </div>
    </div>
  );
}
