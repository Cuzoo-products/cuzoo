import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import PageHeader from "@/components/admin/PageHeader";
import BackendCursorPagination from "@/components/admin/BackendCursorPagination";
import { DataTable } from "@/components/ui/data-table";
import Loader from "@/components/utilities/Loader";
import { columns, type PayoutData } from "@/components/utilities/Vendors/PayoutsDataTable";
import { payoutRecordId } from "@/lib/payoutId";
import { useVendorsPayouts } from "@/api/admin/payouts/usePayouts";
import {
  parseVendorPayoutsListMeta,
  parseVendorPayoutsListPayload,
  type GetVendorPayoutsParams,
} from "@/api/admin/payouts/payoutsApi";
import AdminVendorPayoutsFilters, {
  vendorPayoutsFilterFormToParams,
  vendorPayoutsParamsToSearchParams,
  vendorPayoutsSearchParamsToForm,
  vendorPayoutsSearchParamsToParams,
  type VendorPayoutsFilterFormValues,
} from "@/components/utilities/Admins/AdminVendorPayoutsFilters";

const DEFAULT_LIMIT = 20;

const formatRequestedAt = (value: string) => {
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

const formatBankAccount = (details?: { bankName?: string; accountNumber?: string }) => {
  if (!details) return "—";
  const last4 = details.accountNumber?.slice(-4) ?? "****";
  return `${details.bankName ?? "Bank"} ****${last4}`;
};

export default function AdminVendorsPayouts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlFilters = useMemo(
    () => vendorPayoutsSearchParamsToParams(searchParams),
    [searchParams],
  );
  const filterFormFromUrl = useMemo(
    () => vendorPayoutsSearchParamsToForm(searchParams),
    [searchParams],
  );

  const [appliedFilters, setAppliedFilters] =
    useState<GetVendorPayoutsParams>(urlFilters);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [cursorStack, setCursorStack] = useState<
    (number | string | undefined)[]
  >([undefined]);

  useEffect(() => {
    setAppliedFilters(urlFilters);
    setCursorStack([undefined]);
  }, [urlFilters]);

  const currentCursor = cursorStack[cursorStack.length - 1];

  const queryParams = useMemo<GetVendorPayoutsParams>(() => {
    const params: GetVendorPayoutsParams = {
      ...appliedFilters,
      limit,
    };

    if (currentCursor != null && currentCursor !== "") {
      params.cursor = currentCursor;
    }

    return params;
  }, [appliedFilters, currentCursor, limit]);

  const { data, isLoading, isFetching, error } = useVendorsPayouts(queryParams);

  const apiPayouts = useMemo(() => parseVendorPayoutsListPayload(data), [data]);
  const meta = useMemo(() => parseVendorPayoutsListMeta(data), [data]);

  const tableData: PayoutData[] = apiPayouts.map((p) => {
    const row = p as {
      Id?: string;
      id?: string;
      amount?: unknown;
      status?: unknown;
      createdAt?: unknown;
      details?: { bankName?: string; accountNumber?: string };
    };
    const recordId = payoutRecordId(row);

    return {
      id: recordId
        ? `/admins/payouts/vendors/${encodeURIComponent(recordId)}`
        : "",
      amount: `₦${Number(row.amount ?? 0).toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      status: String(row.status ?? "—"),
      requestedAt: formatRequestedAt(String(row.createdAt ?? "")),
      bankAccount: formatBankAccount(row.details),
    };
  });

  const pageIndex = cursorStack.length - 1;
  const hasPrevious = pageIndex > 0;
  const hasNext =
    meta?.lastCursor != null && meta.lastCursor !== "" && apiPayouts.length >= limit;

  const resetPagination = () => {
    setCursorStack([undefined]);
  };

  const handleApplyFilters = (filters: VendorPayoutsFilterFormValues) => {
    const params = vendorPayoutsFilterFormToParams(filters);
    setAppliedFilters(params);
    resetPagination();
    setSearchParams(vendorPayoutsParamsToSearchParams(params), { replace: true });
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

  if (isLoading) return <Loader />;
  if (error) return <div className="text-red-500">Failed to load vendor payouts.</div>;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Vendor Payouts"
        subtitle={
          meta?.count != null
            ? `Review vendor payout requests and status · ${meta.count.toLocaleString("en-NG")} total`
            : "Review vendor payout requests and status"
        }
      />

      <AdminVendorPayoutsFilters
        key={searchParams.toString()}
        initialValues={filterFormFromUrl}
        onApply={handleApplyFilters}
      />

      <DataTable
        adminVariant
        hidePagination
        searchPlaceholder="Search..."
        columns={columns}
        data={tableData}
      />

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
    </div>
  );
}
