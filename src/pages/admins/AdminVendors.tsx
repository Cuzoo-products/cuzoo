import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import PageHeader from "@/components/admin/PageHeader";
import BackendCursorPagination from "@/components/admin/BackendCursorPagination";
import { DataTable } from "@/components/ui/data-table";
import {
  columns,
  type VendorData,
} from "@/components/utilities/Admins/VendorDataTable";
import AdminVendorsFilters, {
  vendorsParamsToSearchParams,
  vendorsSearchParamsToForm,
  vendorsSearchParamsToParams,
} from "@/components/utilities/Admins/AdminVendorsFilters";
import { useVendors } from "@/api/admin/vendors/useVendors";
import {
  parseVendorsListMeta,
  parseVendorsListPayload,
  type GetVendorsParams,
} from "@/api/admin/vendors/vendorsApi";
import Loader from "@/components/utilities/Loader";

const DEFAULT_LIMIT = 20;

type PhoneNumber = VendorData["phoneNumber"];

function parsePhoneNumber(value: unknown): PhoneNumber | undefined {
  if (value == null || typeof value !== "object") return undefined;
  const phone = value as Record<string, unknown>;
  return {
    countryCallingCode: String(phone.countryCallingCode ?? ""),
    countryCode: String(phone.countryCode ?? ""),
    internationalFormat: String(phone.internationalFormat ?? ""),
    nationalFormat: String(phone.nationalFormat ?? ""),
    number: String(phone.number ?? ""),
  };
}

function mapVendorToRow(v: Record<string, unknown>): VendorData {
  const id = String(v.Id ?? v.id ?? v._id ?? "").trim();

  return {
    id,
    businessName: v.businessName != null ? String(v.businessName) : "—",
    email: v.email != null ? String(v.email) : "—",
    storeCode: v.storeCode != null ? String(v.storeCode) : "—",
    phoneNumber: parsePhoneNumber(v.phoneNumber),
    approvalStatus:
      v.approvalStatus != null
        ? String(v.approvalStatus)
        : v.approved === true
          ? "Approved"
          : v.approved === false
            ? "Pending"
            : "—",
  };
}

function AdminVendor() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlFilters = useMemo(
    () => vendorsSearchParamsToParams(searchParams),
    [searchParams],
  );
  const filterFormFromUrl = useMemo(
    () => vendorsSearchParamsToForm(searchParams),
    [searchParams],
  );

  const [appliedFilters, setAppliedFilters] =
    useState<GetVendorsParams>(urlFilters);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [cursorStack, setCursorStack] = useState<
    (number | string | undefined)[]
  >([undefined]);

  useEffect(() => {
    setAppliedFilters(urlFilters);
    setCursorStack([undefined]);
  }, [urlFilters]);

  const currentCursor = cursorStack[cursorStack.length - 1];

  const queryParams = useMemo<GetVendorsParams>(() => {
    const params: GetVendorsParams = {
      ...appliedFilters,
      limit,
    };

    if (currentCursor != null && currentCursor !== "") {
      params.cursor = currentCursor;
    }

    return params;
  }, [appliedFilters, currentCursor, limit]);

  const { data: vendorsData, isLoading, isFetching, error } =
    useVendors(queryParams);

  const vendors = useMemo(
    () => parseVendorsListPayload(vendorsData),
    [vendorsData],
  );

  const meta = useMemo(
    () => parseVendorsListMeta(vendorsData),
    [vendorsData],
  );

  const tableData: VendorData[] = useMemo(
    () => vendors.map(mapVendorToRow).filter((row) => row.id !== ""),
    [vendors],
  );

  const pageIndex = cursorStack.length - 1;
  const hasPrevious = pageIndex > 0;
  const hasNext =
    meta?.lastCursor != null &&
    meta.lastCursor !== "" &&
    vendors.length >= limit;

  const resetPagination = () => {
    setCursorStack([undefined]);
  };

  const handleApplyFilters = (filters: GetVendorsParams) => {
    setAppliedFilters(filters);
    resetPagination();
    setSearchParams(vendorsParamsToSearchParams(filters), { replace: true });
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

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="space-y-5">
        <PageHeader title="Vendors" subtitle="Failed to load vendors." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Vendors"
        subtitle={
          meta?.count != null
            ? `Manage all vendors · ${meta.count.toLocaleString("en-NG")} total`
            : "Manage all vendors data and information"
        }
      />

      <AdminVendorsFilters
        key={searchParams.toString()}
        initialValues={filterFormFromUrl}
        onApply={handleApplyFilters}
      />

      <DataTable
        adminVariant
        hidePagination
        searchPlaceholder="Search this page..."
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

export default AdminVendor;
