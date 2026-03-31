import { useMemo, useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCreateCoupon, useGetCoupons } from "@/api/vendor/coupon/useCoupon";
import {
  parseVendorCouponsResponse,
  type VendorCouponRow,
} from "@/api/vendor/coupon/coupon";
import { payoutRecordId } from "@/lib/payoutId";
import Loader from "@/components/utilities/Loader";

const couponFormSchema = z.object({
  code: z.string().min(1, "Code is required").max(24),
  value: z.coerce.number().min(0.01, "Value must be greater than 0"),
  minimumSpend: z.coerce.number().min(0, "Minimum spend must be 0 or greater"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  maxUsage: z.coerce.number().min(0).optional(),
  description: z.string().max(200).optional(),
});

type CouponFormValues = z.infer<typeof couponFormSchema>;

type CreateCouponPayload = {
  code: string;
  value: number;
  minimumSpend: number;
  expiryDate: string;
  maxUsage: number | null;
  description: string;
};

function randomCode(length = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function formatCouponDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function isCouponExpired(expiryDate?: string): boolean {
  if (!expiryDate) return false;
  const t = new Date(expiryDate).getTime();
  return !Number.isNaN(t) && t < Date.now();
}

function usageLabel(c: VendorCouponRow): string {
  const used = c.usage ?? 0;
  const max = c.maxUsage ?? 0;
  if (max <= 0) return `${used} / unlimited`;
  return `${used} / ${max}`;
}

export default function Coupons() {
  const { data: couponsPayload, isLoading, isError } = useGetCoupons();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const coupons = useMemo(
    () => parseVendorCouponsResponse(couponsPayload),
    [couponsPayload],
  );

  const { mutate: createCoupon, isPending } = useCreateCoupon();

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: "",
      value: 10,
      minimumSpend: 0,
      expiryDate: "",
      maxUsage: undefined,
      description: "",
    },
  });

  const generateCode = () => {
    form.setValue("code", randomCode(10));
  };

  const onSubmit = (data: CouponFormValues) => {
    const newCoupon: CreateCouponPayload = {
      code: data.code.toUpperCase(),
      value: data.value,
      minimumSpend: data.minimumSpend,
      expiryDate: data.expiryDate,
      maxUsage: data.maxUsage ?? null,
      description: data.description ?? "",
    };

    console.log(newCoupon);
    createCoupon(newCoupon, {
      onSuccess: () => {
        form.reset({
          code: "",
          value: 10,
          minimumSpend: 0,
          expiryDate: "",
          maxUsage: undefined,
          description: "",
        });
      },
    });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Coupons</h3>
        <p className="text-muted-foreground">
          Create and manage discount codes
        </p>
      </div>

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
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateCode}
                    >
                      Random
                    </Button>
                  </div>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Percentage (%)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step={0.01} {...field} />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="minimumSpend"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum amount (₦)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={1}
                      placeholder="0 = no minimum"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

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
                name="maxUsage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max uses</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="Unlimited"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? undefined : e.target.value,
                          )
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. New customer offer" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating…" : "Generate coupon"}
            </Button>
          </form>
        </Form>
      </div>

      <div className="rounded-xl border border-line-1 overflow-hidden">
        <div className="p-4 border-b border-line-1 bg-muted/30">
          <h4 className="font-semibold">Your coupons</h4>
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? "Loading…"
              : `${coupons.length} coupon${coupons.length !== 1 ? "s" : ""} total`}
          </p>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 flex justify-center">
              <Loader />
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              Failed to load coupons.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Min spend</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Uses</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Copy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground py-10"
                    >
                      No coupons yet. Create one above.
                    </TableCell>
                  </TableRow>
                ) : (
                  coupons.map((c) => {
                    const rowKey = payoutRecordId(c) || c.code;
                    const expired = isCouponExpired(c.expiryDate);
                    return (
                      <TableRow key={rowKey}>
                        <TableCell className="font-mono font-medium">
                          {c.code}
                        </TableCell>
                        <TableCell>{c.value}%</TableCell>
                        <TableCell>
                          {(c.minimumSpend ?? 0) > 0
                            ? `₦${(c.minimumSpend ?? 0).toLocaleString("en-NG")}`
                            : "—"}
                        </TableCell>
                        <TableCell>{formatCouponDate(c.expiryDate)}</TableCell>
                        <TableCell>{usageLabel(c)}</TableCell>
                        <TableCell>
                          <Badge variant={expired ? "secondary" : "default"}>
                            {expired ? "Expired" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => copyCode(c.code)}
                            aria-label="Copy code"
                          >
                            {copiedId === c.code ? (
                              <Check className="size-4 text-green-600" />
                            ) : (
                              <Copy className="size-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
