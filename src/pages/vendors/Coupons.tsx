import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ticket, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const couponFormSchema = z.object({
  code: z.string().min(1, "Code is required").max(24),
  discountType: z.enum(["percentage", "fixed"]),
  value: z.coerce.number().min(0.01, "Value must be greater than 0"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  maxUses: z.coerce.number().min(0).optional(),
  description: z.string().max(200).optional(),
});

type CouponFormValues = z.infer<typeof couponFormSchema>;

type Coupon = {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  value: number;
  expiryDate: string;
  maxUses: number | null;
  usedCount: number;
  description: string;
  status: "active" | "expired" | "used_up";
  createdAt: string;
};

// Dummy existing coupons
const DUMMY_COUPONS: Coupon[] = [
  {
    id: "1",
    code: "WELCOME10",
    discountType: "percentage",
    value: 10,
    expiryDate: "2025-06-30",
    maxUses: 100,
    usedCount: 23,
    description: "Welcome discount",
    status: "active",
    createdAt: "2025-01-15",
  },
  {
    id: "2",
    code: "FLAT500",
    discountType: "fixed",
    value: 500,
    expiryDate: "2025-04-20",
    maxUses: 50,
    usedCount: 50,
    description: "₦500 off",
    status: "used_up",
    createdAt: "2025-02-01",
  },
  {
    id: "3",
    code: "SUMMER25",
    discountType: "percentage",
    value: 25,
    expiryDate: "2024-12-31",
    maxUses: 200,
    usedCount: 80,
    description: "Summer sale",
    status: "expired",
    createdAt: "2024-11-01",
  },
];

function randomCode(length = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function Coupons() {
  const [coupons, setCoupons] = useState<Coupon[]>(DUMMY_COUPONS);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: "",
      discountType: "percentage",
      value: 10,
      expiryDate: "",
      maxUses: undefined,
      description: "",
    },
  });

  const generateCode = () => {
    form.setValue("code", randomCode(10));
  };

  const onSubmit = (data: CouponFormValues) => {
    const newCoupon: Coupon = {
      id: crypto.randomUUID?.() ?? `cp-${Date.now()}`,
      code: data.code.toUpperCase(),
      discountType: data.discountType,
      value: data.value,
      expiryDate: data.expiryDate,
      maxUses: data.maxUses ?? null,
      usedCount: 0,
      description: data.description ?? "",
      status: "active",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    toast.success(`Coupon "${newCoupon.code}" created`);
    form.reset({
      code: "",
      discountType: "percentage",
      value: 10,
      expiryDate: "",
      maxUses: undefined,
      description: "",
    });
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatValue = (c: Coupon) =>
    c.discountType === "percentage" ? `${c.value}%` : `₦${c.value.toLocaleString("en-NG")}`;

  const statusVariant = (
    status: Coupon["status"],
  ): "default" | "secondary" | "destructive" | "outline" => {
    if (status === "active") return "default";
    if (status === "expired") return "destructive";
    return "secondary";
  };

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Coupons</h3>
        <p className="text-muted-foreground">Create and manage discount codes</p>
      </div>

      {/* Generate form */}
      <div className="bg-secondary max-w-2xl rounded-xl p-6 mb-8">
        <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Ticket className="size-5" />
          Generate coupon
        </h4>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="e.g. SAVE20"
                        className="uppercase"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <Button type="button" variant="outline" onClick={generateCode}>
                      Random
                    </Button>
                  </div>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="discountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed amount</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {form.watch("discountType") === "percentage" ? "Percentage (%)" : "Amount (₦)"}
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step={0.01} {...field} />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxUses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max uses (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="Unlimited"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value === "" ? undefined : e.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. New customer offer" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating…" : "Generate coupon"}
            </Button>
          </form>
        </Form>
      </div>

      {/* Coupons list */}
      <div className="rounded-xl border border-line-1 overflow-hidden">
        <div className="p-4 border-b border-line-1 bg-muted/30">
          <h4 className="font-semibold">Your coupons</h4>
          <p className="text-sm text-muted-foreground">
            {coupons.length} coupon{coupons.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Uses</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]">Copy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono font-medium">{c.code}</TableCell>
                  <TableCell className="capitalize">{c.discountType}</TableCell>
                  <TableCell>{formatValue(c)}</TableCell>
                  <TableCell>{c.expiryDate}</TableCell>
                  <TableCell>
                    {c.maxUses != null
                      ? `${c.usedCount} / ${c.maxUses}`
                      : `${c.usedCount} used`}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(c.status)}>{c.status.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => copyCode(c.code, c.id)}
                    >
                      {copiedId === c.id ? (
                        <Check className="size-4 text-green-600" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
