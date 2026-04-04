import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loader from "@/components/utilities/Loader";
import { useGetOrderForAdmin } from "@/api/admin/orders/useOrders";

/** Aligns with GET /admins/orders/:id — optional fields from API. */
type OrderDetailsResponse = {
  success?: boolean;
  statusCode?: number;
  data?: {
    id: string;
    pickup?: {
      customerName?: string;
      email?: string;
      phoneNumber?: string;
      pickupAddress?: {
        formatted_address?: string;
        description?: string;
        country?: string;
        state?: string;
      };
    };
    pickUpTime?: { pickUpType?: string };
    userDetails?: {
      userId?: string;
      fullName?: string;
      email?: string;
      phoneNumber?: {
        internationalFormat?: string;
        number?: string;
      };
    };
    paymentMethod?: { method?: string } | string;
    paid?: boolean;
    paidAt?: string;
    status?: string;
    pickedUp?: boolean;
    pickedUpAt?: string;
    completed?: boolean;
    completedAt?: string;
    cancelled?: boolean;
    cancelledAt?: string;
    cancelledBy?: {
      firstName?: string;
      lastName?: string;
    };
    deliveryType?: string;
    orderType?: string;
    vendor?: {
      businessName?: string;
      email?: string;
      phoneNumber?: {
        internationalFormat?: string;
        number?: string;
      };
    };
    products?: Array<{
      id?: string;
      name?: string;
      quantity?: number;
      price?: number;
    }>;
    packagedAt?: string;
    amount?: {
      serviceCharge?: number;
      totalAmount?: number;
    };
    createdAt?: string;
  };
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

export default function AdminOrderDetails() {
  const { id: routeId } = useParams<{ id: string }>();
  const id =
    routeId && routeId !== "undefined" && routeId !== "null"
      ? routeId
      : undefined;

  const { data: payload, isLoading, error } = useGetOrderForAdmin(id);

  if (!id) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Order Details</h3>
          <p className="text-sm text-red-500">No order ID provided.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  const order = (payload as OrderDetailsResponse | undefined)?.data;

  if (error || !order) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Order Details</h3>
          <p className="text-sm text-red-500">Unable to load order details.</p>
        </div>
      </div>
    );
  }
  const products = order.products ?? [];

  const statusColor: Record<
    string,
    "default" | "destructive" | "secondary" | "outline"
  > = {
    completed: "default",
    success: "default",
    queued: "secondary",
    cancelled: "destructive",
  };

  const paymentLabel =
    typeof order.paymentMethod === "object" && order.paymentMethod
      ? order.paymentMethod.method
      : typeof order.paymentMethod === "string"
        ? order.paymentMethod
        : "—";

  return (
    <div className="@container/main">
      <div className="my-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="!font-bold text-3xl">Order Details</h3>
          <p className="text-sm text-muted-foreground">
            Order ID: {id} • Type: {order.orderType ?? "—"} • Delivery:{" "}
            {order.deliveryType ?? "—"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={statusColor[order.status?.toLowerCase() ?? ""] ?? "outline"}>
            {order.status ?? "—"}
          </Badge>
        </div>
      </div>

      <div className="bg-secondary mx-auto mb-10 max-w-4xl space-y-6 rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
          <div>
            <h4 className="mb-1 font-semibold">Status</h4>
            <p>
              {order.completed
                ? "Completed"
                : order.cancelled
                  ? "Cancelled"
                  : (order.status ?? "—")}
            </p>
            <p className="text-xs text-muted-foreground">
              Created: {formatDate(order.createdAt)}
            </p>
          </div>
          <div>
            <h4 className="mb-1 font-semibold">Payment</h4>
            <p>
              {paymentLabel} • {order.paid ? "Paid" : "Unpaid"}
            </p>
            {order.paidAt && (
              <p className="text-xs text-muted-foreground">
                Paid at: {formatDate(order.paidAt)}
              </p>
            )}
          </div>
          <div>
            <h4 className="mb-1 font-semibold">Amount</h4>
            <p>
              Total: ₦
              {(order.amount?.totalAmount ?? 0).toLocaleString("en-NG", {
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-muted-foreground">
              Service charge: ₦
              {(order.amount?.serviceCharge ?? 0).toLocaleString("en-NG", {
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2 text-sm">
          <h4 className="mb-1 font-semibold">Order Items</h4>
          {products.length === 0 ? (
            <p className="text-xs text-muted-foreground">
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
                    <TableRow key={item.id ?? item.name}>
                      <TableCell>{item.name ?? "—"}</TableCell>
                      <TableCell>{item.quantity ?? "—"}</TableCell>
                      <TableCell>
                        ₦{(item.price ?? 0).toLocaleString("en-NG")}
                      </TableCell>
                      <TableCell className="text-right">
                        ₦
                        {((item.quantity ?? 0) * (item.price ?? 0)).toLocaleString(
                          "en-NG",
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div>
            <h4 className="mb-1 font-semibold">Customer</h4>
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
            <h4 className="mb-1 font-semibold">Vendor</h4>
            <p>{order.vendor?.businessName ?? "—"}</p>
            <p>{order.vendor?.email ?? "—"}</p>
            <p>
              {order.vendor?.phoneNumber?.internationalFormat ??
                order.vendor?.phoneNumber?.number ??
                "—"}
            </p>
          </div>
        </div>

        <Separator />

        <div className="text-sm space-y-1">
          <h4 className="mb-1 font-semibold">Pickup Address</h4>
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

        <div className="text-sm">
          <h4 className="mb-1 font-semibold">Timeline</h4>
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

        <div className="flex flex-wrap justify-end gap-3 pt-4">
          <Button variant="outline" asChild>
            <Link to="/admins/orders">Back to orders</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
