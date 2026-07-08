import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import PageHeader from "@/components/admin/PageHeader";
import BackendCursorPagination from "@/components/admin/BackendCursorPagination";
import { DataTable } from "@/components/ui/data-table";
import {
  columns,
  type AdminData,
} from "@/components/utilities/Admins/AdminsDataTable";
import AdminAdminsFilters, {
  adminsParamsToSearchParams,
  adminsSearchParamsToForm,
  adminsSearchParamsToParams,
} from "@/components/utilities/Admins/AdminAdminsFilters";
import { useGetAllAdmins } from "@/api/admin/admin/useAdmin";
import {
  parseAdminsListMeta,
  parseAdminsListPayload,
  type GetAdminsParams,
} from "@/api/admin/admin/adminApi";
import Loader from "@/components/utilities/Loader";

const DEFAULT_LIMIT = 20;

function mapAdminToRow(admin: Record<string, unknown>): AdminData {
  const id = String(admin.Id ?? admin.id ?? admin._id ?? "").trim();

  return {
    id: id ? `/admins/admins/${encodeURIComponent(id)}` : "",
    firstName: admin.firstName != null ? String(admin.firstName) : "",
    lastName: admin.lastName != null ? String(admin.lastName) : "",
    email: admin.email != null ? String(admin.email) : "—",
    suspended:
      admin.suspended === true
        ? "Yes"
        : admin.suspended === false
          ? "No"
          : admin.suspended != null
            ? String(admin.suspended)
            : "—",
    position: admin.position != null ? String(admin.position) : "—",
  };
}

function Admins() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlFilters = useMemo(
    () => adminsSearchParamsToParams(searchParams),
    [searchParams],
  );
  const filterFormFromUrl = useMemo(
    () => adminsSearchParamsToForm(searchParams),
    [searchParams],
  );

  const [appliedFilters, setAppliedFilters] =
    useState<GetAdminsParams>(urlFilters);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [cursorStack, setCursorStack] = useState<
    (number | string | undefined)[]
  >([undefined]);

  useEffect(() => {
    setAppliedFilters(urlFilters);
    setCursorStack([undefined]);
  }, [urlFilters]);

  const currentCursor = cursorStack[cursorStack.length - 1];

  const queryParams = useMemo<GetAdminsParams>(() => {
    const params: GetAdminsParams = {
      ...appliedFilters,
      limit,
    };

    if (currentCursor != null && currentCursor !== "") {
      params.cursor = currentCursor;
    }

    return params;
  }, [appliedFilters, currentCursor, limit]);

  const { data, isLoading, isFetching, error } = useGetAllAdmins(queryParams);

  const admins = useMemo(() => parseAdminsListPayload(data), [data]);
  const meta = useMemo(() => parseAdminsListMeta(data), [data]);

  const tableData: AdminData[] = useMemo(
    () => admins.map(mapAdminToRow).filter((row) => row.id !== ""),
    [admins],
  );

  const pageIndex = cursorStack.length - 1;
  const hasPrevious = pageIndex > 0;
  const hasNext =
    meta?.lastCursor != null &&
    meta.lastCursor !== "" &&
    admins.length >= limit;

  const resetPagination = () => {
    setCursorStack([undefined]);
  };

  const handleApplyFilters = (filters: GetAdminsParams) => {
    setAppliedFilters(filters);
    resetPagination();
    setSearchParams(adminsParamsToSearchParams(filters), { replace: true });
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

  if (error) {
    return (
      <div className="space-y-5">
        <PageHeader title="Admins" subtitle="Failed to load admins." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Admins"
        subtitle={
          meta?.count != null
            ? `Manage all admins · ${meta.count.toLocaleString("en-NG")} total`
            : "Manage all admins data and information"
        }
      />

      <AdminAdminsFilters
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

export default Admins;
