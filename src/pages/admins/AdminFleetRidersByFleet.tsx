import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import NestedAdminPage from "@/components/admin/NestedAdminPage";
import BackendCursorPagination from "@/components/admin/BackendCursorPagination";
import StatusBadge from "@/components/admin/StatusBadge";
import { Section } from "@/components/admin/DetailShell";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Loader from "@/components/utilities/Loader";
import { DataTableIdCell } from "@/components/ui/data-table-id-cell";
import AdminRidersFilters, {
  ridersParamsToSearchParams,
  ridersSearchParamsToForm,
  ridersSearchParamsToParams,
} from "@/components/utilities/Admins/AdminRidersFilters";
import { useGetRiders } from "@/api/admin/riders/useRiders";
import {
  parseRidersListMeta,
  parseRidersListPayload,
  type GetRidersParams,
} from "@/api/admin/riders/riders";

const DEFAULT_LIMIT = 20;

function formatWhen(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function pickId(raw: Record<string, unknown>): string {
  const v = raw.Id ?? raw.id;
  return v != null ? String(v).trim() : "";
}

function pickPhone(raw: Record<string, unknown>): string {
  const pn = raw.phoneNumber;
  if (pn == null || typeof pn !== "object") return "—";
  const o = pn as Record<string, unknown>;
  const intl = o.internationalFormat ?? o.nationalFormat ?? o.number;
  return intl != null ? String(intl) : "—";
}

function statusLabel(raw: Record<string, unknown>): string {
  if (raw.suspended === true) return "Suspended";
  if (raw.approved === true) return "Active";
  return "Pending";
}

export default function AdminFleetRidersByFleet() {
  const { id: routeId } = useParams<{ id: string }>();
  const fleetId =
    routeId && routeId !== "undefined" && routeId !== "null"
      ? routeId
      : undefined;

  const [searchParams, setSearchParams] = useSearchParams();

  const urlFilters = useMemo(
    () => ({
      ...ridersSearchParamsToParams(searchParams),
      ...(fleetId ? { companyId: fleetId } : {}),
    }),
    [searchParams, fleetId],
  );
  const filterFormFromUrl = useMemo(
    () => ridersSearchParamsToForm(searchParams),
    [searchParams],
  );

  const [appliedFilters, setAppliedFilters] =
    useState<GetRidersParams>(urlFilters);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [cursorStack, setCursorStack] = useState<
    (number | string | undefined)[]
  >([undefined]);

  useEffect(() => {
    setAppliedFilters(urlFilters);
    setCursorStack([undefined]);
  }, [urlFilters]);

  const currentCursor = cursorStack[cursorStack.length - 1];

  const queryParams = useMemo<GetRidersParams>(() => {
    const params: GetRidersParams = {
      ...appliedFilters,
      companyId: fleetId,
      limit,
    };

    if (currentCursor != null && currentCursor !== "") {
      params.cursor = currentCursor;
    }

    return params;
  }, [appliedFilters, currentCursor, fleetId, limit]);

  const { data: payload, isLoading, isFetching, isError } = useGetRiders(
    fleetId ? queryParams : undefined,
  );

  const rawRows = useMemo(() => parseRidersListPayload(payload), [payload]);
  const meta = useMemo(() => parseRidersListMeta(payload), [payload]);

  const rows = useMemo(() => {
    return rawRows.map((r) => {
      const id = pickId(r);
      const first = r.firstName != null ? String(r.firstName) : "";
      const last = r.lastName != null ? String(r.lastName) : "";
      const name = [first, last].filter(Boolean).join(" ").trim() || "—";
      const email = r.email != null ? String(r.email) : "—";
      return {
        id,
        name,
        email,
        phone: pickPhone(r),
        status: statusLabel(r),
        companyName:
          r.companyName != null ? String(r.companyName) : "—",
        createdAt: formatWhen(
          r.createdAt != null ? String(r.createdAt) : undefined,
        ),
      };
    });
  }, [rawRows]);

  const pageIndex = cursorStack.length - 1;
  const hasPrevious = pageIndex > 0;
  const hasNext =
    meta?.lastCursor != null &&
    meta.lastCursor !== "" &&
    rawRows.length >= limit;

  const resetPagination = () => {
    setCursorStack([undefined]);
  };

  const handleApplyFilters = (filters: GetRidersParams) => {
    const next = { ...filters, companyId: fleetId };
    setAppliedFilters(next);
    resetPagination();
    setSearchParams(ridersParamsToSearchParams(filters), { replace: true });
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

  const fleetBack = `/admins/fleet_managers/${fleetId ?? ""}`;
  const crumbs = [
    { label: "Dashboard", href: "/admins/dashboard" },
    { label: "Fleet Managers", href: "/admins/fleet_managers" },
    { label: "Fleet", href: fleetBack },
    { label: "Riders" },
  ];

  if (!fleetId) {
    return (
      <NestedAdminPage
        backHref="/admins/fleet_managers"
        backLabel="Fleet Managers"
        crumbs={crumbs}
        title="Fleet riders"
        subtitle="No fleet ID in the URL."
      >
        <></>
      </NestedAdminPage>
    );
  }

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <NestedAdminPage
        backHref={fleetBack}
        backLabel="Fleet"
        crumbs={crumbs}
        title="Fleet riders"
        subtitle="Failed to load riders for this fleet."
      >
        <></>
      </NestedAdminPage>
    );
  }

  const subtitle = `Riders linked to this fleet manager${
    meta?.count != null ? ` · ${meta.count.toLocaleString("en-NG")} total` : ""
  }`;

  return (
    <NestedAdminPage
      backHref={fleetBack}
      backLabel="Fleet"
      crumbs={crumbs}
      title="Fleet riders"
      subtitle={subtitle}
    >
      <div className="space-y-5">
        <AdminRidersFilters
          key={searchParams.toString()}
          initialValues={filterFormFromUrl}
          onApply={handleApplyFilters}
          hiddenFields={["companyId"]}
        />

        <Section title="Riders" subtitle="All riders assigned to this fleet.">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rider ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground"
                    >
                      No riders for this fleet.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((r) => (
                    <TableRow key={r.id || r.email}>
                      <TableCell>
                        <DataTableIdCell id={r.id} />
                      </TableCell>
                      <TableCell>{r.name}</TableCell>
                      <TableCell className="max-w-[180px] truncate text-sm">
                        {r.email}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {r.phone}
                      </TableCell>
                      <TableCell className="max-w-[140px] truncate text-sm">
                        {r.companyName}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={r.status} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {r.createdAt}
                      </TableCell>
                      <TableCell className="text-right">
                        {r.id ? (
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/admins/drivers/${r.id}`}>View</Link>
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Section>

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
    </NestedAdminPage>
  );
}
