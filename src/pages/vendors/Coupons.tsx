import PageHeader from "@/components/admin/PageHeader";
import BackendCursorPagination from "@/components/admin/BackendCursorPagination";
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
  parseVendorCouponsListMeta,
  parseVendorCouponsResponse,
  type FirestoreTimestampLike,
  type GetVendorCouponsParams,
  type VendorCouponRow,
} from "@/api/vendor/coupon/coupon";
import { payoutRecordId } from "@/lib/payoutId";
import Loader from "@/components/utilities/Loader";

const DEFAULT_LIMIT = 20;

const couponFormSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .max(24, "Code must be at most 24 characters"),
  value: z.coerce
    .number({ invalid_type_error: "Percentage is required" })
    .min(0.01, "Value must be greater than 0")
    .max(100, "Percentage cannot exceed 100"),
  minimumSpend: z.coerce
    .number({ invalid_type_error: "Minimum amount is required" })
    .min(0, "Minimum spend must be 0 or greater"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  maxUsage: z.coerce
    .number({ invalid_type_error: "Max uses is required" })
    .int("Max uses must be a whole number")
    .min(0, "Max uses must be 0 or greater"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(200, "Description must be at most 200 characters"),
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

function couponDateToMillis(value: unknown): number | null {
  if (value == null || value === "") return null;
  if (typeof value === "number") {
    const t = new Date(value).getTime();
    return Number.isNaN(t) ? null : t;
  }
  if (typeof value === "string") {
    const t = new Date(value).getTime();
    return Number.isNaN(t) ? null : t;
  }
  if (typeof value === "object" && value !== null) {
    const o = value as FirestoreTimestampLike;
    const sec = o._seconds ?? o.seconds;
    if (typeof sec === "number") return sec * 1000;
  }
  return null;
}

/** Renders API expiry values: ISO strings, Firestore timestamps, or numeric epoch. */
function formatCouponDate(value: unknown): string {
  const ms = couponDateToMillis(value);
  if (ms == null) {
    if (typeof value === "string" && value.trim() !== "") return value.trim();
    return "—";
  }
  return new Date(ms).toLocaleString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function isCouponExpired(expiryDate: unknown): boolean {
  const ms = couponDateToMillis(expiryDate);
  if (ms == null) return false;
  return ms < Date.now();
}

function usageLabel(c: VendorCouponRow): string {
  const used = c.usage ?? 0;
  const max = c.maxUsage ?? 0;
  if (max <= 0) return `${used} / unlimited`;
  return `${used} / ${max}`;
}

export default function Coupons() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [cursorStack, setCursorStack] = useState<
    (number | string | undefined)[]
  >([undefined]);

  const currentCursor = cursorStack[cursorStack.length - 1];

  const queryParams = useMemo<GetVendorCouponsParams>(() => {
    const params: GetVendorCouponsParams = { limit };
    if (currentCursor != null && currentCursor !== "") {
      params.cursor = currentCursor;
    }
    return params;
  }, [currentCursor, limit]);

  const {
    data: couponsPayload,
    isLoading,
    isFetching,
    isError,
  } = useGetCoupons(queryParams);

  const coupons = useMemo(
    () => parseVendorCouponsResponse(couponsPayload),
    [couponsPayload],
  );
  const meta = useMemo(
    () => parseVendorCouponsListMeta(couponsPayload),
    [couponsPayload],
  );

  const pageIndex = cursorStack.length - 1;
  const hasPrevious = pageIndex > 0;
  const hasNext =
    meta?.lastCursor != null &&
    meta.lastCursor !== "" &&
    coupons.length >= limit;

  const resetPagination = () => {
    setCursorStack([undefined]);
  };

  const handleLimitChange = (nextLimit: number) => {
    setLimit(nextLimit);
    resetPagination();
  };

  const handlePrevious = () => {
    if (!hasPrevious) return;
    setCursorStack((prev) => prev.slice(0, -1));
  };

  const handleNext = () => {
    if (!hasNext || meta?.lastCursor == null) return;
    setCursorStack((prev) => [...prev, meta.lastCursor as number | string]);
  };

  const { mutate: createCoupon, isPending } = useCreateCoupon();

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: "",
      value: 10,
      minimumSpend: 0,
      expiryDate: "",
      maxUsage: 50,
      description: "",
    },
  });

  const generateCode = () => {
    form.setValue("code", randomCode(10));
  };

  const onSubmit = (data: CouponFormValues) => {
    const parsed = new Date(data.expiryDate);
    const expiryIso = Number.isNaN(parsed.getTime())
      ? data.expiryDate
      : parsed.toISOString();
    const newCoupon: CreateCouponPayload = {
      code: data.code.toUpperCase(),
      value: data.value,
      minimumSpend: data.minimumSpend,
      expiryDate: expiryIso,
      maxUsage: data.maxUsage,
      description: data.description,
    };

    createCoupon(newCoupon, {
      onSuccess: () => {
        resetPagination();
        form.reset({
          code: "",
          value: 10,
          minimumSpend: 0,
          expiryDate: "",
          maxUsage: 50,
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
    <div className="space-y-6">
      <PageHeader
        title="Coupons"
        subtitle="Create and manage discount codes"
      />

      <div className="portal-form-panel mb-8">
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
                      <Input
                        type="number"
                        min={0.01}
                        max={100}
                        step={0.01}
                        {...field}
                      />
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
                    <FormLabel>Expiry date and time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} step={60} />
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
                        step={1}
                        placeholder="50"
                        {...field}
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
              : meta?.count != null
                ? `${meta.count.toLocaleString("en-NG")} coupon${meta.count !== 1 ? "s" : ""} total`
                : `${coupons.length} on this page`}
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

      {!isLoading && !isError && (
        <BackendCursorPagination
          count={meta?.count}
          limit={limit}
          pageIndex={pageIndex}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          isLoading={isFetching}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onLimitChange={handleLimitChange}
        />
      )}
    </div>
  );
}
