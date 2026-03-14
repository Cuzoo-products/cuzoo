import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router";
import { useGetOrder } from "@/api/vendor/order/useOrder";

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

export default function InvoicePage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetOrder(id as string) as {
    data?: OrderDetailsResponse;
    isLoading: boolean;
    error: unknown;
  };
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  if (!id) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Order</h3>
          <p className="text-red-500 text-sm">No order ID provided.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Order</h3>
          <p className="text-sm text-muted-foreground">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Order</h3>
          <p className="text-sm text-red-500">Unable to load order details.</p>
        </div>
      </div>
    );
  }

  const order = data.data;
  const products = order.products ?? [];

  const handleDownloadPdf = () => {
    setDownloading(true);
    const onAfterPrint = () => {
      setDownloading(false);
      window.removeEventListener("afterprint", onAfterPrint);
    };
    window.addEventListener("afterprint", onAfterPrint);
    window.print();
  };

  const subtotal = products.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );
  const serviceCharge = order.amount.serviceCharge;
  const total = order.amount.totalAmount || subtotal + serviceCharge;

  const statusColor: Record<
    string,
    "default" | "destructive" | "secondary" | "outline"
  > = {
    completed: "default",
    queued: "secondary",
    cancelled: "destructive",
  };

  return (
    <div className="@container/main">
      <div className="my-6 no-print">
        <h3 className="!font-bold text-3xl">Order</h3>
        <p>View and manage user order</p>
      </div>
      <div
        ref={invoiceRef}
        className="invoice-print-area bg-secondary max-w-3xl mx-auto mb-10 p-6 rounded-lg"
      >
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h3>Order #{id}</h3>
              <div className="text-sm text-muted-foreground">
                Created: {formatDate(order.pickedUpAt || order.completedAt)}
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-1">
              <Badge variant={statusColor[order.status] ?? "outline"}>
                {order.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Payment: {order.paymentMethod.method}{" "}
                {order.paid ? "(Paid)" : "(Unpaid)"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6 mt-4">
          {/* From / To Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-1">From (Vendor)</h3>
              <p>{order.vendor?.businessName ?? "—"}</p>
              <p>{order.vendor?.email ?? "—"}</p>
              <p>{order.vendor?.phoneNumber?.internationalFormat ?? "—"}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">To (Customer)</h3>
              <p>
                {order.userDetails?.fullName ??
                  order.pickup?.customerName ??
                  "—"}
              </p>
              <p>{order.userDetails?.email ?? order.pickup?.email ?? "—"}</p>
              <p>
                {typeof order.userDetails?.phoneNumber === "object"
                  ? (order.userDetails.phoneNumber?.internationalFormat ??
                    order.userDetails.phoneNumber?.number)
                  : (order.pickup?.phoneNumber ?? "—")}
              </p>
            </div>
          </div>

          <Separator />

          {/* Items Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>₦{item.price.toLocaleString("en-NG")}</TableCell>
                    <TableCell className="text-right">
                      ₦{(item.quantity * item.price).toLocaleString("en-NG")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Separator />

          {/* Totals */}
          <div className="flex flex-col items-end space-y-1 text-sm">
            <div className="flex gap-4 w-full md:w-auto justify-between md:justify-start">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>₦{subtotal.toLocaleString("en-NG")}</span>
            </div>
            <div className="flex gap-4 w-full md:w-auto justify-between md:justify-start">
              <span className="text-muted-foreground">Service Charge:</span>
              <span>
                ₦
                {serviceCharge.toLocaleString("en-NG", {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex gap-4 w-full md:w-auto justify-between md:justify-start font-semibold text-base mt-2">
              <span>Total:</span>
              <span>
                ₦
                {total.toLocaleString("en-NG", {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-4 no-print">
            <Button
              variant="default"
              onClick={handleDownloadPdf}
              disabled={downloading}
            >
              {downloading ? "Printing…" : "Print Invoice"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
