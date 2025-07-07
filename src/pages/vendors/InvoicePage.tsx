import { useState } from "react";
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

const initialInvoice = {
  id: "INV-2025-001",
  date: "2025-07-05",
  dueDate: "2025-07-15",
  status: "Pending", // Can be "Paid", "Pending", "Overdue"
  from: {
    name: "Your Company Inc.",
    address: "123 Business St, Lagos, Nigeria",
    email: "info@yourcompany.com",
  },
  to: {
    name: "Client Name",
    address: "456 Client Ave, Abuja, Nigeria",
    email: "client@email.com",
  },
  items: [
    { description: "Website Design", quantity: 1, unitPrice: 250_000 },
    { description: "Hosting (1 year)", quantity: 1, unitPrice: 50_000 },
    { description: "Domain (.com)", quantity: 1, unitPrice: 8_500 },
  ],
  taxRate: 7.5, // 7.5% VAT
};

export default function InvoicePage() {
  const [invoice, setInvoice] = useState(initialInvoice);

  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const tax = (invoice.taxRate / 100) * subtotal;
  const total = subtotal + tax;

  const statusColor: Record<
    string,
    "default" | "destructive" | "secondary" | "outline"
  > = {
    Paid: "default",
    Pending: "secondary",
    Overdue: "destructive",
  };

  const handleStatusUpdate = () => {
    // Simulate API update or state change
    setInvoice((prev) => ({
      ...prev,
      status: "Paid",
    }));
  };

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Order</h3>
        <p>view and manager user order</p>
      </div>
      <div className="bg-secondary max-w-3xl mx-auto mb-10 p-6 rounded-lg">
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h3>Invoice #{invoice.id}</h3>
              <div className="text-sm text-muted-foreground">
                Date: {invoice.date} | Due: {invoice.dueDate}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={statusColor[invoice.status]}>
                {invoice.status}
              </Badge>
              {invoice.status !== "Paid" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStatusUpdate}
                >
                  Mark as Ongoing
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* From / To Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-1">From</h3>
              <p>{invoice.from.name}</p>
              <p>{invoice.from.address}</p>
              <p>{invoice.from.email}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">To</h3>
              <p>{invoice.to.name}</p>
              <p>{invoice.to.address}</p>
              <p>{invoice.to.email}</p>
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
                {invoice.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>₦{item.unitPrice.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      ₦{(item.quantity * item.unitPrice).toLocaleString()}
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
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex gap-4 w-full md:w-auto justify-between md:justify-start">
              <span className="text-muted-foreground">
                VAT ({invoice.taxRate}%):
              </span>
              <span>
                ₦{tax.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex gap-4 w-full md:w-auto justify-between md:justify-start font-semibold text-base mt-2">
              <span>Total:</span>
              <span>
                ₦{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-4">
            <Button variant="default">Download PDF</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
