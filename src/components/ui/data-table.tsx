import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import SearchBar from "@/components/admin/SearchBar";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableViewOptions } from "./data-table-view-options";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /** Use admin portal search + table styling */
  adminVariant?: boolean;
  searchPlaceholder?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  adminVariant = false,
  searchPlaceholder = "Search...",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnVisibility,
      globalFilter,
    },
  });

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="flex flex-1 items-center">
          {adminVariant ? (
            <SearchBar
              value={globalFilter}
              onChange={(v) => table.setGlobalFilter(v)}
              placeholder={searchPlaceholder}
              className="max-w-md"
            />
          ) : (
            <Input
              value={globalFilter}
              onChange={(e) => table.setGlobalFilter(String(e.target.value))}
              placeholder={searchPlaceholder}
              className="max-w-md bg-secondary"
            />
          )}
        </div>
        <DataTableViewOptions table={table} />
      </div>
      <div
        className={cn(
          "rounded-md border",
          adminVariant
            ? "vendor-data-table border-[var(--admin-border)] bg-[var(--admin-bg-card)]"
            : "border-line-1",
        )}
      >
        <Table>
          <TableHeader
            className={
              adminVariant
                ? "border-b border-[var(--admin-border)] bg-[var(--vendor-table-header-bg)]"
                : "bg-secondary"
            }
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className={cn(
                  "border-b-line-1",
                  adminVariant && "border-[var(--admin-border)] hover:bg-transparent",
                )}
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={adminVariant ? "font-semibold" : undefined}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="border-line-1"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
